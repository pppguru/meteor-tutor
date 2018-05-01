import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/mrt:moment';
import { Template } from 'meteor/templating';

const formatLessonStatus = (status = 'pending') => {
  const map = {
    pending: { icon: 'icon_pending', text: 'Pending' },
    modified: { icon: 'icon_modified', text: 'Modified' },
    declined: { icon: 'icon_declined', text: 'Declined' },
    accepted: { icon: 'icon_accepted', text: 'Accepted' },
    student_cancelled: { icon: 'icon_declined', text: 'Cancelled' },
    tutor_cancelled: { icon: 'icon_declined', text: 'Cancelled' },
    completed: { icon: 'icon_completed', text: 'Completed' },
    unknown: { icon: 'icon_pending', text: 'Unknown' },
  };
  return map[status] || map.unknown;
};

Template.registerHelper('epochToString', timestamp => moment.unix(timestamp / 1000).format('MMMM Do, YYYY'));

Template.registerHelper('userIdentity', (userId) => {
  const getUser = Meteor.users.findOne({
    _id: userId,
  });
  if (getUser.emails) {
    return getUser.emails[0].address;
  } else {
    return getUser.profile.name;
  }
});

Template.registerHelper('loggedIn', () => {
  const user = Meteor.users.findOne({});
  if (user !== undefined) {
    return 'logged-in';
  } else {
    return;
  }
});

export default formatLessonStatus;
