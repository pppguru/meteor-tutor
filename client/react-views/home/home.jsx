import { Template } from 'meteor/templating';

import React from 'react';

Home = React.createClass({
  render() {
    return (
      <div className="home">
        <HomeComponent />
      </div>
    );
  },
});

Template.home.helpers({
  Home() {
    return Home;
  },
});
