import React from 'react';

TutorReferralBlock = React.createClass({
  render() {
    return (
      <div className="dashboard--referrals">
        <div className="dashboard--referrals-wrapper">
          <div className="dashboard--referrals-copy">
            <h2>Refer friends and earn $50</h2>
            <p>Get paid $50 for every friend you refer to Tutor App who learns or teaches for 10 hours.</p>
          </div>
          <div className="dashboard--referrals-illustration">
            <img src="https://s3.amazonaws.com/tutorappllc/tutor-referral-illustration.png" />
          </div>
        </div>
        <div className="dashboard--referrals-wrapper">
          {this.props.data == 'terms' ? <a href="/terms-of-use">Terms of Use</a> : <a href="/referrals">Invite People</a>}
        </div>
      </div>
    );
  },
});
