import React, { PropTypes } from 'react';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { compose } from 'react-komposer';
import codeblock from 'megadraft-codeblock-plugin';
import { MegadraftEditor, editorStateToJSON } from 'megadraft';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';

import 'megadraft/dist/css/megadraft.css';
import DEFAULT_PLUGINS from 'megadraft/lib/plugins/default.js';
import 'megadraft-codeblock-plugin/dist/css/plugin.css';

/**
 * Watches any changes inside the newBlogPost store.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */
const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('newBlogPost'));
};

const BlogPostEditor = props => <MegadraftEditor
  editorState={props.editorProps}
  onChange={
    editorProps => EventHorizon.dispatch('UPDATE_POST_OBJECT', {
      blogContent: editorStateToJSON(editorProps),
      editorProps,
    })
  }
  placeholder="Write your essay here..."
  plugins={[...DEFAULT_PLUGINS, codeblock]}
  readOnly={props.readOnly}
/>;

const BlogPostEditorComp = compose(getTrackerLoader(onPropsChange))(BlogPostEditor);

BlogPostEditor.propTypes = {
  editorProps: PropTypes.object,
  readOnly: PropTypes.bool,
};

export default BlogPostEditorComp;
