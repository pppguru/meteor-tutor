import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Template } from 'meteor/templating';

import React from 'react';
import algoliasearchHelper from 'algoliasearch-helper';
import algoliasearch from 'algoliasearch';

const INDEX_NAME = 'tutorTesting_verifications';

const PARAMS = {
  hitsPerPage: 100,
  facets: [
    'meetingPreference',
    'rate',
    'completedPhoto',
    'completedSingleSubject',
    'completedAvailiability',
  ],
};

const { searchOnlyKey, applicationId } = Meteor.settings.public.algolia;

const client = algoliasearch(applicationId, searchOnlyKey);

const getHelper = () => algoliasearchHelper(client, INDEX_NAME, PARAMS);

// Replace this with partial of ramda pick when we have npm
const pickIds = xs => xs.map(({ id }) => ({ id }));

TutorVerification = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      searchValue: null,
      tutors: [],
      hits: 0,
    };
  },
  componentDidMount() {
    const algoliaHelper = getHelper();

    algoliaHelper
      .addNumericRefinement('meetingPreference', '<=', 2)
      .search();

    algoliaHelper.on('result', this.processResults);
  },
  getMeteorData() {
    return {
      user: Meteor.user(),
    };
  },
  processResults({ nbHits, hits }) {
    this.setState({
      hits: nbHits,
      tutors: [
        ...this.state.tutors || [],
        ...pickIds(hits),
      ],
    });
  },
  searchTutors(e) {
    e.preventDefault();
    this.setState({ tutors: [] });

    const algoliaHelper = getHelper();

    algoliaHelper.addNumericRefinement('meetingPreference', '<=', 2)
      .setQuery(this.search.value)
      .search();

    algoliaHelper.on('result', processResults);
  },
  renderTutors() {
    return this.state.tutors.map((tutor, i) => (
      <TutorSingleVerification key={i} tutorId={tutor.id} />
    ));
  },
  render() {
    return (
      <div className="dashboard">
        <AdminTutorNavigation />
        <form onSubmit={this.searchTutors}>
          <input type="text" ref={c => this.search = c} className="search--input" placeholder="Search" />
        </form>
        <div className="dashboard--cards">
          <div className="dashboard--cards-admin">
            <div className="dashboard--cards-tutors">
              <div className="dashboard--tutors-header">
                <div className="dashboard--tutors-header-wrapper">
                  <h4>Tutor Name</h4>
                  <h4>Date Modified</h4>
                  <h4>Location</h4>
                  <h4>Documents</h4>
                </div>
              </div>
              {this.renderTutors()}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TutorSingleVerification = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      tutor: Meteor.users.findOne({
        _id: this.props.tutorId,
      }),
    };
  },
  pending() {
    const text = this.data.tutor.pendingVerification === true
      ? 'Pending'
      : 'None';

    return (<h4>{text}</h4>);
  },
  renderContent() {
    return (
      <div className="dashboard--tutors-single">
        <div className="dashboard--tutors-single-wrapper">
          <h4><a href={`/admin/tutors/${this.data.tutor._id}`}>{this.data.tutor.profile.firstName} {this.data.tutor.profile.lastName}</a></h4>
          <h4>{moment(this.data.tutor.dateUpdated).format('MM/DD')}</h4>
          <h4>{this.data.tutor.address.city}, {this.data.tutor.address.state}</h4>
          {this.pending()}

        </div>
      </div>
    );
  },
  render() {
    return this.data.tutor !== undefined
      ? this.renderContent()
      : (<div />);
  },
});

Template.adminTutors.helpers({
  TutorVerification() {
    return TutorVerification;
  },
});
