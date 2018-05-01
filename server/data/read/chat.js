import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  fetchUserAvatar(id) {
    console.log('create chat');
    check(id, String);

    userExists = Meteor.users.findOne({
      _id: id,
    });

    if (userExists) {
      const userTemplate = `<div class="avatar"> <img src="${userExists.profile.avatar}"></div>`
        + `<div class="username">${userExists.profile.firstName} ${userExists.profile.lastName}</div>`;
      return userTemplate;
    }
  },
  chatUser(id) {
    check(id, String);
    const user = Meteor.users.findOne({ _id: id });
    const name = `${user.profile.firstName} ${user.profile.lastName}`;
    return name;
  },
});
