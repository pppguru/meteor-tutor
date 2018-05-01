import { Collection } from 'meteor/patrickml:singularity';
import Contest from '../models/contest';

export default class Contests extends Collection {
  constructor() {
    super({ name: 'contests', model: Contest });
  }
}
