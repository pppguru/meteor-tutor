import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Settings = new Mongo.Collection('settings');

Settings.allow({
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

export default Settings;
