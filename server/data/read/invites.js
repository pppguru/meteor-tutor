import { Meteor } from 'meteor/meteor';

import Tutors from '/collections/tutors';
/*
  Invites
  Collection of methods for reading documents in the Invites collection.
 */
Meteor.methods({
  countTutors() {
    return Tutors.find({}, {
      fields: {
        _id: 1,
      },
    }).count();
  },
});
