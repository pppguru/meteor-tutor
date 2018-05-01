import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import React from 'react';

Promotional = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const promoToken = Session.get('promoToken');
    Meteor.subscribe('user/invite', promoToken);
    const tutor = Meteor.users.findOne({ promoToken });
    return { tutor };
  },
  getInitialState() {
    return {
      promoToken: Session.get('promoToken'),
    };
  },
  render() {
    const illustration = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorappllc/referral-illustration.png)',
    };
    return (
      <div className="promotional forms">
        <div className="forms--wrapper">
          <div className="forms--illustration" style={illustration}>
            <img src="https://s3.amazonaws.com/tutorappllc/referral-illustration.png" />
          </div>
          <div className="forms--inputs">
            {this.data.tutor !== undefined ? <h2>{this.data.tutor.profile.firstName} invited you to join Tutor App!</h2>
          : <h2>This promo code is outdated, but feel free to apply anyway!</h2>
            }
            <p>You've been invited to Join Tutor App, please select your path below to register with a promotional code</p>
            <a href={`/apply/${this.state.promoToken}`} className="btn btn--large">Apply to become a Tutor</a>&nbsp;&nbsp;&nbsp;
            <a href={`/signup/${this.state.promoToken}`} className="btn btn--large">Sign up as a Student</a>
          </div>
        </div>
      </div>
    );
  },
});


Template.promotional.helpers({
  Promotional() {
    return Promotional;
  },
});
