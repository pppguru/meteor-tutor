import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Template } from 'meteor/templating';

import React from 'react';

import Reviews from '/collections/reviews';

ReviewItem = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const tutor = Meteor.users.findOne({ _id: this.props.review.tutor });
    return {
      tutor,
    };
  },
  propTypes: {
    review: React.PropTypes.object.isRequired,
  },
  lookUpTutor() {
    const tutorName = `${this.data.tutor.profile.firstName} ${this.data.tutor.profile.lastName}`;
    return tutorName.toUpperCase();
  },
  flagged() {
    if (this.props.review.flagged === true) {
      return '- Flagged!';
    }
  },
  render() {
    return (
      <li>
        <a href={`/admin/review/${this.props.review._id}`}>{this.props.review.overallRating} {this.flagged()} - of {this.lookUpTutor()}</a>
      </li>
    );
  },
});

ListReviews = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let reviews = Reviews.find(),
      users = Meteor.users.find();
    return {
      users,
      reviews,
    };
  },
  renderReviews() {
    return this.data.reviews.map((review, i) => {
      return <ReviewItem review={review} key={i} />;
    });
  },
  render() {
    return (
      <section className="content">
        <h1>All Reviews</h1>
        <ul>
          {this.renderReviews()}
        </ul>
      </section>
    );
  },
});

Template.listReviews.helpers({
  ListReviews() {
    return ListReviews;
  },
});
