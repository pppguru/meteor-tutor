import { Bert } from 'meteor/themeteorchef:bert';
import EventHorizon from 'meteor/patrickml:event-horizon';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
import fileUploadPromise from '../../../../helpers/fileuploadPromise.helper';

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
 * BlogPostHeaderEditor React Component to handle header editing.
 */
class BlogPostHeaderEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Watches changes of title input and updates the dispatches the value.
   * @returns {Function}  Dispatches 'UPDATE_POST_OBJECT' function.
   */
  handleChange() {
    EventHorizon.dispatch('UPDATE_POST_OBJECT', { title: this.title.value });
  }

  handleClick() {
    this.uploader.click();
  }

  /**
   * Handles file change and dispatches value to store.
   * @param   {Object}    event       Event object of file when changed.
   * @returns {Function}              Dispatches 'UPDATE_POST_OBJECT' function.
   */
  handleFile(event) {
    fileUploadPromise(event)
      .then(
        (response) => {
          EventHorizon.dispatch('UPDATE_POST_OBJECT', { headerImage: response.data });
          Bert.alert(response.message, 'success', 'growl-top-right');
        },
        (reject) => {
          Bert.alert(reject.message, 'danger', 'growl-top-right');
        },
    );
  }
  render() {
    return (
      <div>
        <textarea
          className={`${this.props.headerImage && 'with-header-img'} blog-post-header-title`}
          disabled={this.props.readOnly}
          maxLength="25"
          onChange={this.handleChange}
          placeholder={this.props.title || 'Add your title here...'}
          ref={event => this.title = event}
          type="text"
        />
        {
          !this.props.readOnly &&
            <div
              className="file-upload-container"
              onClick={this.handleClick}
            >
              <div
                className="ion-images"
              >
                <input
                  id="blog-post-header-image-uploader"
                  onChange={this.handleFile}
                  ref={event => this.uploader = event}
                  type="file"
                />
              </div>
              <label htmlFor="photo-title">
                {'Add a cover photo'}
              </label>
            </div>
        }
      </div>
    );
  }
}

const BlogPostHeaderEditorComp = compose(getTrackerLoader(onPropsChange))(BlogPostHeaderEditor);

BlogPostHeaderEditor.propTypes = {
  headerImage: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default BlogPostHeaderEditorComp;
