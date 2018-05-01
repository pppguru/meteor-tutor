import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Presences } from 'meteor/tmeasday:presence';
import { Mandrill } from 'meteor/wylio:mandrill';

import Chats from '/collections/chats';
import Messages from '/collections/messages';

Meteor.methods({
  addMessageToChat(message, url) {
    console.log('create message');
    check(message, {
      student_id: String,
      tutor_id: String,
      from_id: String,
      chat_id: String,
      message: String,
    });

    check(url, String);

    message.read = false;

    message.time = new Date();

    return Messages.insert(message, (error) => {
      if (error) {
        return console.log(error);
      } else {
        /*
        /  Send an email to a user every time they get
        /  a message. We should audit this in some way ;)
        */

        let user = Meteor.userId();
        let searchUser = message.student_id;
        let otherUser = message.tutor_id;
        if (user === message.student_id) {
          searchUser = message.tutor_id;
          otherUser = message.student_id;
        }
        user = Meteor.users.findOne({ _id: searchUser });
        otherUser = Meteor.users.findOne({ _id: otherUser });
        let sendEmail = true;
        // Check if the user is online, if they are don't send them an email
        const filter = { userId: { $exists: true } };
        Presences.find(filter, { fields: { state: true, userId: true } }).forEach(
          (presence) => {
            if (user._id === presence.userId) {
              sendEmail = false;
            }
          }
        );
        if (sendEmail === true) {
          Mandrill.messages.sendTemplate({
            template_name: 'message-notification',
            template_content: [
              { name: 'body', content: '<h3>You have a new message!</h3>' },
            ],
            message: {
              from_email: 'hello@tutorapp.com',
              from_name: 'TutorApp',
              subject: `${otherUser.profile.firstName} Messaged You`,
              to: [
                { email: user.emails[0].address, name: user.profile.firstName },
              ],
              global_merge_vars: [
                { name: 'first_name', content: user.profile.firstName },
                { name: 'other_name', content: otherUser.profile.firstName },
                { name: 'chat_url', content: `${url}/${message.chat_id}` },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
        }

        return Chats.update({ _id: message.chat_id }, {
          $set: {
            updatedAt: new Date(),
          },
        });
      }
    });
  },
});
