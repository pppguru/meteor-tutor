import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mandrill } from 'meteor/wylio:mandrill';
import { Random } from 'meteor/random';

import Tutors from '/collections/tutors';

Meteor.methods({
  sendInvite(tutor, url) {
    let token;
    check(tutor, {
      id: String,
      email: String,
    });
    check(url, String);
    token = Random.hexString(10);
    return Tutors.update(tutor.id, {
      $set: {
        token,
        dateInvited: (new Date()).getTime(),
        invited: true,
        accountCreated: false,
      },
    }, (error) => {
      if (error) {
        return console.log(error);
      } else {
        const newTutor = Tutors.findOne({ _id: tutor.id });
        return Mandrill.messages.sendTemplate({
          template_name: 'tutor-application-approved',
          template_content: [
            { name: 'body', content: '<h3>Congrats! You have been approved to join Tutor App</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: 'Congrats! You Have Been Approved to join Tutor App',
            to: [
              { email: tutor.email, name: newTutor.profile.firstName },
            ],
            global_merge_vars: [
              { name: 'first_name', content: newTutor.profile.firstName },
              { name: 'url_with_token', content: `${url}/${token}` },
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
  },
});
