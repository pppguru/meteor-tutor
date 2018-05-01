import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mandrill } from 'meteor/wylio:mandrill';

import Tutors from '/collections/tutors';
/*
  Tutors
  Collection of methods for inserting documents into the Tutors collection.
 */
Meteor.methods({
  addToTutorsList(tutor) {
    let emailExists, inviteCount;
    check(tutor, {
      email: String,
      profile: Object,
      address: Object,
      requested: Number,
      invited: Boolean,
      promoToken: String,
    });
    emailExists = Tutors.findOne({
      email: tutor.email,
    });
    if (emailExists) {
      throw new Meteor.Error('email-exists', "It looks like you've already signed up. Thanks!");
    } else {
      inviteCount = Tutors.find({}, {
        fields: {
          _id: 1,
        },
      }).count();
      tutor.inviteNumber = inviteCount + 1;
      return Tutors.insert(tutor, (error) => {
        if (error) {
          return console.log(error);
        } else {
          const applicant = Tutors.findOne(tutor);
          Mandrill.messages.sendTemplate({
            template_name: 'new-application-submitted',
            template_content: [
              { name: 'body', content: '<h3>New Lesson Created on Tutor app!</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: 'New Application Submitted',
              to: [
                { email: 'hiring@tutorapp.com', name: 'Tutor App' },
              ],
              global_merge_vars: [
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'pending_tutors', content: `https://tutorapp.com/admin/invite/${applicant._id}` },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
        }
      });
    }
  },
});
