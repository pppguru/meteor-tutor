import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

ReferralInvites = React.createClass({

  getInitialState() {
    return {
      updating: false,
    };
  },
  componentDidMount() {
    const promo = this.props.user.promoToken;
    const user = `${this.props.user.profile.firstName} ${this.props.user.profile.lastName}`;
    const self = this;
    return $('#emailInvite').validate({
      rules: {
        emails: {
          required: true,
        },
      },
      submitHandler() {
        let emails = document.querySelector('.emails').value,
          emailSpace = emails.replace(/\s/g, ''),
          emailArray = emailSpace.split(',');

        return emailArray.map((email) => {
          return Meteor.call('referralEmail', email, user, promo, (error, response) => {
            if (error) {
              return console.log(error);
            } else {
              self.setState({
                updating: true,
              });
              setTimeout(() => {
                self.setState({
                  updating: false,
                });
              }, 5000);
              console.log(`Email sent to ${email}!`);
              document.querySelector('.emails').value = '';
            }
          });
        });
      },
    });
  },
  getTutorStatus() {
    if (Roles.userIsInRole(Meteor.userId(), ['tutor'])) {
      return true;
    }
    return false;
  },
  emailInvite(e) {
    e.preventDefault();
  },
  render() {
    const tutor = this.getTutorStatus();
    return (
      <div className="dashboard--referrals-links">
        {this.state.updating ? <Notification type="success" message="Thanks for inviting Friends to Tutor App!" /> : ''}
        <div className="dashboard--referrals-links-block">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.63 35.53"><title>icon_envelope</title><path d="M324.76,1268.43a8.15,8.15,0,0,0,2.43-.36,12.56,12.56,0,0,0,2.22-.92,17.24,17.24,0,0,0,2.06-1.29c0.66-.48,1.31-1,1.94-1.49q2.89-2.31,5.83-4.52l5.92-4.43,0.48-.36a3.54,3.54,0,0,0,.48-0.41v20.94a2.58,2.58,0,0,1-.77,1.87,2.54,2.54,0,0,1-1.87.79H306.13a2.69,2.69,0,0,1-2.66-2.66v-20.94a3.52,3.52,0,0,0,.48.41l0.47,0.36,5.92,4.43q2.94,2.21,5.83,4.52,0.91,0.72,1.9,1.45a19.21,19.21,0,0,0,2.06,1.32,11.4,11.4,0,0,0,2.24.95A8,8,0,0,0,324.76,1268.43Zm0-5.29a3.62,3.62,0,0,1-1.55-.4,11.9,11.9,0,0,1-1.63-1q-0.8-.56-1.56-1.19c-0.51-.42-1-0.76-1.34-1l-5.54-4.21-5.59-4.23a13.26,13.26,0,0,1-1.24-1.12,12.16,12.16,0,0,1-1.32-1.56,12,12,0,0,1-1-1.74,3.66,3.66,0,0,1-.43-1.59,2.13,2.13,0,0,1,.84-1.66,2.72,2.72,0,0,1,1.78-.7h37.33a2.69,2.69,0,0,1,1.77.7,2.13,2.13,0,0,1,.82,1.66,3.67,3.67,0,0,1-.43,1.59,12,12,0,0,1-1,1.74,12.55,12.55,0,0,1-1.32,1.56,13.49,13.49,0,0,1-1.24,1.12q-2.84,2.12-5.59,4.22l-5.54,4.22c-0.39.28-.83,0.62-1.33,1s-1,.82-1.56,1.19a12.07,12.07,0,0,1-1.64,1,3.57,3.57,0,0,1-1.53.4h-0.09Z" transform="translate(-303.48 -1242.71)" /></svg>
            </div>
            <div className="icon-item-copy">
              <h3>Invite by Email</h3>
            </div>
          </div>
          <form className="forms" id="emailInvite" onSubmit={this.emailInvite}>
            <label>Friends' Email
              <input className="emails" refs="emails" placeholder="To enter multiple emails, please separate each email by a comma" /></label>
            <button type="submit" className="btn btn--arrow btn--xlarge">Send Invites</button>
          </form>
        </div>
        <div className="dashboard--referrals-links-block-wrapper">
          <div className="dashboard--referrals-links-block">
            <div className="icon-item">
              <div className="icon-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.12 37.15"><title>connect_icon</title><path d="M305.41,675.36a9.65,9.65,0,0,1,.79-3.87,10.17,10.17,0,0,1,2.14-3.19,10,10,0,0,1,3.16-2.15,9.65,9.65,0,0,1,3.9-.79,10,10,0,0,1,3.86.77,9.82,9.82,0,0,1,3.23,2.14l0.5,0.47,0.6,0.58a4.12,4.12,0,0,1,.5.59,1,1,0,0,1,.21.58,1,1,0,0,1-.28.72,1,1,0,0,1-.58.28c-0.72.16-1.41,0.33-2,.53a19.8,19.8,0,0,0-2,.73,0.53,0.53,0,0,1-.37.09,1,1,0,0,1-.59-0.25c-0.21-.16-0.45-0.33-0.72-0.5a7.29,7.29,0,0,0-1-.5,3.39,3.39,0,0,0-1.34-.24,3.91,3.91,0,0,0-1.55.31,3.79,3.79,0,0,0-1.26.86,4.3,4.3,0,0,0-.84,1.25,3.86,3.86,0,0,0-.31,1.57,3.71,3.71,0,0,0,.41,1.75,7.51,7.51,0,0,0,1,1.47,13.66,13.66,0,0,0,1.31,1.31c0.48,0.42.92,0.83,1.33,1.23l4.18,4.13a3.27,3.27,0,0,0,1.27.86,4.34,4.34,0,0,0,1.55.28,3.53,3.53,0,0,0,1.7-.37,2.56,2.56,0,0,1,1.07-.37,1.9,1.9,0,0,1,.91.5q0.63,0.5,1.29,1.14a12.4,12.4,0,0,1,1.16,1.28,1.89,1.89,0,0,1,.5,1,1.44,1.44,0,0,1-.83,1.19,10.12,10.12,0,0,1-1.93.9,15.57,15.57,0,0,1-2.19.6,8.79,8.79,0,0,1-1.67.22,9.74,9.74,0,0,1-3.82-.77,10.65,10.65,0,0,1-3.27-2.14l-7-7.09a9.44,9.44,0,0,1-2.19-3.24A10.11,10.11,0,0,1,305.41,675.36Zm20,0a10,10,0,0,1,3.86.77,9.76,9.76,0,0,1,3.23,2.14l7,7.09a9.47,9.47,0,0,1,2.19,3.24,10.15,10.15,0,0,1,.77,3.87,9.75,9.75,0,0,1-.78,3.89,10.09,10.09,0,0,1-5.33,5.31,9.84,9.84,0,0,1-7.73,0,10.4,10.4,0,0,1-3.24-2.16c-0.12-.12-0.29-0.27-0.5-0.46a6.23,6.23,0,0,1-.59-0.58,7.47,7.47,0,0,1-.5-0.62,1,1,0,0,1-.22-0.6,0.78,0.78,0,0,1,.3-0.65,1,1,0,0,1,.56-0.28c0.72-.15,1.41-0.33,2-0.52a14.58,14.58,0,0,0,2-.78,1.52,1.52,0,0,1,.39-0.09,1,1,0,0,1,.59.25,8.69,8.69,0,0,0,.71.5,6.74,6.74,0,0,0,1,.5,3.39,3.39,0,0,0,1.35.24,3.9,3.9,0,0,0,3.95-3.95,4,4,0,0,0-.39-1.77,6,6,0,0,0-1-1.47c-0.42-.44-0.85-0.87-1.31-1.29s-0.89-.83-1.31-1.23l-4.13-4.18a4.18,4.18,0,0,0-2.86-1.16,3.22,3.22,0,0,0-1.69.41,2.33,2.33,0,0,1-1.08.4,1.82,1.82,0,0,1-.89-0.5q-0.62-.5-1.28-1.14a11.24,11.24,0,0,1-1.16-1.3,2,2,0,0,1-.5-1,1.43,1.43,0,0,1,.83-1.19,9.81,9.81,0,0,1,1.91-.9,15.85,15.85,0,0,1,2.19-.6A8.8,8.8,0,0,1,325.45,675.4Z" transform="translate(-305.41 -665.36)" /></svg>
              </div>
              <div className="icon-item-copy">
                <h3>Referral Link</h3>
              </div>
            </div>
            <div className="fake--textbox">{`https://tutorapp.com/promo/${this.props.user.promoToken}`}</div>
          </div>
          <div className="dashboard--referrals-links-block">
            <div className="icon-item">
              <div className="icon-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.3 34"><path d="M405,2201.23a6.33,6.33,0,0,0-3.5,1.05l-9.74-5.34,9.73-5.34a6.35,6.35,0,1,0-2.86-5.3s0,0.07,0,.1l-9.66,5.3a6.36,6.36,0,1,0,0,10.49l9.66,5.3s0,0.07,0,.1A6.36,6.36,0,1,0,405,2201.23Z" transform="translate(-379.02 -2179.94)" /></svg>
              </div>
              <div className="icon-item-copy">
                <h3>Social Share</h3>
              </div>
            </div>
            <ul className="rrssb-buttons share--links">
              <li className="rrssb-facebook">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=http://tutorapp.com/promo/${this.props.user.promoToken}`} className="popup btn btn--xlarge btn--arrow">Facebook</a>
              </li>
              <li className="rrssb-twitter">
                {tutor ?
                  <a href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20Tutor%20App%2C%20a%20market%20place%20to%20hire%20qualified%20tutors%20instantly.%20Follow%20this%20link%20to%20join%20Tutor%20App%20and%20you%20get%20%2410%20to%20learn%20with%20a%20tutor!%20http%3A%2F%2Ftutorapp.com%2Fpromo%2F${this.props.user.promoToken}`} className="popup btn btn--xlarge btn--arrow">Twitter</a>
                :
                  <a href={`https://twitter.com/intent/tweet?text=Hey%2C%20I%20recently%20joined%20Tutor%20App%20and%20thought%20you%27d%20like%20it%20too.%20Use%20my%20link%20to%20sign%20up%20and%20get%20%2410%20credit.%20%20http%3A%2F%2Ftutorapp.com%2Fpromo%2F${this.props.user.promoToken}`} className="popup btn btn--xlarge btn--arrow">Twitter</a> }
              </li>
              <li className="rrssb-linkedin">
                <a href={`http://www.linkedin.com/shareArticle?mini=true&url=http://tutorapp.com/promo/${this.props.user.promoToken}&title=Tutor%20App%20Tutor%20Application&summary=Here%27s%20my%20profile%20on%20Tutor%20App.%20Tutor%20App%20allows%20me%20to%20book%20lessons%20with%20students%20online%20or%20in-person!`} className="popup btn btn--xlarge btn--arrow">Linkedin</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
});
