import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Categories = new Mongo.Collection('categories');

Categories.allow({
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

export default Categories;
