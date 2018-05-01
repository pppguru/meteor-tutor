import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

ReferralPreview = React.createClass({
  headerCopy() {
    if (Roles.userIsInRole(this.props.user, ['tutor'])) {
      return 'You can earn $50 for referring people';
    } else {
      return 'Refer friends and earn a $10 credit for each sign up';
    }
  },
  renderMessage() {
    if (Roles.userIsInRole(this.props.user, ['tutor'])) {
      return 'Invite friends to Tutor App to earn more credit. If a student books a lesson with you through your direct link, Tutor App does not take a fee.';
    } else {
      return "We'll also give your friend a $10 credit just for registering!";
    }
  },

  render() {
    if (this.props.user) {
      return (
        <div className="dashboard--referral-card dashboard-card">
          <div className="dashboard--referral-card-wrapper">
            <h3>{this.headerCopy()}</h3>
            <div className="dashboard--referral-copy">
              <p>{this.renderMessage()}</p>
              <div className="fake--textbox">{`https://tutorapp.com/promo/${this.props.user.promoToken}`}</div>
              <div className="dashboard--referral-share">
                <a href="/referrals" className="btn btn--xlarge btn--arrow">Invite Friends</a>
                <div className="dashboard--referral-share-social">
                  <ul className="soc rrssb-buttons">
                    <li><a className="soc-twitter popup" href={`https://twitter.com/intent/tweet?text=Hey%2C%20I%20recently%20joined%20Tutor%20App%20and%20thought%20you%27d%20like%20it%20too.%20%20http%3A%2F%2Ftutorapp.com%2Fpromo%2F${this.props.user.promoToken}`} /></li>
                    <li><a className="soc-facebook popup" href={`https://www.facebook.com/sharer/sharer.php?u=http://tutorapp.com/promo/${this.props.user.promoToken}`} /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return;
    }
  },
});
