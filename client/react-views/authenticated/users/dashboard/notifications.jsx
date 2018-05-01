import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

NotificationCard = React.createClass({
    // mixins: [ReactMeteorData],
    // getMeteorData() {
    //   const user = Meteor.user();
    //   return {
    //     user: user
    //   }
    // },
  getInitialState() {
    return {
      notifications: [],
    };
  },
  componentDidMount() {
    const notifications = [];
    if (Roles.userIsInRole(this.props.user, ['tutor'])) {
          // for welcoming notification uncomment string below
          // notifications.push(<WelcomeTutorPlaceholder/>);
      if (this.props.user.needStripeAccount === true) {
        notifications.push(<AddPaymentPlaceholder user={'tutor'} />);
      }
      if (!this.props.user.completedPhoto) {
        notifications.push(<AddPhotoPlaceholder user={'tutor'} />);
      }
      if (!this.props.user.completedAvailiability) {
        notifications.push(<AddAvailabilityPlaceholder />);
      }
      if (!this.props.user.completedSingleSubject) {
        notifications.push(<AddSingleSubjectPlaceholder />);
      }
    } else {
          // for welcoming notification uncomment string below
         // notifications.push(<WelcomeStudentPlaceholder/>);
      if (this.props.user.payment === undefined) {
        notifications.push(<AddPaymentPlaceholder user={'student'} />);
      }
      if (!this.props.user.completedPhoto) {
        notifications.push(<AddPhotoPlaceholder user={'student'} />);
      }
    }
    if (notifications.length > 0) {
      if (Roles.userIsInRole(this.props.user, ['tutor'])) {
        notifications.unshift(<div>You will not appear on search until you:</div>);
      }
    }
    this.setState({
      notifications,
    });
  },
  userType() {
    return (
            this.state.notifications.map((notif, i) => {
              return (<div key={i}>{notif}</div>);
            }
            ));
  },
  render() {
    if (this.props.user) {
      if (this.state.notifications.length > 0) {
        return (
          <div className="dashboard--notification-card dashboard-card">
            <div className="dashboard--notification-card-wrapper">
              <h2>Notifications</h2>
              <div className="dashboard--notification-items">
                {this.userType()}
              </div>
            </div>
          </div>
            );
      } else {
        return (<div />);
      }
    } else {
      return;
    }
  },
});
WelcomeTutorPlaceholder = React.createClass({
  render() {
    return (
      <div className="icon-item">
        <div className="icon-item-icon">
          <svg viewBox="0 0 32 32">
            <path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM22.003 19.602l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855s-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398z" />
          </svg>
        </div>
        <div className="icon-item-copy">
          <h4>Welcome to Tutor App!</h4>
          <p>You can only propose a lesson with a student once they have messaged you. Just use the lesson proposal form in the <a href="/inbox">message thread</a></p>
        </div>
      </div>
        );
  },
});
WelcomeStudentPlaceholder = React.createClass({
  render() {
    return (
      <div className="icon-item">
        <div className="icon-item-icon">
          <svg viewBox="0 0 32 32">
            <path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM22.003 19.602l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855s-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398z" />
          </svg>
        </div>
        <div className="icon-item-copy">
          <h4>Welcome to Tutor App!</h4>
          <p>Please browse <a href="/tutors">tutor profiles</a>, <a href="/inbox">message a tutor</a>, and the
          </p>
        </div>
      </div>
            );
  },
}
);


AddPhotoPlaceholder = React.createClass(
  {
    render() {
      return (
        <a href="/settings">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg viewBox="0 0 32 32">
                <path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM22.003 19.602l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855s-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398z" />
              </svg>
            </div>
            <div className="icon-item-copy">
              <h4>Add a photo</h4>
              <p>{this.props.user === 'tutor' ? 'It will make your profile look more attractive' : 'So your tutor can identify you'}</p>
            </div>
          </div>
        </a>
            );
    },
  }
);
AddAvailabilityPlaceholder = React.createClass(
  {
    render() {
      return (
        <a href="/settings">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg viewBox="0 0 32 32">
                <path
                  d="M10 12h4v4h-4zM16 12h4v4h-4zM22 12h4v4h-4zM4 24h4v4h-4zM10 24h4v4h-4zM16 24h4v4h-4zM10 18h4v4h-4zM16 18h4v4h-4zM22 18h4v4h-4zM4 18h4v4h-4zM26 0v2h-4v-2h-14v2h-4v-2h-4v32h30v-32h-4zM28 30h-26v-22h26v22z"
                />
              </svg>
            </div>
            <div className="icon-item-copy">
              <h4>Add availability to your profile</h4>
              <p>So students will know when you can meet with them</p>
            </div>
          </div>
        </a>
            );
    },
  }
);
AddSingleSubjectPlaceholder = React.createClass(
  {
    render() {
      return (
        <a href="/settings">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg viewBox="0 0 32 32">
                <path d="M7 4h-6c-0.55 0-1 0.45-1 1v22c0 0.55 0.45 1 1 1h6c0.55 0 1-0.45 1-1v-22c0-0.55-0.45-1-1-1zM6 10h-4v-2h4v2z" />
                <path d="M17 4h-6c-0.55 0-1 0.45-1 1v22c0 0.55 0.45 1 1 1h6c0.55 0 1-0.45 1-1v-22c0-0.55-0.45-1-1-1zM16 10h-4v-2h4v2z" />
                <path d="M23.909 5.546l-5.358 2.7c-0.491 0.247-0.691 0.852-0.443 1.343l8.999 17.861c0.247 0.491 0.852 0.691 1.343 0.443l5.358-2.7c0.491-0.247 0.691-0.852 0.443-1.343l-8.999-17.861c-0.247-0.491-0.852-0.691-1.343-0.443z" />
                <path d="M29 27c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z" />
              </svg>
            </div>
            <div className="icon-item-copy">
              <h4>Add subjects to your profile</h4>
              <p>So students can find you and book tutoring lessons</p>
            </div>
          </div>
        </a>
            );
    },
  }
);
AddPaymentPlaceholder = React.createClass(
  {
    render() {
      return (
        <a href="/settings/payments">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg viewBox="0 0 20.66 35.34">
                <path
                  d="M253.43-39.28h-2.58a2.42,2.42,0,0,1-2.41-2.41,2.42,2.42,0,0,1,2.41-2.41h2.58a2.42,2.42,0,0,1,2.25,1.55,1.21,1.21,0,0,0,1,.86h4.41A1.19,1.19,0,0,0,262.37-43a9,9,0,0,0-6.92-7.48v-1.82a1.32,1.32,0,0,0-1.32-1.32h-4a1.32,1.32,0,0,0-1.32,1.32v1.82a9,9,0,0,0-7,8.8,9,9,0,0,0,9,9h2.58a2.42,2.42,0,0,1,2.41,2.41,2.42,2.42,0,0,1-2.41,2.41h-2.58a2.42,2.42,0,0,1-2.25-1.55,1.21,1.21,0,0,0-1-.86h-4.41a1.19,1.19,0,0,0-1.23,1.32,9,9,0,0,0,6.92,7.48v1.82a1.32,1.32,0,0,0,1.32,1.32h4a1.32,1.32,0,0,0,1.32-1.32v-1.82a9,9,0,0,0,7-8.8A9,9,0,0,0,253.43-39.28Z"
                  transform="translate(-241.81 53.64)"
                />
              </svg>
            </div>
            <div className="icon-item-copy">
              <h4>{this.props.user === 'tutor' ? 'Add a bank account' : ' Add a credit card' }</h4>
              <p>{this.props.user === 'tutor' ? 'So we may pay you via direct deposit' : 'You need to add a credit card to take a session'}</p>
            </div>
          </div>
        </a>);
    },
  }
);
