import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Chats = new Mongo.Collection('chats');

Chats.allow({
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

export default Chats;
