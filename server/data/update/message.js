import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Messages from '/collections/messages';

Meteor.methods({
  updateReadMessages(chat, user) {
    check(chat, String);
    check(user, String);

    return Messages.find({
      $and: [
        { chat_id: chat },
        { from_id: { $ne: user } },
      ],
    }).forEach((message) => {
      Messages.update({ _id: message._id }, {
        $set: {
          read: true,
        },
      });
    });
  },
});
