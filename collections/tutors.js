import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Tutors = new Meteor.Collection('tutors');

Tutors.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});

export default Tutors;
