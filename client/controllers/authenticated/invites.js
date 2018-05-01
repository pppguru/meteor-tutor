import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import $ from 'jquery';

Template.invitee.rendered = function () {
  CameraTag.setup();
};
Template.invites.events({
  'click .js-tab': function (event) {
    // toggle showing the student/tutor registration
    $('.nav-tabs li').removeClass('active');
    $('.tab-pane').removeClass('active');
    $(event.currentTarget).addClass('active');
    const toggleData = $(event.currentTarget).find('a').attr('data-toggle');
    $(`#${toggleData}`).addClass('active');
  },
});
