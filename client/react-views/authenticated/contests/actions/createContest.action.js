import { Bert } from 'meteor/themeteorchef:bert';
import { call } from 'meteor/patrickml:singularity';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { Router } from 'meteor/iron:router';


import R from 'ramda';

import defaultStore from '../stores/contest.store';

EventHorizon.createAction('constestStore', 'CREATE_CONTEST', (store, data, update) => {
  call('contest/new', R.map(val => (R.is(Object, val) && val.toISOString()) || val, store))
  .then((resolve) => {
    update(defaultStore);
    Bert.alert(resolve.message, 'success', 'growl-top-right');

    return Router.go('/blogposts/list');
  })
  .catch((err) => {
    Bert.alert(err.message, 'danger', 'growl-top-right');
  });
});

EventHorizon.createAction('constestStore', 'CANCEL_CONTEST', (store, data, update) => {
  update(...defaultStore);
});
