var secret;

if (process.env.NODE_ENV === "production") {
  secret = Meteor.settings.private.stripe.liveSecretKey;
} else {
  secret = Meteor.settings.private.stripe.testSecretKey;
}

var Stripe = StripeAPI(secret);

PaymentProcessor = {
  // Charge a user's payment method, first deducting any user credits from the
  // amount (and updating the user credits amount).
  chargeAccount({
    user_id,
    reason,
    amount,
    idempotencyToken,
  }) {
    const customerId = PaymentProcessor.ensureCustomerId(user_id);
    const amountInPennies = amount * 100;
    const name = this.getUserName(user_id);

    this.ensureChargeIdempotency(customerId, idempotencyToken);

    var adjustedAmount = PaymentProcessor.applyAvailableCredit(user_id, amountInPennies);

    var charge = Meteor.wrapAsync((cb) => Stripe.charges.create({
      amount: adjustedAmount,
      currency: "usd",
      customer: customerId,
      description: PaymentProcessor.getChargeDescription(reason, name),
      statement_descriptor: PaymentProcessor.getChargeStatementDescriptor(reason, name) || undefined,
      metadata: {
        idempotencyToken,
      },
    }, cb))();

    return charge;
  },
  // Payout to a user's bank account.
  payoutAccount({
    user_id,
    reason,
    amount,
    idempotencyToken,
  }) {
    var account = this.ensurePayoutAccount(user_id);
    var name = this.getUserName(user_id);

    this.ensurePaymentIdempotency(account.id, idempotencyToken);

    const amountInPennies = amount * 100;
    var charge = Meteor.wrapAsync((cb) => Stripe.transfers.create({
      amount: amountInPennies,
      currency: "usd",
      recipient: account.id,
      bank_account: account.bankAccount,
      description: PaymentProcessor.getPaymentDescription(reason, name),
      statement_descriptor: PaymentProcessor.getPaymentStatementDescriptor(reason, name) || undefined,
      metadata: {
        idempotencyToken,
      },
    }, cb))();

    return charge;
  },
  issueCredit({
    user_id,
    reason,
    amount,
    idempotencyToken,
  }) {
    this.ensureCreditIdempotency(user_id, idempotencyToken);

    const amountInPennies = amount * 100;
    var credit = {
      id: Random.id(),
      amount: amountInPennies,
      reason,
      idempotencyToken,
    };

    Meteor.users.update({ _id: user_id }, {
      $push: {
        "credits": credit,
      },
      $inc: {
        "creditsBalance": amountInPennies,
      },
    });

    return credit;
  },
  createRecipient({
    name,
    type,
    email,
    country,
    currency,
    account_number,
    routing_number,
  }) {
    return Meteor.wrapAsync((cb) => {
      Stripe.recipients.create({
        name,
        type,
        email,
        bank_account: {
          country,
          currency,
          account_number,
          routing_number,
        },
      }, cb);
    })();
  },
  createCustomer({
    name,
    email,
  }) {
    return Meteor.wrapAsync((cb) => Stripe.customers.create({
      description: name,
      email,
    }, cb))();
  },
  createCard(userId, {
    card
  }) {
    var customerId = this.ensureCustomerId(userId);

    var updatedCustomer = Meteor.wrapAsync((cb) => Stripe.customers.update(customerId, {
      card,
    }, cb))();

    var payment = {
      card: {
        id: updatedCustomer.default_source,

        // I'm not sure whether we can trust that the first source is always
        // the card that we just added, however since we only have one card at
        // a time that's not a problem.
        type: updatedCustomer.sources.data[0].brand,
        lastFour: updatedCustomer.sources.data[0].last4
      },
    };

    return payment;
  },
  removeCard(userId) {
    var customerId = this.ensureCustomerId(userId);
    var cardId = this.ensurePaymentId(userId);

    return Meteor.wrapAsync((cb) => Stripe.customers.deleteCard(
      customerId,
      card.id,
      cb
    ))();
  },
  ensureCustomerId(user_id) {
    var user = Meteor.users.findOne(user_id);
    if (! user) {
      throw new Error(`User not found for payment processing: ${user_id}`);
    }

    var customerId = user.customerId;

    if (! customerId) {
      throw new Error(`User does not have a stripe customer id: ${user._id}.`);
    }

    return customerId;
  },
  ensurePaymentId(user_id) {
    var user = Meteor.users.findOne(user_id);
    if (! user) {
      throw new Error(`User not found for payment processing: ${user_id}`);
    }

    var payment = user.payment;
    var cardId = payment && payment.card && payment.card.id;

    if (! cardId) {
      throw new Error(`User does not have a stripe payment account: ${user._id}.`);
    }

    return cardId;
  },
  ensurePayoutAccount(user_id) {
    var user = Meteor.users.findOne(user_id);
    if (! user) {
      throw new Error(`User not found for payment processing: ${user_id}`);
    }

    var account = user.recipient;

    if (! account || ! account.id || ! account.bankAccount) {
      throw new Error(`User does not have a stripe recipient account: ${user._id}.`);
    }

    return account;
  },
  ensureChargeIdempotency(customerId, idempotencyToken) {
    // Check that this charge hasn't already been created, which is possible
    // if our server crashed at some point.
    var charges = Meteor.wrapAsync((cb) => Stripe.charges.list({
      customer: customerId,

      // Fetch as many records as possible, stripe's limit is 100, which
      // should be plenty for detecting if this charge has been processed before
      limit: 100,
    }, Meteor.bindEnvironment((error, result) => {
      if (error) {
        return cb(error);
      }
      cb(null, result);
    })))();

    // If an existing charge has the same idempotencyToken then it's a
    // duplicate charge, throw an error.
    if (_.find(charges, (charge) =>
      // The idempotency token should match
      charge.metadata && charge.metadata.idempotencyToken === idempotencyToken &&
      // And the charge status should be either successful or pending, but not failed
      charge.status !== "failed"
    )) {
      throw new Error(`Duplicate transaction detected: an existing charge (${charge.id}) has the same idempotency token (${idempotencyToken}) as the new charge.`)
    }
  },
  ensureCreditIdempotency(accountId, idempotencyToken) {
    var account = Meteor.users.findOne({
      "credits.idempotencyToken": idempotencyToken,
    });
    var transaction = _.findWhere(account && account.credits || [], { idempotencyToken });
    if (transaction) {
      throw new Error(`Duplicate transaction detected: an existing credit (${transaction.id}) has the same idempotencyToken (${idempotencyToken}) as the new credit.`);
    }
  },
  ensurePaymentIdempotency(accountId, idempotencyToken) {
    // Check that this charge hasn't already been created, which is possible
    // if our server crashed at some point.
    var transfers = Meteor.wrapAsync((cb) => Stripe.transfers.list({
      recipient: accountId,

      // Fetch as many records as possible, stripe's limit is 100, which
      // should be plenty for detecting if this charge has been processed before
      limit: 100,
    }, Meteor.bindEnvironment((error, result) => {
      if (error) {
        return cb(error);
      }
      cb(null, result);
    })))();

    // If an existing charge has the same idempotencyToken then it's a
    // duplicate charge, throw an error.
    if (_.find(transfers, (transfer) =>
      // The idempotency token should match
      transfer.metadata && transfer.metadata.idempotencyToken === idempotencyToken &&
      // And the charge status should be either successful or pending, but not failed
      transfer.status !== "failed"
    )) {
      throw new Error(`Duplicate transaction detected: an existing transfer (${transfer.id}) has the same idempotency token (${idempotencyToken}) as the new transfer.`)
    }
  },
  applyAvailableCredit(userId, amount) {
    var account = Meteor.users.findOne(userId);
    var availableCredit = account && account.creditsBalance;

    if (_.isFinite(availableCredit) && availableCredit > 0) {
      var creditToApply = Math.min(amount, availableCredit);

      Meteor.users.update({
        _id: userId,
      }, {
        $inc: {
          "creditsBalance": -creditToApply,
        },
      });

      return amount - creditToApply;
    }

    return amount;
  },
  getUserName(userId) {
    var user = Meteor.users.findOne({ _id: userId });
    var profile = user && user.profile;
    var name = profile && (`${profile.firstName || ''} ${profile.lastName || ''}`);

    return name;
  },
  getChargeDescription(reason, name) {
    return {
      "lesson:completed": `Charged ${name} for Tutoring Session on Tutor App`,
      "lesson:cancelled": `Charged ${name} for Tutoring Session on Tutor App`,
    }[reason];
  },
  getChargeStatementDescriptor(reason) {
    return {
      "lesson:completed": "",
      "lesson:cancelled": "",
    }[reason];
  },
  getPaymentDescription(reason, name) {
    return {
      "lesson:completed": `Paid for Tutoring Session on Tutor App with Student ${name}`,
      "lesson:cancelled": `Paid for Tutoring Session on Tutor App with Student ${name}`,
    }[reason];
  },
  getPaymentStatementDescriptor(reason) {
    return {
      "lesson:completed": "",
      "lesson:cancelled": "",
    }[reason];
  },
}
