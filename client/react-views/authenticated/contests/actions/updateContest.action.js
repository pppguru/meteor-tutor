import EventHorizon from 'meteor/patrickml:event-horizon';

EventHorizon.createAction('constestStore', 'UPDATE_CONTEST_OBJECT', (store, data, update) => {
  update({ ...store, ...data });
});
