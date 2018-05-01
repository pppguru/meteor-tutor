import EventHorizon from 'meteor/patrickml:event-horizon';

EventHorizon.createAction('listPosts', 'UPDATE_LIST_OBJECT', (store, data, update) => {
  update({ ...store, ...data });
});
