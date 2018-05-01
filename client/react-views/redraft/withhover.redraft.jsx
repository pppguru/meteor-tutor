import React, { Component } from 'react';

const withHover = ComposedComponent => class extends Component {
  constructor(props) {
    super(props);
    this.state = { isHovered: false };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  handleEnter() {
    this.setState({ isHovered: true });
  }
  handleLeave() {
    this.setState({ isHovered: false });
  }

  render() {
    return (
      <ComposedComponent
        {...this.props}
        isHovered={this.state.isHovered}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      />
    );
  }
};

export default withHover;
