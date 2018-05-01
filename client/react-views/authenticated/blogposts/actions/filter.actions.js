import EventHorizon from 'meteor/patrickml:event-horizon';

import R from 'ramda';

import defaultStore from '../stores/filterpost.store';

const getObjectSelection = (selection, obj) => R.path(selection, obj);

/**
 * EventHorizon
 */

EventHorizon.createAction('filterPosts', 'UPDATE_DROPDOWN_TOGGLE', (store, data, update) => {

});

EventHorizon.createAction('filterPosts', 'UPDATE_FILTER_OBJECT', (store, data, update) => {
  if (data.userListFilter && (store.userListFilter !== data.userListFilter)) {
    const blogs = {
      name: 'pending',
      value: '1',
    };
    const contests = {
      name: 'active',
      value: '4',
    };
    const partialSelection = getObjectSelection(new Array('by'), defaultStore);
    const newByActive = (data.userListFilter === 'blogs') && blogs || contests;
    const title = newByActive.name;
    const byActive = {
      ...partialSelection,
      ...{ activeIndex: newByActive },
      ...{ title },
    };

    update({ ...defaultStore, ...{ by: byActive }, ...data });
  } else {
    update({ ...store, ...data });
  }
});

/**
 * Updates filtered option values for filterPost store.
 * @type {Object}
 */
EventHorizon.createAction('filterPosts', 'UPDATE_OPTION_CLICKED', (store, data, update) => {
  const { selected, value: { optionIndex } } = data;
  const partialSelection = getObjectSelection(new Array(selected), store);
  const index = parseInt(optionIndex, 10) - 1;
  const activeIndex = partialSelection.options[index];
  const title = activeIndex.name;

  const dropdown = {
    ...partialSelection,
    ...{ activeIndex },
    ...{ title },
  };

  update({ ...store, ...{ [selected]: dropdown } });
});
