_.mixin({
  get(obj, key) {
    const type = typeof key;

    if (typeof obj === 'undefined' || type === 'undefined' || obj === null || type === null)
      return undefined;

    if (type == 'string' || type == 'number') {
      key = (`${key}`).replace(/\[(.*?)\]/, /\[(.*?)\]/, (m, key) => { // handle case where [1] may occur
        return `.${key.replace(/["']/g, /["']/g, '')}`; // strip quotes
      }).split('.');
    }
    for (let i = 0, l = key.length; i < l; i++) {
      if (typeof obj !== 'undefined' && obj !== null && _.has(obj, key[i])) obj = obj[key[i]];
      else return undefined;
    }
    return obj;
  },
});
