import { Meteor } from 'meteor/meteor';
import { AlgoliaSearch } from 'meteor/acemtp:algolia';
import { Mandrill } from 'meteor/wylio:mandrill';
import { moment } from 'meteor/mrt:moment';
import { Presences } from 'meteor/tmeasday:presence';
import { Roles } from 'meteor/alanning:roles';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import Lessons from '/collections/lessons';

// optionally set the collection's name that synced cron will use

const checkTutorCompleted = function () {
  const hoursNotice = (dateCheck) => {
    const date = moment();
    const previous = moment(dateCheck);
    const timeDifference = date.diff(previous, 'hours');
    const d = moment.duration(timeDifference);
    // var s = d.format("hh:mm:ss");
    // console.log(d);
    return timeDifference;
  };

  const users = Meteor.users.find({
    $and: [
      { 'cronEmails.incompleted': false },
      { $or: [
        { completedPhoto: { $eq: false } },
        { completedSingleSubject: { $eq: false } },
        { completedAvailiability: { $eq: false } },
      ] },
    ],
  });

  users.forEach((user) => {
    const time = hoursNotice(user.createdAt);
    console.log('time', user._id, time);


    if (time >= 72 && user.cronEmails.incompleted === false) {
      // Send the How to start a Session Email and update the meteor user

      Mandrill.messages.sendTemplate({
        template_name: 'your-profile-is-incomplete',
        template_content: [
          { name: 'body', content: '<h3>Your profile is incomplete on Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'Your Profile is Incomplete',
          to: [
            { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'first_name', content: user.profile.firstName },
          ],
        },
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });

      Meteor.users.update({ _id: user._id }, { $set: {
        'cronEmails.incompleted': true,
      },
      });
    }
  });
};


const userLastLogin = function () {
  console.log('hey');

  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setHours(0, 0, 0);
  console.log(d);
  const users = Meteor.users.find({
    $and: [
      { lastActive: { $lt: d } },
      { 'cronEmails.login': { $eq: false } },
    ],
  });

  users.forEach((user) => {
    console.log(user.emails[0], user.lastActive);
    Mandrill.messages.sendTemplate({
      template_name: 'login-reminder',
      template_content: [
        { name: 'body', content: '<h3>Complete your profile on Tutor App</h3>' },
      ],
      message: {
        from_email: 'hello@tutorapp.com',
        from_name: 'Tutor App',
        subject: `${user.profile.firstName}, We Miss You`,
        to: [
          { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
        ],
        global_merge_vars: [
          { name: 'first_name', content: user.profile.firstName },
        ],
      },
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });

    Meteor.users.update({ _id: user._id }, { $set: {
      'cronEmails.login': true,
    },
    });
  });
};

const checkTutorEmails = function () {
  /*
  /  Let's loop through the users that have false values for any of their emails
  */

  const hoursNotice = (dateCheck) => {
    const date = moment();
    const previous = moment(dateCheck);
    const timeDifference = date.diff(previous, 'hours');
    const d = moment.duration(timeDifference);
    // var s = d.format("hh:mm:ss");
    // console.log(d);
    return timeDifference;
  };

  const users = Meteor.users.find({
    $or: [
      { 'cronEmails.complete': { $eq: false } },
      { 'cronEmails.referral': { $eq: false } },
      { 'cronEmails.session': { $eq: false } },
    ],
  });

  users.forEach((user) => {
    const time = hoursNotice(user.createdAt);
    console.log('time', user._id, time);


    if (time >= 24 && user.cronEmails.complete === false) {
      // Send the Tutor Complete Profile Email and update the meteor user

      Mandrill.messages.sendTemplate({
        template_name: 'complete-your-profile',
        template_content: [
          { name: 'body', content: '<h3>Complete your profile on Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'Complete Your Profile',
          to: [
            { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'tutor_name', content: user.profile.firstName },
          ],
        },
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });

      Meteor.users.update({ _id: user._id }, { $set: {
        'cronEmails.complete': true,
      },
      });
    }

    if (time >= 36 && user.cronEmails.referral === false) {
      // Send the Tutor Referral Email and update the meteor user

      Mandrill.messages.sendTemplate({
        template_name: 'tutor-referral',
        template_content: [
          { name: 'body', content: '<h3>Refer your friends to Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'Invite Your Friends to Join Tutor App!',
          to: [
            { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'first_name', content: user.profile.firstName },
            { name: 'referral_url', content: 'https://tutorapp.com/referrals/' },
          ],
        },
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });

      Meteor.users.update({ _id: user._id }, { $set: {
        'cronEmails.referral': true,
      },
      });
    }

    if (time >= 72 && user.cronEmails.session === false) {
      // Send the How to start a Session Email and update the meteor user

      Mandrill.messages.sendTemplate({
        template_name: 'how-to-start-a-session',
        template_content: [
          { name: 'body', content: '<h3>Start a session with Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'How to Submit a Lesson Request',
          to: [
            { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'tutor_name', content: user.profile.firstName },
          ],
        },
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });

      Meteor.users.update({ _id: user._id }, { $set: {
        'cronEmails.session': true,
      },
      });
    }
  });
};


const TellAlgoliaWhosOnline = () => {
  const INDEX_NAME = 'tutorTesting';
  const PARAMS = { hitsPerPage: 60, facets: ['meetingPreference', 'rate', 'completedPhoto', 'completedSingleSubject', 'completedAvailiability'] };
  const client = AlgoliaSearch(Meteor.settings.algolia.applicationId, Meteor.settings.algolia.api_key);
  const index = client.initIndex(Meteor.settings.algolia.tutorIndex);
  const filter = { userId: { $exists: true } };
  const online = Presences.find(filter, { fields: { state: true, userId: true } });


  index.search(1, {
    restrictSearchableAttributes: 'online',
  }, Meteor.bindEnvironment((err, content) => {
    if (err) {
      console.log(err);
    } else {
      let i;

        // Set all online status to false
      for (i = 0; i < content.hits.length; ++i) {
        const hit = content.hits[i];
        index.partialUpdateObject({
          objectID: hit.objectID,
          online: 0,
        });
      }
        // loop through people actually online
      online.forEach((user) => {
        if (Roles.userIsInRole(user.userId, ['tutor'])) {
          index.partialUpdateObject({
            objectID: user.userId,
            online: 1,
          });
        }
      });
    }
  }));
};

SyncedCron.add({
  name: 'Handle Tutor Emails after Sign Up',
  schedule(parse) {
    return parse.text('every 2 hours');
  },
  job(intendedAt) {
    checkTutorEmails();
  },
});

SyncedCron.add({
  name: 'Handle Last Login',
  schedule(parse) {
    return parse.text('every 10 hours');
  },
  job(intendedAt) {
    userLastLogin();
  },
});

SyncedCron.add({
  name: 'Handle Tutor Completed email after Sign Up',
  schedule(parse) {
    return parse.text('every 2 hours');
  },
  job(intendedAt) {
    checkTutorCompleted();
  },
});

SyncedCron.start();
