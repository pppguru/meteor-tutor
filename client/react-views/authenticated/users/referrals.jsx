import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';

import React from 'react';

Referrals = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },
  componentDidMount() {


  },
  checkReferralCard() {
    if (Roles.userIsInRole(this.data.user, ['tutor'])) {
      return <TutorReferralBlock data="terms" />;
    } else if (Roles.userIsInRole(this.data.user, ['student'])) {
      return <StudentReferralBlock />;
    }
  },
  render() {
    return (
      <div className="dashboard">
        <UserNavigation />
        {this.checkReferralCard()}
        <ReferralInvites user={this.data.user} />
        <CurrentReferrals friends={this.data.user.referred} amount={this.data.user.amountReferred} />
      </div>
    );
  },
});

Template.referrals.helpers({
  Referrals() {
    return Referrals;
  },
});
