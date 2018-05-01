import { Meteor } from 'meteor/meteor';
import { TUTORAPP } from '/both/imports/app';
import { check } from 'meteor/check';

import checkAuth from '/both/imports/utils/check-auth';
import emptyQuery from './emptyquery';

const fields = [
  '_id',
  'title',
  'headerImage',
  'description',
  'published',
  'dateCreated',
  'slug',
  'tutorid',
  'tutorName',
  'status',
];

export default {

  /**
   * Returns all posts found in 'blogposts' collection.
   * @param  {String} userId      The current user id.
   * @param  {Number} [sortBy=-1] Sort by value, defaults to -1.
   * @param  {Number} [limit=50]  Limit by value, defaults to 50.
   * @return {Singularity}        Singularity object.
   */
  callback: (userId, sortBy = -1, limit = 50) => {
    check(userId, String);
    check(sortBy, Number);
    check(limit, Number);

    const query = TUTORAPP.Collections.BlogPosts()
        .select(fields)
        .sortBy('dateCreated', sortBy)
        .limit(limit);

    if (checkAuth(userId, ['tutor', 'student'])) {
      return query.where('status', '=', 'approved');
    } else if (checkAuth(userId)) {
      return query;
    }

    return emptyQuery;
  },
  name: 'all-posts',
};
