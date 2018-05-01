PaymentNotifications = {
  notifyPaymentResolved(lesson, details) {
    PaymentNotifications.notifyStudentOfPaymentReciept(lesson, details);
    PaymentNotifications.notifyTutorOfPaymentPending(lesson, details);
  },
  notifyStudentOfPaymentReciept(lesson, details) {
    var student = Meteor.users.findOne({ _id: lesson.student_id });
    var tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    var date = moment(lesson.date).format('Do MMMM YYYY');
    var amount = details.amount;
    var template = this.getTemplateForPaymentReciept(details.reason);
    this.sendTemplate({
      template_name: template,
      template_content: [
        { name: 'body', content: '<h3>You have been charged in Tutor App</h3>' }
      ],
      message: {
        "from_email": "hello@tutorapp.com",
        "from_name": "Tutor App",
        "subject": "Here's Your Receipt",
        "to": [
          this.getUserEmail(student),
        ],
        "global_merge_vars": [
          { name: 'tutor_name', content: tutor.profile.firstName },
          { name: 'student_name', content: student.profile.firstName },
          { name: 'charge_amount', content: this.formatCurrency(amount) },
          { name: 'lesson_history', content: 'https://tutorapp.com/lesson-history/' }
        ]
      }
    });
  },
  notifyTutorOfPaymentPending(lesson, details) {
    var tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    var student = Meteor.users.findOne({ _id: lesson.student_id });
    var date = moment(lesson.date).format('Do MMMM YYYY');
    var amount = details.amount;
    this.sendTemplate({
      template_name: this.getTemplateForPaymentPending(details.reason),
      template_content: [
        { name: 'body', content: '<h3>Thanks for meeting on Tutor App</h3>' }
      ],
      message: {
        "from_email": "hello@tutorapp.com",
        "from_name": "Tutor App",
        "subject": "Payment Receipt",
        "to": [
          this.getUserEmail(tutor),
        ],
        "global_merge_vars": [
          { name: 'tutor_name', content: tutor.profile.firstName },
          { name: 'student_name', content: student.profile.firstName },
          { name: 'payment_amount', content: this.formatCurrency(amount) },
          { name: 'lesson_history', content: 'https://tutorapp.com/lesson-history/' }
        ]
      }
    });
  },
  notifyNeedsPayoutAccount(user_id, details) {
    // Don't notify the tutor if we've already notified them today
    if (this.deferrDuplicateEmail(user_id, details.reason)) {
      return;
    }

    var lesson = details.lesson;
    var student = lesson && Meteor.users.findOne({ _id: lesson.student_id });
    var tutor = lesson && Meteor.users.findOne({ _id: lesson.tutor_id });
    var date = lesson && moment(lesson.date).format('Do MMMM YYYY');
    this.sendTemplate({
      template_name: "tutor-no-bank-acct-on-file",
      template_content: [
        { name: 'body', content: '<h3>Student has accepted your Lesson</h3>' }
      ],
      message: {
        "from_email": "hello@tutorapp.com",
        "from_name": "Tutor App",
        "subject": "Bank Account Required",
        "to": [
          this.getUserEmail(tutor),
        ],
        "global_merge_vars": [
          { name: 'student_name', content: student && student.profile.firstName },
          { name: 'tutor_name', content: tutor && tutor.profile.firstName },
          { name: 'chat_url', content: "https://tutorapp.com/chat/"+lesson.chat_id },
          { name: 'day_time', content: date }
        ]
      }
    });
  },
  notifyRenumerationResolved(lesson, details) {
    this.notifyTutorOfPayoutPending(lesson, details);
  },
  notifyTutorOfPayoutPending(lesson, details) {
    var student = Meteor.users.findOne({ _id: lesson.student_id });
    var tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    var date = moment(lesson.date).format('Do MMMM YYYY');
    var amount = details.amount;
    this.sendTemplate({
      template_name: this.getTemplateForPayoutNotification(details.reason),
      template_content: [
        { name: 'body', content: '<h3>You have been paid in Tutor App</h3>' }
      ],
      message: {
        "from_email": "hello@tutorapp.com",
        "from_name": "Tutor App",
        "subject": "You've been paid for your Session on Tutor App!",
        "to": [
          PaymentNotifications.getUserEmail(tutor),
        ],
        "global_merge_vars": [
          { name: 'tutor_name', content: tutor.profile.firstName },
          { name: 'student_name', content: student.profile.firstName },
          { name: 'payment_amount', content: this.formatCurrency(amount) },
          { name: 'day_time', content: date },
          { name: 'lesson_history', content: 'https://tutorapp.com/lesson-history/' }
        ]
      }
    });
  },
  notifyStudentOfCreditEarned(userId, details) {
    var user = Meteor.users.findOne({ _id: userId });
    var referredUser = Meteor.users.findOne(details.referredUserId);
    this.sendTemplate({
      template_name: "you-earned-referral-credit",
      template_content: [
        { name: 'body', content: '<h3>You earned referral credit</h3>' }
      ],
      message: {
        "from_email": "hello@tutorapp.com",
        "from_name": "Tutor App",
        "subject": "Referral Receipt",
        "to": [
          this.getUserEmail(user),
        ],
        "global_merge_vars": [
          { name: 'other_name', content: referredUser.profile.firstName },
          { name: 'payment_amount', content: this.formatCurrency(details.amount) },
          { name: 'referrer_first_name', content: user.profile.firstName }
        ]
      }
    });
  },
  notifyAdminOfError(job, record, error) {
    var adminEmail = Meteor.settings && Meteor.settings.sendPaymentErrorNotificationsTo;
    if (! adminEmail) {
      console.log("Sending admin error notification emails is disabled.");
      return;
    }

    var adminUser = Meteor.users.findOne({ "emails.address": adminEmail });
    if (! adminUser) {
      throw new Error("Admin user was not found, can't send error notification email.");
    }

    var reason = job + ":" + (record && record.id || record._id || "unknown");
    if (this.deferrDuplicateEmail(adminUser._id, reason)) {
      return;
    }

    this.sendMessage({
      from_email: "hello@tutorapp.com",
      to: [ { email: adminEmail, type: 'to' } ],
      subject: "Error in payment processing",
      text: [
        "While running the payment processing job: " + job + ",",
        "",
        "There was an error: ",
        error && error.stack || error,
        '',
        'The record being processed was: ',
        this.stringify(record),
        '',
        'This email will only be sent once per error type per record per day, the uniqueness key is: ' + reason + '.',
      ].join("\n"),
    });
  },
  formatCurrency(amount) {
    return "$" + Number(amount).toFixed(2);
  },
  getTemplateForPaymentReciept(reason) {
    return {
      "lesson:completed": "student-lesson-charged",
      "lesson:cancelled": "student-lesson-charged-24-hour-cancellation",
    }[reason];
  },
  getTemplateForPaymentPending(reason) {
    return {
      "lesson:completed": "tutor-payment-pending",
      "lesson:cancelled": "tutor-payment-pending-24-hour-cancellation",
    }[reason];
  },
  getTemplateForPayoutNotification(reason) {
    return {
      "lesson:completed": "tutor-paid",
      "lesson:cancelled": "tutor-paid",
    }[reason];
  },
  getUserEmail(user) {
    var email = user && user.emails && user.emails[0] && user.emails[0].address;
    var name = user && user.profile && (
      user.profile.firstName || "" +
      " " +
      user.profile.lastName || ""
    );
    return { email, name };
  },
  deferrDuplicateEmail(userId, reason) {
    var today = moment().startOf('day').toDate();
    var emailAlreadySentToday = Meteor.users.findOne({
      _id: userId,
      notificationsSent: {
        $elemMatch: {
          reason,
          date: { $gte: today },
        },
      },
    });

    if (emailAlreadySentToday) {
      // true means 'do deferr'
      return true;
    }

    Meteor.users.update({
      _id: userId,
    }, {
      $push: {
        notificationsSent: {
          reason,
          date: new Date(),
        },
      },
    });

    // false means 'send the email'
    return false;
  },
  sendTemplate(options) {
    console.log(`Sent email about ${options.subject} from ${options.from_email} to ${options.to} using template ${options.template_name}.`);
    return Meteor.wrapAsync((cb) => {
      Mandrill.messages.sendTemplate(options, cb);
    })();
  },
  sendMessage(options) {
    console.log(`Sent email about ${options.subject} from ${options.from_email} to ${options.to} without a template.`);
    return Meteor.wrapAsync((cb) => {
      Mandrill.messages.send({ message: options }, cb);
    })();
  },
  stringify: (a) => PaymentProcessingTask.prototype.stringify(a),
};
