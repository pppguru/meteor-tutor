import { Meteor } from 'meteor/meteor';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';

import queries from '/both/imports/queries/queries';
import getTrackerLoader from '/both/imports/utils/composeWithTracker';

/**
 * Watches any changes inside from 'all-posts' subscription.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */
const onPropsChange = (props, onData) => {
  const docs = queries.fetch(['all-posts', -1, 3]);

  docs.then((data) => {
    onData(null, { data });
  });
};

/**
 * BlogList stateless component to be rendered.
 * @param   {Object}     data Data for stateless rendered component.
 * @returns {Component}       Stateless component to be rendered.
 */
const BlogList = ({ data }) =>
  <div
    className="dashboard--blog-posts dashboard-card"
  >
    <div className="dashboard--activity-card-wrapper">
      <div className="dashboard--activity-header">
        <h2>
          {'Recent Posts'}
        </h2>
        <a
          href="/blogposts/list"
        >
          {'View All'}
        </a>
      </div>
      <div className="dashboard--activity-preview">
        <div className="dashboard--activity-item">
          {
            data && data.map((obj, key) => {
              const divStyle = { backgroundImage: `url("${obj.headerImage || ''}")` };

              return (
                <div
                  key={key}
                  onClick={() => Router.go(`/blogposts/single/${obj.slug}`)}
                >
                  <ul>
                    <li id="first-card-list">
                      <span
                        id="thumbnail-circle"
                        style={divStyle}
                      />
                    </li>
                    <li id="second-card-list">
                      <ul>
                        <li>
                          <h3>
                            {obj.title}
                          </h3>
                        </li>
                        <li>
                          <p>
                            {obj.firstBlock()}
                          </p>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              );
            })
          }
        </div>
      </div>
      <a
        className="btn btn--xlarge btn--arrow"
        href="/blogpost-create"
      >
        {'Create Post'}
      </a>
    </div>
  </div>

;

BlogList.propTypes = { data: PropTypes.array };

const BlogListCard = compose(getTrackerLoader(onPropsChange))(BlogList);

export default BlogListCard;
