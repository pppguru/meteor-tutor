import EventHorizon from 'meteor/patrickml:event-horizon';
import { editorStateFromRaw } from 'megadraft';

/**
 * defaultStore for newBlogPost store.
 * @type {Object}
 */
export const defaultStore = {
  activeEditor: 'publish',
  blogContent: null,
  editorProps: editorStateFromRaw(null),
  headerImage: null,
  readOnly: false,
  showPopUp: true,
  tags: [{ id: 1, text: 'Tutor App' }],
  termsAgreed: false,
  title: null,
};

/**
 * Create newBlogPost store.
 */
EventHorizon.createStore('newBlogPost', defaultStore);
