Payments
=================

All the payment processing logic is in this directory, and is split into several files:

1. payments.js handles the business logic for processing individual lessons and referrals for payment, for example, the `rewardTutorForReferal` method checks the number of hours a given referred user has used (taught or been taught) TutorApp, and the current payment state for that referrer relationship, and then calls `paymentProcessor.issuePayment(referrer, amount)` and then calls `paymentNotifier.notifyPayment(referrer, amount, 'referral-reward')`
2. stripe.js handles actually processing payments, charges, transfers and issuing credit.
3. emails.js handles sending out notifications to various users concerning payments
4. jobs.js handles finding un-processed records and calls the payment processing method in payments.js to process those records, for example we might find a Lesson in the 'completed' stage and call `payments.chargeStudentForLesson`
5. methods.js contains any user-facing meteor methods, e.g. addCard, etc.

Settings
=================

There are 2 places where you can edit the settings for the payment processing system:

1. Meteor settings file:
    - `sendPaymentErrorNotificationsTo` - Set this key to the email address of an admin who should receive notifications in the case of payment processing errors. A user with the same email address must exist in the database.
    - `debug_payment_processing` - Set this flag to true to cause payment processing to happen immediately, otherwise payment processing will happen every 2 hours and the default delays for payment processing (24 and 64 hours for charges and payouts respectively) will be used.
2. Payments.js - The following variables may all be set in the top of `/server/payments/payments.js`
    - hoursBeforeStudentPayment
    - hoursBeforeTutorPayment
    - percentCommission
    - studentReferralRewardAmount
    - tutorReferralRewardAmount

Cron Jobs
=================
Payment processing jobs are defined in `server/payments/jobs` and are run as a single cron job.


Referrals
=================

The logic for awarding referrals also resides here, since it's mostly payment related.
