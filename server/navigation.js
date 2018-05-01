import Settings from '/collections/settings';

const fillMenu = function (data) {
  const menu = data.menu;
  let menuRow = '';
  menu.forEach((row, index) => {
    menuRow += `<li><a href="${row.slug}">${row.title}</a>`;
    if (row.nested === true) {
      const nested = row.nestedMenu;
      menuRow += '<ul class="dropdown">';
      nested.forEach((row, index) => {
        menuRow += `<li><a href="${row.slug}">${row.title}</a><li>`;
      });
      menuRow += '</ul>';
    }
    menuRow += '</li>';
  });
  return menuRow;
};

Meteor.methods({
  navigation() {
    const navigation = Settings.findOne({});
    const fill = fillMenu(navigation);
    return fill;
  },
});
