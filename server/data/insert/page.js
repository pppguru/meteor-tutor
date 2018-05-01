import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Pages from '/collections/pages';

Meteor.methods({
  createPage(page, user) {
    check(page, {
      title: String,
      slug: String,
      content: Array,
      metaTitle: String,
      metaDescription: String,
    });
    check(user, Object);
    page.createdAt = new Date();


    // Generate a Slug
    let nameSlug = page.title;
    nameSlug = nameSlug.replace(/\s+/g, '-').toLowerCase();

    console.log(nameSlug);

    let _nameUsed = true;
    let _nameInc = 0;
    while (_nameUsed == true) {
      checkSlug = Pages.findOne({
        slug: nameSlug,
      });
      if (!checkSlug) {
        page.slug = nameSlug;
        _nameUsed = false;
      } else {
        _nameInc++;
        const nameNum = _nameInc.toString();
        nameSlug += `-${nameNum}`;
      }
    }


    return Pages.insert(page, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  },
});
