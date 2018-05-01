import EventHorizon from 'meteor/patrickml:event-horizon';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';
import getTrackerLoader from '/both/imports/utils/composeWithTracker';

import PostTagBox from './tags-box.editor';

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
 * BlogPostEditorNavigationComp is a stateless component rended in the editor layout.
 * @param   {Object}     props  Props for component.
 * @returns {Component}         A react component.
 */
const BlogPostEditorNavigationComp = props =>
  <div className="blogpost-navigation-wrapper">
    <ul>
      <li>
        <button
          onClick={
            () => EventHorizon.dispatch('UPDATE_POST_OBJECT', { activeEditor: 'sfl' })
          }
          className={props.activeEditor === 'sfl' && 'active'}
        >
          Save For Later
        </button>
      </li>
      <li>
        <button
          className={props.activeEditor === 'preview' && 'active'}
          onClick={
            () => EventHorizon.dispatch('UPDATE_POST_OBJECT', {
              readOnly: !props.readOnly,
              activeEditor: 'preview',
            })
          }
        >
          {
            props.readOnly ? 'Edit' : 'Preview'
          }
        </button>
      </li>
      <li className="tag-box-link">
        <button
          className={props.activeEditor === 'publish' && 'active'}
          onClick={
            () => EventHorizon.dispatch('UPDATE_POST_OBJECT', {
              readOnly: !props.readOnly,
              activeEditor: 'publish',
            })
        }
        >
          Publish
        </button>
        <PostTagBox />
      </li>
    </ul>
  </div>

;

BlogPostEditorNavigationComp.propTypes = {
  activeEditor: PropTypes.string,
  readOnly: PropTypes.bool,
};

const BlogPostEditorNavigation = compose(getTrackerLoader(onPropsChange))(BlogPostEditorNavigationComp);

export default BlogPostEditorNavigation;
