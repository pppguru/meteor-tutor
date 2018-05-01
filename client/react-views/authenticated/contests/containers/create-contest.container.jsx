import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Router } from 'meteor/iron:router';
import { Template } from 'meteor/templating';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { moment } from 'meteor/mrt:moment';

import React, { PropTypes, Component } from 'react';
import DatePicker from 'react-datepicker';
import { compose } from 'react-komposer';
import R from 'ramda';

import getTrackerLoader from '/both/imports/utils/composeWithTracker';
// import checkAuth from '/both/imports/utils/check-auth';
// import queries from '/both/imports/queries/queries';
import fileUploadPromise from '../../../../helpers/fileuploadPromise.helper';

const onPropsChange = (props, onData) => {
  onData(null, EventHorizon.subscribe('constestStore'));
};

class CreateContesLayoutComp extends Component {
  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(event) {
    fileUploadPromise(event)
      .then(
        (response) => {
          EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { image: response.data });
          Bert.alert(response.message, 'success', 'growl-top-right');
        },
        (reject) => {
          Bert.alert(reject.message, 'danger', 'growl-top-right');
        },
    );
  }


  render() {
    const {
      beginSubmissionPhase,
      beginVotingPhase,
      endSubmissionPhase,
      endVotingPhase,
    } = this.props;

    return (
      <section className="create-contest-container">
        <section id="create-contest-header">
          <div>
            <ul>
              <li>
                <button
                  onClick={
                    () => EventHorizon.dispatch('CREATE_CONTEST')
                  }
                >
                  {'Create Contest'}
                </button>
              </li>
              <li>
                <button
                  onClick={
                    () => Router.go('/admin/post-lists')
                  }
                >
                  {'Cancel'}
                </button>
              </li>
            </ul>
          </div>
        </section>
        <section id="create-contest-body">
          <h3>
            {'Create Contest'}
          </h3>
          <form>
            <div className="form-group contest-image-field">
              <label htmlFor="contestImage">
                {'Image'}
              </label>
              <input
                type="file"
                id="contest-image"
                className="form-control"
                onChange={this.handleFileChange}
              />
            </div>
            <div className="form-group contest-title-field">
              <label htmlFor="contestTitle">
                {'Title'}
              </label>
              <input
                className="form-control"
                id="contest-title"
                onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { title: event.target.value })}
                type="text"
              />
            </div>
            <div className="form-group contest-prompt-field">
              <label htmlFor="contestPrompt">
                {'Prompt'}
              </label>
              <textarea
                cols="30"
                id="contest-prompt"
                onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { prompt: event.target.value })}
                rows="10"
              />
            </div>
            <div className="form-section">
              <h3>
                {'Submission Phase'}
              </h3>
              <div className="form-group">
                <label htmlFor="beginSubmissionPhase">
                  {'Beginning'}
                </label>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  dropdownMode="select"
                  name="begin-submission-phase"
                  onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { beginSubmissionPhase: event })}
                  peekNextMonth
                  selected={beginSubmissionPhase || moment()}
                  showMonthDropdown
                  showYearDropdown
                />
              </div>
              <div className="form-group">
                <label htmlFor="endingPhase">
                  {'End'}
                </label>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  dropdownMode="select"
                  name="endSubmissionPhase"
                  onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { endSubmissionPhase: event })}
                  peekNextMonth
                  selected={endSubmissionPhase || moment()}
                  showMonthDropdown
                  showYearDropdown
                />
              </div>
            </div>
            <div className="form-section">
              <h3>
                {'Voting Phase'}
              </h3>
              <div className="form-group">
                <label htmlFor="">
                  {'Beginning'}
                </label>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  dropdownMode="select"
                  name="beginVotingPhase"
                  onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { beginVotingPhase: event })}
                  peekNextMonth
                  selected={beginVotingPhase || moment()}
                  showMonthDropdown
                  showYearDropdown
                />
              </div>
              <div className="form-group">
                <label htmlFor="">
                  {'End'}
                </label>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  dropdownMode="select"
                  name="endVotingPhase"
                  onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { endVotingPhase: event })}
                  peekNextMonth
                  selected={endVotingPhase || moment()}
                  showMonthDropdown
                  showYearDropdown
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contestReward">
                {'Reward'}
              </label>
              <input
                id="contest-reward"
                max="2500"
                min="0.00"
                onChange={event => EventHorizon.dispatch('UPDATE_CONTEST_OBJECT', { reward: event.target.valueAsNumber })}
                step="0.01"
                type="number"
              />
            </div>
          </form>
        </section>
      </section>
    );
  }
}

CreateContesLayoutComp.propTypes = {
  beginSubmissionPhase: PropTypes.object,
  beginVotingPhase: PropTypes.object,
  endSubmissionPhase: PropTypes.object,
  endVotingPhase: PropTypes.object,
};

const CreateContesLayout = compose(getTrackerLoader(onPropsChange))(CreateContesLayoutComp);

Template.createContest.helpers({
  CreateContesLayout() {
    return CreateContesLayout;
  },
});
