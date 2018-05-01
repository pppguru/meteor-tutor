import { Template } from 'meteor/templating';

Header = React.createClass({
  render() {
    return (
      <div>
        <Navigation />
      </div>
    );
  },
});

Template.layout.helpers({
  Header() {
    return Header;
  },
});
