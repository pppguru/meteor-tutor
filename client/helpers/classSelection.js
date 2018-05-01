const removeClass = function (elem, cls) {
  const str = ` ${elem.className} `;
  elem.className = str.replace(` ${cls} `, ' ').replace(/^\s+|\s+$/g, '');
};

const hasClass = function (elem, cls) {
  const str = ` ${elem.className} `;
  const testCls = ` ${cls} `;
  return (str.indexOf(testCls) !== -1);
};

const addClass = function (elem, cls) {
  if (!hasClass(elem, cls)) {
    let oldCls = elem.className;
    if (oldCls) {
      oldCls += ' ';
    }
    elem.className = oldCls + cls;
  }
};

const toggleClass = function (elem, cls) {
  if (hasClass(elem, cls)) {
    removeClass(elem, cls);
  } else {
    addClass(elem, cls);
  }
};

export default addClass;
