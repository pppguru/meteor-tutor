import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import EventHorizon from 'meteor/patrickml:event-horizon';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';
import R from 'ramda';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
import checkAuth from '/both/imports/utils/check-auth';
import queries from '/both/imports/queries/queries';
import PostFilterAdmin from '../blog-filters/admin-list.filters';
import BlogContestFilter from '../blog-filters/blog-contest-list.filters';
import PostLatestHeader from './header.list';
import BlogPostList from './body.list';
import BlogPostLatestColumn from './latest-column.list';

const queryBuilder = ({
  userListFilter,
  by: { activeIndex: { name: status } },
  and: { activeIndex: { sort } },
}) => new Array(
  ((userListFilter === 'blogs') && 'get-blog-posts-by-status-and-order') || 'get-blog-contests-by-status-and-order',
  status,
  sort
);


/**
 * Watches any changes inside from 'all-posts' subscription and the filterPosts store.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */

async function onPropsChange(props, onData) {
  const filterPostsStore = EventHorizon.subscribe('filterPosts');

  try {
    const docs = await queries.fetch(queryBuilder({ ...filterPostsStore }));

    onData(null, { docs, filterPostsStore });
  } catch (err) {
    console.log(err);
  }
}

export default class BlogPostsListLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { docs, filterPostsStore: { userListFilter } } = this.props;

    console.log(docs);

    return (
      <div className={'blogpost-list-layout--container'}>
        {
          !Router.current().url === '/blogposts/list' && <UserNavigation />
        }
        {
          checkAuth(Meteor.userId(), ['student', 'tutor', 'admin']) && <BlogContestFilter />
        }
        {
          checkAuth(Meteor.userId(), ['admin']) && <PostFilterAdmin />
        }
        {
          (docs.length > 0 && checkAuth(Meteor.userId(), ['student', 'tutor'])) && <PostLatestHeader data={docs[0]} />
        }
        {
          userListFilter === 'blogs' &&
          <div className={'blogpost-list-layout--items'}>
            {
              docs && docs.map((obj, key) =>
                (
                  key !== 2 && <BlogPostList key={key} props={obj} />
                ) || <BlogPostLatestColumn key={key} />
              )
            }
          </div>
        }
      </div>
    );
  }
}

BlogPostsListLayout.propTypes = { data: PropTypes.array };

Template.blogPostList.helpers({
  BlogPostsListLayout() {
    return compose(getTrackerLoader(onPropsChange))(BlogPostsListLayout);
  },
});
