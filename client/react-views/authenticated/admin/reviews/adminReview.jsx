import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Template } from 'meteor/templating';

import React from 'react';
import ReactDOM from 'react-dom';

import Reviews from '/collections/reviews';

AdminReview = React.createClass({
  mixins: [ReactMeteorData],
  PropTypes: {
    return: {
      id: React.PropTypes.string.isRequired,
      tutorId: React.PropTypes.string.isRequired,
    },
  },
  getMeteorData() {
    let review = Reviews.findOne({ _id: this.props.id }),
      tutor = Meteor.users.findOne({ _id: this.props.tutorId });

    return {
      review,
      tutor,
    };
  },
  componentDidMount() {
    if (this.data.review.flagged) {
      document.querySelector('.reviewHide').checked = true;
    }
  },
  updateReview() {
    const total = parseInt(this.communication.value, 10) +
                parseInt(this.clarity.value, 10) +
                parseInt(this.helpfulness.value, 10) +
                parseInt(this.patience.value, 10) +
                parseInt(this.professionalism.value, 10);

    const review = {
      _id: this.props.id,
      rating: {
        communication: this.communication.value,
        clarity: this.clarity.value,
        helpfulness: this.helpfulness.value,
        patience: this.patience.value,
        professionalism: this.professionalism.value,
      },
      content: this.content.value,
      overallRating: (total / 5),
      flagged: this.reviewHide.checked,
    };

    Meteor.call('updateReview', review, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'warning');
      } else {
        Bert.alert('Updated Review!', 'success');
      }
    });
  },
  renderData() {
    return (
      <div>
        <h2>Review of {this.data.tutor.profile.firstName} {this.data.tutor.profile.lastName}</h2>

        <h4>Ratings</h4>
        communication <input ref={c => this.communication} type="number" step="1" max="5" min="0" defaultValue={this.data.review.rating.communication} />
        clarity <input ref={c => this.clarity = c} type="number" step="1" max="5" min="0" defaultValue={this.data.review.rating.clarity} />
        helpfulness <input ref={c => this.helpfulness = c} type="number" step="1" max="5" min="0" defaultValue={this.data.review.rating.helpfulness} />
        patience <input ref={c => this.patience = c} type="number" step="1" max="5" min="0" defaultValue={this.data.review.rating.patience} />
        professionalism <input ref={c => this.professionalism = c} type="number" step="1" max="5" min="0" defaultValue={this.data.review.rating.professionalism} />

        <h4>Review</h4>
        <textarea ref={c => this.content = c} defaultValue={this.data.review.content} />
        <br />
        <input type="checkbox" className="reviewHide" ref={c => this.reviewHide = c} defaultValue={this.data.review.flagged} />Visible only to admins
        <input type="submit" onClick={this.updateReview} />
      </div>
    );
  },
  render() {
    return (
      <section className="content">
        {this.renderData()}
      </section>

    );
  },
});

Template.adminReview.helpers({
  AdminReview() {
    return AdminReview;
  },
});
