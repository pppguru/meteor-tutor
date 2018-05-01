import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { moment } from 'meteor/mrt:moment';

import React from 'react';
import ReactDOM from 'react-dom';

StudentLesson = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },
  statusLesson() {
    if (this.props.lesson.status === 'pending') {
      return <LessonPending lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'modified') {
      return <LessonModified lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'declined') {
      return <LessonDeclined lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'accepted') {
      return <LessonAccepted lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'student_cancelled') {
      return <LessonCancelled lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'tutor_cancelled') {
      return <TutorCancelledOnStudent lesson={this.props.lesson} tutor={this.props.tutor} />;
    } else if (this.props.lesson.status === 'completed') {
      return <StudentCompleted lesson={this.props.lesson} tutor={this.props.tutor} />;
    }
  },
  renderLesson() {
    if (this.data.user.payment) {
      return this.statusLesson();
    } else {
      return <StudentNeedsCard />;
    }
  },
  render() {
    return (
      <div className={`dashboard--lesson status--${this.props.lesson.status}`}>
        <div className="dashboard--lesson-wrapper">
          {this.renderLesson()}
        </div>
      </div>
    );
  },
});

StudentCompleted = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>Congrats you completed a lesson with {this.props.tutor.profile.firstName}. You can message them and have another one!</p>
          </div>
        </div>
      </div>
    );
  },
});


LessonDeclined = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>You have declined the lesson with {this.props.tutor.profile.firstName}, they will be notified and if they make changes to the lesson you can choose to accept it in the future.</p>
          </div>
        </div>
      </div>
    );
  },
});

LessonCancelled = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>You have cancelled your lesson with {this.props.tutor.profile.firstName}. Please message them if you would like to reschedule.</p>
            <p>{this.props.lesson.autoBillable ? 'You will be billed for 1 hour of the tutors time because you cancelled within 24 hours.' : ''}</p>
          </div>
        </div>
      </div>
    );
  },
});


TutorCancelledOnStudent = React.createClass({
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      location = '';
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h3>Oh no!</h3>
            <p>{this.props.tutor.profile.firstName} has cancelled your lesson scheduled for {month} {day}. Whenever a tutor cancels a lesson within 24 hours of the lesson start time, the Tutor App admins are notified and the cancelation is investigated. We understand you may need a tutor for an upcoming assignment or exam with a strict deadline. This is why we take cancellations seriously.</p><br /><br />
            <p>If you need additional help, please reach out to our staff and we will do our best to match you with a tutor that fits your needs ASAP.</p>
          </div>
        </div>
      </div>
    );
  },
});


LessonAccepted = React.createClass({
  getInitialState() {
    return {
      cancel: false,
    };
  },
  cancelLesson() {
    this.setState({
      cancel: true,
    });
  },
  closeForm() {
    this.setState({
      cancel: false,
    });
  },
  renderCancel() {
    return <CancelLesson lesson={this.props.lesson} closeForm={this.closeForm} />;
  },
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      location = '';
    if (this.props.lesson.where === 'online') {
      location = 'online';
    } else {
      location = `at ${this.props.lesson.location}`;
    }
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>You have confirmed a lesson with {this.props.tutor.profile.firstName}, on the {day} of {month} between {this.props.lesson.startTime} and {this.props.lesson.endTime} taking place {location}. </p>


          </div>
        </div>
        {this.state.cancel
          ? <div className="lesson--cancel">{this.renderCancel()}</div>
          :
            <div>
              <div className="lesson--buttons">
                <a href="" className="btn btn--xlarge btn--white" onClick={this.cancelLesson}>Cancel</a>
              </div>
              <p>Don't forget our <a href="/24-hour-cancellation">24 hour cancellation policy</a>.</p>
            </div>
         }
      </div>
    );
  },
});


CancelLesson = React.createClass({
  componentDidMount() {
    const self = this;
    const hoursNotice = this.hoursNotice();

    return $('#lessons').validate({
      rules: {
        reason: {
          required: true,
        },
      },
      submitHandler() {
        const reason = ReactDOM.findDOMNode(self.refs.reason).value;
        return Meteor.call('studentCancelLesson', reason, hoursNotice, self.props.lesson._id, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
            self.props.closeForm();
           //  Router.go('/invoices/thank-you');
            return;
          }
        });
      },
    });
  },
  cancelLesson(e) {
    e.preventDefault();
  },
  hoursNotice() {
    const date = moment();
    const previous = moment(this.props.lesson.date);
    const timeDifference = previous.diff(date, 'hours');
    if (timeDifference <= 24) {
      return true;
    }
    return false;
  },
  render() {
    const date = moment(this.props.lesson.date).format('DD/MM/YYYY');
    const hourNotice = this.hoursNotice();
    return (
      <div>
        <div className="lesson--edit cancel">
          <h3>Cancel this Lesson</h3>
          {hourNotice ?
            <p>You will be billed for 1 hour of time for cancelling this order because it is within 24 hours of starting.</p> :
            ''
          }
          <div className="dashboard--lesson-form edit forms">
            <form onSubmit={this.cancelLesson} id="lessons">
              <div className="forms">
                <label>Reason
                  <textarea name="reason" required="true" required /></label>
              </div>
              <div className="lesson--buttons">
                <button type="submit" className="btn btn--white btn--xlarge">Cancel Lesson</button>
                <span className="btn btn--white btn--xlarge" onClick={this.props.closeForm}>Keep Lesson</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});

LessonPending = React.createClass({
  acceptLesson() {
    Meteor.call('acceptLesson', this.props.lesson._id, this.props.lesson.chat_id, this.props.lesson.student_id, this.props.lesson.tutor_id, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  },
  declineLesson() {
    Meteor.call('declineLesson', this.props.lesson._id, this.props.lesson.chat_id, this.props.lesson.student_id, this.props.lesson.tutor_id, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  },
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      location = '';
    if (this.props.lesson.where === 'online') {
      location = 'online';
    } else {
      location = `at ${this.props.lesson.location}`;
    }
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h4>{this.props.tutor.profile.firstName} has created a lesson for you on the {day} of {month} between {this.props.lesson.startTime} and {this.props.lesson.endTime} taking place {location}.</h4>
            <p>Don't forget our <a href="/24-hour-cancellation">24 hour cancellation policy</a>.</p>
            <div className="lesson--buttons">
              <a href="" className="btn btn--xlarge btn--white" onClick={this.acceptLesson}>Accept</a>
              <a href="" className="btn btn--xlarge btn--white" onClick={this.declineLesson}>Decline</a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});


LessonModified = React.createClass({
  acceptLesson() {
    console.log('accept the lesson', this.props.lesson._id);
  },
  declineLesson() {
    Meteor.call('declineLesson', this.props.lesson._id, this.props.lesson.chat_id, this.props.lesson.student_id, this.props.lesson.tutor_id, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  },
  acceptLesson() {
    Meteor.call('acceptLesson', this.props.lesson._id, this.props.lesson.chat_id, this.props.lesson.student_id, this.props.lesson.tutor_id, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  },
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      location = '';
    if (this.props.lesson.where === 'online') {
      location = 'online';
    } else {
      location = `at ${this.props.lesson.location}`;
    }
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h4>{this.props.tutor.profile.firstName} has made a change to your lesson, it will now be on {day} of {month} between {this.props.lesson.startTime} and {this.props.lesson.endTime} taking place {location}.</h4>
            <p>Don't forget our <a href="/24-hour-cancellation">24 hour cancellation policy</a>.</p>
            <div className="lesson--buttons">
              <a href="" className="btn btn--xlarge btn--white" onClick={this.acceptLesson}>Accept</a>
              <a href="" className="btn btn--xlarge btn--white" onClick={this.declineLesson}>Decline</a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

StudentNeedsCard = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h4>Before you can accept a lesson with a tutor you must first enter your payment information. Your card will not be charged until 24 hours after the session takes place to ensure you and your tutor are a good fit.</h4>
          </div>
        </div>
        <div>
          <a href="/settings/payments" className="btn btn--xlarge btn--white btn--arrow">Add a card in Settings</a>
        </div>
      </div>
    );
  },
});
