import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import React from 'react';
import $ from 'jquery';

ResetPassword = React.createClass({

  componentDidMount() {
    return $('#reset').validate({
      rules: {
        password: {
          required: true,
          minlength: 6,
        },
        passwordRepeat: {
          required: true,
          minlength: 6,
          equalTo: "[name='password']",
        },
      },
      messages: {
        password: {
          required: 'Please enter a new password.',
          minlength: 'Please use at least six characters.',
        },
        passwordRepeat: {
          required: 'Please repeat your new password.',
          equalTo: 'Your password do not match. Please try again.',
        },
      },
      submitHandler() {
        let password, token;
        token = Session.get('resetPasswordToken');
        password = {
          newPassword: document.querySelector('[name="password"]').value,
          repeatPassword: document.querySelector('[name="passwordRepeat"]').value,
        };
        return Accounts.resetPassword(token, password.newPassword, (error) => {
          if (error) {
            return alert(error.reason);
          } else {
            Router.go('/');
            return Session.set('resetPasswordToken', null);
          }
        });
      },
    });
  },

  submit(e) {
    e.preventDefault();
  },

  render() {
    const illustration = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorappllc/login-illustration.png)',
    };
    return (
      <div className="login forms">
        <div className="forms--wrapper">
          <div className="forms--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/login-illustration.png" />
          </div>
          <div className="forms--inputs">
            <h2>Reset Password</h2>
            <form id="reset" onSubmit={this.submit}>
              <label>New Password
                <input name="password" placeholder="New Password" type="password" required /></label>
              <label>Repeat New Password
                <input name="passwordRepeat" placeholder="Repeat New Password" type="password" required /></label>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Reset Password</button>
                <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});


Template.resetPassword.helpers({
  ResetPassword() {
    return ResetPassword;
  },
});
