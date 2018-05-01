import { Model } from 'meteor/patrickml:singularity';
import { check } from 'meteor/check';

import R from 'ramda';

/**
 * contestDoc: {
 *  id: String,
 *  blogs: [String],
 *  image: String,
 *  title: String,
 *  prompt: String,
 *  beginSubmissionPhase: String,
 *  endSubmissionPhase: String,
 *  beginVotingPhase: String,
 *  endVotingPhase: String,
 *  reward: Number, // Currency
 *  status: String
 * }
 */

export default class Contest extends Model {
  constructor(doc) {
    super(doc);
    Object.assign(this, doc);

    return this;
  }

  schema() {
    return [
      {
        check: String,
        value: 'title',
      },
      {
        check: String,
        value: 'image',
      },
      {
        check: String,
        value: 'prompt',
      },
      {
        check: String,
        value: 'beginSubmissionPhase',
      },
      {
        check: String,
        value: 'endSubmissionPhase',
      },
      {
        check: String,
        value: 'beginVotingPhase',
      },
      {
        check: String,
        value: 'endVotingPhase',
      },
      {
        check: Number,
        value: 'reward',
      },
      {
        check: String,
        value: 'status'
      }
    ];
  }
}
