import EventHorizon from 'meteor/patrickml:event-horizon';

const defaultStore = { activeColumn: 'popular' };

EventHorizon.createStore('listPosts', defaultStore);
