import { Collection } from 'meteor/patrickml:singularity';
import BlogPost from '../models/blogpost';

export default class BlogPosts extends Collection {
  constructor() {
    super({ name: 'blogposts', model: BlogPost });
  }
}
