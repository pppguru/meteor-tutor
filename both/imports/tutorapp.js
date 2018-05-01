import BlogPosts from './collections/blogposts';
import Contests from './collections/contests';
import Users from './collections/users';


/**
 * TUTORAPP class instance, allows us to obtain the collections and there models powered by
 * Singularity package/
 */
export class TUTORAPP {

  /**
   * Instance of collections available to TUTORAPP.
   * @type {Object}
   */
  constructor() {
    this.Collections = {
      BlogPosts: new BlogPosts(),
      Users: new Users(),
      Contests: new Contests(),
    };
  }

  /**
   * Method to allow access of collections through class.
   * @abstract
   * @param   {String}      name  Collection name.
   * @returns {Singularity}       Collections powered by Singularity.
   */
  getCollection(name) {
    const keys = Object.keys(this.Collections);

    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i].toLowerCase() === name.toLowerCase()) {
        return this.Collections[keys[i]]();
      }
    }

    return 'undefined';
  }
}
