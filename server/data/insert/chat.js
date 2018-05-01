import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Chats from '/collections/chats';

Meteor.methods({
  createChat(chat, url) {
    console.log('create chat');
    check(chat, {
      student_id: String,
      tutor_id: String,
    });
    check(url, String);

    chatExists = Chats.findOne({
      student_id: chat.student_id,
      tutor_id: chat.tutor_id,
    });
    chat.createdAt = new Date();
    chat.updateAt = new Date();

    if (chatExists) {
      throw new Meteor.Error('chat exists', 'it looks like you already have a chat with this person');
    } else {
      return Chats.insert(chat, (error, response) => {
        if (error) {
          return console.log(error);
        }
      });
    }
  },
});
