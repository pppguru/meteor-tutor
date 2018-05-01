import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Pages from '/collections/pages';
import Posts from '/collections/posts';

Meteor.methods({
  deleteItem(page) {
    check(page, Object);
    if (page.featuredImage) {
      Posts.remove(page._id);
    } else {
      Pages.remove(page._id);
    }
    return;
  },
});
