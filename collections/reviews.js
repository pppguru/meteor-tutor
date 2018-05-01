import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Reviews = new Mongo.Collection('reviews');

Reviews.allow({
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

export default Reviews;
