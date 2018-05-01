import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';

import React from 'react';

import BlogListCard from '/client/react-views/authenticated/blogposts/bloglist.card';

Dashboard = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },
  checkTutorCard() {
    if (Roles.userIsInRole(this.data.user, ['tutor'])) {
      return <TutorCard />;
    }
  },
  checkReferralCard() {
    if (Roles.userIsInRole(this.data.user, ['tutor'])) {
      return <TutorReferralBlock />;
    } else if (Roles.userIsInRole(this.data.user, ['student'])) {
      return <StudentReferralBlock />;
    }
  },
  render() {
    if (this.data.user.promoToken) {
      return (
        <div className="dashboard">
          <UserNavigation />
          {this.checkReferralCard()}
          <div className="dashboard--cards">
            <div className="dashboard--cards-wrapper">
              <ActivityCard user={this.data.user} />
              <NotificationCard user={this.data.user} />
              <MessagesPreview />
              <ReferralPreview user={this.data.user} />
              <BlogListCard />
            </div>
          </div>
        </div>
      );
    } else {
      return (<div>Loading...</div>);
    }
  },
});

Template.dashboard.helpers({
  Dashboard() {
    return Dashboard;
  },
});
