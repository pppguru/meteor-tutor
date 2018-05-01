// Meteor Packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactMeteorData } from 'meteor/react-meteor-data';

// NPM Packages
import React from 'react';

// Local
import Lessons from '/collections/lessons';
import { getUserNameById, capitalizeFirst, getLessonCost } from '/client/helpers/helpers-global';

TransactionHistory = React.createClass({

  mixins: [ReactMeteorData],

  currentSortOrder: -1,
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      admin = Roles.userIsInRole(userId, ['admin']),
      tutor = Roles.userIsInRole(userId, ['tutor']),
      lessons = Lessons.find({}, { sort: { date: this.currentSortOrder } }).fetch();
    student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      userId,
      admin,
      tutor,
      lessons,
      student,
    };
  },
  getTutorStatus() {
    if (Roles.userIsInRole(Meteor.userId(), ['tutor'])) {
      return true;
    }
    return false;
  },


  getInitialState() {
    return {
      lessons: [],
    };
  },

  sortItems() {
    this.currentSortOrder = (this.currentSortOrder === -1) ? 1 : -1;
    this.setState({
      currentSortOrder: this.currentSortOrder,
      lessons: Lessons.find({}, { sort: { date: this.currentSortOrder } }).fetch(),
    });
  },

  componentDidMount() {
    // console.log(this.data);

    this.setState({
      lessons: this.data.lessons,
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
    let currentYear, currentMonth;
    const components = [];

    if (lessons.length >= 1) {
      for (const lesson of lessons) {
        if (lesson.payment === 'resolved') {
          const date = new Date(lesson.date);
          components.push(<TransactionHistoryItem
            key={lesson._id}
            isTutor={this.data.tutor}
            lesson={lesson}
            id={lesson._id}
            date={lesson.date}
            person={getUserNameById((Roles.userIsInRole(this.data.userId, ['tutor'])) ? lesson.student_id : lesson.tutor_id, false)}
            start={lesson.startTime}
            end={lesson.endTime}
            where={lesson.where}
            cost={getLessonCost(lesson.minutesRequested, lesson.currentRate)}
            status={lesson.status}
            chat_id={lesson.chat_id}
          />);
        }
      }
      return components;
    } else {
      return <TransactionEmpty />;
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
                  <svg id="Layer_1" data-name="Layer 1" viewBox="0 0 20.66 35.34"><path d="M253.43-39.28h-2.58a2.42,2.42,0,0,1-2.41-2.41,2.42,2.42,0,0,1,2.41-2.41h2.58a2.42,2.42,0,0,1,2.25,1.55,1.21,1.21,0,0,0,1,.86h4.41A1.19,1.19,0,0,0,262.37-43a9,9,0,0,0-6.92-7.48v-1.82a1.32,1.32,0,0,0-1.32-1.32h-4a1.32,1.32,0,0,0-1.32,1.32v1.82a9,9,0,0,0-7,8.8,9,9,0,0,0,9,9h2.58a2.42,2.42,0,0,1,2.41,2.41,2.42,2.42,0,0,1-2.41,2.41h-2.58a2.42,2.42,0,0,1-2.25-1.55,1.21,1.21,0,0,0-1-.86h-4.41a1.19,1.19,0,0,0-1.23,1.32,9,9,0,0,0,6.92,7.48v1.82a1.32,1.32,0,0,0,1.32,1.32h4a1.32,1.32,0,0,0,1.32-1.32v-1.82a9,9,0,0,0,7-8.8A9,9,0,0,0,253.43-39.28Z" transform="translate(-241.81 53.64)" /></svg>
                </div>
                <div className="icon-item-copy">
                  <h2 className="m-r-20">Transaction History</h2>
                </div>
              </div>
              <span className="btn-filter" onClick={this.sortItems}>Filter by date<span className={this.state.currentSortOrder === -1 ? 'arrow-down' : 'arrow-up'} /></span>
            </div>
            <div>
              <table className="transaction-history">
                <tbody>
                  <tr cellSpacing="0">
                    <th>Ref</th>
                    <th>With</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                  { this.renderLessons() }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TransactionEmpty = React.createClass({
  render() {
    return (
      <tr>
        <td colSpan="5"><h4>No recent transactions</h4></td>
      </tr>
    );
  },
});

TransactionHistoryItem = React.createClass({
  status() {
    if (this.props.isTutor) {
      if (this.props.lesson.tutorPaid === true) {
        return 'Paid';
      } else {
        return 'Pending';
      }
    } else {
      return 'Paid';
    }
  },
  amount() {
    if (this.props.isTutor) {
      if (this.props.lesson.tutorPaid === true) {
        return `$${this.props.lesson.tutorAmountPaid / 100}`;
      } else {
        return 'Pending';
      }
    } else {
      return `$${this.props.lesson.studentCharged / 100}`;
    }
  },
  render() {
    console.log(this.props);
    return (
      <tr className="transaction-item">
        <td>{this.props.id}</td>
        <td>{capitalizeFirst(this.props.person)}</td>
        <td>{this.status()}</td>
        <td>{this.amount()}</td>
        <td>{moment(this.props.date).format('MM/DD')}</td>
      </tr>
    );
  },

});


Template.transactions.helpers({
  TransactionHistory() {
    return TransactionHistory;
  },
});
