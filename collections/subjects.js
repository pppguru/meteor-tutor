import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Subjects = new Mongo.Collection('subjects');

Subjects.allow({
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

// NOTE: Not sure if this one is used at all.
export default Subjects;
