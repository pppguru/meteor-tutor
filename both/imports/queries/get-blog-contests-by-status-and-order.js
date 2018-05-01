import { Meteor } from 'meteor/meteor';
import { TUTORAPP } from '/both/imports/app';
import { check } from 'meteor/check';

import checkAuth from '/both/imports/utils/check-auth';
import emptyQuery from './emptyquery';

const fields = [
  '_id',
  'title',
  'image',
  'prompt',
  'beginSubmissionPhase',
  'endSubmissionPhase',
  'beginVotingPhase',
  'endVotingPhase',
  'reward',
  'status'
];

export default {

  /**
   * Returns all posts found in 'contests' collection.
   * @param  {String} userId      The current user id.
   * @param  {String} status      The status to filter on [inactive, active].
   * @param  {Number} [sortBy=-1] Sort by value, defaults to -1 => DESC or 1 => ASC.
   * @param  {Number} [limit=50]  Limit by value, defaults to 50.
   * @return {Singularity}        Singularity object.
   */
  callback: (userId, status = 'inactive', sortBy = -1, limit = 50) => {
    check(userId, String);
    check(sortBy, Number);
    check(limit, Number);

    const query = TUTORAPP.Collections.Contests()
      .select(fields)
      .where('status', '=', status)
      .sortBy('dateCreated', sortBy)
      .limit(limit);

    if (checkAuth(userId, ['tutor', 'student'])) {
      return query.where('published', '=', true);
    } else if (checkAuth(userId)) {
      return query;
    }

    return emptyQuery;
  },
  name: 'get-blog-contests-by-status-and-order',
};
