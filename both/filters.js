import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Roles } from 'meteor/alanning:roles';

let checkUserLoggedIn = null;
let userAuthenticatedTutor = null;
let userAuthenticatedStudent = null;
let userAuthenticatedAdmin = null;

checkUserLoggedIn = function () {
  if (!Meteor.loggingIn() && !Meteor.user()) {
    Router.go('/');
  }
  this.next();
};

userAuthenticatedTutor = function () {
  let isTutor;
  let loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
  if (!Meteor.loggingIn()) {
    if (isAdmin) {
      return Router.go('/admin/invites');
    } else {
      return Router.go('/dashboard');
    }
  } else {
    return this.next();
  }
};

userAuthenticatedStudent = function () {
  let isStudent, loggedInUser;
  loggedInUser = Meteor.user();
  isStudent = Roles.userIsInRole(loggedInUser, ['student']);
  if (!Meteor.loggingIn() && isStudent) {
    // return Router.go('/tutors');
    return this.next();
  } else {
    return this.next();
  }
};

userAuthenticatedAdmin = function () {
  let isAdmin, loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
  if (!Meteor.loggingIn() && !isAdmin) {
    // return Router.go('/');
    this.next();
  } else {
    this.next();
  }
};

const globalHooks = {
  grabMessages() {
    let isUser, loggedInUser;
    loggedInUser = Meteor.user();
    isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
    if (loggedInUser && !isAdmin) {
      Meteor.subscribe('messages');
      return this.next();
    } else {
      return this.next();
    }
  },
  userPresence() {
    Meteor.subscribe('userPresence');
    return this.next();
  },
  siteSettings() {
    Meteor.subscribe('siteSettingsHeader');
    return this.next();
  },
  grabLessons() {
    let isUser, loggedInUser;
    loggedInUser = Meteor.user();
    isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
    if (loggedInUser && !isAdmin) {
      Meteor.subscribe('lessons');
      return this.next();
    } else {
      return this.next();
    }
  },
  grabNotifications() {
    Meteor.subscribe('notifications');
    return this.next();
  },
  setFavicon() {
    SEO.set({
      link: {
        icon: 'https://s3.amazonaws.com/tutorthepeople/content/favicon.png',
      },
    });
  },
};

Router.onBeforeAction(globalHooks.siteSettings);
Router.onBeforeAction(globalHooks.grabMessages);
Router.onBeforeAction(globalHooks.grabLessons);
Router.onBeforeAction(globalHooks.userPresence);
Router.onBeforeAction(globalHooks.grabNotifications);

Router.onAfterAction(globalHooks.setFavicon);

Router.onBeforeAction(checkUserLoggedIn, {
  except: [
    'home',
    'signup',
    'signup/:promo',
    'thankyou',
    'promo/:promo',
    'authorize/:token',
    'authorize',
    'tutorsSearch',
    'singlePost',
    'singlePage',
    'blog',
    'testing',
    'tutors',
    'tutorGeo',
    'tutorGeoState',
    'tutor',
    'tutorCategories',
    'subjects',
    'register',
    'apply',
    'apply/:promo',
    'login',
    'loginError',
    'recover-password',
    'reset-password',
    'terms-of-use',
    'privacy-policy',
    'tutor-payment-policy',
    '24-hour-cancellation',
    'independent-tutor-agreement',
    'contact'],
});
