import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import slugify from 'slugify';

import { TUTORAPP } from '/both/imports/app';
import BlogPost from '/both/imports/models/blogpost';
import checkAuth from '/both/imports/utils/check-auth';
import validateSchema from '/both/imports/utils/validateSchema.util';

Meteor.methods({
  'blogpost/new': function ({ ...values }) {
    const blogpost = TUTORAPP.Collections.BlogPosts();
    const { title, headerImage, blogContent, tags, termsAgreed } = values;
    const dateNow = new Date();

    if (!checkAuth(this.userId, ['tutor'])) {
      throw new Error('You are not authenticated to submit this post.');
    }
    const fullName = () => TUTORAPP.Collections.Users().where('_id', '=', this.userId).firstSync().name();

    const data = {
      dateCreated: dateNow,
      dateEdited: dateNow,
      description: blogContent,
      headerImage,
      slug: `${slugify(title).toLowerCase()}`,
      status: 'pending',
      tags,
      termsAgreed,
      title,
      tutorid: this.userId,
      tutorName: fullName(),
    };

    validateSchema(new BlogPost().schema(), data);

    return blogpost.create(data).then(res => ({
      message: 'Blog post was successfully created.',
      res,
      success: true,
    }));
  },
});
