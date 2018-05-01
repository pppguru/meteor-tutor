import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Pages = new Mongo.Collection('pages');

Pages.allow({
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

export default Pages;
