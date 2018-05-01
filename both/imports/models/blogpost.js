import { Model } from 'meteor/patrickml:singularity';
import { moment } from 'meteor/mrt:moment';

import { Match } from 'meteor/check';

/**
 * blogpostDoc: {
 *  _id: String,
 *  blogPostThumb: String,
 *  dateCreated: Date,
 *  dateEdited: Date,
 *  description: String,
 *  published: Boolean,
 *  slug: String,
 *  title: String,
 *  status: String,
 *  tutorid: String,
 *  tutorName: String
 * }
 */

export default class BlogPost extends Model {
  constructor(doc) {
    super(doc);
    Object.assign(this, doc);

    return this;
  }

  /**
   * Returns the first block values from the description value inside the docuemnt.
   * @returns   {String} A string obtained thorught the description key.
   */
  firstBlock() {
    return JSON.parse(this.description).blocks[0].text.substring(1, 100);
  }

  /**
   * Returns a formatted string from the dateCreated key.
   * @returns {String}  A formatted date string.
   */
  formattedDate() {
    return moment(this.dateCreated).format('MMM D, YYYY');
  }

  schema() {
    return [
      {
        check: Date,
        value: 'dateCreated',
      },
      {
        check: Date,
        value: 'dateEdited',
      },
      {
        check: String,
        value: 'description',
      },
      {
        check: String,
        value: 'headerImage',
      },
      {
        check: String,
        value: 'slug',
      },
      {
        check: String,
        value: 'status',
      },
      {
        check: [Object],
        value: 'tags',
      },
      {
        check: Match.Where(termsAgreedValue => termsAgreedValue),
        value: 'termsAgreed',
      },
      {
        check: String,
        value: 'title',
      },
      {
        check: String,
        value: 'tutorid',
      },
      {
        check: String,
        value: 'tutorName',
      },

    ];
  }
}
