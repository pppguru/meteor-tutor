import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Reviews from '/collections/reviews';

Meteor.methods({
  updateReview(review) {
    check(review, {
      _id: String,
      content: String,
      rating: Object,
      overallRating: Number,
      flagged: Boolean,
    });


    return Reviews.update({ _id: review._id }, {
      $set: {
        content: review.content,
        'rating.communication': review.rating.communication,
        'rating.clarity': review.rating.clarity,
        'rating.professionalism': review.rating.professionalism,
        'rating.patience': review.rating.patience,
        'rating.helpfulness': review.rating.helpfulness,
        overallRating: review.overallRating,
        flagged: review.flagged,
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        return response;
      }
    });
  },
});
