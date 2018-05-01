import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveMethod } from 'meteor/simple:reactive-method';

Template.inbox.helpers({
  hasChats() {
    if (this) {
      return true;
    }
    return false;
  },
  chats() {
    return this;
  },
  userName(userId) {
    return ReactiveMethod.call('chatUser', userId);
  },
});
