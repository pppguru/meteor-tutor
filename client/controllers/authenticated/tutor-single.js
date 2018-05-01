import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Counts } from 'meteor/tmeasday:publish-counts';

import Reviews from '/collections/reviews';

Template.tutorSingle.helpers({
  canReview(tutorId) {
    // var user = Meteor.user(),
    //     hadSession = user.hasHadSession,
    //     reviewed = user.hasReviewed,
    //     canReview = false,
    //     beenReviewed = false;
    //
    // if (Roles.userIsInRole(user, ['student'])) {
    //   [].forEach.call(reviewed, function(review) {
    //     if (review === tutorId) {
    //       console.log('reviewed');
    //       beenReviewed = true;
    //       return canReview;
    //     }
    //   });
    //
    //   [].forEach.call(hadSession, function(session) {
    //     if (session === tutorId) {
    //       canReview = true;
    //     }
    //   });
    // }
    // if (beenReviewed === true) {
    //   return false;
    // } else {
    //   return canReview;
    // }
  },
  reviews() {
    return Reviews.find({});
  },
  totalRating() {
    const reviews = Reviews.find({});
    let score = 0;
    const total = Counts.get('total-reviews');
    reviews.forEach((review, i) => {
      score += review.overallRating;
    });


    if (total === 0) {
      return 0.0;
    } else {
      return score / total;
    }
  },
  getSubjects(subjects) {
    const teaches = '';
    // console.log(subjects);
    // if (subjects !== undefined) {
    //   for (var i = 0; i < subjects.length; i++) {
    //     var subject = Subjects.findOne({_id: subjects[i]});
    //     teaches += subject.name + ' ';
    //   }
    //   return teaches;
    // }
  },
});


Template.tutorSingle.rendered = function () {
  // $('textarea').redactor({
  //   focus: false,
  //   toolbar: false,
  // });

  const instance = this;
  return $('#reviewTutor').validate({
    rules: {
      review: {
        required: true,
      },
    },
    submitHandler() {
      const total = parseInt(this.currentForm.querySelector('[name="communication"]:checked').value, 10) +
                  parseInt(this.currentForm.querySelector('[name="clarity"]:checked').value, 10) +
                  parseInt(this.currentForm.querySelector('[name="helpfulness"]:checked').value, 10) +
                  parseInt(this.currentForm.querySelector('[name="patience"]:checked').value, 10) +
                  parseInt(this.currentForm.querySelector('[name="professionalism"]:checked').value, 10);

      const review = {
        content: this.currentForm.querySelector('.reviewText').value,
        rating: {
          communication: this.currentForm.querySelector('[name="communication"]:checked').value,
          clarity: this.currentForm.querySelector('[name="clarity"]:checked').value,
          helpfulness: this.currentForm.querySelector('[name="helpfulness"]:checked').value,
          patience: this.currentForm.querySelector('[name="patience"]:checked').value,
          professionalism: this.currentForm.querySelector('[name="professionalism"]:checked').value,
        },
        overallRating: (total / 5),
        flagged: this.currentForm.querySelector('[name="reviewHide"]').checked,
        tutor: instance.data._id,
        reviewer: Meteor.userId(),
      };

      return Meteor.call('insertReview', review, (error, response) => {
        if (error) {
          return alert(error.reason);
        } else {
          if (response.error) {
            return alert(response.error);
          } else {
            if (review.flagged === true) {
              return Meteor.call('flaggedTutorReview', review, (error, response) => {
                if (error) {
                  return console.log(error);
                }
              });
            }
          }
        }
      });
    },
  });
};
