import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

Template.layout.helpers({
  route() {
    return Session.get('currentRoute');
  },
});
