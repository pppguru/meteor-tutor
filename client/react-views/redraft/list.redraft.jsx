import React, { PropTypes } from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';

import './list.style.css';

const List = ({ ordered, children }) =>
  <ReactTransitionGroup
    className="List"
    component={(ordered && 'ol') || 'ul'}
    transitionEnterTimeout={1000}
    transitionLeaveTimeout={1000}
    transitionName="animatedList"
  >
    {children}
  </ReactTransitionGroup>

;

List.propTypes = {
  children: PropTypes.node.isRequired,
  ordered: PropTypes.bool,
};

export default List;
