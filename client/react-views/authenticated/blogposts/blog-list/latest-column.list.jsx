import { Meteor } from 'meteor/meteor';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { Router } from 'meteor/iron:router';

import React, { Component, PropTypes } from 'react';
import { compose } from 'react-komposer';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
import queries from '/both/imports/queries/queries';

const onPropsChange = (props, onData) => {
  // TODO: Need to aggregate most views vs most recent.
  const docs = queries.fetch(['all-posts', -1, 4]);
  const { activeColumn } = EventHorizon.subscribe('listPosts');

  docs.then((data) => {
    onData(null, { activeColumn, data });
  });
};

class BlogPostLatestColumnComp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, activeColumn } = this.props;

    return (
      <section className={'latest-column-container'}>
        <div className={'latest-column-buttons'}>
          <button
            className={(activeColumn === 'popular') && 'active'}
            onClick={
              () => EventHorizon.dispatch('UPDATE_LIST_OBJECT', { activeColumn: 'popular' })
            }
          >
            {'Most Voted'}
          </button>
          <button
            className={(activeColumn === 'recent') && 'active'}
            onClick={
              () => EventHorizon.dispatch('UPDATE_LIST_OBJECT', { activeColumn: 'recent' })
            }
          >
            {'Most Recent'}
          </button>
        </div>
        <div className={'latest-column-list'}>
          {
            data && data.map((obj, key) =>
              <button
                key={key}
                onClick={() => Router.go(`/blogposts/single/${obj.slug}`)}
              >
                <ul key={key}>
                  <li>
                    <img src={obj.headerImage} />
                  </li>
                  <li>
                    <ul>
                      <li>
                        <span>
                          {
                            obj.title
                          }
                        </span>
                      </li>
                      <li>
                        <p>
                          {
                            obj.firstBlock()
                          }
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </button>
            )
          }
        </div>
      </section>
    );
  }
}

BlogPostLatestColumnComp.propTypes = { activeColumn: PropTypes.string };

const BlogPostLatestColumn = compose(getTrackerLoader(onPropsChange))(BlogPostLatestColumnComp);

export default BlogPostLatestColumn;
