import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';

import React from 'react';
import $ from 'jquery';

RecoverPassword = React.createClass({

  getInitialState() {
    return {
      updating: false,
    };
  },
  componentDidMount() {
    const self = this;
    return $('#recover').validate({
      rules: {
        emailAddress: {
          required: true,
          email: true,
        },
      },
      messages: {
        emailAddress: {
          required: 'Please enter your email address to recover your password.',
          email: 'Please enter a valid email address.',
        },
      },
      submitHandler() {
        let email;
        email = document.querySelector('[name="email"]').value;
        return Accounts.forgotPassword({
          email,
        }, (error) => {
          if (error) {
            return alert(error.reason);
          } else {
            document.querySelector('[name="email"]').value = '';

            self.setState({
              updating: true,
            });
            setTimeout(() => {
              self.setState({
                updating: false,
              });
            }, 5000);
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
        {this.state.updating ? <Notification type="success" message="We've sent you an email!" /> : ''}
        <div className="forms--wrapper">
          <div className="forms--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/login-illustration.png" />
          </div>
          <div className="forms--inputs">
            <h2>Recover Password</h2>
            <p>Enter the email address associated with your account below and click the "Recover Password" button. You will receive an email with further instructions on how to reset your password.</p>
            <form id="recover" onSubmit={this.submit}>
              <label>
                <input name="email" placeholder="E-Mail Address" required /></label>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Recover Password</button>
                <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});


Template.recoverPassword.helpers({
  RecoverPassword() {
    return RecoverPassword;
  },
});
