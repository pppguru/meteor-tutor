import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Lessons = new Mongo.Collection('lessons');

Lessons.allow({
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

export default Lessons;
