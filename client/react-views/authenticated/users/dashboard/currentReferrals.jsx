import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

CurrentReferrals = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    const friends = Meteor.users.find(
      {
        $and: [
          { _id: { $ne: Meteor.userId() } },
          { _id: { $in: this.props.friends } },
        ],
      }
    );
    return {
      friends,
      user,
    };
  },
  renderUsers() {
    return this.data.friends.map((friend) => {
      console.log(friend);
      return <ReferredUser key={friend._id} friend={friend} />;
    });
  },
  countTutors() {
    return this.props.friends.length;
  },
  renderText() {
    if (this.props.friends.length) {
      if (this.props.friends.length == 1) {
        return 'user';
      } else {
        return 'users';
      }
    } else {
      return 'users';
    }
  },
  render() {
    if (Roles.userIsInRole(this.data.user, ['student'])) {
      return (
        <div className="dashboard--referred-users">
          <div className="dashboard--referred-users-wrapper">
            <h3>You've recruited <span className="referred-blue">{this.countTutors()} {this.renderText()}</span> and earned
              <span className="referred-blue"> ${this.data.user.amountReferred}</span> credit</h3>
            <div className="dashboard--referred-users-view">
              {this.renderUsers()}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="dashboard--referred-users">
        <div className="dashboard--referred-users-wrapper">
          <h3>You've recruited <span className="referred-blue">{this.countTutors()} {this.renderText()}</span> and made
            <span className="referred-blue"> ${this.data.user.amountReferred}</span> dollars</h3>
          <div className="dashboard--referred-users-view">
            {this.renderUsers()}
          </div>
        </div>
      </div>
    );
  },
});

ReferredUser = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const tutor = Roles.userIsInRole(this.props.friend._id, ['tutor']),
      student = Roles.userIsInRole(this.props.friend._id, ['student']);
    return {
      tutor,
      student,
    };
  },
  studentsTaught() {
    console.log(this.data.student);
    if (this.data.student) {
      return;
    } else {
      return (
        <div className="dashboard--tutor-card-stat">
          <h3>{this.props.friend.studentsTaught.length}</h3>
          <p>Students taught</p>
        </div>
      );
    }
  },
  minutesTaught() {
    if (this.data.student) {
      return (
        <div className="dashboard--tutor-card-stat">
          <h3>{this.props.friend.learnedMinutes}</h3>
          <p>Minutes Learned</p>
        </div>
      );
    } else {
      return (
        <div className="dashboard--tutor-card-stat">
          <h3>{this.props.friend.minutesTaught}</h3>
          <p>Minutes Taught</p>
        </div>
      );
    }
  },
  render() {
    const photo = {
      backgroundImage: `url(${this.props.friend.profile.avatar})`,
    };
    return (
      <div className="dashboard--tutor-card">
        <div className="dashboard--tutor-card-wrapper">
          <div className="dashboard--tutor-card-photo" style={photo} />
          <h1>{this.props.friend.profile.firstName}</h1>
          <div className="dashboard--tutor-card-stats">
            {this.studentsTaught()}
            {this.minutesTaught()}
          </div>
        </div>
      </div>
    );
  },
});
