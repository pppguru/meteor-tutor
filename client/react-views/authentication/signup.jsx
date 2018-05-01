import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import React from 'react';
import $ from 'jquery';

Register = React.createClass({
  getInitialState() {
    return {
      promoToken: Session.get('promoToken'),
    };
  },

  componentDidMount() {
    $('#signup').validate({
      rules: {
        email: {
          email: true,
          required: true,
        },
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        password: {
          required: true,
          minlength: 5,
        },
        passwordConfirm: {
          required: true,
          equalTo: '#password',

        },
      },
      messages: {
        email: {
          email: 'Please use a valid email address.',
          required: 'An email address is required to join',
        },
        password: {
          required: '',
          minlength: 'Password must be at least 5 characters',
        },
        firstName: {
          required: '',
        },
        lastName: {
          required: '',
        },
        passwordConfirm: {
          equalTo: 'Passwords do not match',
        },
      },
      submitHandler() {
        const student = {
          emailAddress: $('#signup [name="email"]').val(),
          password: $('#signup [name="password"]').val(),
          profile: {
            firstName: $('#signup [name="firstName"]').val(),
            lastName: $('#signup [name="lastName"]').val(),
            avatar: 'https://s3.amazonaws.com/tutorthepeople/temp/default-avatar.png',
          },
          promoToken: $('#signup [name="promoToken"]').val(),
        };

        const submitButton = $('input[type="submit"]').val('Loading');

        return Meteor.call('validateEmailAddress', student.emailAddress, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
            Meteor.call('createStudent', student, (error, response) => {
              if (error) {
                alert(error.reason);
                submitButton.val('Reset');
              } else {
                if (response.error) {
                  alert(response.message);
                  submitButton.val('Reset');
                } else {
                  const info = response;
                  Meteor.loginWithPassword(student.emailAddress, student.password, (error) => {
                    if (error) {
                      alert(error.reason);
                      submitButton.val('Reset');
                    } else {
                      if (info.tutor) {
                        const tutorUrl = `/tutor/${info.tutor.meta.state}/${info.tutor.meta.city}/${info.tutor.slug}`;
                        Router.go(tutorUrl);
                      } else {
                        Router.go('/dashboard');
                      }
                      submitButton.val('Reset');
                      return Meteor.call('welcomeStudentEmail', student, (error) => {
                        if (error) {
                          return console.log(error);
                        } else {
                          return console.log(`Invite sent to ${student.email}!`);
                        }
                      });
                    }
                  });
                }
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
      backgroundImage: 'url(https://s3.amazonaws.com/tutorappllc/login-illustration.png)',
    };
    return (
      <div className="signup forms">
        <div className="forms--wrapper">
          <div className="forms--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/login-illustration.png" />
          </div>
          <div className="forms--inputs signup">
            <h2>Sign up.</h2>
            <h4>No credit card required.</h4>
            <form id="signup" onSubmit={this.submit}>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>First Name
                    <input name="firstName" required="true" required /></label>
                </div>
                <div className="forms--double-s">
                  <label>Last Name
                    <input name="lastName" required /></label>
                </div>
              </div>
              <label>Your email
                <input name="email" required /></label>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>Your password
                    <input type="password" id="password" name="password" /></label>
                </div>
                <div className="forms--double-s">
                  <label>Confirm password
                    <input type="password" name="passwordConfirm" /></label>
                </div>
              </div>
              <label>Referral Code (Optional)
                <input name="promoToken" defaultValue={this.state.promoToken} /></label>
              <div className="forms--double">
                <label>
                  <input type="checkbox" name="terms" required /><span className="terms--agree">I agree with the <a href="/terms-of-use" target="_blank">terms and conditions</a> and <a href="/privacy-policy" target="_blank">privacy policy</a></span></label>
              </div>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Register</button>
                <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});

Template.register.helpers({
  Register() {
    return Register;
  },
});
