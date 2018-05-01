import { Meteor } from 'meteor/meteor';
import { Collection } from 'meteor/patrickml:singularity';
import User from '../models/user';

Meteor.users._transform = user => new User(user);

export default class Users extends Collection {
  constructor() {
    super({ name: 'users', model: User, collection: Meteor.users });
  }
}
