import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import Pages from '/collections/pages';
import {
  createRows,
  fillModules,
  serializeContent,
} from '/client/controllers/authenticated/contentBuilder';
import { addClass } from '/client/helpers/classSelection';

Template.newPage.events({
  'submit form': function (event, template) {
    event.preventDefault();
  },
});

Template.listPages.events({
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

Template.listPages.helpers({
  hasPages() {
    let getPages;
    getPages = Pages.find({}).count();
    if (getPages > 0) {
      return true;
    } else {
      return false;
    }
  },
  pages() {
    return Pages.find({}, { sort: {
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

Template.newPage.rendered = function () {
  $('body').addClass('admin');
  const slugField = document.querySelector('.js-page-slug');
  if (Session.get('currentRoute') == 'edit-page') {
    $('.type').html('Edit');
    $('input[type="submit"]').val('Update');
    $('#visit').html(`- <a href="/${this.data.slug}">Visit Page</a>`);
    // Handles the filling of existing modules into
    // the edit page, see function in contentBuilder.js
    createRows(this.data);
    fillModules(this.data);
    var ID = this.data._id;
  } else {
    addClass(slugField, 'hidden');
  }


  return $('#page-editor').validate({
    rules: {
      title: {
        required: true,
      },
    },
    messages: {
      title: {
        required: 'Please enter a title',
      },
    },
    submitHandler() {
      const user = Meteor.user();
      const page = {
        title: $('#page-editor [name="title"]').val(),
        slug: $('#page-editor [name="slug"]').val() || '',
        metaTitle: $('#page-editor [name="metaTitle"]').val() || '',
        metaDescription: $('#page-editor [name="metaDescription"]').val() || '',
      };
      // Serialize all the modular content and place it
      // into the page object that is saved to the database
      // see contentBuilder.js for the build
      page.content = serializeContent();
      if (Session.get('currentRoute') == 'new-page') {
        return Meteor.call('createPage', page, user, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
            const pageObj = {
              id: response,
            };
            Router.go('editPage', pageObj);
          }
        });
      } else {
        return Meteor.call('updatePage', page, user, ID, (error, response) => {
          if (error) {
            return alert(error.reason);
          } else {
            const pageObj = {
              id: response,
            };
            Router.go('editPage', pageObj);
          }
        });
      }
    },
  });
};
