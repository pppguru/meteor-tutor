import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

import Lessons from '/collections/lessons';
import {
  getUserNameById,
  capitalizeFirst,
  getLessonCost,
  formatUSD,
} from '/client/helpers/helpers-global';
import formatLessonStatus from '/client/helpers/helpers-ui';

ActivityCard = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      userId: Meteor.userId(),
      lessons: Lessons.find({}, { sort: { date: -1 } }).fetch(),
    };
  },

  renderCard() {
    if (this.data.lessons.length > 0) {
      return (
        <div className="dashboard--activity-card dashboard-card">
          <div className="dashboard--activity-card-wrapper">
            <div className="dashboard--activity-header">
              <h2>Activity</h2><a href="/settings/lesson-history">See lesson history</a>
            </div>
            <div className="dashboard--activity-preview">
              <div className="dashboard--activity-item">
                { this.renderActivity() }
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  },

  renderActivity() {
    if (this.data.lessons) {
      return this.data.lessons.map((lesson, index) => {
        return (
          <LessonItem
            key={index}
            id={lesson._id}
            date={lesson.date}
            person={getUserNameById((Roles.userIsInRole(this.data.userId, ['tutor'])) ? lesson.student_id : lesson.tutor_id)}
            start={lesson.startTime}
            end={lesson.endTime}
            where={lesson.where}
            cost={getLessonCost(lesson.minutesRequested, lesson.currentRate)}
            status={lesson.status}
            chat_id={lesson.chat_id}
          />
        );
      });
    } else {
      return null;
    }
  },

  render() {
    return (this.renderCard());
  },

});

LessonItem = React.createClass({

  render() {
    const status = formatLessonStatus(this.props.status);
    return (
      <a href={`/chat/${this.props.chat_id}`}>
        <div className="icon-item">
          <div className="icon-item-icon">
            <span>{moment(this.props.date).format('MM/DD')}</span>
          </div>
          <div className="icon-item-copy">
            <h3>{capitalizeFirst(this.props.person)}</h3>
            <p>{this.props.start} to {this.props.end}, {this.props.where}, {formatUSD(this.props.cost)}</p>
          </div>
        </div>
        <span className={'lesson--status default'}>
          <img src={`/images/${status.icon}.svg`} />
          {status.text}
        </span>
      </a>
    );
  },
});
