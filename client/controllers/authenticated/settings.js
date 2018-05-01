import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Sortable from 'sortablejs';
import $ from 'jquery';

import Pages from '/collections/pages';

const serializeNestedMenu = function (row, index) {
  if (row.nested === true) {
    const currentRow = $('.menu-list > li')[index];
    const nested = $(currentRow).find('.submenu li');

    $(nested).each((index, nest) => {
      let newSubMenu;
      newSubMenu = {
        title: $(nest).data('title'),
        slug: $(nest).data('slug'),
      };
      row.nestedMenu.push(newSubMenu);
    });

    return row;
  }
};

const serializeMenu = function () {
  const menuObject = [];
  $('.menu-list > li').each((index, elm) => {
    let nested = false;
    const linkObject = {};
    if ($(elm).find('.submenu').length) {
      nested = true;
    }
    newLink = {
      nested,
      title: $(elm).data('title'),
      slug: $(elm).data('slug'),
      nestedMenu: [],
    };
    menuObject.splice(index, 0, newLink);
  });
  menuObject.forEach((row, index) => {
    serializeNestedMenu(row, index);
  });
  return menuObject;
};

const fillMenu = function (data) {
  rows = data;
  const menu = $('#menu-list');
  console.log('data', data);
  data.forEach((row, index) => {
    var menuRow = '';

    var menuRow = `<li class="inner-menu" data-slug="${row.slug}" data-title="${row.title}"><i class="fa fa-bars menu-sort"></i> ${row.title}`;
    menuRow += '<i class="fa fa-times destroy"></i><i class="fa fa-plus add-submenu"></i>';
    if (row.nested === true) {
      const nested = row.nestedMenu;
      menuRow += '<ul class="submenu" id="submenu">';
      nested.forEach((row, index) => {
        menuRow += `<li class="inner-menu" data-slug="${row.slug}" data-title="${row.title}"><i class="fa fa-bars menu-sort"></i> ${row.title}`;
        menuRow += '<i class="fa fa-times destroy"></i><i class="fa fa-plus add-submenu"></i>';
      });
      menuRow += '</ul>';
    }
    menuRow += '</li>';
    $(menu).append(menuRow);
    setTimeout(() => {
      if (row.nested === true) {
        const menu = $('.menu-list > li')[index];
        const nest = $(menu).find('.submenu');
        Sortable.create(nest[0], {
          group: {
            name: 'menu-list',
          },

          handle: '.menu-sort',
          onAdd(e) {
            const itemEl = e.item;
            if (!$(itemEl).hasClass('inner-menu')) {
              $(itemEl).prepend('<i class="fa fa-bars menu-sort"></i>');
              $(itemEl).prepend('<i class="fa fa-times destroy"></i>');
              $(itemEl).addClass('inner-menu');
              $(itemEl).append('<i class="fa fa-plus add-submenu"></i>');
            }
          },
        });
      }
    }, 400);
  });
};

Template.menuManager.rendered = function () {
  console.log('emoji');
  const pageList = document.getElementById('sortable-pages');
  const list = document.getElementById('menu-list');
  Sortable.create(list, {
    group: {
      name: 'menu-list',
      // pull: false
    },
    handle: '.menu-sort',
    onAdd(e) {
      const itemEl = e.item;
      if (!$(itemEl).hasClass('inner-menu')) {
        $(itemEl).prepend('<i class="fa fa-bars menu-sort"></i>');
        $(itemEl).prepend('<i class="fa fa-times destroy"></i>');
        $(itemEl).addClass('inner-menu');
        $(itemEl).append('<i class="fa fa-plus add-submenu"></i>');
      }
    },
  }); // That's all.
  Sortable.create(pageList, {
    sort: false,
    group: {
      name: 'menu-list',
      pull: 'clone',
    },

  }); // That's all.
  if (this.data.menu.length > 0) {
    fillMenu(this.data.menu);
  }
  $('#addMenu').validate({
    rules: {
      title: {
        required: true,
      },
      url: {
        required: true,
      },
    },
    messages: {
      title: {
        required: 'Please enter a title',
      },
      url: {
        required: 'Please enter a url',
      },
    },
    submitHandler() {
      const link = {
        title: $('[name="title"]').val(),
        url: $('[name="url"]').val(),
      };
      let itemEl = `<li class="inner-menu" data-slug="${link.url}" data-title="${link.title}"><i class="fa fa-bars menu-sort"></i><i class="fa fa-times destroy"></i>`;
      itemEl += `${link.title}<i class="fa fa-plus add-submenu"></i></li>`;
      $('#addMenu input').val('');
      $('.menu-list').append(itemEl);
    },
  });
};

Template.menuManager.events({
  'click .destroy': function (event) {
    $(event.currentTarget).parent().remove();
  },
  'submit form': function (event) {
    event.preventDefault();
  },
  'click .add-submenu': function (event) {
    const menuLevel = $(event.currentTarget).parent();
    const subMenu = '<ul id="submenu" class="submenu"></ul>';

    if (!$(menuLevel).find('.submenu').length) {
      $(menuLevel).append(subMenu);
      const menu = $(menuLevel).find('.submenu');
      Sortable.create(menu[0], {
        group: {
          name: 'menu-list',
        },

        handle: '.menu-sort',
        onAdd(e) {
          const itemEl = e.item;
          if (!$(itemEl).hasClass('inner-menu')) {
            $(itemEl).prepend('<i class="fa fa-bars menu-sort"></i>');
            $(itemEl).prepend('<i class="fa fa-times destroy"></i>');
            $(itemEl).addClass('inner-menu');
            $(itemEl).append('<i class="fa fa-plus add-submenu"></i>');
          }
        },

      }); // That's all.
    }
  },
  'click .save-menu': function () {
    const menu = serializeMenu();
    const user = Meteor.user();
    return Meteor.call('updateMenu', menu, user, (error, response) => {
      if (error) {
        return alert(error.reason);
      }
    });
  },
});

Template.generalSettings.rendered = function () {
  $('#generalSettings').validate({
    rules: {
      metaTitle: {
        required: true,
      },
      metaDescription: {
        required: true,
      },
      metaKeywords: {
        required: true,
      },
    },
    submitHandler() {
      const settings = {
        metaTitle: $('[name="metaTitle"]').val(),
        metaDescription: $('[name="metaDescription"]').val(),
        metaKeywords: $('[name="metaKeywords"]').val(),
      };
      $('.btn').val('Saving');
      return Meteor.call('siteSettings', settings, (error, response) => {
        if (error) {
          return alert(error.reason);
        } else {
          setTimeout(() => {
            $('.btn').val('Save Settings');
          }, 500);
        }
      });
    },
  });
};

Template.generalSettings.events({
  'submit form': function (event) {
    event.preventDefault();
  },
});

Template.dashboard.helpers({
  user() {
    const user = Meteor.users.findOne({});
    return console.log(user);
  },
});


Template.menuManager.helpers({
  pages() {
    return Pages.find({},
      {
        fields: {
          slug: 1,
          title: 1,
        },
      });
  },
  hasPages() {
    const pages = Pages.findOne({});
    if (pages) return true;
  },
});

Template.siteSettings.events({
  'click .js-tab': function (event) {
    // toggle showing the student/tutor registration
    $('.nav-tabs li').removeClass('active');
    $('.tab-pane').removeClass('active');
    $(event.currentTarget).addClass('active');
    const toggleData = $(event.currentTarget).find('a').attr('data-toggle');
    $(`#${toggleData}`).addClass('active');
  },
});
