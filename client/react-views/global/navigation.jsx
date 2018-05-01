import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';


import React from 'react';

import Settings from '/collections/settings';

MainNavigation = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      admin = Roles.userIsInRole(userId, ['admin']),
      tutor = Roles.userIsInRole(userId, ['tutor']),
      student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      admin,
      tutor,
      student,
      navigation: Settings.findOne({}),
    };
  },
  getInitialState() {
    return {
      mobileOpen: false,
    };
  },
  renderNavigation() {
    /*
     *  Disable the navigation
     *
     */
    const dataNavigation = [
      {
        slug: '/',
        name: 'Home',
      },
    ];
    return dataNavigation.map((nav) => {
      return <li key={nav.slug}><a href={nav.slug}>{nav.name}</a></li>;
    });

    return false;

    if (this.data.navigation) {
      return this.data.navigation.menu.map((nav) => {
        return <Nav key={nav.slug} nav={nav} />;
      });
    }
  },
  getLoginStatus() {
    if (!this.data.user && !this.data.userLogginIn) { return false; }
    if (this.data.user) { return true; }
    return false;
  },
  getAdminStatus() {
    if (this.data.admin) { return true; }
    return false;
  },
  getTutorStudentStatus() {
    if (this.data.tutor || this.data.student) { return true; }
    return false;
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
  searchTutors(e) {
    e.preventDefault();
    const searchValue = this.search.value;

    if (searchValue !== '') {
      Session.set('forceSearch', true);
      Session.set('searchValue', searchValue);
      Router.go('tutors', {}, { query: { subject: searchValue } });
    }
  },
  render() {
    let loginStatus = this.getLoginStatus(),
      adminStatus = this.getAdminStatus(),
      tutorStudent = this.getTutorStudentStatus(),
      mobileNavOpened = this.getMobileNavStatus();

    return (

      <div className={`${mobileNavOpened} header`}>
        <div className="navigation">
          <div className="navigation-block">

            <div className="header--inner">
              <div className="header--logo">
                <h1>
                  <a href="/">
                    <Logo />
                  </a>
                </h1>
              </div>
              <div className="header--search">
                <form className="header--search-form" onSubmit={this.searchTutors}>
                  <svg viewBox="0 0 35.23 35.24"><path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" /></svg>
                  <input type="text" ref={c => this.search = c} placeholder="What do you want to learn today?" />
                </form>
              </div>
              {adminStatus ?
                <div className="logged-in-navigation">
                  {adminStatus ? <AdminUserNav user={this.data.user} tutor={this.data.tutor} /> : '' }
                </div>
                : ''
              }
              <nav className="nav nav--desktop">
                <ul>
                  {loginStatus ? '' :
                    <li><a href="/apply" className="btn btn--large">Become a Tutor</a></li>
                  }
                  {loginStatus ? '' :
                    <li><a href="/signup" className="normal">Sign Up</a></li>
                  }
                  {loginStatus ? '' :
                    <li><a href="/login" className="normal">Login</a></li>
                  }
                </ul>

                {tutorStudent ? <NormalUserNav user={this.data.user} tutor={this.data.tutor} /> : '' }
              </nav>
              <div className="header--mobile" onClick={this.mobileShow}>
                <div className="header--mobile-toggle" />
              </div>
            </div>
            <nav className={`${mobileNavOpened} nav nav--mobile`} onClick={this.hideMenu}>
              <ul>

                {this.renderNavigation()}
                {loginStatus ? '' :
                  <li><a href="/apply">Become a Tutor</a></li>
                }
                {loginStatus ? '' :
                  <li><a href="/signup">Sign Up</a></li>
                }
                {loginStatus ? '' :
                  <li><a href="/login">Login</a></li>
                }
              </ul>

              {tutorStudent ? <NormalUserNav user={this.data.user} tutor={this.data.tutor} /> : '' }
            </nav>
          </div>
        </div>
      </div>
    );
  },
});

Nav = React.createClass({
  propTypes: {
    nav: React.PropTypes.object.isRequired,
  },
  render() {
    return (
      <li>
        <a href={this.props.nav.slug}>{this.props.nav.title}</a>
      </li>
    );
  },
});

Navigation = React.createClass({
  render() {
    return (
      <div>
        <MainNavigation />
      </div>
    );
  },
});

AdminUserNav = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    tutor: React.PropTypes.bool.isRequired,
  },
  logout(event) {
    event.preventDefault();
    Meteor.logout();
  },
  render() {
    return (
      <div className="admin-control">
        <ul className="admin-control-nav">
          <li><a href="/admin/invites">Tutors</a></li>
          <li><a href="/admin/tutors">Verifications</a></li>
          <li><a href="/admin/post-lists">Posts</a></li>
          <li><a href="/admin/chats">Chats</a></li>
          <li><a href="/admin/reviews">Reviews</a></li>
          <li className="logout--link">
            <a href="/" className="logout" onClick={this.logout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    );
  },
});

NormalUserNav = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      counts: Counts.get('notification-count'),
    };
  },
  propTypes: {
    user: React.PropTypes.object.isRequired,
    tutor: React.PropTypes.bool.isRequired,
  },
  getMessageNotifications() {
    if (this.data.counts >= 1) {
      return (
        <li className="notifications">
          <a href="/inbox">
            <span className="notification-caption">Messages</span>
            <div className="notification-bubble">
              <span>
                {this.data.counts}
              </span>
            </div>
            <div className="icon-item">
              <svg viewBox="0 0 32 32">
                <path d="M32 12.679v14.179q0 1.179-0.839 2.018t-2.018 0.839h-26.286q-1.179 0-2.018-0.839t-0.839-2.018v-14.179q0.786 0.875 1.804 1.554 6.464 4.393 8.875 6.161 1.018 0.75 1.652 1.17t1.688 0.857 1.964 0.438h0.036q0.911 0 1.964-0.438t1.688-0.857 1.652-1.17q3.036-2.196 8.893-6.161 1.018-0.696 1.786-1.554zM32 7.429q0 1.411-0.875 2.696t-2.179 2.196q-6.714 4.661-8.357 5.804-0.179 0.125-0.759 0.545t-0.964 0.679-0.929 0.58-1.027 0.482-0.893 0.161h-0.036q-0.411 0-0.893-0.161t-1.027-0.482-0.929-0.58-0.964-0.679-0.759-0.545q-1.625-1.143-4.679-3.259t-3.661-2.545q-1.107-0.75-2.089-2.063t-0.982-2.438q0-1.393 0.741-2.321t2.116-0.929h26.286q1.161 0 2.009 0.839t0.848 2.018z" />
              </svg>
            </div>

          </a>
        </li>
      );
    }
  },


  getNotifications() {
    let total = 0;

    if (this.props.tutor) {
      total += !this.props.user.completedPhoto ? 1 : 0;
      total += !this.props.user.completedAvailiability ? 1 : 0;
      total += !this.props.user.completedSingleSubject ? 1 : 0;
      total += this.props.user.needStripeAccount ? 1 : 0;
    }
    if (this.props.student || this.props.user.roles.indexOf('student') >= 0) {
      total += !this.props.user.completedPhoto ? 1 : 0;
      total += this.props.user.payment === undefined ? 1 : 0;
    }
    if (total > 0) {
      return (
        <li className="notifications">
          <a href="/dashboard">
            <span className="notification-caption">Notifications</span>
            <div className="notification-bubble">
              <span>
                {total}
              </span>
            </div>
            <div className="icon-item">
              <svg viewBox="0 0 32 32">
                <path d="M16.286 30.286q0-0.286-0.286-0.286-1.054 0-1.813-0.759t-0.759-1.813q0-0.286-0.286-0.286t-0.286 0.286q0 1.304 0.92 2.223t2.223 0.92q0.286 0 0.286-0.286zM30.857 25.143q0 0.929-0.679 1.607t-1.607 0.679h-8q0 1.893-1.339 3.232t-3.232 1.339-3.232-1.339-1.339-3.232h-8q-0.929 0-1.607-0.679t-0.679-1.607q0.893-0.75 1.625-1.571t1.518-2.134 1.33-2.83 0.893-3.679 0.348-4.643q0-2.714 2.089-5.045t5.482-2.83q-0.143-0.339-0.143-0.696 0-0.714 0.5-1.214t1.214-0.5 1.214 0.5 0.5 1.214q0 0.357-0.143 0.696 3.393 0.5 5.482 2.83t2.089 5.045q0 2.482 0.348 4.643t0.893 3.679 1.33 2.83 1.518 2.134 1.625 1.571z" />
              </svg>
            </div>

          </a>
          <div className="notifications--tooltip">
            <NotificationCard user={this.props.user} />
          </div>

        </li>
      );
    }
  },
  getRole() {
    if (this.props.tutor) { return true; }
    return false;
  },
  logout(event) {
    event.preventDefault();
    Meteor.logout();
  },
  tutorLink() {
    return (
      <a className="user--link" href="/dashboard">
        Dashboard
      </a>
    );
  },
  studentLink() {
    return (
      <a className="user--link" href="/dashboard">
        Dashboard
      </a>
    );
  },
  render() {
    const getRole = this.getRole();
    const style = {
      backgroundImage: `url(${this.props.user.profile.avatar})`,
    };
    return (
      <ul className="user-navigation">
        {this.getMessageNotifications()}
        {this.getNotifications()}
        <li className="name">
          <span className="avatar--name">
            <a href="/dashboard" className="avatar--link" style={style} />
            {getRole ? this.tutorLink() : this.studentLink()}
          </span>
          <a href="#" className="logout--link" onClick={this.logout}>Logout</a>
        </li>
      </ul>
    );
  },
});
