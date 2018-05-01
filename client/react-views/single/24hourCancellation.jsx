import { Template } from 'meteor/templating';

Cancellation24Hour = React.createClass({
  renderPage() {
    return (
      <div>
        <SingleNavigation />
        {this.renderCancellation()}
      </div>
        );
  },
  renderCancellation() {
    return (
      <div className="terms-and-conditions cancellation single ">
        <p>
                    If you cancel a lesson with less than 24 hours notice, you will be charged for one hour at your
                    tutor’s hourly rate. We understand that sometimes last minute cancellations are unavoidable.
        </p>
        <p> Contact us if something comes up. :)</p>
      </div>
        );
  },
  render() {
    return this.renderPage();
  },
});

Template.cancellation.helpers({
  Cancellation24Hour() {
    return Cancellation24Hour;
  },
});
