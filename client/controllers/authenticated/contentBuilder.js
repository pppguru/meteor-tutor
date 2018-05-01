import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { S3 } from 'meteor/lepozepo:s3';

import $ from 'jquery';
import Sortable from 'sortablejs';

const singleContent = () => '<div class="block single"><div class="sort-handle"><i class="fa fa-arrows-alt"></i></div><div class="delete-row"><i class="fa fa-times"></i></div><div class="inner-content"></div><div class="inner-modules"><i class="fa fa-picture-o image"></i><i class="fa fa-pencil text"></i></div></div>';

const doubleContent = () => '<div class="block double clearfix"><div class="sort-handle"><i class="fa fa-arrows-alt"></i></div><div class="delete-row"><i class="fa fa-times"></i></div><div class="column"><div class="inner-content"></div><div class="inner-modules"><i class="fa fa-picture-o image"></i><i class="fa fa-pencil text"></i></div></div><div class="column"><div class="inner-content"></div><div class="inner-modules"><i class="fa fa-picture-o image"></i><i class="fa fa-pencil text"></i></div></div></div>';

const createColumn = function (num) {
  const modularContent = document.getElementById('content');
  if (num === 1) {
    modularContent.innerHTML += singleContent();
  } else {
    modularContent.innerHTML += doubleContent();
  }
};

const createImage = function (data) {
  const content = $(data.currentTarget).parent().parent().find('.inner-content');
  const template = '<div class="image module"><img src="" class="hidden"><div class="delete-module"><i class="fa fa-times"></i></div><div class="sort-handle-module"><i class="fa fa-arrows-alt"></i></div><div class="drop-file"><i class="fa fa-camera"></i> Upload a Photo<div class="fileinputs"><input type="file" class="image-upload file"></div></div>';
  $(content).append(template);
};

const createText = function (data) {
  const content = $(data.currentTarget).parent().parent().find('.inner-content');
  const template = '<div class="text module"><div class="delete-module"><i class="fa fa-times"></i></div><div class="sort-handle-module"><i class="fa fa-arrows-alt"></i></div><textarea class="editor"></textarea></div>';
  $(content).append(template);
};

const fireSortable = function (data) {
  const content = $(data.currentTarget).parent().parent().find('.inner-content');
  Sortable.create(content[0], {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    handle: '.sort-handle-module', // Restricts sort start click/touch to the specified element
  });
};

const fireRedactor = function (data) {
  const textarea = $(data.currentTarget).parent().parent().find('textarea');
  textarea.redactor({
    focus: false,
    toolbar: true,
    buttons: ['formatting', 'bold', 'italic', 'link'],
  });
};

Template.modularContentBuilder.events({
  'click .create-modular-content a': function (event) {
    const columns = event.currentTarget.className;
    switch (columns) {
      case 'one':
        createColumn(1);
        break;
      case 'two':
        createColumn(2);
        break;
      default:
        return;
    }
  },
  'click .inner-modules .image': function (event) {
    createImage(event);
    fireSortable(event);
  },
  'click .inner-modules .text': function (event) {
    createText(event);
    fireRedactor(event);
    fireSortable(event);
  },
  'click .delete-row': function (e) {
    const deleteRow = $(e.currentTarget).parent();
    deleteRow.remove();
  },
  'click .delete-module': function (e) {
    const deleteModule = $(e.currentTarget).parent();
    deleteModule.remove();
  },
  'change .file': function (e) {
    e.preventDefault();
    const image = $(e.currentTarget)
      .parent()
      .parent()
      .parent()
      .find('img');
    const files = $(e.currentTarget)[0].files;

    S3.upload({
      files,
      path: 'content',
    }, (err, res) => {
      const url = res.secure_url;
      image.attr('src', url);
    });
  },
});

Template.modularContentBuilder.rendered = function () {
  const list = document.getElementById('content');
  Sortable.create(list, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    handle: '.sort-handle', // Restricts sort start click/touch to the specified element
  });
};

// Global function that we use in pages.js

const serializeModules = function (row, index) {
  const currentRow = $('.modular-content .block')[index];
  const modules = $(currentRow).find('.module');

  modules.each(function () {
    let newModule;
    if ($(this).hasClass('text')) {
      const textContent = $(this).find('.redactor_editor').html();
      newModule = {
        module_type: 'text',
        content: textContent,
      };
    } else {
      const imageUrl = $(this).find('img').attr('src');
      newModule = {
        module_type: 'image',
        url: imageUrl,
      };
    }
    row.content.push(newModule);
  });
  return row;
};

const serializeColumn = function (row, index, col) {
  // Find the column in question
  const currentRow = $('.modular-content .block')[index];
  const moduleBlock = $(currentRow).find('.column')[col];
  const modules = $(moduleBlock).find('.module');
  modules.each(function () {
    let newModule;
    if ($(this).hasClass('text')) {
      const textContent = $(this).find('.redactor_editor').html();
      newModule = {
        module_type: 'text',
        content: textContent,
      };
    } else {
      const imageUrl = $(this).find('img').attr('src');
      newModule = {
        module_type: 'image',
        url: imageUrl,
      };
    }
    row.content[col].push(newModule);
  });
  return row;
};

const serializeRows = function (row, index) {
  if (row.numCols === 2) {
    return [serializeColumn(row, index, 0), serializeColumn(row, index, 1)];
  }
  return serializeModules(row, index);
};

const serializeContent = function () {
  const contentObject = [];

  $('.modular-content .block').each((index, elm) => {
    //
    // Create the empty content array objects
    //
    let numCols = 1;
    let contentArray = [];
    if ($(elm).hasClass('double')) {
      numCols = 2;
      contentArray = [
        [],
        [],
      ];
    }
    const newRow = {
      numCols,
      content: contentArray,
    };
    contentObject.splice(index, 0, newRow);
  });

  // Push the modular content into their proper arrays
  contentObject.forEach((row, index) => {
    serializeRows(row, index);
  });

  return contentObject;
};

const createRows = function (data) {
  const rows = data.content;
  rows.forEach((row) => {
    if (row.numCols === 1) {
      createColumn(1);
    } else {
      createColumn(2);
    }
  });
};


// Fill the modules back into the page
const fillModules = function (data) {
  const rows = data.content;
  rows.forEach((row, index) => {
    if (row.numCols === 1) {
      const modules = row.content;
      modules.forEach((module, internalIndex) => {
        switch (module.module_type) {
          case 'text':
            var el = $('.modular-content .block')[index];
            var button = {
              currentTarget: $(el).find('.text'),
            };
            createText(button);
            fireRedactor(button);
            fireSortable(button);
            var editorBlock = $(el).find('.module')[internalIndex];
            var editor = $(editorBlock).find('.redactor_editor');
            $(editor).html(module.content);
            break;
          case 'image':
            var el = $('.modular-content .block')[index];
            var button = {
              currentTarget: $(el).find('.image'),
            };
            createImage(button);
            fireSortable(button);

            var imgBlock = $(el).find('.module')[internalIndex];
            var img = $(imgBlock).find('img');
            $(img).attr('src', module.url);
            break;
          default :
            return;
        }
      });
    } else {
      let i = 0;
      while (i <= 1) {
        const modules = row.content;
        modules[i].forEach((module, internalIndex) => {
          switch (module.module_type) {
            case 'text':
              var el = $('.modular-content .block')[index];
              var moduleBlock = $(el).find('.column')[i];
              var button = {
                currentTarget: $(moduleBlock).find('.text'),
              };
              createText(button);
              fireRedactor(button);
              fireSortable(button);

              var editorBlock = $(moduleBlock).find('.module')[internalIndex];
              var editor = $(editorBlock).find('.redactor_editor');
              $(editor).html(module.content);
              break;
            case 'image':
              var el = $('.modular-content .block')[index];
              var moduleBlock = $(el).find('.column')[i];
              var button = {
                currentTarget: $(moduleBlock).find('.image'),
              };
              createImage(button);
              fireSortable(button);
              var imgBlock = $(moduleBlock).find('.module')[internalIndex];
              var img = $(imgBlock).find('img');
              $(img).attr('src', module.url);
              break;
          }
        });
        i++;
      }
    }
  });
};

export { serializeContent, createRows, fillModules };
