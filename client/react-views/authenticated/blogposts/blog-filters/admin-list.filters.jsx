import EventHorizon from 'meteor/patrickml:event-horizon';
import { Router } from 'meteor/iron:router';

import React, { Component, PropTypes } from 'react';
import { compose } from 'react-komposer';
import R from 'ramda';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
import DropDown from '/client/react-views/global/general.dropdown';

const getCurrentTypeOptions = (type, list) => R.filter(
  R.propEq('type', type),
  list
);

/**
 * Watches any changes inside the filterPosts store.
 * @abstract
 * @param  {Object}   props  Local props returned by composeWithTracker.
 * @param  {Function} onData Parses newBlogPost store to props of Component.
 */
const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('filterPosts'));
};

/**
 * PostFilterAdmin stateless component.
 * @returns {Component} stateless component.
 */
class PostFilterAdminComp extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !R.equals(this.props, nextProps);
  }
  render() {
    const { and, by, userListFilter } = this.props;
    const options = getCurrentTypeOptions(userListFilter, by.options);

    return (
      <section className="admin-post-filters-wrapper">
        <div className="content-container">
          <div className="admin-filters-container">
            <div>{'Filter by'}</div>
            <div
              className="admin-filters-dropdown-container"
            >
              {
                <DropDown
                  {...R.omit(['options'], by)}
                  options={options}
                  handleDropDownToggle={
                    value => EventHorizon.dispatch(
                      'UPDATE_DROPDOWN_TOGGLE', {
                        selected: 'by',
                        value,
                      }
                    )
                  }
                  handleOptionClick={
                    value => EventHorizon.dispatch(
                      'UPDATE_OPTION_CLICKED', {
                        selected: 'by',
                        value,
                      }
                    )
                  }
                  index={0}
                  key={0}
                />
              }
            </div>
            <div>
              {'and'}
            </div>
            <div
              className="admin-filters-dropdown-container"
            >
              {
                <DropDown
                  {...and}
                  handleDropDownToggle={
                    value => EventHorizon.dispatch(
                      'UPDATE_DROPDOWN_TOGGLE', {
                        selected: 'by',
                        value,
                      }
                    )
                  }
                  handleOptionClick={
                    value => EventHorizon.dispatch(
                      'UPDATE_OPTION_CLICKED', {
                        selected: 'and',
                        value,
                      }
                    )
                  }
                  index={1}
                  key={1}
                />
              }
            </div>
            <div>{'.'}</div>
          </div>
          {
            userListFilter === 'contests' &&
            <div id="create-contest-container">
              <button
                onClick={() => Router.go('create-contest')}
              >
                <span>{'Create Contest'}</span>
              </button>
            </div>
          }
        </div>
      </section>
    );
  }
}

PostFilterAdminComp.propTypes = {
  and: PropTypes.object,
  by: PropTypes.object,
  userListFilter: PropTypes.string,
};
const PostFilterAdmin = compose(getTrackerLoader(onPropsChange))(PostFilterAdminComp);

export default PostFilterAdmin;
