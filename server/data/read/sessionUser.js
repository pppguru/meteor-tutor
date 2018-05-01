import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  fetchSessionUser(data, user) {
    check(data, Object);
    check(user, String);

    if (user === data.tutor_id) {
      var sessionUser = Meteor.users.findOne({ _id: data.student_id });
      if (sessionUser) {
        return sessionUser.profile.firstName;
      }
    } else {
      var sessionUser = Meteor.users.findOne({ _id: data.tutor_id });
      if (sessionUser) {
        return sessionUser.profile.firstName;
      }
    }
  },
});
