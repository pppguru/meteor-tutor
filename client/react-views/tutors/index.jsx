import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Template } from 'meteor/templating';

import React from 'react';

TutorSingle = React.createClass({
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
  renderTutor() {
    return (
      <div className="tutor">
        <TutorHeader user={this.data.user} backend="true" />
        <TutorSchedule scheduling={this.data.user.scheduling} meeting={this.data.user.meetingPreference} backend="true" />
        <TutorProfileEducation education={this.data.user.education} backend="true" />
        <TutorProfileSubjects subjects={this.data.user.specialities} backend="false" />
        <TutorProfileReviews reviews={this.data.user.reviews} tutor={this.props.tutor} backend="true" />
      </div>
    );
  },

  render() {
    if (this.data.user !== undefined) {
      return this.renderTutor();
    } else {
      return (<div className="loading">Loading...</div>);
    }
  },
});


Template.tutorSingle.helpers({
  TutorSingle() {
    return TutorSingle;
  },
});
