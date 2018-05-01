import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { Handlebars } from 'meteor/cmather:handlebars-server';

Meteor.methods({
  flaggedTutorReview(review) {
    let emailTemplate;

    check(review, {
      content: String,
      rating: Object,
      overallRating: Number,
      flagged: Boolean,
      tutor: String,
      reviewer: String,
    });
    // Flagged Email is sent to admin

    const flaggedTutor = Meteor.users.findOne({ _id: this.userId });

    return Email.send({
      to: 'hello@tutorapp.com',
      from: 'Tutor App <hello@tutorapp.com>',
      subject: 'Someone Wrote a Flagged Review',
      html: Handlebars.templates['flagged-review']({
        email: flaggedTutor.emails[0].address,
        urlTutor: `${flaggedTutor.meta.state}/${flaggedTutor.meta.city}/${flaggedTutor.slug}`,
        name: `${flaggedTutor.profile.firstName} ${flaggedTutor.profile.lastName}`,
        url: 'http://tutorapp.com/',
      }),
    });
  },
});
