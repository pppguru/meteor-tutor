import { Accounts } from 'meteor/accounts-base';

/*
  Reset Password Email Template
  Override Meteor defaults when sending a reset password email.
 */
Accounts.emailTemplates.siteName = 'Tutor App';
//
Accounts.emailTemplates.from = 'Tutor App <hello@tutorapp.com>';

Accounts.emailTemplates.resetPassword.subject = function (user) {
  return 'Tutor App Password Reset';
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
  let email, removeHash;
  email = user.emails[0].address;
  removeHash = url.replace('#/', '');
  return `A password reset has been requested for the account related to this address(${email}). To reset the password, visit the following link:\n\n ${removeHash}\n\n If you did not request this reset, please ignore this email. If you feel something is wrong, please contact support: help@tutorapp.com.`;
};
