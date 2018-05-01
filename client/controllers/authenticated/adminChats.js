import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Chats from '/collections/chats';


Template.adminChats.helpers({
  hasChats() {
    if (this) {
      return true;
    }
    return false;
  },
  chats() {
    return Chats.find({});
  },
  userName(userId) {
    const user = Meteor.users.findOne({ _id: userId });
    return `${_.get(user, 'profile.firstName') || 'John'} ${_.get(user, 'profile.lastName') || 'Doe'}`;
  },
});
