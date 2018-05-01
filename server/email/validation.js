import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

import Future from 'future';
/*
  Email Validation
  Method for validating email addresses for authenticity.
 */

Meteor.methods({
  validateEmailAddress(address) {
    let validateEmail;
    check(address, String);
    validateEmail = new Future();
    HTTP.call('GET', 'https://api.kickbox.io/v1/verify', {
      params: {
        email: address,
        apikey: 'f7445d45838d36fc1ba40de0cb05c6cef032c8b56584c014cd3463801ea9e80c',
      },
    }, (error, response) => {
      if (error) {
        return validateEmail.return(error);
      } else {
        if (response.data.result === 'invalid' || response.data.result === 'unknown') {
          return validateEmail.return({
            error: 'Sorry, your email was returned as invalid. Please try another address.',
          });
        } else {
          return validateEmail.return(true);
        }
      }
    });
    return validateEmail.wait();
  },
});
