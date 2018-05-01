import BlogPosts from '../blogposts';
import Contests from '../contests';
import Users from '../users';

import { TUTORAPP } from '../../app';
import checkAuth from '../../utils/check-auth';

const rules = {
  insert(userId) {
    return checkAuth(userId);
  },
  update(userId) {
    return checkAuth(userId);
  },
  remove() {
    return false;
  },
};

TUTORAPP.Collections.Contests().getCollection().getRawCollection().allow({
  insert(userId) {
    return checkAuth(userId, ['admin']);
  },
  remove(userId) {
    return checkAuth(userId, ['admin']);
  },
  update(userId) {
    return checkAuth(userId, ['admin']);
  },
});
