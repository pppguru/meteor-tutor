import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import $ from 'jquery';

Template.newPage.events({
  'submit form': function (event) {
    event.preventDefault();
  },
});


const fileUpload = function () {
  return console.log('file Upload');
};

Template.newPage.rendered = function () {
  $('textarea').redactor({
    // focus: false,
    // toolbar: true,
    // s3: fileUpload(),
    // dragImageUpload: true,
    // imageLink: false,
    // buttons: ['formatting', 'bold', 'italic', 'link', 'image', 'files']
  });
};
