import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/mrt:moment';

import React from 'react';
import $ from 'jquery';
import 'datetimepick';

import Lessons from '/collections/lessons';
import Chats from '/collections/chats';
import Messages from '/collections/messages';

SingleMessages = React.createClass({
  getInitialState() {
    return {
      lesson: null,
    };
  },

  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      chat = Chats.findOne({ _id: this.props.chat_id }),
      lesson = Lessons.findOne({ chat_id: this.props.chat_id }, { sort: { createdAt: -1 } }),
      messages = Messages.find({ chat_id: this.props.chat_id }, { sort: { time: -1 } }).fetch(),
      tutor = Meteor.users.findOne({ _id: this.props.tutor_id });

    return {
      user,
      chat_id: this.props.chat_id,
      lesson,
      chat,
      tutor,
      messages,
    };
  },

  renderMessage() {
    return this.data.messages.map((message) => {
      return <Message key={message._id} message={message} chat_id={this.data.chat_id} />;
    });
  },

  componentDidMount() {
    const self = this;

    $('#datePicker').datetimepicker({
      format: 'MM/DD/YYYY',
      timepicker: false,
      minDate: 0,
      onShow(ct) {
      },
    });

    $('#datetimepicker_start').datetimepicker({
      format: 'h:mm a',
      datepicker: false,
      onShow(ct) {
        this.setOptions({
          maxDate: $('#date_timepicker_end').val() ? $('#date_timepicker_end').val() : false,
        });
      },
    });
    $('#datetimepicker_end').datetimepicker({
      format: 'h:mm a',
      datepicker: false,
      onShow(ct) {
        this.setOptions({
          minDate: $('#date_timepicker_start').val() ? $('#date_timepicker_start').val() : false,
        // We can't allow midnight, because technically that would be midnight
        // this morning, instead we'll use 23:59 which is almost midnight
        // tonight, we correct for this by rounding up the minutesRequested
          allowTimes: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '04:00',
            '04:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30',
            '23:59',
          ],
        });
      },
    });

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
          now = elms[2].value;
        hours = moment.duration(moment(now, 'h:mm a').diff(moment(then, 'h:mm a')));

        hours = hours.asHours() * 60;
        let requested = parseInt(hours);

       // Hack to correct minutesRequested so that a lesson which extends from
       // 11pm to 12:59 pm is billed for 60 minutes.
        if (requested % 15 === 14) {
          requested += 1;
        }

        const lesson = {
          minutesRequested: requested,
          chat_id: self.data.chat._id,
          date: elms[0].value,
          startTime: then,
          endTime: now,
          where: elms[3].value,
          location: elms[4] ? elms[4].value : '',
          student_id: self.data.chat.student_id,
          tutor_id: self.data.chat.tutor_id,
        };

      //  var submitButton = $('input[type="submit"]').val("Loading");
       //
        return Meteor.call('generateLesson', lesson, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
          //  Router.go('/invoices/thank-you');
            self.setState({
              lesson: false,
            });
            return;
          }
        });
      },
    });
  },

  componentWillReceiveProps() {
    const self = this;
    return $('#message').validate({
      rules: {
        message: {
          required: true,
        },
      },
      messages: {
        message: {
          required: 'Please enter in a reply before submitting',
        },
      },
      submitHandler() {
        const url = `${window.location.origin}/chat`;
        const user = Meteor.user();
        const existingMessages = document.querySelector('.dashboard--messages-chats-single');
        let message = {};

        // let chat = Chats.findOne({_id: self.props.chat_id});
        // debugger;
        if (Roles.userIsInRole(user, ['student'])) {
          message = {
            message: $('[name="message"]').val(),
            student_id: user._id,
            from_id: user._id,
            tutor_id: self.data.chat.tutor_id,
            chat_id: self.data.chat._id,
          };
        } else if (Roles.userIsInRole(user, ['tutor'])) {
          message = {
            message: $('[name="message"]').val(),
            student_id: self.data.chat.student_id,
            from_id: user._id,
            tutor_id: user._id,
            chat_id: self.data.chat._id,
          };
        }
        return Meteor.call('addMessageToChat', message, url, (error) => {
          if (error) {
            console.log(error);
          } else {
            $('[name="message"]').val('');
            if (existingMessages === null) {
              window.location.reload();
            }
          }
        });
      },
    });
  },

  handleSubmit(e) {
    e.preventDefault();
  },

  renderForm() {
    return (
      <div className="dashboard--messages-form">
        <form id="message" onSubmit={this.handleSubmit}>
          <textarea id="chat-message" name="message" placeholder="Write your message here..." />
          <button type="submit" className="btn btn--large">Send Message</button>
        </form>
      </div>
    );
  },

  openLessonCreate(e) {
    e.preventDefault();
    this.setState({
      lesson: true,
    });
  },
  renderCreateLesson() {
    if (Roles.userIsInRole(this.data.user, ['tutor'])) {
      return (<a href="" className="btn btn--arrow btn--xlarge" onClick={this.openLessonCreate}>Create a Lesson</a>);
    } else {
      return;
    }
  },
  renderButton() {
    if (this.data.lesson) {
      if (this.data.lesson.status === 'student_cancelled' || this.data.lesson.status === 'completed' || this.data.lesson.status === 'tutor_cancelled') {
        return this.renderCreateLesson();
      }
    }
  },
  checkStatus() {
    filter = { userId: this.data.tutor._id };
    status = Presences.findOne(filter, { fields: { state: true, userId: true } });
    if (status === true) {
      return (<span className="status--circle status--circle-big status--online" />);
    }
  },
  tutorWindow() {
    if (this.data.tutor && this.data.tutor.address) {
      let city = this.data.tutor.address.city;
      city = city.replace(/\s+/g, '-').toLowerCase();
      let state = this.data.tutor.address.state;
      state = state.replace(/\s+/g, '-').toLowerCase();

      const combineName = `${this.data.tutor.profile.firstName}-${this.data.tutor.profile.lastName.substring(0, 1)}`;
      const nameSlug = combineName.toLowerCase();
      const image = {
        backgroundImage: `url(${this.data.tutor.profile.avatar})`,
      };
      return (
        <div className="dashboard--messages-tutor-card">
          <div className="dashboard--messages-tutor-photo" style={image} />
          {this.checkStatus()}
          <h4><a href={`/tutor/${state}/${city}/${nameSlug}`}> {this.data.tutor.profile.firstName}</a></h4>
          <h5>{`${this.data.tutor.address.city}, ${this.data.tutor.rate}`}/hr</h5>
          {!this.shouldRenderLessonStatus() && this.renderCreateLesson() || ''}
          {this.renderButton()}
        </div>
      );
    } else {
      return;
    }
  },

  renderLesson() {
    return this.createLesson();
  },

  handleLesson(e) {
    e.preventDefault();
  },
  handleChange(e) {
    if (e.target.value === 'online') {
      document.querySelector('.address--field').style.display = 'none';
    } else {
      document.querySelector('.address--field').style.display = 'block';
    }
  },

  createLesson() {
    return (
      <div className={`${'dashboard--lesson ' + 'dashboard--lesson-'}${this.state.lesson}`}>
        <div className="dashboard--lesson-wrapper">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="M37.82,166.5A13.5,13.5,0,1,1,24.32,180a13.52,13.52,0,0,1,13.5-13.5m0-4.5a18,18,0,1,0,18,18,18,18,0,0,0-18-18h0Z" transform="translate(-19.82 -162)" /><path d="M43.92,182.9l-3.85-3.85v-8H35.55v9a2.23,2.23,0,0,0,.78,1.68l4.41,4.41Z" transform="translate(-19.82 -162)" /></svg>
            </div>
            <div className="icon-item-copy">
              <h3>Book a Lesson</h3>
            </div>
          </div>
          <div className="dashboard--lesson-form forms">
            <form onSubmit={this.handleLesson} id="lessons">
              <div className="forms--triple">
                <div className="forms--triple-b">
                  <label>When
                    <input name="when" required="true" id="datePicker" required /></label>
                </div>
                <div className="forms--triple-s">
                  <label>Between
                    <input name="startDate" id="datetimepicker_start" required /></label>
                </div>
                <div className="forms--triple-s">
                  <label>And
                    <input name="endDate" id="datetimepicker_end" required /></label>
                </div>
              </div>
              <div className="forms--double">
                <div className="forms--double-s">
                  <label>Where
                    <div className="select-style">
                      <select name="where" onChange={this.handleChange} required >
                        <option value="person">In Person</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </label>
                </div>
                <div className="forms--double-s address--field">
                  <label>Address
                    <input name="address" required />
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn--white">Create Lesson</button>
            </form>
          </div>
        </div>
      </div>
    );
  },

  shouldRenderLessonStatus() {
    const lesson = this.data.lesson;
    if (!lesson) {
      return false;
    }
    const date = moment(lesson.date);
    if (!date.isValid()) {
      return false;
    }
    // Only show the lesson status if the lesson is in the future.
    // Date is actually midnight in the morning, so we need to grab end of day
    // for comparison
    return date.endOf('day').valueOf() > moment().valueOf();
  },

  renderLessonStatus() {
    if (Roles.userIsInRole(this.data.user, ['tutor'])) {
      return <TutorLesson lesson={this.data.lesson} />;
    } else {
      return <StudentLesson lesson={this.data.lesson} tutor={this.data.tutor} />;
    }
  },

  render() {
    if (this.data.messages) {
      return (
        <div className="dashboard">
          <UserNavigation />
          <div className="dashboard--messages">
            <div className="dashboard--messages-wrapper">
              <div className="dashboard--messages-chats">
                {this.shouldRenderLessonStatus() ?
                  this.renderLessonStatus() : ''}
                {this.renderLesson()}
                <div className="dashboard--messages-chats-list">{this.renderMessage()}</div>
                {this.renderForm()}
              </div>
              <div className="dashboard--messages-info">
                {this.tutorWindow()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return;
    }
  },
});


Message = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const currentUser = Meteor.userId();
    let user, message, filter, status, alignment;

    if (this.props.message.student_id === this.props.message.from_id) {
      user = Meteor.users.findOne({ _id: this.props.message.student_id });
      filter = { userId: this.props.message.student_id };
      status = Presences.findOne(filter, { fields: { state: true, userId: true } });
      alignment = '';
    } else if (this.props.message.tutor_id === this.props.message.from_id) {
      user = Meteor.users.findOne({ _id: this.props.message.tutor_id });
      filter = { userId: this.props.message.tutor_id };
      status = Presences.findOne(filter, { fields: { state: true, userId: true } });
      alignment = 'reverse';
      // console.log(user, message, status);
    }
    return {
      message: this.props.message,
      user,
      alignment,
      status,
    };
  },

  render() {
    if (this.data.user && this.data.message) {
      return <ChatSingle user={this.data.user} alignment={this.data.alignment} status={this.data.status} message={this.data.message} />;
    } else {
      return (
        <div className="loading">Loading</div>
      );
    }
  },
});

ChatSingle = React.createClass({
  checkStatus() {
    if (this.props.status) {
      return (<span className="status--circle status--online" />);
    }
  },
  componentWillMount() {
    const user = Meteor.userId();

    // Update notifications
    Meteor.call('updateReadMessages', this.props.message.chat_id, user, (error, response) => {
      if (error) {
        console.log(error);
      }
    });
  },
  render() {
    const time = moment(this.props.message.time).fromNow();
    const lastName = this.props.user.profile.lastName.substring(0, 1);
    const style = {
      backgroundImage: `url(${this.props.user.profile.avatar})`,
    };
    return (
      <div className={`dashboard--messages-chats-single ${this.props.alignment}`}>
        <div className="dashboard--messages-chats-info">
          <span style={style} className="dashboard--messages-single-avatar" />
          {this.checkStatus()}
          <div>
            <h4>{this.props.user.profile.firstName} {` ${lastName}`}.</h4>
            <p>{time}</p>
          </div>
        </div>
        <div className="dashboard--messages-chats-content">
          <p>{this.props.message.message}</p>
        </div>
      </div>
    );
  },
});

Template.message.helpers({
  SingleMessages() {
    return SingleMessages;
  },
});
