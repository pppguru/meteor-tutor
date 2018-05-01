import React from 'react';

Notification = React.createClass({
  render() {
    return (
      <div className={`notification-popup ${this.props.type}`}>{this.props.message}</div>
    );
  },
});
