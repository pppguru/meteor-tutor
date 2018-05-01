import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/mrt:moment';

import React from 'react';

import Lessons from '/collections/lessons';
import { capitalizeFirst, getLessonCost, getUserNameById } from '/client/helpers/helpers-global';

LessonHistory = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      user: Meteor.user(),
      userId: Meteor.userId(),
      student: Roles.userIsInRole(this.userId, ['student']),
      tutor: Roles.userIsInRole(this.userId, ['tutor']),
    };
  },

  getTutorStatus() {
    if (Roles.userIsInRole(Meteor.userId(), ['tutor'])) {
      return true;
    }
    return false;
  },

  currentSortOrder: -1,

  getInitialState() {
    return {
      lessons: Lessons.find({}, { sort: { date: this.currentSortOrder } }).fetch(),
    };
  },

  sortItems() {
    this.currentSortOrder = (this.currentSortOrder === -1) ? 1 : -1;
    this.setState({
      currentSortOrder: this.currentSortOrder,
      lessons: Lessons.find({}, { sort: { date: this.currentSortOrder } }).fetch(),
    });
  },

  renderForm() {
    if (this.data.student) {
      return <CreditCardForm user={this.data.user} />;
    } else {
      return <BankAccountForm user={this.data.user} />;
    }
  },

  renderLessons() {
    const lessons = this.state.lessons;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const components = [];

    let currentYear, currentMonth;

    if (lessons) {
      for (const lesson of lessons) {
        const date = new Date(lesson.date);
        const lessonYear = date.getFullYear();
        const lessonMonth = monthNames[date.getMonth()];

        // Push year to components stack if different
        if (lessonYear !== currentYear) {
          components.push(<YearHeader date={lessonYear} />);
          currentYear = lessonYear;
        }

        // Push month to components stack if different
        if (lessonMonth !== currentMonth) {
          components.push(<MonthHeader date={lessonMonth} />);
          currentMonth = lessonMonth;
        }

        // Push lesson item component
        components.push(<LessonHistoryItem id={lesson._id} date={lesson.date} person={getUserNameById((Roles.userIsInRole(this.data.userId, ['tutor'])) ? lesson.student_id : lesson.tutor_id, false)} start={lesson.startTime} end={lesson.endTime} where={lesson.where} cost={getLessonCost(lesson.minutesRequested, lesson.currentRate)} status={lesson.status} chat_id={lesson.chat_id} />);
      }

      return components;
    } else {
      return null;
    }
  },

  render() {
    const tutor = this.getTutorStatus();
    return (
      <div className="dashboard--account">
        <UserNavigation />
        <div className="dashboard--account-wrapper">
          <div className="dashboard--account-navigation">
            <ul>
              <li><a href="/settings/payments">Payment Preferences</a></li>
              {tutor ? '' : <li><a href="/settings">Name and Photo</a></li> }
              <li><a href="/settings/lesson-history">Lesson History</a></li>
              <li><a href="/settings/transaction-history">Transaction History</a></li>
            </ul>
          </div>
          <div className="dashboard--account-content">
            <div>
              <div className="icon-item inline-flex">
                <div className="icon-item-icon">
                  <svg viewBox="0 0 23.07 35.62"><path d="M399.75,1415h0a1.14,1.14,0,0,0,1.13-1.13h0v-22.19a1.14,1.14,0,0,0-1.13-1.14h-4.29V1385a1.14,1.14,0,0,0-.52-1,1.13,1.13,0,0,0-1.08-.08l-15.37,6.94a1.12,1.12,0,0,0-.62.74h-0.06v22.21h0a5.63,5.63,0,0,0,5.4,5.6h16.53a1.14,1.14,0,0,0,0-2.28A1.1,1.1,0,0,1,399.75,1415Zm-3.16,2.2h-8.93v0h-4.43a3.34,3.34,0,0,1-2.93-2.2h16.3a3.37,3.37,0,0,0-.2,1.11A3.32,3.32,0,0,0,396.59,1417.19Zm-12.34-4.5,10.53-4.76a1.14,1.14,0,0,0,.67-1V1392.8h3.16v19.89H384.25Z" transform="translate(-377.82 -1383.86)" /></svg>
                </div>
                <div className="icon-item-copy">
                  <h2 className="m-r-20">Lesson History</h2>
                </div>
              </div>
              <span className="btn-filter" onClick={this.sortItems}>Filter by date<span className={this.state.currentSortOrder === -1 ? 'arrow-down' : 'arrow-up'} /></span>
            </div>
            <div>
              { this.renderLessons() }
            </div>
          </div>
        </div>
      </div>
    );
  },
});

LessonHistoryItem = React.createClass({

  render() {
    return (
      <div className="lesson-item">

        <div className="icon-item">
          <div className="icon-item-icon clear outline-blue">
            <span>{moment(this.props.date).format('MM/DD')}</span>
          </div>
          <div className="icon-item-copy">
            <h3>{capitalizeFirst(this.props.person)}</h3>
            <span>{this.props.start} to {this.props.end}</span>
            <span className="comma">,&nbsp;</span>
            <span>{this.props.where === 'person' ? 'In person' : 'Online'}</span>
          </div>
        </div>

      </div>
    );
  },

});

YearHeader = React.createClass({

  render() {
    return (
      <div className="lesson-header">
        <div className="date-item">{this.props.date}</div>
      </div>
    );
  },

});

MonthHeader = React.createClass({

  render() {
    return (
      <div className="lesson-item">
        <div className="icon-item-icon blue">
          <span className="text-upper">{this.props.date}</span>
        </div>
      </div>
    );
  },

});

Template.lessons.helpers({
  LessonHistory() {
    return LessonHistory;
  },
});
