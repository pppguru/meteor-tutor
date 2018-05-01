import EventHorizon from 'meteor/patrickml:event-horizon';

/**
 * defaultStore Filter Post store for filter options.
 * @type {Object}
 */
const defaultStore = {
  and: {
    activeIndex: {
      name: 'most recent',
      sort: -1,
      value: '1',
    },
    activeOption: '0',
    options: [
      {
        name: 'most recent',
        sort: -1,
        value: '1',
      },
      {
        name: 'older',
        sort: 1,
        value: '2',
      },
    ],
    title: 'most recent',
  },
  by: {
    activeIndex: {
      name: 'pending',
      value: '1',
    },
    activeOption: '0',
    options: [
      {
        name: 'pending',
        type: 'blogs',
        value: '1',
      },
      {
        name: 'approved',
        type: 'blogs',
        value: '2',
      },
      {
        name: 'rejected',
        type: 'blogs',
        value: '3',
      },
      {
        name: 'active',
        value: '4',
        type: 'contests',
      },
      {
        name: 'inactive',
        value: '5',
        type: 'contests',
      },
    ],
    title: 'pending',
  },
  userListFilter: 'blogs',
};

/**
 * EventHorizon store.
 */
EventHorizon.createStore('filterPosts', defaultStore);

export default defaultStore;
