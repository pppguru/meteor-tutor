import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.singlePage.helpers({
  dynamicContent() {
    console.log(this.content);
    const container = $('#dynamicContent');
    const content = this.content;
    let htmlContent = '';
    content.forEach((row, index) => {
      if (row.numCols === 1) {
        var modules = row.content;
        modules.forEach((module, intenalIndex) => {
          console.log('guy');
          switch (module.module_type) {
            case 'text':
              htmlContent += module.content;
              break;
            case 'image':
              htmlContent += `<img src="${module.url}" alt=""/ >`;
              break;
          }
        });
      } else {
        let i = 0;
        htmlContent += '<div class="hw-grid">';
        while (i <= 1) {
          htmlContent += '<div>';
          var modules = row.content;
          modules[i].forEach((module, internalIndex) => {
            switch (module.module_type) {
              case 'text':
                htmlContent += module.content;
                break;
              case 'image':
                htmlContent += `<img src="${module.url}" alt=""/ >`;
                break;
            }
          });
          htmlContent += '</div>';
          i++;
        }
        htmlContent += '</div>';
      }
    });
    return htmlContent;
  },
});
