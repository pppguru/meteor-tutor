import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Template } from 'meteor/templating';

import React from 'react';
import ReactDOM from 'react-dom';
import autocomplete from 'autocomplete.js';
import algoliasearch from 'algoliasearch';

import Modules from '/client/modules/serialize-modules';


ProfileSettings = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      tutor = Roles.userIsInRole(userId, ['tutor']),
      student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      tutor,
      student,
    };
  },
  getTutorStatus() {
    if (this.data.tutor) { return true; }
    return false;
  },
  getInitialState() {
    return {
      updating: false,
    };
  },
  componentDidMount() {
    const self = this;
    $('#updateUser').validate({
      rules: {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        address: {
          required: true
        },
        city: {
          required: true
        },
        state: {
          required: true
        },
        postal: {
          required: true
        }
      },
      submitHandler: function() {
        let submitButton = document.querySelector('.js-save');
        submitButton.innerHTML = "Saving";
        submitButton.classList.add('saving');
        const currentUser = Meteor.user();
        let tutor = false;
        const update = { _id: currentUser._id };
        const user = {
          profile: {
            firstName: document.querySelector('[name="firstName"]').value,
            lastName: document.querySelector('[name="lastName"]').value,
          },
        };

        const educationContent = Modules.client.serializeEducation();

        const subjectContent = Modules.client.serializeSubjects();


        if (Roles.userIsInRole(currentUser, 'tutor')) {
          user.profile.biography = document.querySelector('[name="biography"]').value || ' ';
          user.address = {
            address: document.querySelector('[name="address"]').value,
            city: document.querySelector('[name="city"]').value,
            state: document.querySelector('[name="state"]').value,
            postal: document.querySelector('[name="postal"]').value,
          };
          user.scheduling = [
            {
              name: 'monday',
              value: document.querySelector('[name="monday"]').value,
            },
            {
              name: 'tuesday',
              value: document.querySelector('[name="tuesday"]').value,
            },
            {
              name: 'wednesday',
              value: document.querySelector('[name="wednesday"]').value,
            },
            {
              name: 'thursday',
              value: document.querySelector('[name="thursday"]').value,
            },
            {
              name: 'friday',
              value: document.querySelector('[name="friday"]').value,
            },
            {
              name: 'saturday',
              value: document.querySelector('[name="saturday"]').value,
            },
            {
              name: 'sunday',
              value: document.querySelector('[name="sunday"]').value,
            },
          ];
          user.education = educationContent;
          user.specialities = subjectContent;
          user.rate = document.querySelector('[name="rate"]').value;
          user.meetingPreference = document.querySelector('[name="meetingPreference"]').value;
          tutor = true;
        }

        if (tutor === false) {
          console.log('false?');
          return Meteor.call('updateUser', update, user, (error, response) => {
            if (error) {
              return alert(error.reason);
            } else {
              submitButton.innerHTML = 'Save Again';
              submitButton.classList.remove('saving');
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
        } else {
          return Meteor.call('updateTutor', update, user, (error, response) => {
            if (error) {
              return alert(error.reason);
            } else {
              submitButton.innerHTML = 'Save Again';
              submitButton.classList.remove('saving');
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
        }
      },
    });
  },

  updateUser(e) {
    e.preventDefault();
  },
  handleFile(e) {
    const file = e.target.files[0];
    const uploader = new Slingshot.Upload('fileUpload');
    const user = { _id: Meteor.userId() };

    uploader.send(file, (error, downloadUrl) => {
      console.log(error);
      if (error) {
        console.error('Error upload', uploader.xhr.response);
      } else {
        Meteor.call('updateAvatar', user, downloadUrl, true, (error, response) => {
          if (error) {
            return console.log(error);
          } else {
            return console.log('success');
          }
        });
        // parent.querySelector('.image').value = downloadUrl; // state isn't updating hidden fields?
        Bert.alert('Image uploaded!', 'success');
      }
    });
  },
  deleteAvatar(e) {
    const user = { _id: Meteor.userId() };
    Meteor.call('updateAvatar', user, 'https://s3.amazonaws.com/tutorthepeople/temp/default-avatar.png', false, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        return console.log('success');
      }
    });
  },
  render() {
    const tutorStatus = this.getTutorStatus();
    const avatar = {
      backgroundImage: `url(${this.data.user.profile.avatar})`,
    };
    return (
      <div className="dashboard">
        {this.state.updating ? <Notification type="success" message="Settings Saved!" /> : ''}
        <UserNavigation />
        <form className="forms" id="updateUser" onSubmit={this.updateUser}>
          <div className="dashboard--settings-header">
            <div className="dashboard--settings-avatar">
              <div className="dashboard--settings-avatar-bg" style={avatar} />
            </div>
            { this.data.user.profile.avatar.indexOf('default-avatar.png') < 0 ?
              <div className="dashboard--settings-avatar-delete" onClick={this.deleteAvatar}><a href="#" title="delete photo">X</a></div> : ''}
            <div className="dashboard--settings-name">
              <input type="text" className="input--half" name="firstName" required defaultValue={this.data.user.profile.firstName} />
              <input type="text" className="input--half" name="lastName" required defaultValue={this.data.user.profile.lastName} />
              <label>Upload a photo. For optimal quality, please make sure it is a headshot and formatted in square ratio.
                <input type="file" className="avatar-upload" onChange={this.handleFile} /></label>
            </div>
          </div>
          <div className="dashboard--settings-information">
            <div className="dashboard--settings-information-wrapper">
              {tutorStatus ?
                <TutorAbout user={this.data.user} />
              : '' }
              {tutorStatus ?
                <TutorScheduling user={this.data.user} />
              : '' }
              {tutorStatus ?
                <TutorEducation user={this.data.user} />
              : '' }
              {tutorStatus ?
                <TutorSubjects user={this.data.user} />
              : '' }
            </div>
          </div>
          <div className="dashboard--settings-save">
            <button type="submit" className="js-save btn btn--large" >Save Changes</button>
          </div>
        </form>
      </div>
    );
  },
});

TutorAbout = React.createClass({
  render() {
    return (
      <div>
        <label>About
          <textarea id="bio" name="biography" placeholder="About" defaultValue={this.props.user.profile.biography} />
        </label>
        <div className="dashboard--settings-address">
          <div className="dashboard--settings-address-wrapper">
            <div className="dashboard--settings-address-single">
              <label>Address
                <input type="text" name="address" className="address" required placeholder="Address 1" defaultValue={this.props.user.address.address} />
              </label>
            </div>
            <div className="dashboard--settings-address-single">
              <label>City
                <input type="text" name="city" className="city" placeholder="Address 1" defaultValue={this.props.user.address.city} />
              </label>
            </div>
            <div className="dashboard--settings-address-single">
              <label>State
                <div className="select-style">
                  <select name="state" defaultValue={this.props.user.address.state} required>
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
            <div className="dashboard--settings-address-single">
              <label>Zip Code
                <input type="text" name="postal" className="postal" placeholder="Postal" defaultValue={this.props.user.address.postal} />
              </label>
            </div>
          </div>

          <div className="dashboard--settings-address-wrapper">
            <div className="dashboard--settings-address-single">
              <label>Rate
                <span className="tooltip">?
                  <div className="tooltip--hidden">
                    <p>Tutor App takes a 30% commission for students we bring to you. Keep this in mind when setting your rates so you get what you deserve! And remember, for every student that signs up using your unique <a href="/referrals">referral link</a>, you pay no fees.</p>
                  </div>
                </span>
                <input type="number" step="5" max="240" min="35" id="rate" name="rate" placeholder="Rate" defaultValue={this.props.user.rate} /></label>
            </div>
            <div className="dashboard--settings-address-single">
              <label>Meeting Preference {this.props.user.meeetingPreference}
                <div className="select-style">
                  <select name="meetingPreference" defaultValue={this.props.user.meeetingPreference} required>
                    <option value="0">No Preference</option>
                    <option value="1">Online Only</option>
                    <option value="2">In Person Only</option>
                  </select>
                </div></label>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TutorScheduling = React.createClass({
  renderSchedule() {
    return this.props.user.scheduling.map((schedule) => {
      return <ScheduleItem key={schedule.name} schedule={schedule} />;
    });
  },
  render() {
    return (
      <div className="dashboard--settings-scheduling">
        <div className="icon-item">
          <div className="icon-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="M37.82,166.5A13.5,13.5,0,1,1,24.32,180a13.52,13.52,0,0,1,13.5-13.5m0-4.5a18,18,0,1,0,18,18,18,18,0,0,0-18-18h0Z" transform="translate(-19.82 -162)" /><path d="M43.92,182.9l-3.85-3.85v-8H35.55v9a2.23,2.23,0,0,0,.78,1.68l4.41,4.41Z" transform="translate(-19.82 -162)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h3>Availability</h3>
          </div>
        </div>
        <div className="dashboard--settings-scheduling-wrapper">
          {this.renderSchedule()}
        </div>
      </div>
    );
  },
});

ScheduleItem = React.createClass({
  render() {
    return (
      <div className="dashboard--settings-scheduling-item">
        <label>{this.props.schedule.name}:
          <div className="select-style">
            <select name={this.props.schedule.name} defaultValue={this.props.schedule.value} required>
              <option value="0">Not Availiable</option>
              <option value="1">Mornings</option>
              <option value="2">Afternoon</option>
              <option value="3">Evenings</option>
              <option value="4">All Day</option>
            </select>
          </div>
        </label>
      </div>
    );
  },
});

TutorEducation = React.createClass({
  getInitialState() {
    return {
      education: [],
    };
  },
  componentWillMount() {
    this.setState({
      education: this.props.user.education,
    });
  },
  deleteEducation(e) {
    const educationIndex = parseInt(e.currentTarget.getAttribute('data-value'), 10);
    this.setState((state) => {
      state.education.splice(educationIndex, 1);
      return { education: state.education };
    });
  },
  renderEducation() {
    return this.state.education.map((education, i) => {
      return <EducationItem key={i} index={i} education={education} deleteEducation={this.deleteEducation} />;
    });
  },
  addEducation(e) {
    e.preventDefault();

    const education = {
      adminApproved: false,
      approvalNeeded: false,
      verifiedDocument: null,
      schoolName: '',
      educationLevel: '',
    };
    const educationItems = this.state.education;
    educationItems.push(education);
    this.setState({
      education: educationItems,
    });
  },
  render() {
    return (
      <div className="dashboard--settings-education">
        <div className="icon-item">
          <div className="icon-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.14 42.34"><path d="M17.25,39.55l-5.68-2.34L45.64,23.14,79.71,37.21,45.64,51.27,20.09,40.72V65.48H17.25V39.55ZM45.64,54.62l-17-7.56V59.56s6.09,5.92,17,5.92,17-5.92,17-5.92V47.07Z" transform="translate(-11.57 -23.14)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h3>Education</h3>
          </div>
        </div>
        <div className="dashboard--settings-education">
          {this.renderEducation()}
        </div>
        <div className="dashboard--settings-education-add">
          <a href="" className="btn btn--large" onClick={this.addEducation}>Add Education</a>
        </div>
      </div>
    );
  },
});


const client = algoliasearch(Meteor.settings.public.algolia.applicationId, Meteor.settings.public.algolia.searchOnlyKey);
const index = client.initIndex('Subjects');

TutorSubjects = React.createClass({
  getInitialState() {
    return {
      subjects: [],
    };
  },
  componentWillMount() {
    this.setState({
      subjects: this.props.user.specialities,
    });
  },
  deleteSubject(e) {
    const subjectIndex = parseInt(e.currentTarget.getAttribute('data-value'), 10);
    this.setState((state) => {
      state.subjects.splice(subjectIndex, 1);
      return { subjects: state.subjects };
    });
  },
  renderSubjects() {
    return this.state.subjects.map((subject, i) => {
      return <SubjectItem key={i} index={i} subject={subject} deleteSubject={this.deleteSubject} />;
    });
  },
  componentDidMount() {
    const self = this;
    const field = document.getElementById('subjectSearch');
    autocomplete('#subjectSearch', { hint: false }, [
      {
        source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
        displayKey: 'subject',
        templates: {
          suggestion(suggestion) {
            return suggestion._highlightResult.subject.value;
          },
        },
      },
    ]).on('autocomplete:selected', (event, suggestion, dataset) => {
      const subject = {
        subject: suggestion.subject,
        adminApproved: false,
        approvalNeeded: false,
        verifiedDocument: null,
      };
      const subjectItems = self.state.subjects;
      subjectItems.push(subject);
      self.setState({
        subjects: subjectItems,
      });

      field.value = '';
    });
  },
  render() {
    return (
      <div className="dashboard--settings-subjects">
        <div className="icon-item">
          <div className="icon-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07 35.62"><path d="M399.75,1415h0a1.14,1.14,0,0,0,1.13-1.13h0v-22.19a1.14,1.14,0,0,0-1.13-1.14h-4.29V1385a1.14,1.14,0,0,0-.52-1,1.13,1.13,0,0,0-1.08-.08l-15.37,6.94a1.12,1.12,0,0,0-.62.74h-0.06v22.21h0a5.63,5.63,0,0,0,5.4,5.6h16.53a1.14,1.14,0,0,0,0-2.28A1.1,1.1,0,0,1,399.75,1415Zm-3.16,2.2h-8.93v0h-4.43a3.34,3.34,0,0,1-2.93-2.2h16.3a3.37,3.37,0,0,0-.2,1.11A3.32,3.32,0,0,0,396.59,1417.19Zm-12.34-4.5,10.53-4.76a1.14,1.14,0,0,0,.67-1V1392.8h3.16v19.89H384.25Z" transform="translate(-377.82 -1383.86)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h3>Subjects</h3>
          </div>
        </div>
        <div className="dashboard--settings-subjects-add">
          <input type="text" id="subjectSearch" placeholder="Search for Subjects" onChange={this.handleChange} />
        </div>
        <div className="dashboard--settings-subjects-wrapper">
          {this.renderSubjects()}
        </div>
      </div>
    );
  },
});

SubjectItem = React.createClass({
  getInitialState() {
    return {
      verified: false,
      verifiedDocument: this.props.subject.verifiedDocument,
    };
  },
  checkVerified(e) {
    if (e.target.checked) {
      this.setState({
        verified: true,
      });
    } else {
      this.setState({
        verified: false,
      });
    }
  },
  componentDidMount() {
    console.log(this.props);
    if (this.props.subject.approvalNeeded === true || this.props.subject.adminApproved === true) {
      const switchHandle = this.approvalNeeded;
      switchHandle.checked = true;

      this.setState({
        verified: true,
      });
    }
    if (this.props.subject.adminApproved === true) {
      const adminApproval = this.adminApproved;
      adminApproval.checked = true;
    }
  },
  handleFile(e) {
    let file = e.target.files[0],
      self = this,
      uploader = new Slingshot.Upload('fileUpload'),
      parent = e.target.parentNode.parentNode.querySelector('[name="verified-document"]'),
      user = { _id: Meteor.userId() };
    console.log(parent);
    uploader.send(file, (error, downloadUrl) => {
      if (error) {
        console.error('Error upload', uploader.xhr.response);
      } else {
        self.setState({
          verifiedDocument: downloadUrl,
        });

        Bert.alert('Documented uploaded!', 'success');
      }
    });
  },
  render() {
    let verified = this.state.verified,
      verifiedDoc = this.state.verifiedDocument;

    return (
      <div className="dashboard--settings-subjects-single subject-module" data-module-type="subject">
        <h4>{this.props.subject.subject}</h4>
        <input type="checkbox" className="hidden-admin" ref={c => this.adminApproved = c} defaultValue={this.props.subject.adminApproved} name="admin-approved" />
        <div className="dashboard--settings-subjects-switch">
          <span className="verified">Verify
            <span className="tooltip">?
              <div className="tooltip--hidden">
                <p>Verified subjects or education will display a verification symbol √ to showcase your expertise to students. Please upload supporting documents (i.e. transcript, diploma, certificate, etc.) to verify a subject/education. If you have any questions, please contact <a href="mailto:verify@tutorapp.com">verify@tutorapp.com</a>.</p>
              </div>
            </span></span>
          <label className="switch switch-left-right">
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input className="switch-input" name="approval-needed" ref={c => this.approvalNeeded = c} type="checkbox" onChange={this.checkVerified} />
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span className="switch-label" data-on="yes" data-off="off" />
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span className="switch-handle" />
          </label>
          <div className="dashboard--settings-subjects-delete" onClick={this.props.deleteSubject} data-value={this.props.index}>Delete Subject</div>
        </div>
        <div className="dashboard--settings-subjects-upload">

          {verifiedDoc !== null ?
            <a href={this.state.verifiedDocument} target="_blank">View Document</a>
          : '' }
          {verified ?
            <div>
              <input type="hidden" required defaultValue={this.state.verifiedDocument} name="verified-document" />
              <input type="file" className="subject-upload" onChange={this.handleFile} />
            </div>
          : ''}
        </div>
      </div>
    );
  },
});

EducationItem = React.createClass({
  getInitialState() {
    return {
      verified: false,
      verifiedDocument: this.props.education.verifiedDocument,
    };
  },
  checkVerified(e) {
    if (e.target.checked) {
      this.setState({
        verified: true,
      });
    } else {
      this.setState({
        verified: false,
      });
    }
  },
  componentDidMount() {
    console.log(this.props);
    if (this.props.education.approvalNeeded === true || this.props.education.adminApproved === true) {
      const switchHandle = this.approvalNeeded;
      switchHandle.checked = true;

      this.setState({
        verified: true,
      });
    }

    if (this.props.education.adminApproved === true) {
      const adminApproval = this.adminApproved;
      adminApproval.checked = true;
    }
  },
  handleFile(e) {
    let file = e.target.files[0],
      self = this,
      uploader = new Slingshot.Upload('fileUpload'),
      parent = e.target.parentNode.parentNode.querySelector('[name="verified-document"]'),
      user = { _id: Meteor.userId() };


    uploader.send(file, (error, downloadUrl) => {
      if (error) {
        console.error('Error upload', uploader.xhr.response);
      } else {
        self.setState({
          verifiedDocument: downloadUrl,
        });

        Bert.alert('Documented uploaded!', 'success');
      }
    });
  },
  render() {
    let verified = this.state.verified,
      verifiedDoc = this.state.verifiedDocument;

    return (
      <div className="dashboard--settings-education-single education-module" data-module-type="education" data-value={this.props.index}>
        <input defaultValue={this.props.education.schoolName} name={`school-${this.props.index}`} className="school" required placeholder="School / Institution" />
        <input defaultValue={this.props.education.educationLevel} name={`education-${this.props.index}`} className="education" required placeholder="Education level, degree, masters" />
        <input type="checkbox" className="hidden-admin" ref={c => this.adminApproved = c} defaultValue={this.props.education.adminApproved} name="admin-approved" />
        <div className="dashboard--settings-education-switch">
          <span className="verified">

            Verify
            <span className="tooltip">?
              <div className="tooltip--hidden">
                <p>Verified subjects or education will display a verification symbol √ to showcase your expertise to students. Please upload supporting documents (i.e. transcript, diploma, certificate, etc.) to verify a subject/education. If you have any questions, please contact <a href="mailto:verify@tutorapp.com">verify@tutorapp.com</a>.</p>
              </div>
            </span></span>
          <label className="switch switch-left-right">
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <input className="switch-input" name="approval-needed" ref={c => this.approvalNeeded = c} type="checkbox" onChange={this.checkVerified} />
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span className="switch-label" data-on="yes" data-off="off" />
          	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span className="switch-handle" />
          </label>


          <div className="btn dashboard--settings-education-delete" onClick={this.props.deleteEducation} data-value={this.props.index}>Delete Education</div>
        </div>
        <div className="dashboard--settings-education-upload">
          {verifiedDoc !== null ?
            <a href={this.state.verifiedDocument} target="_blank">View Document</a>
          : '' }
          {verified ?
            <div>
              <input type="hidden" required defaultValue={this.state.verifiedDocument} name="verified-document" />
              <input type="file" className="education-upload" onChange={this.handleFile} />
            </div>
          : ''}
        </div>
      </div>
    );
  },
});

Template.settings.helpers({
  ProfileSettings() {
    return ProfileSettings;
  },
});
