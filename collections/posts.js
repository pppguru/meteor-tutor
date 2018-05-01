import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Posts = new Mongo.Collection('posts');

Posts.allow({
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

export default Posts;
