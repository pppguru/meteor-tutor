import React from 'react';

StudentReferralBlock = React.createClass({
  render() {
    return (
      <div className="dashboard--referrals">
        <div className="dashboard--referrals-wrapper">
          <div className="dashboard--referrals-illustration">
            <img src="https://s3.amazonaws.com/tutorappllc/tutor-referral-illustration.png" />
          </div>
          <div className="dashboard--referrals-copy">
            <h2>{this.props.data == 'terms' ? 'Tutor App needs more people like you' : 'Refer Friends' }</h2>
            <p>Give your friends $10 credit on Tutor App and gain $10 credit for yourself. Invite friends.</p>
            {this.props.data == 'terms' ? <a href="/terms-of-use">Terms of Use</a> : <a href="/referrals">Invite Friends</a>}
          </div>
        </div>
      </div>
    );
  },
});
