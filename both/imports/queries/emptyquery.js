/**
 * A function to handle Singularity when the queries return no value.
 * @type {Object}
 */
export default {
  cursor: () => ({ fetch: () => [] }),
  first: () => new Promise(),
  firstSync: () => 'undefined',
};
