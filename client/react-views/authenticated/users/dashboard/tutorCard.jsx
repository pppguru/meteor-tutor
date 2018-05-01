import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import React from 'react';

TutorCard = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },
  studentsTaught() {
    return this.data.user.studentsTaught.length;
  },
  minutesTaught() {
    return this.data.user.minutesTaught;
  },
  render() {
    const photo = {
      backgroundImage: `url(${this.data.user.profile.avatar})`,
    };
    return (
      <div className="dashboard--tutor-card dashboard-card">
        <div className="dashboard--tutor-card-wrapper">
          <div className="dashboard--tutor-card-photo" style={photo} />
          <h1>{this.data.user.profile.firstName}</h1>
          <div className="dashboard--tutor-card-links">
            <a href="/settings">Edit Profile</a>
            <a href="/profile">View Profile</a>
          </div>
          <div className="dashboard--tutor-card-stats">
            <div className="dashboard--tutor-card-stat">
              <h3>{this.studentsTaught()}</h3>
              <p>Students taught</p>
            </div>
            <div className="dashboard--tutor-card-stat">
              <h3>{this.minutesTaught()}</h3>
              <p>Minutes taught</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
