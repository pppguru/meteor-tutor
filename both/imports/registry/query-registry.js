import { Meteor } from 'meteor/meteor';

/**
 * Class Queries - This class allows us to dynamically register and subscribe to publications. The
 * publications can be accessed by initiating the Queries class and setting up the queries (found
 * in the ../queries/) directory.
 */
export default class Queries {

  /**
   * Set up the current user null value.
   * @type {String}
   */
  constructor() {
    this.user = null;
  }

  /**
   * Register method allows us to set up queries on the Queries instance.
   * @abstract
   * @param   {String}   name     Name of the subscription.
   * @param   {Function} callback Subscription call back function.
   * @returns {Object}            Initiates the function on class instance.
   */
  set register([name, callback]) {
    this[name] = callback;
  }

  /**
   * Set up the current user for subscription.
   * @type {String}
   */
  getUser() {
    return (Meteor.isClient && Meteor.userId()) || this.userId;
  }

  /**
   * First method subscribes and fetches a single document.
   * @abstract
   * @type    {Array}             Parameter deconstructor of subscription and arguments.
   * @returns {Promise}           Promise of subscription
   */
  first([subscription, ...args]) {
    const sub = Meteor.subscribe('query-class', subscription, ...args);
    const subPromise = new Promise((resolve, reject) => {
      if (sub.ready()) {
        resolve(this[subscription](this.user || this.getUser(), ...args).firstSync());
      }
    });

    return subPromise;
  }

  /**
   * Fetch method subscribes and fetches a list of documents.
   * @abstract
   * @type    {Array}             Parameter deconstructor of subscription and arguments.
   * @returns {Promise}           Promise of subscription
   */
  fetch([subscription, ...args]) {
    this.getUser();
    const sub = Meteor.subscribe('query-class', subscription, ...args);
    const subPromise = new Promise((resolve, reject) => {
      if (sub.ready()) {
        resolve(this[subscription](this.user || this.getUser(), ...args).cursor().fetch());
      }
    });

    return subPromise;
  }

  /**
   * Cursor method subscribes returns the cursor.
   * @abstract
   * @type    {Array}             Parameter deconstructor of subscription and arguments.
   * @returns {Promise}           Promise of subscription
   */
  cursor([subscription, ...args]) {
    this.getUser();
    const sub = Meteor.subscribe('query-class', subscription, ...args);
    const subPromise = new Promise((resolve, reject) => {
      if (sub.ready()) {
        resolve(this[subscription](this.user || this.getUser(), ...args).cursor());
      }
    });

    return subPromise;
  }
}
