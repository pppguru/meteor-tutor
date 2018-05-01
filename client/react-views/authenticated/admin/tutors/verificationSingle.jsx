import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Template } from 'meteor/templating';

import { getUserNameById } from '/client/helpers/helpers-global';

TutorVerificationSingle = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.users.findOne(
      {
        _id: this.props.tutor,
      }
    );
    return {
      user,
    };
  },
  renderEduVerifications() {
    if (this.data.user.education.length >= 1) {
      return this.data.user.education.map((doc, i) => {
        if (doc.approvalNeeded === true || doc.adminApproved === true)
          return <EduDocumentVerification key={i} doc={doc} index={i} tutor={this.data.user} />;
      });
    }
  },
  renderSubVerifications() {
    if (this.data.user.specialities.length >= 1) {
      return this.data.user.specialities.map((doc, i) => {
        if (doc.approvalNeeded === true || doc.adminApproved === true)
          return <SubDocumentVerification key={i} doc={doc} index={i} tutor={this.data.user} />;
      });
    }
  },
  sendVerifications(e) {
    e.preventDefault();
    Meteor.call('tutorVerificationEmail', this.props.tutor, (err, resp) => {
      if (err) {
        console.log(err);
      }
    });
  },
  render() {
    const user = this.data.user;
    return (
      <div className="dashboard">
        <AdminTutorNavigation />
        <div className="dashboard--cards">
          <div className="dashboard--cards-admin">
            <div className="dashboard--cards-tutors">
              <h2>{getUserNameById(user._id)}</h2>
              <a href="#" onClick={this.sendVerifications} className="btn btn--xlarge">Email tutor about verifications</a>
            </div>
            <div className="dashboard--cards-pending">
              <h3>Education Verifications</h3>
              {this.renderEduVerifications()}
            </div>
            <div className="dashboard--cards-pending">
              <h3>Subject Verifications</h3>
              {this.renderSubVerifications()}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

EduDocumentVerification = React.createClass({
  isVerifed() {
    if (this.props.doc.adminApproved === true) {
      return (
        <span>Verified Education</span>
      );
    } else {
      return (
        <span>Education not Verified</span>
      );
    }
  },
  verifyDocument() {
    Meteor.call('educationApproval', this.props.tutor, this.props.index, (err, resp) => {
      if (err) {
        console.log(err);
      }
    });
  },
  denyVerification() {
    Meteor.call('educationDeny', this.props.tutor, this.props.index, (err, resp) => {
      if (err) {
        console.log(err);
      }
    });
  },
  render() {
    return (
      <div className="dashboard--cards-pending-document">
        <h2>{this.props.doc.schoolName} - {this.props.doc.educationLevel} - {this.isVerifed()}</h2>
        <a href={this.props.doc.verifiedDocument}>View Document</a><br />

        {this.props.doc.adminApproved ?
          <a href="#" className="btn" onClick={this.denyVerification}>Revoke</a>
          :
            <div><a href="#" className="btn" onClick={this.verifyDocument}>Verify</a>                                <a className="btn" href="#" onClick={this.denyVerification}>Decline</a></div>
        }
      </div>
    );
  },
});


SubDocumentVerification = React.createClass({
  isVerifed() {
    if (this.props.doc.adminApproved === true) {
      return (
        <span>Verified Subject</span>
      );
    } else {
      return (
        <span>Subject not Verified</span>
      );
    }
  },
  verifyDocument() {
    Meteor.call('subjectApproval', this.props.tutor, this.props.index, (err, resp) => {
      if (err) {
        console.log(err);
      }
    });
  },
  denyVerification() {
    Meteor.call('subjectDeny', this.props.tutor, this.props.index, (err, resp) => {
      if (err) {
        console.log(err);
      }
    });
  },
  render() {
    return (
      <div className="dashboard--cards-pending-document">
        <h2>{this.props.doc.subject} - {this.isVerifed()}</h2>
        <a href={this.props.doc.verifiedDocument}>View Document</a><br />
        {
          this.props.doc.adminApproved ?
            <a href="#" className="btn" onClick={this.denyVerification}>Revoke</a> :
              <div>
                <a href="#" className="btn" onClick={this.verifyDocument}>Verify</a>
                <a className="btn" href="#" onClick={this.denyVerification}>Decline</a>
              </div>
        }
      </div>
    );
  },
});

Template.adminVerficationSingle.helpers({
  TutorVerificationSingle() {
    return TutorVerificationSingle;
  },
});
