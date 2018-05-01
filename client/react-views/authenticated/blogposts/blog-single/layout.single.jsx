import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import EventHorizon from 'meteor/patrickml:event-horizon';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';
import 'megadraft/dist/css/megadraft.css';

import BlogPreview from '/client/react-views/redraft/blog.redraft';
import queries from '/both/imports/queries/queries';
import getTrackerLoader from '/both/imports/utils/composeWithTracker';

/**
 * Watches any changes inside from 'single-posts' subscription.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */

async function onPropsChange(props, onData) {
  try {
    const doc = await queries.first(['single-posts', Router.current().params.slug]);
    const { headerImage } = doc;

    onData(null, {
      divStyle: {
        backgroundImage: `url("${headerImage || ''}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      },
      response: doc,
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * BlogPostSingleComp stateless component.
 * @param   {Object}    response    Document returned by subscription.
 * @param   {Object}    divStyle    Styled object for header section.
 * @param   {Boolean}   readOnly    Boolean value for MegadraftEditor.
 * @param   {Object}    description editorState for MegadraftEditor.
 * @returns {Component}             Stateless component to be rendered.
 */
const BlogPostSingleComp = ({ response, divStyle }) => {
  const { title, tutor, description } = response;

  return (
    <div>
      <section style={divStyle}>
        <div>
          <ul>
            <li>
              {title}
            </li>
            <li>
              {tutor && `By ${tutor.name} on ${response.formattedDate()} `}
            </li>
          </ul>
        </div>
      </section>
      <section>
        {
          <BlogPreview raw={JSON.parse(description)} />
        }
      </section>
    </div>
  );
};

BlogPostSingleComp.propTypes = {
  divStyle: PropTypes.object,
  response: PropTypes.object,
};

Template.blogPostSingle.helpers({
  BlogPostSingle() {
    return compose(getTrackerLoader(onPropsChange))(BlogPostSingleComp);
  },
});
