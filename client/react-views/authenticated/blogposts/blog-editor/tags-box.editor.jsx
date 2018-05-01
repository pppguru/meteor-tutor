import EventHorizon from 'meteor/patrickml:event-horizon';

import React, { PropTypes } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { compose } from 'react-komposer';
import getTrackerLoader from '/both/imports/utils/composeWithTracker';

/**
 * Watches any changes inside the newBlogPost store.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */
const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('newBlogPost'));
};

/**
 * React component to handle tag box.
 * @param   {Obejct}    tags  Array of objects for populating tags.
 * @returns {Component}       A react component to be rendered.
 */
const PostTagBoxComp = ({ tags }) =>
  <div className="tag-box-wrapper">
    <ul>
      <li>
        {'Add your tags'}
      </li>
      <li>
        {'Add tags so your post reaches more people. Add up to XX tags, seperated by commas.'}
      </li>
      <li>
        <ReactTags
          handleAddition={tag => EventHorizon.dispatch('HANDLE_ADDITION_TAG', tag)}
          handleDelete={i => EventHorizon.dispatch('HANDLE_DELETE_TAG', i)}
          tags={tags}
        />
      </li>
      <li>
        <label htmlFor="term-selected">
          <input
            id="term-selected"
            onChange={
              e => EventHorizon.dispatch('UPDATE_POST_OBJECT', { termsAgreed: e.target.value === 'on' || false })
            }
            type="checkbox"
          />
          {'My post complies with the Tutor App'}
          <a
            href="/terms-of-use"
            target="_new"
          >
            {'Terms of Use'}
          </a>
        </label>
      </li>
      <li>
        <button onClick={() => EventHorizon.dispatch('CREATE_UNPUBLISHED_POST')}>
          {'Publish'}
        </button>
      </li>
    </ul>
  </div>

;

const PostTagBox = compose(getTrackerLoader(onPropsChange))(PostTagBoxComp);

PostTagBoxComp.propTypes = { tags: PropTypes.array };

export default PostTagBox;
