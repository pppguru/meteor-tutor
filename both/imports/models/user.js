import { Model } from 'meteor/patrickml:singularity';

export default class User extends Model {
  constructor(doc) {
    super(doc);
    Object.assign(this, doc);

    return this;
  }

  name() {
    return `${_.get(this.profile, 'firstName')} ${_.get(this.profile, 'lastName')}`;
  }
}
