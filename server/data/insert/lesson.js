import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { moment } from 'meteor/mrt:moment';

import Lessons from '/collections/lessons';

Meteor.methods({

  generateLesson(lesson) {
    console.log('create invoice');
    check(lesson, {
      minutesRequested: Number,
      startTime: String,
      endTime: String,
      date: String,
      where: String,
      location: String,
      student_id: String,
      chat_id: String,
      tutor_id: String,
    });

    // convert the string dates to date objects
    lesson.date = new Date(lesson.date);

    const tutor = Meteor.users.findOne({ _id: lesson.tutor_id });

    lesson.currentRate = tutor.rate;
    lesson.status = 'pending';
    lesson.createdAt = new Date();


    return Lessons.insert(lesson, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        // / Send an Email to the tutor and the student with the lesson information

        let tutor = Meteor.users.findOne({ _id: lesson.tutor_id }),
          student = Meteor.users.findOne({ _id: lesson.student_id }),
          date = moment(lesson.date).format('MMMM Do');

        return Mandrill.messages.sendTemplate({
          template_name: 'tutor-proposed-lesson',
          template_content: [
            { name: 'body', content: '<h3>New Lesson Created on Tutor app!</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: `${tutor.profile.firstName} Submitted a Lesson Request`,
            to: [
              { email: student.emails[0].address, name: `${student.profile.firstName} ${student.profile.lastName}` },
            ],
            global_merge_vars: [
              { name: 'student_name', content: student.profile.firstName },
              { name: 'tutor_name', content: tutor.profile.firstName },
              { name: 'day_time', content: date },
              { name: 'chat_url', content: `https://tutorapp.com/chat/${lesson.chat_id}` },
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
