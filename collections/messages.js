import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Messages = new Mongo.Collection('messages');

Messages.allow({
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

export default Messages;
