/**
 * Initiating and register our queries to the Queries class.
 */
import Queries from '../registry/query-registry';
import getBlogPostSingle from './get-blog-post-single';
import getBlogPosts from './get-blog-posts';
import getBlogPostsByStatusAndOrder from './get-blog-posts-by-status-and-order';
import getBlogContestsByStatusAndOrder from './get-blog-contests-by-status-and-order';
import getBlogContestsPosts from './get-latest-blog-contest-posts';

const data = [
  getBlogPostSingle,
  getBlogPosts,
  getBlogPostsByStatusAndOrder,
  getBlogContestsByStatusAndOrder,
  getBlogContestsPosts,
];

const queries = new Queries();

/**
 * Populate the Queries class instance with registered subscriptions.
 * @type {Array}
 */
data.forEach((obj, key) => {
  queries.register = [obj.name, obj.callback];
});

export default queries;
