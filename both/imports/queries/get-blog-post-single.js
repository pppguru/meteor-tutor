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
  'tags',
  'tutorid',
  'tutorName',
  'status',
];

export default {

  /**
   * Returns a single document from 'blogposts'.
   * @param  {String}   userId The current value of user id.
   * @param  {String}   slug   The current slug value to find where document exists.
   * @return {Singularity}     Returns Singularity object.
   */
  callback: (userId, slug) => {
    check(userId, String);
    check(slug, String);
    const query = TUTORAPP.Collections.BlogPosts()
      .select(fields)
      .where('slug', '=', slug);

    if (checkAuth(userId, ['tutor', 'student'])) {
      return query.where('status', '=', 'approved');
    } else if (checkAuth(userId)) {
      return query;
    }

    return emptyQuery;
  },
  name: 'single-posts',
};
