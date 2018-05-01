import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

/**
 * Checks and authorizes user by role.
 * @param  {[type]} userId [description]
 * @param  {[type]} roles  [description]
 * @return {[type]}        [description]
 */
const checkAuth = (userId, roles) =>
  Roles.userIsInRole((Meteor.isClient && Meteor.userId()) || userId, roles || ['admin']);

export default checkAuth;
