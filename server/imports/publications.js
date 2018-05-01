import { Meteor } from 'meteor/meteor';
import queries from '/both/imports/queries/queries';

Meteor.publish('query-class', function (query, ...args) {
  return queries[query](this.userId, ...args).cursor();
});
