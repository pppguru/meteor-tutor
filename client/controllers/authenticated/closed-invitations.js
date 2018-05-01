import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Tutors from '/collections/tutors';

Template.closedInvitations.helpers({
  hasInvites() {
    const getInvites = Tutors.find({
      invited: true,
    }, {
      fields: {
        _id: 1,
        invited: 1,
      },
    }).fetch();
    if (getInvites.length > 0) {
      return true;
    }
    return false;
  },
  invites() {
    return Tutors.find({
      invited: true,
    }, {
      sort: {
        dateInvited: -1,
      },
    }, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "email": 1,
        "token": 1,
        "dateInvited": 1,
        "invited": 1,
        "accountCreated": 1,
        "promoToken": 1
      }
    });
  },
});
