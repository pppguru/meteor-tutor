import React, { PropTypes, Component } from 'react';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { compose } from 'react-komposer';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';

const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('filterPosts'));
};

class BlogContestFilterComp extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { userListFilter } = this.props;

    return (
      <section className="user-post-filter-wrapper">
        <div>
          <ul>
            <li>
              <button
                className={(userListFilter === 'blogs') && 'active'}
                onClick={
                  () => EventHorizon.dispatch('UPDATE_FILTER_OBJECT', { userListFilter: 'blogs' })
                }
              >
                {'Blogs'}
              </button>
            </li>
            <li>
              <button
                className={(userListFilter === 'contests') && 'active'}
                onClick={
                  () => EventHorizon.dispatch('UPDATE_FILTER_OBJECT', { userListFilter: 'contests' })
                }
              >
                {'Contest'}
              </button>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

const BlogContestFilter = compose(getTrackerLoader(onPropsChange))(BlogContestFilterComp);

BlogContestFilterComp.propTypes = { userListFilter: PropTypes.string };

export default BlogContestFilter;
