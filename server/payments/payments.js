var debug = Meteor.settings.debug_payment_processing;

Payments = {
  hoursBeforeStudentPayment: debug ? 0 : 24,
  hoursBeforeTutorPayment: debug ? 0 : 64,
  percentCommission: 30,
  studentReferralRewardAmount: 10, // 10 dollars
  tutorReferralRewardAmount: 50, // this.tutorReferralRewardAmount dollars
  addPayoutAccount(userId, bankAccount) {
    // TODO: Why shouldn't users be able to change their bank account?
    Payments.ensureNoPayoutAccount(userId);

    try {
      var recipient = PaymentProcessor.createRecipient(bankAccount);
    } catch (e) {
      if (e && (e.type == "StripeCardError" || e.type == "StripeInvalidRequestError")) {
        e.sanitizedError = new Meteor.Error(e.type, `(${e.code}) ${e.message}`);
      }

      throw e;
    }

    Payments.setDefaultPayoutAccount(userId, recipient);
  },
  createCustomer(userId, emailAddress) {
    var customer = PaymentProcessor.createCustomer(userId, emailAddress);

    Payments.setCustomer(userId, customer);
  },
  addPaymentAccount(userId, creditCard) {
    try {
      var account = PaymentProcessor.createCard(userId, creditCard);
    } catch (e) {
      if (e.type == "StripeCardError") {
        e.sanitizedError = new Meteor.Error("card-error", `(${e.code}) ${e.message}`);
      }

      throw e;
    }

    Payments.setDefaultPaymentAccount(userId, account);
  },
  removePaymentAccount(userId) {
    var account = PaymentProcessor.removePaymentAccount(userId);

    Payments.removeDefaultPaymentAccount(userId);
  },
  chargeStudentForCompletedLesson(lesson) {
    if (! lesson) {
      throw new Error(`Lesson not found: ${lesson}`);
    }
    if (! lesson.student_id) {
      throw new Error(`Lesson has no student: ${lesson.student_id}`);
    }

    // Check that the lesson hasn't already been charged
    if (lesson.payment !== "unresolved") {
      throw new Error(`Cannot charge student for lesson with payment status: ${lesson.payment} (should be 'unresolved').`)
    }
    if (lesson.status !== "completed") {
      throw new Error(`Cannot charge student for lesson with status: ${lesson.status} (should be 'completed').`)
    }
    if (lesson.completedAt > moment().add(this.hoursBeforeStudentPayment, 'hours').toDate()) {
      var diffHours = moment().diff(lesson.completedAt, 'hours');
      throw new Error(`Cannot charge student for lesson, fewer than ${this.hoursBeforeStudentPayment} hours have elapsed (${diffHours} hours have elapsed).`)
    }

    // Create a unique id for this payment so that our payment processing
    // code can prevent duplicate transactions
    // This token is shared across other methods which charge for lessons (e.g.
    // chargeStudentForCancelledLesson)
    var idempotencyToken = `lesson:${lesson._id}`;

    // Compute the amount
    var amount = Payments.getChargeForLesson(lesson);


    // This identifies what we're doing here, giving other methods we
    // call more info, used for example to choose which email templates to
    // use.
    var reason = "lesson:completed";

    // The user who's going to be charged is the student
    var user_id = lesson.student_id;

    // Charge payment
    var payment;
    try {
      payment = PaymentProcessor.chargeAccount({
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
    } catch (error) {
      console.log("Error in PaymentProcessor.chargeAccount, arguments: ", {
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
      // TODO: Handle error possiblities:
      // 1. Declined card (notify the cardholder)
      // 2. Idempotency error (mark the lesson as payment = "error")
      // 3. Other: notify an admin and or the user, record the error on the
      //    lesson, perhaps paymentError = error.message

      // After we handle the error we should throw it, this
      // 1. Prevents the rest of this function from running and marking the
      //    payment as resolved, and
      // 2. Reports the error to the caller (e.g. jobs.js)
      throw error;
    }

    // Mark the lesson as resolved and record any payment metadata we might
    // want later for debugging or auditing.
    // We don't wrap this method in a try catch because if something went wrong
    // updating the lesson as 'paid' we should probably wait to notify the user
    // until that's resolved.
    Payments.markPaymentResolved(lesson._id, payment);

    // Send any notification emails we need to
    PaymentNotifications.notifyPaymentResolved(lesson, {
      amount,
      reason,
    });
  },
  chargeStudentForCancelledLesson(lesson) {
    if (! lesson) {
      throw new Error(`Lesson not found: ${lesson}`);
    }
    if (! lesson.student_id) {
      throw new Error(`Lesson has no student: ${lesson.student_id}`);
    }

    // Check that the lesson hasn't already been charged
    if (lesson.payment !== "unresolved") {
      throw new Error(`Cannot charge student for lesson with payment status: ${lesson.payment} (should be 'unresolved').`)
    }
    if (lesson.status !== "student_cancelled") {
      throw new Error(`Cannot charge student for lesson with status: ${lesson.status} (should be 'student_cancelled').`)
    }
    if (lesson.autoBillable !== true) {
      throw new Error(`Cannot charge student for lesson with autoBillable: ${lesson.autoBillable} (should be 'true').`)
    }
    if (lesson.completedAt > moment().add(this.hoursBeforeStudentPayment, 'hours').toDate()) {
      var diffHours = moment().diff(lesson.completedAt, 'hours');
      throw new Error(`Cannot charge student for lesson, fewer than ${this.hoursBeforeStudentPayment} hours have elapsed (${diffHours} hours have elapsed).`)
    }

    // Create a unique id for this payment so that our payment processing
    // code can prevent duplicate transactions
    // This token is shared across other methods which charge for lessons (e.g.
    // chargeStudentForCancelledLesson)
    var idempotencyToken = `lesson:${lesson._id}`;

    // Compute the amount
    var amount = Payments.getMinimumChargeForLesson(lesson);

    // This identifies what we're doing here, giving other methods we
    // call more info, used for example to choose which email templates to
    // use.
    var reason = "lesson:cancelled";

    // The user who's going to be charged is the student
    var user_id = lesson.student_id;

    // Charge payment
    var payment;
    try {
      payment = PaymentProcessor.chargeAccount({
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
    } catch (error) {
      console.log("Error in PaymentProcessor.chargeAccount, arguments:", {
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
      // TODO: Handle error possiblities:
      // 1. Declined card (notify the cardholder)
      // 2. Idempotency error (mark the lesson as payment = "error")
      // 3. Other: notify an admin and or the user, record the error on the
      //    lesson, perhaps paymentError = error.message

      // After we handle the error we should throw it, this
      // 1. Prevents the rest of this function from running and marking the
      //    payment as resolved, and
      // 2. Reports the error to the caller (e.g. jobs.js)
      throw error;
    }

    // Mark the lesson as resolved and record any payment metadata we might
    // want later for debugging or auditing.
    // We don't wrap this method in a try catch because if something went wrong
    // updating the lesson as 'paid' we should probably wait to notify the user
    // until that's resolved.
    Payments.markPaymentResolved(lesson._id, payment);

    // Send any notification emails we need to
    PaymentNotifications.notifyPaymentResolved(lesson, {
      amount,
      reason,
    });
  },
  payTutorForCompletedLesson(lesson) {
    if (! lesson) {
      throw new Error(`Lesson not found: ${lesson}`);
    }
    if (! lesson.tutor_id) {
      throw new Error(`Lesson has no tutor: ${lesson.tutor_id}`);
    }

    // Check that the lesson hasn't already been paid out
    if (lesson.tutorPaid) {
      throw new Error(`Cannot pay tutor for lesson, tutor has already been paid: ${lesson.tutorPaid} (should be 'false' or undefined).`)
    }
    if (lesson.payment !== "resolved") {
      throw new Error(`Cannot pay tutor for lesson with unresolved payment status: ${lesson.payment} (should be 'resolved').`)
    }
    if (lesson.status !== "completed") {
      throw new Error(`Cannot pay tutor for lesson with status: ${lesson.status} (should be 'completed').`)
    }
    if (lesson.completedAt > moment().add(this.hoursBeforeTutorPayment, 'hours').toDate()) {
      var diffHours = moment().diff(lesson.completedAt, 'hours');
      throw new Error(`Cannot pay tutor for lesson, fewer than ${this.hoursBeforeTutorPayment} hours have elapsed (${diffHours} hours have elapsed).`)
    }

    // This identifies what we're doing here, giving other methods we
    // call more info, used for example to choose which email templates to
    // use.
    var reason = "lesson:completed";

    // Check that the tutor has a bank account, otherwise skip processing this
    // lesson for now.
    // getPayoutAccount will send the tutor an email to remind them to
    // setup their account.
    if (! Payments.getPayoutAccount(lesson.tutor_id, reason, lesson)) {
      return;
    }

    // Create a unique id for this payment so that our payment processing
    // code can prevent duplicate transactions
    // This token is shared across other methods which charge for lessons (e.g.
    // chargeStudentForCancelledLesson)
    var idempotencyToken = `lesson:${lesson._id}`;

    // Compute the amount
    var amount = Payments.getRenumerationForLesson(lesson);

    // The user who's going to be charged is the student
    var user_id = lesson.tutor_id;

    // Charge payment
    var transfer;
    try {
      transfer = PaymentProcessor.payoutAccount({
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
    } catch (error) {
      console.log("Error in PaymentProcessor.payoutAccount, arguments: ", {
        user_id,
        reason,
        amount,
        idempotencyToken,
      })
      // TODO: Handle error possiblities:
      // 1. Bank account info incorrect (notify the bank account owner)
      // 2. Idempotency error (mark the lesson as tutorPaid = "error")
      // 3. Other: notify an admin and or the user, record the error on the
      //    lesson, perhaps renumerationError = error.message

      // After we handle the error we should throw it, this
      // 1. Prevents the rest of this function from running and marking the
      //    payment as resolved, and
      // 2. Reports the error to the caller (e.g. jobs.js)
      throw error;
    }

    // Mark the lesson as resolved and record any payment metadata we might
    // want later for debugging or auditing.
    // We don't wrap this method in a try catch because if something went wrong
    // updating the lesson as 'paid' we should probably wait to notify the user
    // until that's resolved.
    Payments.markRenumerationResolved(lesson._id, transfer);

    // Send any notification emails we need to
    PaymentNotifications.notifyRenumerationResolved(lesson, {
      amount,
      reason,
    });

  },
  payTutorForCancelledLesson(lesson) {
    if (! lesson) {
      throw new Error(`Lesson not found: ${lesson}`);
    }
    if (! lesson.tutor_id) {
      throw new Error(`Lesson has no tutor: ${lesson.tutor_id}`);
    }

    // Check that the lesson hasn't already been paid out
    if (lesson.tutorPaid) {
      throw new Error(`Cannot pay tutor for lesson, tutor has already been paid: ${lesson.tutorPaid} (should be 'false' or undefined).`)
    }
    if (lesson.payment !== "resolved") {
      throw new Error(`Cannot pay tutor for lesson with unresolved payment status: ${lesson.payment} (should be 'resolved').`)
    }
    if (lesson.status !== "student_cancelled") {
      throw new Error(`Cannot pay tutor for lesson with status: ${lesson.status} (should be 'student_cancelled').`)
    }
    if (lesson.completedAt > moment().add(this.hoursBeforeTutorPayment, 'hours').toDate()) {
      var diffHours = moment().diff(lesson.completedAt, 'hours');
      throw new Error(`Cannot pay tutor for lesson, fewer than ${this.hoursBeforeTutorPayment} hours have elapsed (${diffHours} hours have elapsed).`)
    }

    // This identifies what we're doing here, giving other methods we
    // call more info, used for example to choose which email templates to
    // use.
    var reason = "lesson:cancelled";

    // Check that the tutor has a bank account, otherwise skip processing this
    // lesson for now.
    // getPayoutAccount will send the tutor an email to remind them to
    // setup their account.
    if (! Payments.getPayoutAccount(lesson.tutor_id, reason)) {
      return;
    }

    // Create a unique id for this payment so that our payment processing
    // code can prevent duplicate transactions
    // This token is shared across other methods which charge for lessons (e.g.
    // chargeStudentForCancelledLesson)
    var idempotencyToken = `lesson:${lesson._id}`;

    // Compute the amount
    var amount = Payments.getMinimumRenumerationForLesson(lesson);

    // The user who's going to be charged is the student
    var user_id = lesson.tutor_id;

    // Charge payment
    var transfer;
    try {
      transfer = PaymentProcessor.payoutAccount({
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
    } catch (error) {
      console.log("Error in PaymentProcessor.payoutAccount, arguments:", {
        user_id,
        reason,
        amount,
        idempotencyToken,
      });
      // TODO: Handle error possiblities:
      // 1. Bank account info incorrect (notify the bank account owner)
      // 2. Idempotency error (mark the lesson as tutorPaid = "error")
      // 3. Other: notify an admin and or the user, record the error on the
      //    lesson, perhaps renumerationError = error.message

      // After we handle the error we should throw it, this
      // 1. Prevents the rest of this function from running and marking the
      //    payment as resolved, and
      // 2. Reports the error to the caller (e.g. jobs.js)
      throw error;
    }

    // Mark the lesson as resolved and record any payment metadata we might
    // want later for debugging or auditing.
    // We don't wrap this method in a try catch because if something went wrong
    // updating the lesson as 'paid' we should probably wait to notify the user
    // until that's resolved.
    Payments.markRenumerationResolved(lesson._id, transfer);

    // Send any notification emails we need to
    PaymentNotifications.notifyRenumerationResolved(lesson, {
      amount,
      reason,
    });

  },
  issueRewardForReferral(referredUser) {
    if (! referredUser) {
      throw new Error('Referred user not found.');
    }
    if (! referredUser.referredBy) {
      throw new Error('Referrer not specified.');
    }

    var referrer = Meteor.users.findOne(referredUser.referredBy);
    if (! referrer) {
      throw new Error("Referrer not found.");
    }

    if (_.contains(referrer.roles, 'tutor')) {
      // Tutors get rewarded for referrals differently than students
      return Payments.issueTutorRewardForReferral(referredUser, referrer);
    }
    if (_.contains(referrer.roles, 'student')) {
      return Payments.issueStudentRewardForReferral(referredUser, referrer);
    }
  },
  issueTutorRewardForReferral(referredUser, referrer) {
    if (referredUser.referralRewardPaid) {
      throw new Error("Reward already issued.");
    }
    var minutesCounted = referredUser.learnedMinutes || referredUser.minutesTaught;
    if (minutesCounted < 600) {
      // The referred user hasn't accumulated enough minutes for the refferer
      // to get credit.
      return;
    }

    var reason = "referred:by-tutor";
    var amount = this.tutorReferralRewardAmount; // 50 dollars

    // idempotencyToken is by referred user, not referrer, because many
    // rewards may be earned per referrer, but only one reward may be earned
    // per referred user.
    var idempotencyToken = "referred:" + referredUser._id;

    // Don't process the payment if the user doesn't yet have a bank account.
    if (! Payments.getPayoutAccount(referrer._id, reason)) {
      return;
    }

    var transfer = PaymentProcessor.payoutAccount({
      user_id: referrer._id,
      reason,
      amount,
      idempotencyToken,
    });

    Payments.markReferralRewardResolved(referredUser._id, referrer._id, transfer);

    // TODO: Notification?
  },
  issueStudentRewardForReferral(referredUser, referrer) {

    if (referredUser.referralRewardPaid) {
      throw new Error("Reward already issued.");
    }

    var reason = "referred:by-student";
    var amount = this.studentReferralRewardAmount; // in dollars

    // idempotencyToken is by referred user, not referrer, because many
    // rewards may be earned per referrer, but only one reward may be earned
    // per referred user.
    var idempotencyToken = "referred:" + referredUser._id;


    var credit = PaymentProcessor.issueCredit({
      user_id: referrer._id,
      reason,
      amount,
      idempotencyToken,
    });


    Payments.markReferralRewardResolved(referredUser._id, referrer._id, credit);


    PaymentNotifications.notifyStudentOfCreditEarned(referrer._id, {
      referredUserId: referredUser._id,
      amount: amount,
    });
  },
  ensureNoPayoutAccount(userId) {
    var user = Meteor.users.findOne({ _id: userId });

    if (user.recipient) {
      // User friendly error because this get's thrown directly to the client
      // TODO: it might be better to handle this kind of error in the method
      // handler, so that here we can throw a more 'developer' friendly error.
      throw new Meteor.Error("400", "You already have an account.");
    }
  },
  getPayoutAccount(userId, reason, lesson) {
    var user = Meteor.users.findOne({ _id: userId });

    if (user.needStripeAccount || ! user.recipient) {
      PaymentNotifications.notifyNeedsPayoutAccount(userId, { reason, lesson });
      return false;
    }

    return user.recipient;
  },
  getChargeForLesson(lesson) {
    // charge by the hour (minutes / 60)
    return lesson.currentRate * lesson.minutesRequested / 60;
  },
  getMinimumChargeForLesson(lesson) {
    // charge for 1 hour
    return lesson.currentRate * 1;
  },
  getRenumerationForLesson(lesson) {
    // pay by the hour (minutes / 60)
    return this.getBaseRenumerationForLesson(lesson) * lesson.minutesRequested / 60;
  },
  getMinimumRenumerationForLesson(lesson) {
    // pay for 1 hour
    return this.getBaseRenumerationForLesson(lesson) * 1;
  },
  getBaseRenumerationForLesson(lesson) {
    var student = Meteor.users.findOne({ _id: lesson.student_id });

    // If the student was referred by the tutor being paid, then that tutor
    // shouldn't have to pay a commision.
    if (student.referredBy && student.referredBy == lesson.tutor_id) {
      return lesson.currentRate;
    }

    return lesson.currentRate * (100 - this.percentCommission) / 100;
  },
  markRenumerationResolved(lesson_id, transfer) {
    Lessons.update({_id: lesson_id}, {
      $set: {
        'tutorPaid': true,
        'tutorAmountPaid': transfer.amount
      }
    });
  },
  markPaymentResolved(lesson_id, payment) {
    Lessons.update(lesson_id, {
      $set: {
        payment: "resolved",
        payment_id: payment.id,
        studentCharged: payment.amount,
      },
    });
  },
  markReferralRewardResolved(referredUserId, referrerUserId, transaction) {
    Meteor.users.update({ _id: referredUserId }, {
      $set: {
        referralRewardPaid: true,
        referralRewardId: transaction.id,
      },
    });
    Meteor.users.update({ _id: referrerUserId }, {
      $push: {
        referralRewardsRecieved: transaction.id,
      },
      $inc: {
        amountReferred: transaction.amount / 100,
      },
    });
  },
  setCustomer(userId, customer) {
    Meteor.users.update({ _id: userId }, { $set: { customerId: customer.id } });
  },
  setDefaultPayoutAccount(userId, recipient) {
    var details = {
      id: recipient.id,
      bankAccount: recipient.active_account.id,
      last4: recipient.active_account.last4,
    };
    Meteor.users.update({
      _id: userId,
    }, {
      $set: {
        recipient: details,
        needStripeAccount: false,
      },
    });
  },
  setDefaultPaymentAccount(userId, account) {
    Meteor.users.update(userId, {
      $set: {
        payment: account,
      },
    });
  },
  removePaymentAccount(userId) {
    Meteor.users.update(userId, {
      $unset: {
        payment: true,
      },
    });
  },
};
