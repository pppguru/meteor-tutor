import { moment } from 'meteor/mrt:moment';
import EventHorizon from 'meteor/patrickml:event-horizon';

const defaultStore = {
  beginSubmissionPhase: moment(),
  beginVotingPhase: moment(),
  endSubmissionPhase: moment(),
  endVotingPhase: moment(),
};

EventHorizon.createStore('constestStore', defaultStore);

export default defaultStore;
