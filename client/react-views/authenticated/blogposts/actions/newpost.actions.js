import { Bert } from 'meteor/themeteorchef:bert';
import EventHorizon from 'meteor/patrickml:event-horizon';
import { Router } from 'meteor/iron:router';
import { call } from 'meteor/patrickml:singularity';

import R from 'ramda';
import { editorStateFromRaw } from 'megadraft';

import { defaultStore } from '../stores/newpost.store';

/**
 * Updates the newBlogPost store with old and new data.
 */
EventHorizon.createAction('newBlogPost', 'UPDATE_POST_OBJECT', (store, data, update) => {
  store.showPopUp = false;
  update({ ...store, ...data });
});

/**
 * Creates a new blog post and reroutes the page to 'blogposts/list'.
 */
EventHorizon.createAction('newBlogPost', 'CREATE_UNPUBLISHED_POST', (store, data, update) => {
  call('blogpost/new', store).then(
    (resolve) => {
      update(defaultStore);
      Bert.alert(resolve.message, 'success', 'growl-top-right');

      return Router.go('/dashboard');
    },
    (reject) => {
      Bert.alert(reject.message, 'danger', 'growl-top-right');
    }
  );
});

/**
 * Resets newBlogPost store to deault values.
 */
EventHorizon.createAction('newBlogPost', 'RESET_NEWBLOG_POST', (store, data, update) => {
  update(defaultStore);
});

/**
 * Updates the newBlogPost store with old and new data.
 */
EventHorizon.createAction('newBlogPost', 'FROM_EXISTING_POST', (store, data, update) => {
  const newData = {
    ...data,
    ...{
      blogContent: data.description,
      editorProps: editorStateFromRaw(JSON.parse(data.description)),
    },
  };

  update(newData);
});
