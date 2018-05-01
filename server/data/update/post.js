import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Posts from '/collections/posts';

Meteor.methods({
  updatePost(post, user, id) {
    check(post, {
      title: String,
      slug: String,
      categories: Array,
      featuredImage: String,
      excerpt: String,
      content: Array,
      metaTitle: String,
      metaDescription: String,
    });
    check(user, Object);
    check(id, String);

    // Check if Title changes
    // checkTitle = Posts.findOne({
    //   "_id": id
    // });
    //
    // if(checkTitle.title !== post.title) {
    //
    //   // Generate a Slug
    //   var nameSlug = post.title;
    //   nameSlug = nameSlug.replace(/\s+/g, '-').toLowerCase();
    //
    //   post.slug = nameSlug;
    //
    //   var _nameUsed = true;
    //   var _nameInc = 0;
    //   while (_nameUsed == true) {
    //     checkSlug = Posts.findOne({
    //       "slug": nameSlug
    //     });
    //     if (!checkSlug) {
    //
    //       post.slug = nameSlug;
    //       _nameUsed = false;
    //     } else {
    //       _nameInc++;
    //       var nameNum = _nameInc.toString();
    //       nameSlug += '-'+nameNum;
    //     }
    //   }
    //   Posts.update({_id:id},
    //   {
    //     $set: {
    //       "slug": post.slug
    //     }
    //   })
    // }

    post.slug = post.slug.replace(/\s+/g, '-').toLowerCase();

    return Posts.update({ _id: id },
      {
        $set: {
          title: post.title,
          content: post.content,
          featuredImage: post.featuredImage,
          categories: post.categories,
          excerpt: post.excerpt,
          metaDescription: post.metaDescription,
          metaTitle: post.metaTitle,
        },
      }, (error) => {
        if (error) {
          return console.log(error);
        }
      });
  },
});
