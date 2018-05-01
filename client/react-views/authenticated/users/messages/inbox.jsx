import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';

import React from 'react';

import Chats from '/collections/chats';
import Messages from '/collections/messages';

Inbox = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      admin = Roles.userIsInRole(userId, ['admin']),
      tutor = Roles.userIsInRole(userId, ['tutor']),
      student = Roles.userIsInRole(userId, ['student']);

    let messages = Messages.find().fetch(),
      chats = Chats.find({}, { $sort: { updatedAt: -1 } }).fetch();

    return {
      user,
      chats,
      messages,
      admin,
      tutor,
      student,
    };
  },

  getTutorStatus() {
    if (this.data.tutor) { return true; }
    return false;
  },


  renderChats() {
    return this.data.chats.map((chat) => {
      return <ChatPreview key={chat._id} chat={chat} />;
    });
  },


  getStudentStatus() {
    if (this.data.student && this.data.chats.length >= 1) { return true; }
    return false;
  },

  studentMessages() {
    if (this.data.student) {
      if (this.data.messages.length >= 1 && this.data.chats.length >= 1) {
        return (
          <div className="inbox--wrapper">
            {this.renderChats()}
          </div>
        );
      } else {
        return (
          <div className="inbox--empty inbox--wrapper">
            <div className="inbox--empty-wrapper">
              <div className="icon-item">
                <div className="icon-item-icon">
                  <svg viewBox="0 0 90 57.1"><path d="M94.1,50.3L80.7,27.2a11.39,11.39,0,0,0-9.5-5.4H28.8a11.78,11.78,0,0,0-9.5,5.4L5.9,50.3A8.62,8.62,0,0,0,5,55V74.9a4,4,0,0,0,4,4H91a4,4,0,0,0,4-4V55A8.46,8.46,0,0,0,94.1,50.3ZM50.5,61.7a9.94,9.94,0,0,1-10-9.9H14.3L26.2,31.3a3.89,3.89,0,0,1,2.5-1.5H71.1a3.46,3.46,0,0,1,2.5,1.5L85.5,51.8h-25A10,10,0,0,1,50.5,61.7Z" transform="translate(-5 -21.8)" /></svg>
                </div>
              </div>
              <h3>Welcome to your inbox!</h3>
              <p>Here you can chat with tutors to find out if they are a right match for you before entering a credit card.</p><p>Once you determine whether the tutor is a good fit for you, they will propose a lesson.</p><p> Happy Learning :)</p>
              <a className="find-tutor" href="/tutors">Click here to find and message a tutor.</a>
            </div>
          </div>
        );
      }
    }
  },

  tutorMessages() {
    if (this.data.tutor) {
      if (this.data.chats.length >= 1 && this.data.messages.length >= 1) {
        return (
          <div className="inbox--wrapper">
            {this.renderChats()}
          </div>
        );
      } else {
        return (
          <div className="inbox--empty inbox--wrapper">
            <div className="inbox--empty-wrapper">
              <div className="icon-item">
                <div className="icon-item-icon">
                  <svg viewBox="0 0 90 57.1"><path d="M94.1,50.3L80.7,27.2a11.39,11.39,0,0,0-9.5-5.4H28.8a11.78,11.78,0,0,0-9.5,5.4L5.9,50.3A8.62,8.62,0,0,0,5,55V74.9a4,4,0,0,0,4,4H91a4,4,0,0,0,4-4V55A8.46,8.46,0,0,0,94.1,50.3ZM50.5,61.7a9.94,9.94,0,0,1-10-9.9H14.3L26.2,31.3a3.89,3.89,0,0,1,2.5-1.5H71.1a3.46,3.46,0,0,1,2.5,1.5L85.5,51.8h-25A10,10,0,0,1,50.5,61.7Z" transform="translate(-5 -21.8)" /></svg>
                </div>
              </div>
              <h3>You have no messages at the moment</h3>
              <p>Welcome to your inbox. Students who are interested in working with you will send you messages here.</p>
              <p className="lite">For your protection, keep all communication between you and the student within the Tutor App messaging system, and communicate everything. This way, for example, in the off-chance that a student claims a lesson didn't take place, but it really did, we can review the message history to ensure you get paid for your time.</p>
            </div>
          </div>
        );
      }
    }
  },

  render() {
    return (
      <div className="inbox">
        <UserNavigation />
        {this.studentMessages()}
        {this.tutorMessages()}
      </div>
    );
  },
});

Template.inbox.helpers({
  Inbox() {
    return Inbox;
  },
});
