import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Tutors from '/collections/tutors';

Template.openInvitations.helpers({
  hasInvites() {
    const getInvites = Tutors.find({
      invited: false,
    }, {
      fields: {
        _id: 1,
        invited: 1,
      },
    }).count();
    if (getInvites > 0) {
      return true;
    } else {
      return false;
    }
  },
  invites() {
    return Tutors.find({
      invited: false,
    }, {
      sort: {
        requested: 1,
      },
    }, {
      fields: {
        _id: 1,
        inviteNumber: 1,
        requested: 1,
        email: 1,
        invited: 1,
      },
    });
  },
});

Template.openInvitations.events({
  'click .send-invite': function () {
    const tutor = {
      id: this._id,
      email: this.email,
    };
    const url = `${window.location.origin}/authorize`;
    const confirmInvite = confirm(`Are you sure you want to invite ${this.email}?`);
    if (confirmInvite) {
      return Meteor.call('sendInvite', tutor, url, (error) => {
        if (error) {
          return console.log(error);
        } else {
          return alert(`Invite sent to ${tutor.email}!`);
        }
      });
    }
  },
});
