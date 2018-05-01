import { Meteor } from 'meteor/meteor';


import { TUTORAPP } from '/both/imports/app';
import Contest from '/both/imports/models/contest';
import checkAuth from '/both/imports/utils/check-auth';
import validateSchema from '/both/imports/utils/validateSchema.util';

Meteor.methods({
  'contest/new': function ({ ...values }) {
    const contest = TUTORAPP.Collections.Contests();

    if (!checkAuth(this.userId, ['admin'])) {
      throw new Error('You are not authenticated to submit this post.');
    }
    validateSchema(new Contest().schema(), values);

    return contest.create(values).then(res => ({
      data: res,
      message: 'Contest was successfully created.',
      success: true,
    }));
  },
});
