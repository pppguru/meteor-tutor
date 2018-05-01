import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Reviews from '/collections/reviews';

Meteor.methods({
  insertReview(review) {
    check(review, {
      content: String,
      rating: Object,
      overallRating: Number,
      flagged: Boolean,
      tutor: String,
      reviewer: String,
    });

    review.createdAt = new Date();

    return Reviews.insert(review, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        // Update the student so they are marked as having reviewed this tutor
        Meteor.users.update({ _id: Meteor.user()._id }, {
          $push: {
            hasReviewed: review.tutor,
          },
        });

        // Update the tutor with the review posted

        return Meteor.users.update({ _id: review.tutor }, {
          $push: {
            reviews: response,
            ratings: review.overallRating,
          },
        });
      }
    });
  },
});
