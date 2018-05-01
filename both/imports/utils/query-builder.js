// Build a Regex Exp
export const buildRegExp = searchText => new RegExp(searchText, 'ig');

// Build a Search Query
export const buildSearchQuery = (search, config) => {
  let $or = {};
  if (search) {
    $or = [];
    _.each(config.keys, (key) => {
      const obj = {};
      obj[key] = buildRegExp(search);
      $or.push(obj);
    });
  }

  const query = {};

  _.each(_.omit(config, ['keys']), (value, key) => {
    query.$and = query.$and || [];
    query.$and.push({ [key]: value });
  });

  if ($or.length > 0) {
    if (query.$and) {
      query.$and.push({ $or });
    } else {
      query.$or = $or;
    }
  }

  return query;
};
