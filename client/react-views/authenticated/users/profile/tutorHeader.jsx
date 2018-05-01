import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import React from 'react';

import Chats from '/collections/chats';
import { getUserNameById } from '/client/helpers/helpers-global';

const uniq = xs => Array.from(new Set(xs));

TutorHeader = React.createClass({
  componentDidMount() {
    L.mapbox.accessToken = Meteor.settings.public.mapboxToken;
    const map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false,
    })
      .setView([this.props.user.geoLocation.latitude, this.props.user.geoLocation.longitude], 14);

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();
  },
  renderAbout() {
    if (this.props.user.profile.biography) {
      return { __html: `<h4>About</h4>${this.props.user.profile.biography}` };
    }
  },
  studentsTaught() {
    const { studentsTaught } = this.props.user;

    return studentsTaught && studentsTaught.length > 0 ? (
      <div className="dashboard--tutor-card-stat">
        <h3>{uniq(studentsTaught).length}</h3>
        <p>Students Taught</p>
      </div>
    ) : null;
  },
  minutesTaught() {
    return this.props.user.minutesTaught ? (
      <div className="dashboard--tutor-card-stat">
        <h3>{this.props.user.minutesTaught}</h3>
        <p>Minutes Taught</p>
      </div>
    ) : null;
  },
  buttonActions() {
    const userId = Meteor.userId();

    return this.props.user._id === userId
      ? (<a href="/settings" className="btn btn--large">Edit Profile</a>)
      : (<StudentButtonBlock tutor={this.props.user} />);
  },
  tutorStatus() {
    const filter = { userId: this.props.user._id };
    const status = Presences.findOne(filter, { fields: { state: true, userId: true } });

    return status
      ? (<i className="online--status green" />)
      : (<i className="online--status red" />);
  },
  tutorBack() {
    return Session.get('latLang') !== undefined;
  },
  render() {
    const backgroundImage = {
      backgroundImage: `url(${this.props.user.profile.avatar})`,
    };
    return (
      <div className="tutor--header">
        <div className="tutor--header-wrapper">
          {this.tutorBack() ?
            <div className="tutor--header-back"><a href="/tutors">Back to search results</a></div>
          : ''}
          <div id="map" className="tutor--map" />
          <div className="tutor--information">
            <div className="tutor--profile-photo" style={backgroundImage}>
              <img src={this.props.user.profile.avatar} />
            </div>
            <div className="tutor--profile-name">
              <h1>{getUserNameById(this.props.user._id)}</h1>
              <h5>{`${this.props.user.address.city}, ${this.props.user.rate}`}/hr</h5>
              {this.tutorStatus()}
            </div>
          </div>
        </div>
        <div className="tutor--header-extended">
          <div dangerouslySetInnerHTML={this.renderAbout()} />
          <div style={{ paddingBottom: 50 }} className="dashboard--tutor-card-stats">
            {this.studentsTaught()}
            {this.minutesTaught()}
          </div>
        </div>
        <div className="tutor--buttons">
          {this.buttonActions()}
        </div>
      </div>
    );
  },
});

StudentButtonBlock = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      student,
    };
  },
  getLoginStatus() {
    if (!this.data.user && !this.data.userLogginIn) { return false; }
    if (this.data.user) { return true; }
    return false;
  },
  getStudentStatus() {
    if (this.data.student) { return true; }
    return false;
  },
  messageTutor(e) {
    e.preventDefault();
    url = `${window.location.origin}/chat`;
    let userId = Meteor.userId(),
      self = this,
      user = Meteor.user(),
      tutor = this.props.tutor._id,
      chat = {
        student_id: userId,
        tutor_id: tutor,
      };

    const chatExists = Chats.findOne({ tutor_id: tutor, student_id: userId });
    console.log('chat exist', chatExists);
    if (chatExists) {
      const chatObject = {
        slug: self.props.tutor.slug,
        id: chatExists._id,
      };
      Router.go('chat', chatObject);
    } else {
      return Meteor.call('createChat', chat, url, (error, response) => {
        if (error) {
          return alert(error.reason);
        } else {
          const chat = Chats.findOne({ tutor_id: tutor, student_id: userId });
          const chatObject = {
            slug: $('.tutor-listing .messages').data('slug'),
            id: chat._id,
          };
          Router.go('chat', chatObject);
        }
      });
    }
  },
  render() {
    let loginStatus = this.getLoginStatus(),
      studentStatus = this.getStudentStatus(),
      email = `mailto:?subject=Hey%20take%20a%20look%20at%20this%20tutor%20onTutor%20App%20profile%20http%3A%2F%2Ftutorapp.com%2Ftutor%2F${this.props.tutor.meta.state}%2F${this.props.tutor.meta.city}%2F${this.props.tutor.slug}`,
      facebook = `https://www.facebook.com/sharer/sharer.php?u=http://tutorapp.com/tutor/${this.props.tutor.meta.state}/${this.props.tutor.meta.city}/${this.props.tutor.slug}`,
      linkedin = `http://www.linkedin.com/shareArticle?mini=true&amp;url=http://tutorapp.com/tutor/${this.props.tutor.meta.state}/${this.props.tutor.meta.city}/${this.props.tutor.slug}&amp;title=${this.props.tutor.profile.firstName}%20Tutor%20App%20Profile&amp;summary=Check%20out%20my%20Tutor%20%20profile%20on%20Tutor%20App`,
      twitter = `https://twitter.com/intent/tweet?text=Hey%20check%20out%20my%20Tutor%20App%20profile%20http%3A%2F%2Ftutorapp.com%2Ftutor%2F${this.props.tutor.meta.state}%2F${this.props.tutor.meta.city}%2F${this.props.tutor.slug}`,
      google = `https://plus.google.com/share?url=Hey%20check%20out%20my%20Tutor%20App%20profile%20http%3A%2F%2Ftutorapp.com%2Ftutor%2F${this.props.tutor.meta.state}%2F${this.props.tutor.meta.city}%2F${this.props.tutor.slug}`;

    return (
      <div className="tutor--butons-student">
        {loginStatus ?
          <div className="tutor--buttons-student-auth">
            {studentStatus ? <a href="" className="btn btn--large" onClick={this.messageTutor}>Message Tutor</a> : '' }
          </div>
          : <a href="/login" className="btn btn--large">Login to Message Tutor</a>
        }
        <div className="tutor--buttons-social">
          <ul className="rrssb-buttons share--links">
            <li className="rrssb-email">
              <a href={email}>
                <span className="rrssb-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M20.11 26.147c-2.335 1.05-4.36 1.4-7.124 1.4C6.524 27.548.84 22.916.84 15.284.84 7.343 6.602.45 15.4.45c6.854 0 11.8 4.7 11.8 11.252 0 5.684-3.193 9.265-7.398 9.3-1.83 0-3.153-.934-3.347-2.997h-.077c-1.208 1.986-2.96 2.997-5.023 2.997-2.532 0-4.36-1.868-4.36-5.062 0-4.75 3.503-9.07 9.11-9.07 1.713 0 3.7.4 4.6.972l-1.17 7.203c-.387 2.298-.115 3.3 1 3.4 1.674 0 3.774-2.102 3.774-6.58 0-5.06-3.27-8.994-9.304-8.994C9.05 2.87 3.83 7.545 3.83 14.97c0 6.5 4.2 10.2 10 10.202 1.987 0 4.09-.43 5.647-1.245l.634 2.22zM16.647 10.1c-.31-.078-.7-.155-1.207-.155-2.572 0-4.596 2.53-4.596 5.53 0 1.5.7 2.4 1.9 2.4 1.44 0 2.96-1.83 3.31-4.088l.592-3.72z" /></svg>
                </span>
              </a>
            </li>
            <li className="rrssb-facebook">
              <a href={facebook} className="popup">
                <span className="rrssb-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path d="M26.4 0H2.6C1.714 0 0 1.715 0 2.6v23.8c0 .884 1.715 2.6 2.6 2.6h12.393V17.988h-3.996v-3.98h3.997v-3.062c0-3.746 2.835-5.97 6.177-5.97 1.6 0 2.444.173 2.845.226v3.792H21.18c-1.817 0-2.156.9-2.156 2.168v2.847h5.045l-.66 3.978h-4.386V29H26.4c.884 0 2.6-1.716 2.6-2.6V2.6c0-.885-1.716-2.6-2.6-2.6z" /></svg>
                </span>
              </a>
            </li>
            <li className="rrssb-linkedin">
              <a href={linkedin} className="popup">
                <span className="rrssb-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M25.424 15.887v8.447h-4.896v-7.882c0-1.98-.71-3.33-2.48-3.33-1.354 0-2.158.91-2.514 1.802-.13.315-.162.753-.162 1.194v8.216h-4.9s.067-13.35 0-14.73h4.9v2.087c-.01.017-.023.033-.033.05h.032v-.05c.65-1.002 1.812-2.435 4.414-2.435 3.222 0 5.638 2.106 5.638 6.632zM5.348 2.5c-1.676 0-2.772 1.093-2.772 2.54 0 1.42 1.066 2.538 2.717 2.546h.032c1.71 0 2.77-1.132 2.77-2.546C8.056 3.593 7.02 2.5 5.344 2.5h.005zm-2.48 21.834h4.896V9.604H2.867v14.73z" /></svg>
                </span>
              </a>
            </li>
            <li className="rrssb-twitter">
              <a href={twitter} className="popup">
                <span className="rrssb-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M24.253 8.756C24.69 17.08 18.297 24.182 9.97 24.62a15.093 15.093 0 0 1-8.86-2.32c2.702.18 5.375-.648 7.507-2.32a5.417 5.417 0 0 1-4.49-3.64c.802.13 1.62.077 2.4-.154a5.416 5.416 0 0 1-4.412-5.11 5.43 5.43 0 0 0 2.168.387A5.416 5.416 0 0 1 2.89 4.498a15.09 15.09 0 0 0 10.913 5.573 5.185 5.185 0 0 1 3.434-6.48 5.18 5.18 0 0 1 5.546 1.682 9.076 9.076 0 0 0 3.33-1.317 5.038 5.038 0 0 1-2.4 2.942 9.068 9.068 0 0 0 3.02-.85 5.05 5.05 0 0 1-2.48 2.71z" /></svg>
                </span>
              </a>
            </li>
            <li className="rrssb-googleplus">
              <a href={google} className="popup">
                <span className="rrssb-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 8.29h-1.95v2.6h-2.6v1.82h2.6v2.6H21v-2.6h2.6v-1.885H21V8.29zM7.614 10.306v2.925h3.9c-.26 1.69-1.755 2.925-3.9 2.925-2.34 0-4.29-2.016-4.29-4.354s1.885-4.353 4.29-4.353c1.104 0 2.014.326 2.794 1.105l2.08-2.08c-1.3-1.17-2.924-1.883-4.874-1.883C3.65 4.586.4 7.835.4 11.8s3.25 7.212 7.214 7.212c4.224 0 6.953-2.988 6.953-7.082 0-.52-.065-1.104-.13-1.624H7.614z" /></svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  },
});
