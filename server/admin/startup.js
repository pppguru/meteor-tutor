import { Meteor } from 'meteor/meteor';
import { Kadira } from 'meteor/meteorhacks:kadira';
import { Mandrill } from 'meteor/wylio:mandrill';
import { Random } from 'meteor/random';
import { GeoCoder } from 'meteor/aldeed:geocoder';

Meteor.startup(() => {
  /*
    Define environment variables.
   */
  let checkUser, id, sub, user, subjects, users, _i, _s, _len, _subjects, _results;
  // process.env.MAIL_URL = 'smtp://postmaster%40tutorapp.com:fece850b6e0345cb83179dd6282dc4a1@smtp.mailgun.org:587';
  process.env.MAIL_URL = `smtp://elizaTTP:${Meteor.settings.mandrill.apiKey}@smtp.mandrill.com:587`;

  Mandrill.config({
    username: Meteor.settings.mandrill.user,
    key: Meteor.settings.mandrill.apiKey,
  });

  SERVER_AUTH_TOKEN = Random.secret();

  // Initialize the geocoder
  const geo = new GeoCoder({
    httpAdapter: 'https',
  });

  Kadira.connect('JyxepvK8EvExeSHBh', '4cc52594-369c-4a73-9bab-3dccc4c1df0f');


  /*
    Generate test Accounts
    Creates a collection of test accounts automatically on startup.
   */
});
