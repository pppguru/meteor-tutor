import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Pages from '/collections/pages';
import Posts from '/collections/posts';

Meteor.methods({
  createPost(post, user) {
    check(post, {
      title: String,
      categories: Array,
      slug: String,
      featuredImage: String,
      content: Array,
      excerpt: String,
      metaTitle: String,
      metaDescription: String,
    });
    check(user, Object);
    post.createdAt = new Date();


    // Generate a Slug
    let nameSlug = post.title;
    nameSlug = nameSlug.replace(/\s+/g, '-').toLowerCase();

    console.log(nameSlug);

    let _nameUsed = true;
    let _nameInc = 0;
    while (_nameUsed == true) {
      checkSlug = Pages.findOne({
        slug: nameSlug,
      });
      if (!checkSlug) {
        post.slug = nameSlug;
        _nameUsed = false;
      } else {
        _nameInc++;
        const nameNum = _nameInc.toString();
        nameSlug += `-${nameNum}`;
      }
    }

    return Posts.insert(post, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  },
});
