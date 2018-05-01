import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { S3 } from 'meteor/lepozepo:s3';

import Categories from '/collections/categories';
import Posts from '/collections/posts';
import { addClass } from '/client/helpers/classSelection';

import {
  createRows,
  fillModules,
  serializeContent,
} from '/client/controllers/authenticated/contentBuilder';

Template.newPost.events({
  'submit form': function (event, template) {
    event.preventDefault();
  },
  'change .file': function (e) {
    e.preventDefault();
    const image = $('.image-preview img');
    const imageField = $('.post-file');
      // var findFiles = $(e.currentTarget).parent().find("input.file");
    const files = $(e.currentTarget)[0].files;

    S3.upload({
      files,
      path: 'content',
    }, (e, r) => {
      const url = r.secure_url;
      image.attr('src', url);
      imageField.val(url);
    });
  },
});

Template.listPosts.events({
  'click .js-delete': function (event) {
    event.preventDefault();
    if (confirm('Are you sure you way to delete this item forever?')) {
      Meteor.call('deleteItem', this, (error) => {
        if (error) {
          return console.log(error);
        }
      });
    } else {
        // Do nothing!
    }
  },
});

Template.listPosts.helpers({
  hasPosts() {
    let getPosts;
    getPosts = Posts.find({}).count();

    return getPosts > 0
  },
  posts() {
    return Posts.find({}, { sort: {
      createdAt: 1,
    },
    }, {
      fields: {
        _id: 1,
        title: 1,
      },
    });
  },
});

Template.newPost.rendered = function () {
  $('body').addClass('admin');
  const slugField = document.querySelector('.js-page-slug');
  if (Session.get('currentRoute') == 'edit-post') {
    $('.type').html('Edit');
    $('input[type="submit"]').val('Update');
    $('#visit').html(`- <a href="/blog/${this.data.slug}">Visit Post</a>`);
    $('.image-preview img').attr('src', this.data.featuredImage);
    $('.post-file').val(this.data.featuredImage);
    // Handles the filling of existing modules into
    // the edit page, see function in contentBuilder.js
    createRows(this.data);
    fillModules(this.data);
    var ID = this.data._id;
  } else {
    addClass(slugField, 'hidden');
  }

  return $('#post-editor').validate({
    rules: {
      title: {
        required: true,
      },
      featuredImage: {
        required: true,
      },
      excerpt: {
        required: true,
      },
    },
    messages: {
      title: {
        required: 'Please enter a title',
      },
      featuredImage: {
        required: 'Blog posts require a featured image for headers and thumbnail creation',
      },
      excerpt: {
        required: 'Please provide a short description of the post.',
      },
    },
    submitHandler() {
      const user = Meteor.user();
      const post = {
        title: $('#post-editor [name="title"]').val(),
        slug: $('#post-editor [name="slug"]').val() || '',
        featuredImage: $('#post-editor [name="featuredImage"]').val() || '',
        excerpt: $('#post-editor [name="excerpt"]').val() || '',
        metaTitle: $('#post-editor [name="metaTitle"]').val() || '',
        metaDescription: $('#post-editor [name="metaDescription"]').val() || '',
      };
      // Serialize all the modular content and place it
      // into the post object that is saved to the database
      // see contentBuilder.js for the build
      post.content = serializeContent();
      post.categories = grabCategories();
      if (Session.get('currentRoute') == 'new-blog') {
        return Meteor.call('createPost', post, user, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
            const pageObj = {
              id: response,
            };
            Router.go('editPost', pageObj);
          }
        });
      } else {
        return Meteor.call('updatePost', post, user, ID, (error, response) => {
          if (error) {
            return alert(error.reason);
          }
        });
      }
    },
  });
};

grabCategories = function () {
  const categoryArray = [];
  $('.categories li.active').each((category) => {
    const categoryObj = $('.categories li.active')[category];
    const dataID = $(categoryObj).data('id');
    categoryArray.push(dataID);
  });
  return categoryArray;
};


Template.categories.onRendered(function () {
  console.log(this);
  if (this.data.categories !== null) {
    const categories = this.data.categories;
    categories.forEach((category, index) => {
      $('.categories li').filter(`[data-id="${category}"]`).addClass('active');
      console.log('special', category);
    });
  }
});

Template.categories.helpers({
  categories() {
    return Categories.find();
  },
});

Template.categories.events({
  'click li': function (event) {
    $(event.currentTarget).toggleClass('active');
  },
});
