import EventHorizon from 'meteor/patrickml:event-horizon';

/**
 * Adds tags upon submitting a new value to newBlogPost store.
 * @type {Object}
 */
EventHorizon.createAction('newBlogPost', 'HANDLE_ADDITION_TAG', ({ tags }, data, update) => {
  const newTag = { tags: [{ id: tags.length + 1, text: data }, ...tags] };
  update(newTag);
});

/**
 * Deletes tags upon clicking specific tag, then updates key value of tags in newBlogPost store.
 * @type {Object}
 */
EventHorizon.createAction('newBlogPost', 'HANDLE_DELETE_TAG', ({ tags }, data, update) => {
  tags.splice(data, 1);
  const newTag = { tags: [...tags] };
  update(newTag);
});
