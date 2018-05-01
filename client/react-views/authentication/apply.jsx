import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { moment } from 'meteor/mrt:moment';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Template } from 'meteor/templating';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import $ from 'jquery';
import 'jquery.scrollto';

Apply = React.createClass({
  getInitialState() {
    return {
      number: 1,
      promoToken: Session.get('promoToken'),
      birthDate: moment(),
    };
  },

  componentDidMount() {
    const self = this;

    CameraTag.setup();

    // $('#birthdate').datetimepicker({
    //   format: 'MM/DD/YYYY',
    //   timepicker: false,
    // });

    $('#applyOne').validate({
      rules: {
        resumeUrl: { required: true },
        emailAddress: {
          email: true,
          required: true,
        },
        firstName: { required: true },
        lastName: { required: true },
        phone: { required: true },
        address: { required: true },
        city: { required: true },
        state: { required: true },
        postal: { required: true },
      },
      submitHandler() {
        const stepTwo = document.querySelector('.stepTwo');

        stepTwo.classList.remove('disabled');
        $('body').scrollTo('.file_bag', { duration: 'slow' });
        document.querySelector('.js-step-two').disabled = false;
        self.setState({ number: 2 });
      },
    });

    $('#applyTwo').validate({
      rules: { specialities: { required: true } },
      submitHandler() {
        const stepThree = document.querySelector('.stepThree');

        stepThree.classList.remove('disabled');
        document.querySelector('.js-step-three').disabled = false;
        $('body').scrollTo('.specialities', { duration: 'slow' });
        self.setState({ number: 3 });
      },
    });

    $('#applyThree').validate({
      submitHandler() {
        // video

        const stepFour = document.querySelector('.stepFour');

        stepFour.classList.remove('disabled');
        document.querySelector('.js-step-four').disabled = false;
        $('body').scrollTo('#videoId', { duration: 'slow' });
        self.setState({ number: 4 });
      },
    });

    $('#applyFour').validate({
      submitHandler() {
        let tutor,
          tutorEmail;

        tutor = {
          email: $('.application [name="emailAddress"]').val().toLowerCase(),
          profile: {
            firstName: $('.application [name="firstName"]').val(),
            lastName: $('.application [name="lastName"]').val(),
            phoneNumber: $('.application [name="phone"]').val(),
            resume: $('.application [name="resumeUrl"]').val(),
            birthdate: $('.application [name="birthdate"]').val(),
            videoId: $('.application #tutorapplication_video_uuid').val(),
            videoShare: document.querySelector('[name="videoShare"]').checked,
            specialities: $('.application [name="specialities"]').val(),
            avatar: 'https://s3.amazonaws.com/tutorthepeople/temp/default-avatar.png',
          },
          address: {
            address: $('.application [name="address"]').val(),
            city: $('.application [name="city"]').val(),
            state: $('.application [name="state"]').val(),
            postal: $('.application [name="postal"]').val(),
          },
          invited: false,
          requested: (new Date()).getTime(),
          promoToken: $('.application [name="promoToken"]').val(),
        };
        tutorEmail = {
          email: $('.application [name="emailAddress"]').val().toLowerCase(),
          profile: {
            firstName: $('.application [name="firstName"]').val(),
            lastName: $('.application [name="lastName"]').val(),
          },
        };
        console.log(tutor);

        return Meteor.call('validateEmailAddress', tutor.email, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else if (response.error) {
            return alert(response.error);
          } else {
            return Meteor.call('addToTutorsList', tutor, (error, response) => {
              if (error) {
                console.log('call failed with:', error.reason);

                return alert(error.reason);
              } else {
                return Meteor.call('welcomePendingTutorEmail', tutorEmail, (error, response) => {
                  if (error) {
                    return console.log(error);
                  } else {
                    console.log(`Email sent to ${tutor.email}!`);

                    return Router.go('thankyou');
                  }
                });
              }
            });
          }
        });
      },
    });
  },
  handleDateChange(date) {
    this.setState({ birthDate: date });
  },
  uploadResume(e) {
    const file = e.target.files[0];
    const uploader = new Slingshot.Upload('fileUpload');
    const user = { _id: Meteor.userId() };

    uploader.send(file, (error, downloadUrl) => {
      if (error) {
        console.error('Error upload', uploader.xhr.response);
      } else {
        console.log(downloadUrl);
        $('[name="resumeUrl"]').val(downloadUrl);
        // parent.querySelector('.image').value = downloadUrl; // state isn't updating hidden fields?
        Bert.alert('Image uploaded!', 'success');
      }
    });
  },

  submitStep(e) {
    e.preventDefault();
  },

  render() {
    const illustration = { backgroundImage: 'url(https://s3.amazonaws.com/tutorappllc/tutor-apply-illustration.png)' };


    return (
      <div className="application">
        {/* <div className="application--steps">
          <h5>Step {this.state.number} of 4</h5>
        </div> */}
        <div className="forms">
          <div>
            <h5 className="steps">Step {this.state.number} of 4</h5>
            <h5 className="stepsGrey">*</h5>
          </div>
          <div className="application--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/tutor-apply-illustration.png" />
          </div>
          <div className="forms--inputs application--step-one">
            <h2>Personal Details</h2>
            <form id="applyOne" onSubmit={this.submitStep}>
              <label>Referral Code (Optional)
                <input name="promoToken" defaultValue={this.state.promoToken} /></label>
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
              <label>Email Address
                <input name="emailAddress" /></label>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>
                    Date of Birth
                    <DatePicker
                      name="birthdate"
                      dateFormat="MM/DD/YYYY"
                      selected={this.state.birthDate}
                      onChange={this.handleDateChange}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </label>
                </div>
                <div className="forms--double-s">
                  <label>Phone Number
                    <input name="phone" required /></label>
                </div>
              </div>
              <label>Address
                <input name="address" required /></label>
              <div className="forms--double">

                <div className="forms--double-s">
                  <label>City
                    <input name="city" required /></label>
                </div>
                <div className="forms--double-s">
                  <label>State
                    <div className="select-style">
                      <select name="state" required>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select></div></label>
                </div>
              </div>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>Zip Code
                    <input name="postal" required /></label>
                </div>
              </div>
              <h2>Education</h2>
              <label>Resume
                <p className="hint">Please upload your resume in PDF format</p>
                {/* <input className="file_bag" required name="resume" type="file" onChange={this.uploadResume} /></label> */}
                <input className="file_bag" name="resume" type="file" onChange={this.uploadResume} /></label>
              <input type="hidden" className="resume" name="resumeUrl" />
              <button type="submit" className="btn btn--xlarge btn--arrow">Next</button>
            </form>
            <div className="stepTwo disabled">
              <h2 className="application--break">Tutoring Subjects</h2>
              <form id="applyTwo" onSubmit={this.submitStep}>
                <div>
                  <h5 className="steps2">Step {this.state.number} of 4</h5>
                  <h5 className="stepsGrey2">*</h5>
                </div>
                <label>Enter all subjects
                  <textarea name="specialities" className="specialities" /></label>
                <button type="submit" className="js-step-two btn btn--xlarge btn--arrow" disabled>Next</button>
              </form>
            </div>
            <div className="stepThree disabled">
              <h2 className="application--break">Video</h2>
              <form id="applyThree" onSubmit={this.submitStep}>
                <div>
                  <h5 className="steps3">Step {this.state.number} of 4</h5>
                  <h5 className="stepsGrey3">*</h5>
                </div>
                <p>We want to get a better feel for your teaching style. Please pick a topic and record a video of how you would teach us that topic (at least 90 seconds). Be creative! Here’s an example from Sarah, one of our tutors:</p>
                <div className="video-container">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/N7QmwM5-mk0" frameBorder="0" allowFullScreen />
                </div>
                <div className="application--video">
                  <br /><br />
                  <camera id="tutorapplication" data-app-id="a-b2f41490-dfdc-0133-4d37-0e6e8acab70b" data-maxlength="300" />
                </div>
                <p>If your video interview is not recording, you may not have the latest version of Adobe Flash. Please update your Adobe Flash <a href="https://get.adobe.com/flashplayer/">here</a>.</p>
                <input id="videoId" className="video-hidden" type="text" name="videoId" />
                <div className="form-video-error" />
                <p>Submitting a video interview is strongly recommended but not required. With your permission, Tutor App will use your video to market your profile and distribute your unique referral link. Do we have your permission?</p>
                <label>
                  <input type="checkbox" name="videoShare" value="videoShare" /><span>Yes (leave blank if no)</span></label><br />
                <button type="submit" className="js-step-three btn btn--xlarge btn--arrow" disabled>Next</button>
              </form>
            </div>

            <div className="stepFour disabled">
              <h2 className="application--break">Legal</h2>
              <form id="applyFour" onSubmit={this.submitStep}>
                <div className="steps4">
                  <h5>Step {this.state.number} of 4</h5>
                </div>
                <div className="step--four-step">
                  <label>
                    <input type="checkbox" name="ssn" required /><span>I have a Social Security Number and can work in the US</span></label>
                </div>
                <div className="step--four-step">
                  <label>
                    <input type="checkbox" name="terms" required /><span>I agree with the <a href="/terms-of-use" target="_blank">terms of use</a> and <a href="/privacy-policy" target="_blank">privacy policy</a></span></label>
                </div>
                <button type="submit" className="js-step-four btn btn--xlarge btn--arrow" disabled>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

Template.tutorApply.helpers({
  Apply() {
    return Apply;
  },
});
