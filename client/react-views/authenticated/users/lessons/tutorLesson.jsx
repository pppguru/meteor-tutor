import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { moment } from 'meteor/mrt:moment';

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'datetimepick';

TutorLesson = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const student = Meteor.users.findOne({ _id: this.props.lesson.student_id });
    return { student };
  },
  statusLesson() {
    if (this.props.lesson.status === 'pending' || this.props.lesson.status === 'declined' || this.props.lesson.status === 'modified') {
      return <TutorLessonPending lesson={this.props.lesson} student={this.data.student} />;
    } else if (this.props.lesson.status === 'student_cancelled') {
      return <StudentCancelled lesson={this.props.lesson} student={this.data.student} />;
    } else if (this.props.lesson.status === 'tutor_cancelled') {
      return <TutorCancelled lesson={this.props.lesson} student={this.data.student} />;
    } else if (this.props.lesson.status === 'accepted') {
      return <TutorLessonAccepted lesson={this.props.lesson} student={this.data.student} />;
    } else if (this.props.lesson.status === 'completed') {
      return <TutorCompleted lesson={this.props.lesson} student={this.data.student} />;
    }
  },
  renderLesson() {
    if (this.data.student) {
      return this.statusLesson();
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


TutorCompleted = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>Congrats you completed a lesson with {this.props.student.profile.firstName}. You can message them and have another one!</p>
          </div>
        </div>
      </div>
    );
  },
});


StudentCancelled = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>{this.props.student.profile.firstName} has cancelled their lesson with you. You can message them to start another lesson.</p>
          </div>
        </div>
      </div>
    );
  },
});


TutorCancelled = React.createClass({
  render() {
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1"><title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            <p>You cancelled your lesson with {this.props.student.profile.firstName}. Message them or create a new lesson.</p>
          </div>
        </div>
      </div>
    );
  },
});


TutorLessonAccepted = React.createClass({
  getInitialState() {
    return { cancel: false, edit: false, complete: false };
  },
  hoursNotice() {
    const date = moment();
    const previous = moment(this.props.lesson.date);
    const timeDifference = previous.diff(date, 'hours');
    console.log(timeDifference);
    if (timeDifference <= 24) {
      return true;
    }
    return false;
  },
  componentDidMount() {
    const self = this;
  },

  timePast() {
    const date = moment();
    const previous = moment(this.props.lesson.date);
    const timeDifference = previous.diff(date, 'hours');
    console.log(timeDifference);
    if (timeDifference <= 6) {
      return true;
    }
    return false;
  },
  cancelLesson(e) {
    e.preventDefault();
    const self = this;
    const hoursNotice = this.hoursNotice();
    const pending = false;
    const reason = ReactDOM.findDOMNode(self.refs.reason).value;
    return Meteor.call('tutorCancelLesson', reason, pending, hoursNotice, self.props.lesson._id, (error, response) => {
      if (error) {
        return alert(error.reason);
      } else {
        self.closeCancelForm();
       //  Router.go('/invoices/thank-you');
        return;
      }
    });
  },

  completeLesson(e) {
    e.preventDefault();
    const self = this;

    const reason = ReactDOM.findDOMNode(self.refs.reason).value;
    return Meteor.call('tutorCompleteLesson', reason, self.props.lesson._id, (error, response) => {
      if (error) {
        return alert(error.reason);
      } else {
        self.closeCompleteForm();
       //  Router.go('/invoices/thank-you');
        return;
      }
    });
  },
  cancelThisLesson() {
    this.setState({ edit: false, cancel: true, complete: false });
  },
  completeThisLesson() {
    this.setState({ edit: false, cancel: false, complete: true });
  },
  editLesson() {
    this.setState({ edit: true, cancel: false, complete: false });
  },
  closeCancelForm(e) {
    e.preventDefault();
    this.setState({ cancel: false });
  },
  closeCompleteForm() {
    this.setState({
      complete: false,
    });
  },
  closeForm() {
    this.setState({
      edit: false,
    });
  },
  renderCancel() {
    const hoursNotice = this.hoursNotice();
    return (
      <div>
        <div className="lesson--edit cancel">
          <h3>Cancel Lesson</h3>
          {hoursNotice ?
            <p>You are cancelling a lesson with 24 hours, we take that very seriously here at Tutor App. Please provide a valid reason below.</p> :
              ''
            }
          <form id="cancel" onSubmit={this.cancelLesson}>
            <label>Your Message
              <textarea name="reason" />
            </label>
            <div className="lesson--buttons">
              <button type="submit" className="btn btn--white btn--xlarge">Cancel Lesson</button>
              <a href="" className="btn btn--white btn--xlarge" onClick={this.closeCancelForm}>Undo</a>
            </div>
          </form>
        </div>
      </div>
    );
  },
  renderComplete() {
    const hoursNotice = this.hoursNotice();
    return (
      <div>
        <div className="lesson--edit cancel">
          <h3>Complete Lesson</h3>
          <p>Looks, like you're all done, please fill in any additional notes needed for the student and mark the lesson as complete to get paid!</p>
          <form id="complete" onSubmit={this.completeLesson}>
            <label>Your Message
              <textarea name="reason" />
            </label>
            <div className="lesson--buttons">
              <button type="submit" className="btn btn--white btn--xlarge">Complete Lesson</button>
              <a href="" className="btn btn--white btn--xlarge" onClick={this.closeCompleteForm}>Undo</a>
            </div>
          </form>
        </div>
      </div>
    );
  },
  renderEdit() {
    return <TutorEditLesson lesson={this.props.lesson} closeForm={this.closeForm} />;
  },
  getModifying() {
    if (this.state.cancel === true || this.state.edit === true) {
      return false;
    } else {
      return true;
    }
  },
  getDeclined() {
    if (this.props.lesson.status === 'declined') {
      return true;
    }
    return false;
  },
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      canceled = this.getDeclined(),
      location = '',
      timePast = this.timePast();
    editing = this.getModifying();

    if (this.props.lesson.where === 'online') {
      location = 'online';
    } else {
      location = `at ${this.props.lesson.location}`;
    }
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1">
              <title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">

            <h4>Your lesson with {this.props.student.profile.firstName} has been approved for the {day} of {month} between {this.props.lesson.startTime} and {this.props.lesson.endTime} taking place {location}.</h4>
            <p>Don't forget our <a href="/24-hour-cancellation">24 hour cancellation policy</a>.</p>
            {editing
              ? <div className="lesson--buttons">
                <a href="" className="btn btn--xlarge btn--white" onClick={this.editLesson}>Edit</a>
                <a href="" className="btn btn--xlarge btn--white" onClick={this.cancelThisLesson}>Cancel Lesson</a>
                {timePast ?
                  <a href="" className="btn btn--xlarge btn--white" onClick={this.completeThisLesson}>Complete Lesson</a>
                    : ''}
              </div>
              : ''}
            <div className="lesson--cancel">
              {this.state.cancel
                ? this.renderCancel()
                : ''}
            </div>
            <div className="lesson--edit">
              {this.state.edit
                ? this.renderEdit()
                : ''}
            </div>
            <div className="lesson--edit">
              {this.state.complete
                ? this.renderComplete()
                : ''}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TutorLessonPending = React.createClass({
  getInitialState() {
    return { cancel: false, edit: false };
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
  componentDidMount() {
    const self = this;
    console.log('hey');
  },
  cancelLesson(e) {
    e.preventDefault();
    const self = this;
    const hoursNotice = this.hoursNotice();
    const pending = true;
    const reason = ReactDOM.findDOMNode(self.refs.reason).value;
    return Meteor.call('tutorCancelLesson', reason, pending, hoursNotice, self.props.lesson._id, (error, response) => {
      if (error) {
        return alert(error.reason);
      } else {
        self.closeCancelForm();
       //  Router.go('/invoices/thank-you');
        return;
      }
    });
  },
  cancelThisLesson() {
    this.setState({ edit: false, cancel: true });
  },
  editLesson() {
    this.setState({ edit: true, cancel: false });
  },
  closeCancelForm(e) {
    e.preventDefault();
    this.setState({ cancel: false });
  },
  renderCancel() {
    return (
      <div>
        <div className="lesson--edit cancel">
          <h3>Cancel Lesson</h3>
          <p>This lesson hasn't been approved yet so there is no penalty for cancelling. If you have a specific reason for cancelling please leave us a note.</p>
          <form id="cancel" onSubmit={this.cancelLesson}>
            <label>Your Message
              <textarea name="reason" />
            </label>
            <div className="lesson--buttons">
              <button type="submit" className="btn btn--white btn--xlarge">Cancel Lesson</button>
              <a href="" className="btn btn--white btn--xlarge" onClick={this.closeCancelForm}>Undo</a>
            </div>
          </form>
        </div>
      </div>
    );
  },
  closeForm() {
    this.setState({
      edit: false,
    });
  },
  renderEdit() {
    return <TutorEditLesson lesson={this.props.lesson} closeForm={this.closeForm} />;
  },
  getModifying() {
    if (this.state.cancel === true || this.state.edit === true) {
      return false;
    } else {
      return true;
    }
  },
  getDeclined() {
    if (this.props.lesson.status === 'declined') {
      return true;
    }
    return false;
  },
  render() {
    let day = moment(this.props.lesson.date).format('Do'),
      month = moment(this.props.lesson.date).format('MMMM'),
      canceled = this.getDeclined(),
      location = '',
      editing = this.getModifying();

    if (this.props.lesson.where === 'online') {
      location = 'online';
    } else {
      location = `at ${this.props.lesson.location}`;
    }
    return (
      <div>
        <div className="icon-item white">
          <div className="icon-item-icon">
            <svg viewBox="0 0 20.39 36.1">
              <title>icon_information</title><circle cx="10.28" cy="6.38" r="6.38" /><path d="M746.36-396.12a1.79,1.79,0,0,0,1.79,1.79h1.79a0.45,0.45,0,0,1,.45.45v11.23a0.45,0.45,0,0,1-.45.45h-1.79a1.79,1.79,0,0,0-1.79,1.79v0.9a1.79,1.79,0,0,0,1.79,1.79H765a1.79,1.79,0,0,0,1.79-1.79v-0.9a1.79,1.79,0,0,0-1.79-1.79h-1.79a0.45,0.45,0,0,1-.45-0.45V-397a1.8,1.8,0,0,0-1.79-1.79H748.16a1.79,1.79,0,0,0-1.79,1.79v0.9Z" transform="translate(-746.36 413.82)" /></svg>
          </div>
          <div className="icon-item-copy">
            {canceled ?
              <h4>This lesson has been declined by the student, if you make any changes you will be able to resubmit the lesson</h4>
              :
                <h4>Your lesson with {this.props.student.profile.firstName} is pending for the {day} of {month} between {this.props.lesson.startTime} and {this.props.lesson.endTime} taking place {location}.</h4>
            }
            <p>Don't forget our <a href="/24-hour-cancellation">24 hour cancellation policy</a>.</p>
            {editing
              ? <div className="lesson--buttons">
                <a href="" className="btn btn--xlarge btn--white" onClick={this.editLesson}>Edit</a>
                <a href="" className="btn btn--xlarge btn--white" onClick={this.cancelThisLesson}>Cancel Lesson</a>
              </div>
              : ''}
            <div className="lesson--cancel">
              {this.state.cancel
                ? this.renderCancel()
                : ''}
            </div>
            <div className="lesson--edit">
              {this.state.edit
                ? this.renderEdit()
                : ''}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TutorEditLesson = React.createClass({
  componentDidMount() {
    const self = this;
    $('#datePicker').datetimepicker({ format: 'MM/DD/YYYY', timepicker: false, minDate: 0, onShow(ct) {} });

    $('#datetimepicker_start').datetimepicker({
      format: 'h:mm a',
      datepicker: false,
      onShow(ct) {
        this.setOptions({
          maxDate: $('#date_timepicker_end').val()
            ? $('#date_timepicker_end').val()
            : false,
        });
      },
    });
    $('#datetimepicker_end').datetimepicker({
      format: 'h:mm a',
      datepicker: false,
      onShow(ct) {
        this.setOptions({
          minDate: $('#date_timepicker_start').val()
            ? $('#date_timepicker_start').val()
            : false,
        });
      },
    });
    if (this.props.lesson.where === 'online') {
      document.querySelector('.address--field').style.display = 'none';
    }
    return $('#lessons').validate({
      rules: {
        when: {
          required: true,
        },
        startDate: {
          required: true,
        },
        address: {
          required: true,
        },
        endDate: {
          required: true,
        },
        where: {
          required: true,
        },
      },
      submitHandler() {
        let elms = this.currentElements,
          then = elms[1].value,
          now = elms[2].value,
          hours = moment.duration(moment(now, 'h:mm a').diff(moment(then, 'h:mm a')));

        hours = hours.asHours() * 60;
        const requested = parseInt(hours);

        const lesson = {
          minutesRequested: requested,
          date: elms[0].value,
          startTime: then,
          endTime: now,
          where: elms[3].value,
          location: elms[4] ? elms[4].value : '',
        };

       //  var submitButton = $('input[type="submit"]').val("Loading");
        //
        return Meteor.call('updateLesson', lesson, self.props.lesson._id, (error, response) => {
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
  handleChange(e) {
    if (e.target.value === 'online') {
      document.querySelector('.address--field').style.display = 'none';
    } else {
      document.querySelector('.address--field').style.display = 'block';
    }
  },
  updateLesson(e) {
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
          <h3>Modify this Lesson</h3>
          {hourNotice ?
            <p>Warning! This lesson is set to begin within 24 hours.</p> :
              <p>Keep in mind if this lesson has already been approved by a student it will turn back into a pending lesson if any changes are made to it. This means a student has to approve of any changes before progressing.</p>
          }
          <div className="dashboard--lesson-form edit forms">
            <form onSubmit={this.updateLesson} id="lessons">
              <div className="forms--triple">
                <div className="forms--triple-b">
                  <label>When
                    <input name="when" required="true" id="datePicker" required defaultValue={date} /></label>
                </div>
                <div className="forms--triple-s">
                  <label>Between
                    <input name="startDate" id="datetimepicker_start" required defaultValue={this.props.lesson.startTime} /></label>
                </div>
                <div className="forms--triple-s">
                  <label>And
                    <input name="endDate" id="datetimepicker_end" required defaultValue={this.props.lesson.endTime} /></label>
                </div>
              </div>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>Where
                    <div className="select-style">
                      <select name="where" onChange={this.handleChange} defaultValue={this.props.lesson.where} required >
                        <option value="person">In Person</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </label>
                </div>
                <div className="forms--double-s address--field">
                  <label>Address
                    <input name="address" required defaultValue={this.props.lesson.location} />
                  </label>
                </div>
              </div>

              <div className="lesson--buttons">
                <button type="submit" className="btn btn--white btn--xlarge">Update Lesson</button>
                <span className="btn btn--white btn--xlarge" onClick={this.props.closeForm}>Cancel</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});
