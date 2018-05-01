import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import React, { PropTypes } from 'react';

import checkAuth from '/both/imports/utils/check-auth';

/**
 * BlogPostList stateless component.
 * @param {Object} props Props used by the stateless component.
 */
const BlogPostList = ({ props }) => {
  const { title, slug, tutorName, headerImage } = props;
  const doc = props;

  return (
    <section>
      <ul>
        <li>
          <img
            className={'object-fit_cover'}
            src={headerImage}
          />
        </li>
        <li>
          <span>
            {
            `By ${tutorName} on ${doc.formattedDate()}`
            }
          </span>
        </li>
        <li>
          <span>
            {title}
          </span>
        </li>
        <li>
          <p>
            {
              doc.firstBlock()
            }
          </p>
        </li>
        <li>
          {
            checkAuth(Meteor.userId(), ['admin']) &&
            <div>
              <button
                onClick={() => Router.go(`/blogpost-edit/${slug}`)}
              >
                {'edit'}
              </button>
              <button>
                {'delete'}
              </button>
            </div>
          }
        </li>
      </ul>
    </section>
  );
};

BlogPostList.propTypes = {
  headerImage: PropTypes.string,
  props: PropTypes.object,
  slug: PropTypes.string,
  title: PropTypes.string,
  tutorid: PropTypes.string,
  tutorName: PropTypes.string,
  status: PropTypes.string,
};

export default BlogPostList;
