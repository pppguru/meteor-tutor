import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import React from 'react';
import ScrollMagic from 'scrollmagic';

HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  componentDidMount() {
    const controller = new ScrollMagic.Controller();
    const homeBlocks = document.querySelectorAll('.home--block');

    new ScrollMagic.Scene({ triggerElement: homeBlocks[1], offset: '-100%' })
      .setClassToggle(homeBlocks[1], 'visible')
      .addTo(controller);

    new ScrollMagic.Scene({ triggerElement: homeBlocks[2], offset: '-100%' })
      .setClassToggle(homeBlocks[2], 'visible')
      .addTo(controller);

    new ScrollMagic.Scene({ triggerElement: homeBlocks[3], offset: '-100%' })
      .setClassToggle(homeBlocks[3], 'visible')
      .addTo(controller);

    if (this.data.user) {
      Meteor.call('updateUserLogin', this.data.user._id);
    }
  },
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },

  searchTutors(e) {
    e.preventDefault();
    const searchValue = this.search.value;

    if (searchValue !== '') {
      Session.set('forceSearch', true);
      Session.set('searchValue', searchValue);
      Router.go('tutors', {}, { query: { subject: searchValue } });
    }
  },

  render() {
    const illustrationOne = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorthepeople/content/home_illustration_1.png)',
    };
    const illustrationTwo = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorthepeople/content/home_illustration_2.png)',
    };
    const illustrationThree = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorthepeople/content/home_illustration_3.png)',
    };
    const illustrationFour = {
      backgroundImage: 'url(https://s3.amazonaws.com/tutorthepeople/content/home_illustration_4.png)',
    };

    return (
      <section className="home--blocks">
        <div className="home--block block-one">
          <div className="home--illustration illustration-one" style={illustrationOne}>
            <img src="https://s3.amazonaws.com/tutorthepeople/content/home_illustration_1.png" />
          </div>
          <div className="home--copy">
            <h2>Learn from qualified tutors instantly</h2>
            <p>In person or online</p>
            <form className="search--home btn btn--large" onSubmit={this.searchTutors}>
              <input
                type="text"
                ref={(c) => { this.search = c; }}
                placeholder="What do you want to learn today?"
              />
              <svg viewBox="0 0 35.23 35.24">
                <path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" />
              </svg>
            </form>
          </div>
        </div>
        <div className="home--block">
          <div className="home--illustration illustration-two" style={illustrationTwo}>
            <img src="https://s3.amazonaws.com/tutorthepeople/content/home_illustration_2.png" />
          </div>
          <div className="home--copy copy-two">
            <h2>Earn extra money while giving the gift of knowledge</h2>
            <p>Set your own rate, message with students, and teach. We handle the rest.</p>
            <a href="/apply" className="btn btn--large btn--arrow">Become a Tutor</a>
          </div>
        </div>
        <div className="home--block block-three">
          <div className="home--illustration illustration-three" style={illustrationThree}>
            <img src="https://s3.amazonaws.com/tutorthepeople/content/home_illustration_3.png" />
          </div>
          <div className="home--copy copy-three">
            <h2>Better tutors equals better scores</h2>
            <p>Our proprietary interview and verification technology ensures you are learning from the best.</p>
            <a href="/tutors" className="btn btn--large btn--arrow">Browse Tutors</a>
          </div>
        </div>
        <div className="home--block block-four">
          <div className="home--illustration illustration-four" style={illustrationFour}>
            <img src="https://s3.amazonaws.com/tutorthepeople/content/home_illustration_4.png" />
          </div>
          <div className="home--copy copy-four">
            <p className="home--quote">Tutor App helped me succeed on my AP's, and now I can't wait to attend the college of my dreams.</p>
            <h4>Caroline H.</h4>
            <a href="/signup" className="btn btn--large btn--arrow">Sign Up</a>
          </div>
        </div>
      </section>
    );
  },
});
