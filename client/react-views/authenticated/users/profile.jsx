import { Meteor } from 'meteor/meteor';
import { TUTORAPP } from '/both/imports/app';
import { Template } from 'meteor/templating';

import React, { PropTypes } from 'react';
import { compose } from 'react-komposer';
import getTrackerLoader from '/both/imports/utils/composeWithTracker';

import queries from '/both/imports/queries/queries';
import BlogPostList from '../blogposts/blog-list/body.list';


const onPropsChange = (props, onData) => {
  const docs = queries.fetch(['all-posts', -1, 50]);
  docs.then((data) => {
    const user = TUTORAPP.Collections.Users().cursor().fetch();
    onData(null, { data, user });
  });
};

const ProfileComp = ({ docs, user: [user] }) => {
  return (
    <div className="tutor">
      <UserNavigation />
      <TutorHeader backend="true" user={user} />
      <TutorSchedule backend="true" scheduling={user.scheduling} />
      <TutorProfileEducation backend="true" education={user.education} />
      <TutorProfileSubjects backend="true" subjects={user.specialities} />
      <TutorProfileReviews backend="true" reviews={user.reviews} />
      {
          docs && docs.map((obj, key) =>
            <BlogPostList
              key={key}
              props={obj}
            />
          )
      }
    </div>
  );
};

const Profile = compose(getTrackerLoader(onPropsChange))(ProfileComp);

ProfileComp.propTypes = {
  docs: PropTypes.array,
  user: PropTypes.array,
};

Template.userProfile.helpers({
  Profile() {
    return Profile;
  },
});
