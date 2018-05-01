import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

// Meteor methods which are part of the payment process
// these methods are just thin wrappers around the relevant functionality in
// payments.js
Meteor.methods({
  createStudent(student) {
    // ===================
    // This code is taken from stripe/stripe.js and is modified only to
    // replace calls to stripe with calls to Payments.*

    // TODO:
    //    - Remove console log statements,
    //    - Move 'createStudent' method to methods,
    //    - Security audit

    check(student, {
      emailAddress: String,
      password: String,
      profile: {
        firstName: String,
        lastName: String,
        avatar: String,
      },
      promoToken: String,
    });

    const emailRegex = new RegExp(student.emailAddress, 'i');
    const lookupCustomer = Meteor.users.findOne({
      'emails.address': emailRegex,
    });

    let promo = false;
    const lookupPromo = Meteor.users.findOne({
      promoToken: student.promoToken,
    });
    if (student.promoToken !== '') {
      if (!lookupPromo) {
        throw new Meteor.Error('customer-exists', 'Bad Promo Code');
      } else {
        promo = true;
      }
    }

    if (!lookupCustomer) {
      const user = Accounts.createUser({
        email: student.emailAddress,
        password: student.password,
        profile: {
          firstName: student.profile.firstName,
          lastName: student.profile.lastName,
          avatar: student.profile.avatar,
        },
      });

      Roles.addUsersToRoles(user, ['student']);

      // ====================
      // -- Start -- This code is the updated code, surrounding code has
      // also been edited slightly because of the removed callback.

      Payments.createCustomer(user, student.emailAddress);

      // -- End --
      // ====================

      // Create Promotional Tokens for Students and add them to the referrals
      const token = `promo${Random.hexString(10)}`;
      Meteor.users.update(user, { $set: {
        promoToken: token,
        referred: [],
        hasHadSession: [],
        invoices: [],
        lessons: [],
        hasReviewed: [],
        notifications: true,
        learnedMinutes: 0,
        amountReferred: 0,
        learnedTen: false,
        totalSpent: 0,
        cronEmails: {
          login: false,
        },
      },
      });

      if (lookupPromo) {
        Meteor.users.update(user, { $set: { referredBy: lookupPromo._id } });
        Meteor.users.update({
          promoToken: student.promoToken,
        }, {
          $push: { referred: user },
        });
      }
    } else {
      throw new Meteor.Error('customer-exists', 'Sorry, that customer email already exists');
    }

    // ================
  },
  createRecipient(bankAccount) {
    check(bankAccount, {
      name: String,              // User's full legal name
      tax_id: String,            // User's SSN
      type: String,              // 'individual' or 'business'
      country: String,
      currency: String,
      account_number: String,
      routing_number: String,
    });

    Payments.addPayoutAccount(this.userId, bankAccount);
  },
  deleteCreditCard(userId) {
    check(userId, this.userId);

    Payments.removePaymentAccount(this.userId);
  },
  createCustomer(customer) {
    check(customer, {
      card: {
        number: String,
        exp_month: String,
        exp_year: String,
        cvc: String,
      },
    });

    Payments.addPaymentAccount(this.userId, customer);
  },
});
