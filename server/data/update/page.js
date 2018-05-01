import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Pages from '/collections/pages';

Meteor.methods({
  updatePage(page, user, id) {
    check(page, {
      title: String,
      slug: String,
      content: Array,
      metaTitle: String,
      metaDescription: String,
    });
    check(user, Object);
    check(id, String);

    // Check if Title changes
    // checkTitle = Pages.findOne({
    //   "_id": id
    // });
    //
    // if(checkTitle.title !== page.title) {
    //
    //   // Generate a Slug
    //   var nameSlug = page.title;
    //   nameSlug = nameSlug.replace(/\s+/g, '-').toLowerCase();
    //
    //   page.slug = nameSlug;
    //
    //   var _nameUsed = true;
    //   var _nameInc = 0;
    //   while (_nameUsed == true) {
    //     checkSlug = Pages.findOne({
    //       "slug": nameSlug
    //     });
    //     if (!checkSlug) {
    //       page.slug = nameSlug;
    //       _nameUsed = false;
    //     } else {
    //       _nameInc++;
    //       var nameNum = _nameInc.toString();
    //       nameSlug += '-'+nameNum;
    //     }
    //   }
    // }
    //

    page.slug = page.slug.replace(/\s+/g, '-').toLowerCase();

    return Pages.update({ _id: id },
      {
        $set: {
          title: page.title,
          content: page.content,
          slug: page.slug,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
        },
      }, (error) => {
        if (error) {
          return console.log(error);
        }
      });
  },
});
