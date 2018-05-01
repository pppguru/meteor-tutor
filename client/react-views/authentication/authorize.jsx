import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import React from 'react';
import $ from 'jquery';

Authorize = React.createClass({
  getInitialState() {
    return {
      betaToken: Session.get('betaToken'),
    };
  },
  componentDidMount() {
    return $('#authorize').validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
        betaToken: {
          required: true,
        },
      },
      messages: {
        email: {
          required: 'Please enter your email address to sign up.',
          email: 'Please enter a valid email address.',
        },
        password: {
          required: 'Please enter a password to sign up.',
          minlength: 'Please use at least six characters.',
        },
        betaToken: {
          required: 'A valid beta token is required to sign up.',
        },
      },
      submitHandler() {
        let user;
        user = {
          email: $('[name="email"]').val().toLowerCase(),
          password: $('[name="password"]').val(),
          betaToken: $('[name="betaToken"]').val(),
        };
        return Meteor.call('validateBetaToken', user, (error) => {
          if (error) {
            return alert(error.reason);
          } else {
            return Meteor.loginWithPassword(user.email, user.password, (error) => {
              if (error) {
                return alert(error.reason);
              } else {
                return Router.go('/dashboard');
              }
            });
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
      backgroundImage: 'url(https://s3.amazonaws.com/tutorappllc/tutor-approval-illustration.png)',
    };
    return (
      <div className="authroize forms">
        <div className="forms--wrapper">
          <div className="forms--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/login-illustration.png" />
          </div>
          <div className="forms--inputs">
            <h2>Welcome to Tutor App!</h2>
            <form id="authorize" onSubmit={this.submit}>
              <div className="forms--double">
                <div className="forms--single">
                  <label>Your Code
                    <input name="betaToken" placeholder="Token" defaultValue={this.state.betaToken} required /></label>
                </div>
                <div className="forms--single">
                  <label>Your Email
                    <input name="email" required type="email" /></label>
                </div>
              </div>

              <div className="forms--double">
                <div className="forms--single">
                  <label>Password
                    <input name="password" placeholder="New Password" type="password" required /></label>
                </div>
                <div className="forms--single">
                  <label>Confirm Password
                    <input name="passwordRepeat" placeholder="Repeat New Password" type="password" required /></label>
                </div>
              </div>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Complete Signup</button>
                <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});


Template.signup.helpers({
  Authorize() {
    return Authorize;
  },
});
