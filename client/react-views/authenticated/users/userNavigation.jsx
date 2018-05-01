import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

UserNavigation = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    const userId = Meteor.userId();
    const admin = Roles.userIsInRole(userId, ['admin']);
    const tutor = Roles.userIsInRole(userId, ['tutor']);
    const student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      admin,
      tutor,
      student,
    };
  },
  getInitialState() {
    return {
      currentRoute: Session.get('currentRoute'),
      mobileOpen: false,
    };
  },
  getLoginStatus() {
    if (!this.data.user && !this.data.userLogginIn) { return false; }
    if (this.data.user) { return true; }
    return false;
  },

  getTutorStatus() {
    if (this.data.tutor) {
      return true;
    }
    return false;
  },
  currentSelection() {
    const route = this.state.currentRoute;
    switch (route) {
      case 'dashboard': return 'Dashboard';
      case 'referrals': return 'Refer Friends';
      case 'inbox': return 'Inbox';
      case 'account': return 'Your Account';
      case 'profile': return 'Profile';
      case 'blogposts/list': return 'Posts';
      default: return 'Dashboard';
    }
  },
  getMobileNavStatus() {
    if (this.state.mobileOpen) {
      return 'open';
    }
    return 'closed';
  },
  mobileShow(e) {
    const active = !this.state.mobileOpen;
    this.setState({
      mobileOpen: active,
    });
  },
  hideMenu() {
    const active = !this.state.mobileOpen;
    this.setState({
      mobileOpen: active,
    });
  },

  render() {
    const { currentRoute } = this.state;
    const tutorStatus = this.getTutorStatus();
    const mobileNavOpened = this.getMobileNavStatus();
    const selectedMenu = this.currentSelection();
    return (
      <div className="navigation-block">
        <nav className="dashboard--navigation">
          <ul>
            <li>
              <a href="/dashboard" className={currentRoute === 'dashboard' && 'active'}>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/inbox" className={currentRoute === 'inbox' && 'active'}>
                Inbox
              </a>
            </li>
            {
              tutorStatus &&
                <li>
                  <a href="/blogposts/list" className={currentRoute === 'blogposts/list' && 'active'}>
                    Posts
                  </a>
                </li>
            }
            {
              tutorStatus ?
                <li>
                  <a href="/referrals" className={currentRoute === 'referrals' && 'active'}>
                    Refer Friends
                  </a>
                </li> :
                  <li>
                    <a href="/referrals" className={currentRoute === 'referrals' && 'active'}>
                      Refer Friends
                    </a>
                  </li>
            }
            {
              tutorStatus &&
                <li>
                  <a href="/profile" className={currentRoute === 'profile' && 'active'}>
                    Profile
                  </a>
                </li>
            }
            <li>
              <a href="/settings/payments" className={currentRoute === 'account' && 'active'}>
                Your Account
              </a>
            </li>
          </ul>
        </nav>
        <div className="header--mobile-main" onClick={this.mobileShow}>
          <div className="header--mobile-main-toggle">
            <div className="header--mobile-main-toggle-selected">{selectedMenu}</div>
            <span className={`icono-play ${mobileNavOpened}`} />
          </div>
          <nav className={`${mobileNavOpened} nav nav--mobile-main`} onClick={this.hideMenu}>
            <div className="nav--mobile-main-inner">
              <ul>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/inbox">Inbox</a>
                </li>
                <li>
                  <a href="/referrals">Refer Friends</a>
                </li>
                {
                  tutorStatus ?
                    <li>
                      <a href="/profile">Profile</a>
                    </li> :
                      <li>
                        <a href="/settings">Profile</a>
                      </li>
                }
                <li>
                  <a href="/settings/payments">Your Account</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  },
});
