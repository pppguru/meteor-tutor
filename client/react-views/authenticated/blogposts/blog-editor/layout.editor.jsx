import { Template } from 'meteor/templating';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { Router } from 'meteor/iron:router';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';
import R from 'ramda';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
import BlogPreview from '/client/react-views/redraft/blog.redraft';
import BlogPostEditor from './body.editor';
import BlogPostHeaderEditor from './header.editor';
import BlogPostEditorNavigation from './navigation.editor';
import PopupEditor from './popup.editor';
import queries from '/both/imports/queries/queries';

const hasSlug = R.has('slug');

/**
 * Watches any changes inside the newBlogPost store.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */
const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('newBlogPost'));
};

async function getExistingPost(props, onData) {
  try {
    const { slug } = Router.current().params;

    if (slug && slug.length > 0) {
      const doc = await queries.first(['single-posts', Router.current().params.slug]);

      EventHorizon.dispatch('FROM_EXISTING_POST', doc);
      onData(null, { isEditing: !!slug });
    }
    onData(null, EventHorizon.subscribe('newBlogPost'));
  } catch (error) {
    console.log(error);
  }
}

/**
 * Stateless component for the Blog Editor Layout.
 * @abstract
 * @param   {Object}    props Data for component to render.
 * @returns {Component}       Returns a react component.
 */
const BlogEditorLayoutComp = (props) => {
  const divStyle = {
    background: `
      ${(props.headerImage !== null) && 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)'}),
      url("${props.headerImage || ''}")
    `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <div>
      <section className="blogpost-navigation">
        <BlogPostEditorNavigation />
      </section>
      <section
        className="blogpost-header-editor"
        style={divStyle}
      >
        <BlogPostHeaderEditor />
      </section>
      <section className="blogpost-editor">
        {
          (!props.readOnly && <BlogPostEditor />) ||
            <BlogPreview raw={JSON.parse(props.blogContent)} />
        }
        {
          props.showPopUp && <PopupEditor />
        }
      </section>
    </div>
  );
};

const BlogPostEditorLayout = compose(getTrackerLoader(getExistingPost))(BlogEditorLayoutComp);

BlogEditorLayoutComp.propTypes = {
  blogContent: PropTypes.string,
  headerImage: PropTypes.string,
  readOnly: PropTypes.bool,
  showPopUp: PropTypes.bool,
};

Template.blogEditorLayout.helpers({
  BlogEditorLayout() {
    return BlogPostEditorLayout;
  },
});
