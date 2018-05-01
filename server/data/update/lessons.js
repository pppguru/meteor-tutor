import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { moment } from 'meteor/mrt:moment';
import { Mandrill } from 'meteor/wylio:mandrill';

import Lessons from '/collections/lessons';

Meteor.methods({
  updateLesson(lesson, id) {
    check(lesson, {
      minutesRequested: Number,
      startTime: String,
      endTime: String,
      date: String,
      where: String,
      location: String,
    });
    check(id, String);


    lesson.date = new Date(lesson.date);
    lesson.modified = new Date();

    console.log(lesson);

    return Lessons.update({ _id: id }, {
      $set: {
        minutesRequested: lesson.minutesRequested,
        date: lesson.date,
        lastModified: lesson.modified,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        status: 'modified',
        where: lesson.where,
        location: lesson.location,
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        let lesson = Lessons.findOne({ _id: id }),
          student = Meteor.users.findOne({ _id: lesson.student_id }),
          tutor = Meteor.users.findOne({ _id: lesson.tutor_id });

        return Mandrill.messages.sendTemplate({
          template_name: 'tutor-proposed-lesson-change',
          template_content: [
            { name: 'body', content: '<h3>Tutor has changed your Lesson</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: `${tutor.profile.firstName} Submitted a Lesson Change`,
            to: [
              { email: student.emails[0].address, name: student.profile.firstName },
            ],
            global_merge_vars: [
              { name: 'student_name', content: student.profile.firstName },
              { name: 'tutor_name', content: tutor.profile.firstName },
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
  declineLesson(id, chat, student_id, tutor_id) {
    check(id, String);
    check(student_id, String);
    check(tutor_id, String);
    check(chat, String);

    let student = Meteor.users.findOne({ _id: student_id }),
      tutor = Meteor.users.findOne({ _id: tutor_id }),
      lesson = Lessons.findOne({ _id: id }),
      date = moment(lesson.date).format('MMMM Do YYYY');

    return Lessons.update({ _id: id }, {
      $set: {
        status: 'declined',
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        return Mandrill.messages.sendTemplate({
          template_name: 'student-declines-lesson',
          template_content: [
            { name: 'body', content: '<h3>Student has declined your Lesson</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: `${student.profile.firstName} Declined Lesson Request`,
            to: [
              { email: tutor.emails[0].address, name: tutor.profile.firstName },
            ],
            global_merge_vars: [
              { name: 'student_name', content: student.profile.firstName },
              { name: 'tutor_name', content: tutor.profile.firstName },
              { name: 'day_time', content: date },
              { name: 'chat_url', content: `https://tutorapp.com/chat/${chat}` },
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
  acceptLesson(id, chat, student_id, tutor_id) {
    check(id, String);
    check(student_id, String);
    check(tutor_id, String);
    check(chat, String);

    let student = Meteor.users.findOne({ _id: student_id }),
      lesson = Lessons.findOne({ _id: id }),
      tutor = Meteor.users.findOne({ _id: tutor_id });
    date = moment(lesson.date).format('MMMM Do YYYY');

    return Lessons.update({ _id: id }, {
      $set: {
        status: 'accepted',
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        const trimStudent = student.profile.firstName;
        const trimTutor = tutor.profile.firstName;
        return Mandrill.messages.sendTemplate({
          template_name: 'student-accepts-proposed-lesson',
          template_content: [
            { name: 'body', content: '<h3>Student has accepted your Lesson</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: `Yippee! ${student.profile.firstName} Confirmed Your Lesson`,
            to: [
              { email: tutor.emails[0].address, name: tutor.profile.firstName },
            ],
            global_merge_vars: [
              { name: 'student_name', content: trimStudent.trim() },
              { name: 'tutor_name', content: trimTutor.trim() },
              { name: 'chat_url', content: `https://tutorapp.com/chat/${lesson.chat_id}` },
              { name: 'day_time', content: date },
            ],
          },
        }, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            const trimStudent = student.profile.firstName;
            const trimTutor = tutor.profile.firstName;
            return Mandrill.messages.sendTemplate({
              template_name: 'lesson-confirmed-student',
              template_content: [
                { name: 'body', content: '<h3>You have accepted a Lesson</h3>' },
              ],
              message: {
                from_email: 'hello@tutorapp.com',
                from_name: 'Tutor App',
                subject: `Yippee! ${tutor.profile.firstName} Confirmed Your Lesson`,
                to: [
                  { email: student.emails[0].address, name: student.profile.firstName },
                ],
                global_merge_vars: [
                  { name: 'student_name', content: trimStudent.trim() },
                  { name: 'tutor_name', content: trimTutor.trim() },
                  { name: 'chat_url', content: `https://tutorapp.com/chat/${lesson.chat_id}` },
                  { name: 'day_time', content: date },
                ],
              },
            }, (error, response) => {
              if (error) {
                console.log(error);
              } else {
                console.log(response);
              }
            });
            console.log(response);
          }
        });
      }
    });
  },
  tutorCompleteLesson(notes, id) {
    check(id, String);
    check(notes, String);

    let lesson = Lessons.findOne({ _id: id }),
      student = Meteor.users.findOne({ _id: lesson.student_id }),
      tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    date = moment(lesson.date).format('MMMM Do YYYY');

    return Lessons.update({ _id: id }, {
      $set: {
        status: 'completed',
        tutorPaid: false,
        payment: 'unresolved',
        completedAt: new Date(),
        notes,
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        // Update tutors and students in terms of hours learned and taught
        Meteor.users.update(student, {
          $inc: { learnedMinutes: lesson.minutesRequested },
          $push: { hasHadSession: tutor._id },
        });

        Meteor.users.update(tutor, {
          $inc: { minutesTaught: lesson.minutesRequested },
          $push: { studentsTaught: student._id },
        });


        return Mandrill.messages.sendTemplate({
          template_name: 'notes-about-lesson',
          template_content: [
            { name: 'body', content: '<h3>Student has accepted your Lesson</h3>' },
          ],
          message: {
            from_email: 'hello@tutorapp.com',
            from_name: 'Tutor App',
            subject: `${tutor.profile.firstName}'s Notes about Your Lesson`,
            to: [
              { email: student.emails[0].address, name: student.profile.firstName },
            ],
            global_merge_vars: [
              { name: 'student_name', content: student.profile.firstName },
              { name: 'tutor_name', content: tutor.profile.firstName },
              { name: 'lesson_notes', content: notes },
              { name: 'day_time', content: date },
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
  studentCancelLesson(reason, notice, id) {
    check(id, String);
    check(reason, String);
    check(notice, Boolean);

    let lesson = Lessons.findOne({ _id: id }),
      student = Meteor.users.findOne({ _id: lesson.student_id }),
      tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    date = moment(lesson.date).format('MMMM Do YYYY');

    return Lessons.update({ _id: id }, {
      $set: {
        status: 'student_cancelled',
        autoBillable: notice,
        tutorPaid: false,
        payment: 'unresolved',
        completedAt: new Date(),
        reason,
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        if (notice === false) {
          Mandrill.messages.sendTemplate({
            template_name: 'student-cancelled-lesson-with-tutor',
            template_content: [
              { name: 'body', content: '<h3>Student has cancelled your Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `Uh-oh, ${student.profile.firstName} Cancelled Your Lesson`,
              to: [
                { email: tutor.emails[0].address, name: tutor.profile.firstName },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'chat_url', content: `https://tutorapp.com/chat/${lesson.chat_id}` },
                { name: 'day_time', content: date },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
        } else {
          Mandrill.messages.sendTemplate({
            template_name: 'lesson-cancelled-by-student-in-24-hours',
            template_content: [
              { name: 'body', content: '<h3>Student has cancelled your Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `Uh-oh, ${student.profile.firstName} Cancelled Your Lesson`,
              to: [
                { email: tutor.emails[0].address, name: tutor.profile.firstName },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'day_time', content: date },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });


          Mandrill.messages.sendTemplate({
            template_name: 'student-cancels-within-24-hours',
            template_content: [
              { name: 'body', content: '<h3>Tutor has cancelled a Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `${student.profile.firstName} Cancelled a Lesson with ${tutor.profile.firstName}`,
              to: [
                { email: 'hello@tutorapp.com', name: 'Tutor App' },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'day_time', content: date },
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
      }
    });
  },
  tutorCancelLesson(reason, notice, pending, id) {
    check(id, String);
    check(reason, String);
    check(notice, Boolean);
    check(pending, Boolean);

    let lesson = Lessons.findOne({ _id: id }),
      student = Meteor.users.findOne({ _id: lesson.student_id }),
      tutor = Meteor.users.findOne({ _id: lesson.tutor_id });
    date = moment(lesson.date).format('MMMM Do YYYY');

    return Lessons.update({ _id: id }, {
      $set: {
        status: 'tutor_cancelled',
        within24hours: notice,
        completedAt: new Date(),
        reason,
      },
    }, (error, response) => {
      if (error) {
        return console.log(error);
      } else {
        if (notice === false || pending === true) {
          Mandrill.messages.sendTemplate({
            template_name: 'lesson-cancelled-by-tutor-in-24-hours',
            template_content: [
              { name: 'body', content: '<h3>Tutor has cancelled your Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `Uh-oh, ${tutor.profile.firstName} Cancelled Your Lesson`,
              to: [
                { email: student.emails[0].address, name: student.profile.firstName },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'chat_url', content: `https://tutorapp.com/chat/${lesson.chat_id}` },
                { name: 'day_time', content: date },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });

          Mandrill.messages.sendTemplate({
            template_name: 'tutor-cancels-within-24-hours',
            template_content: [
              { name: 'body', content: '<h3>Tutor has cancelled a Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: 'Tutor Cancelled Lesson',
              to: [
                { email: 'hello@tutorapp.com', name: 'Tutor App' },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'day_time', content: date },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
        } else {
          Mandrill.messages.sendTemplate({
            template_name: 'lesson-cancelled-by-tutor-in-24-hours',
            template_content: [
              { name: 'body', content: '<h3>Tutor has cancelled your Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `Uh-oh, ${tutor.profile.firstName} Cancelled Your Lesson`,
              to: [
                { email: student.emails[0].address, name: student.profile.firstName },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'day_time', content: date },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
          Mandrill.messages.sendTemplate({
            template_name: 'tutor-cancels',
            template_content: [
              { name: 'body', content: '<h3>Tutor has cancelled a Lesson</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'Tutor App',
              subject: `${tutor.profile.firstName} has Cancelled a Lesson`,
              to: [
                { email: 'hello@tutorapp.com', name: 'Tutor App' },
              ],
              global_merge_vars: [
                { name: 'student_name', content: student.profile.firstName },
                { name: 'tutor_name', content: tutor.profile.firstName },
                { name: 'day_time', content: date },
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
      }
    });
  },
});
