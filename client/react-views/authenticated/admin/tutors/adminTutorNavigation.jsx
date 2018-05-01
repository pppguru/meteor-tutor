import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactMeteorData } from 'meteor/react-meteor-data';

AdminTutorNavigation = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      admin = Roles.userIsInRole(userId, ['admin']);
    return {
      user,
      admin,
    };
  },
  getAdminStatus() {
    if (this.data.admin) {
      return true;
    }
    return false;
  },
  checkSession(session) {
    const route = Session.get('currentRoute');
    return session === route && 'active';
  },
  render() {
    const adminStatus = this.getAdminStatus();
    return (
      <div className="navigation-block">
        <nav className="dashboard--navigation admin">
          {adminStatus ?
            <ul>
              <li><a href="/admin/invites" className={this.checkSession('invites')}>Pending</a></li>
              <li><a href="/admin/tutors" className={this.checkSession('verification')}>Verifications</a></li>
            </ul>
             : '' }
        </nav>
      </div>
      );
  },
});
