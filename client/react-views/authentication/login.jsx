import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Router } from 'meteor/iron:router';
import { Template } from 'meteor/templating';

import React from 'react';
import $ from 'jquery';

Login = React.createClass({
  getInitialState() {
    return {
      canSubmit: false,
      email: false,
      password: false,
    };
  },

  componentDidMount() {
    return $('#login').validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        email: {
          required: 'Please enter your email address to login.',
          email: 'Please enter a valid email address.',
        },
        password: {
          required: 'Please enter your password to login.',
        },
      },
      submitHandler() {
        const user = {
          email: $('[name="email"]').val(),
          password: $('[name="password"]').val(),
        };
        return Meteor.loginWithPassword(user.email, user.password, (error) => {
          if (error) {
            return alert(error.reason);
          } else {
            loggedInUser = Meteor.user();
            isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
            if (isAdmin) {
              Router.go('/admin/invites');
            } else {
              Router.go('/dashboard');
            }
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
            <h2>Login</h2>
            <form id="login" onSubmit={this.submit}>
              <label>Your email
                <input name="email" required /></label>
              <label>Your password
                <input type="password" name="password" /></label>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Login</button>
                <div className="links">
                  <a href="/recover-password">Forgot Password</a><br />
                </div>
              </div>
            </form>
            <span className="no-account">Don't have an account? <a href="/signup">Sign up for free</a>. No credit card required.</span>
          </div>
        </div>
      </div>
    );
  },
});


Template.login.helpers({
  Login() {
    return Login;
  },
});
