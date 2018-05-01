import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import EventHorizon from 'meteor/patrickml:event-horizon';

import Chats from '/collections/chats';
import Pages from '/collections/pages';
import Posts from '/collections/posts';
import Reviews from '/collections/reviews';
import Settings from '/collections/settings';
import Tutors from '/collections/tutors';

Router.configure({
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout',
  trackPageView: true,
  fastRender: true,
  onAfterAction() {
    window.scrollTo(0, 0);
  },
});

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    onBeforeAction() {
      Session.set('currentRoute', 'home');

      return this.next();
    },
    onAfterAction() {
      SEO.set({
        title: 'Tutor App',
        link: { icon: 'https://s3.amazonaws.com/tutorthepeople/content/favicon.png' },
        meta: { description: "We're a new type of tutoring platform." },
        og: {
          title: 'Tutor App',
          description: 'Tutor App is a marketplace that allows students to connect instantly with tutors who are verified via our proprietary technology.',
          image: 'https://s3.amazonaws.com/tutorthepeople/content/home_illustration_1.png',
        },
      });
    },
  });

  // Student and Tutor Dashboard Routes (authenticated routes)

  this.route('dashboard', {
    path: '/dashboard',
    template: 'dashboard',
    onBeforeAction() {
      Session.set('currentRoute', 'dashboard');

      return this.next();
    },
  });

  this.route('referrals', {
    path: '/referrals',
    template: 'referrals',

    waitOn() {
      return Meteor.subscribe('referredUsers');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'referrals');

      return this.next();
    },

    onAfterAction() {
      SEO.set({
        title: 'Referrals - Tutor App',
        link: { icon: 'https://s3.amazonaws.com/tutorthepeople/content/favicon.png' },
        meta: { description: "We're a new type of tutoring platform." },
        og: {
          title: 'Referrals - Tutor App',
          description: 'I just joined Tutor App, a marketplace to hire qualified tutors instantly. Follow this link to join Tutor App and you get $10 to learn with a tutor!',
          image: 'https://s3.amazonaws.com/tutorappllc/referral-illustration.png',
        },
      });
    },
  });

  this.route('tutors', {
    path: '/tutors/',
    template: 'tutors',
    waitOn() {
      return Meteor.subscribe('tutors');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'tutors');

      return this.next();
    },
    onAfterAction() {
      SEO.set({
        title: 'Search Tutors - Tutor App',
        meta: { description: "We're a new type of tutoring platform." },
        og: {
          title: 'Search Tutors - Tutor App',
          description: "We're a new type of tutoring platform, we're currently accepting Tutor submissions and will be launching sometime in 2016",
          image: 'https://s3.amazonaws.com/tutorthepeople/content/home_illustration_1.png',
        },
      });
    },
  });

  this.route('tutorsSearch', {
    path: '/tutors/:searched',
    template: 'tutors',
    waitOn() {
      return Meteor.subscribe('tutors');
    },
    data() {
      return this.params.searched;
    },
    onBeforeAction() {
      Session.set('currentRoute', 'tutorSearch');

      return this.next();
    },
  });

  this.route('tutorCategories', {
    path: '/tutors/:category',
    template: 'tutors',
    waitOn() {
      return Meteor.subscribe('tutorsCategory', { category: this.params.category });
    },
    data() {

    },
    onBeforeAction() {
      Session.set('currentRoute', 'tutorCategories');

      return this.next();
    },
  });

  this.route('blogposteditor', {
    path: '/blogpost-create',
    template: 'blogEditorLayout',
    onBeforeAction() {
      return this.next();
    },
  });

  this.route('blogpostedit', {
    path: '/blogpost-edit/:slug',
    template: 'blogEditorLayout',
    onBeforeAction() {
      return this.next();
    },
  });

  this.route('blogpost-list', {
    path: '/blogposts/list',
    template: 'blogPostList',
    onBeforeAction() {
      Session.set('currentRoute', 'blogposts/list');

      return this.next();
    },
  });

  this.route('blogpost-single', {
    path: '/blogposts/single/:slug',
    template: 'blogPostSingle',
    onBeforeAction() {
      return this.next();
    },
  });

  this.route('create-contest', {
    path: '/create-contest',
    template: 'createContest',
    onBeforeAction() {
      return this.next();
    },
  });

  // create the complex state/local path
  this.route('tutorGeoState', {
    path: 'tutor/:state/-/:slug',
    template: 'tutor-single',
    waitOn() {
      return Meteor.subscribe('tutorSingle', { slug: this.params.slug, city: '', state: this.params.state });
    },
    data() {
      if (this.ready()) {
        return Meteor.users.findOne({ slug: this.params.slug, 'meta.city': '', 'meta.state': this.params.state });
      }
    },
    onBeforeAction() {
      Session.set('currentRoute', 'singleTutor');

      return this.next();
    },
    onAfterAction() {
      const tutor = Meteor.users.findOne({ slug: this.params.slug, 'meta.city': '', 'meta.state': this.params.state });

      if (tutor) {
        let title = `${tutor.meta.state} - ${tutor.meta.city} - ${tutor.profile.firstName} ${tutor.profile.specialities} Tutor `;

        title = title.toUpperCase();
        SEO.set({
          title,
          meta: { description: tutor.profile.biography },
          og: {
            title,
            description: tutor.profile.biography,
            image: tutor.profile.avatar,
          },
        });
      }
    },
  });
  this.route('tutorGeo', {
    path: 'tutor/:state/:city/:slug',
    template: 'tutor-single',
    waitOn() {
      return Meteor.subscribe('tutorSingle', { slug: this.params.slug, city: this.params.city, state: this.params.state });
    },
    data() {
      if (this.ready()) {
        return Meteor.users.findOne({ slug: this.params.slug, 'meta.city': this.params.city, 'meta.state': this.params.state });
      }
    },
    onBeforeAction() {
      Session.set('currentRoute', 'singleTutor');

      return this.next();
    },
    onAfterAction() {
      const tutor = Meteor.users.findOne({ slug: this.params.slug, 'meta.city': this.params.city, 'meta.state': this.params.state });

      if (tutor) {
        let title = `${tutor.meta.state} - ${tutor.meta.city} - ${tutor.profile.firstName} ${tutor.profile.specialities} Tutor `;

        title = title.toUpperCase();
        SEO.set({
          title,
          meta: { description: tutor.profile.biography },
          og: {
            title,
            description: tutor.profile.biography,
            image: tutor.profile.avatar,
          },
        });
      }
    },
  });

  this.route('tutorMessages', {
    path: 'tutor/:slug/messages',
    template: 'messages',
    waitOn() {
      // return Meteor.subscribe('tutorMessages');
    },
  });

  /*
   *   Messages and Inbox
   */

  this.route('chat', {
    path: 'chat/:id',
    template: 'message',
    waitOn() {
      return Meteor.subscribe('chatMessages', { chat: this.params.id });
    },
    data() {
      return Chats.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'inbox');

      return this.next();
    },
  });

  this.route('inbox', {
    path: 'inbox',
    template: 'inbox',
    data() {
      return Chats.find({});
    },
    onBeforeAction() {
      Session.set('currentRoute', 'inbox');

      return this.next();
    },
  });

  /*
   *   Invoices and Creation
   */
  //
  // this.route('invoices', {
  //   path: '/invoices',
  //   template: 'invoices',
  //   waitOn: function() {
  //     return Meteor.subscribe('invoices');
  //   },
  //   data: function() {
  //     return Invoices.find({});
  //   },
  //   onBeforeAction: function() {
  //     Session.set('currentRoute', 'invoices');
  //     return this.next();
  //   }
  // });


  // this.route('thankYouInvoice', {
  //   path: '/invoices/thank-you',
  //   template: 'invoice-thank-you',
  //   onBeforeAction: function() {
  //     Session.set('currentRoute', 'invoice-thank-you');
  //     return this.next();
  //   }
  // });
  //
  // this.route('singleInvoice', {
  //   path: '/invoice/:id',
  //   template: 'singleInvoice',
  //   waitOn: function() {
  //     return Meteor.subscribe('singleInvoice', {invoice: this.params.id});
  //   },
  //   data: function() {
  //     return Invoices.findOne({_id: this.params.id});
  //   },
  //   onBeofreAction: function() {
  //     Session.set('currentRoute', 'invoice');
  //     return this.next();
  //   }
  // })

  this.route('newInvoice', {
    path: 'invoice/new/:studentId',
    template: 'newInvoice',
    waitOn() {
      return Meteor.subscribe('userData');
    },
    data() {
      const user = Meteor.users.findOne({});
      const studentId = this.params.studentId;

      return [user, studentId];
    },
    onBeforeAction() {
      Session.set('currentRoute', 'new-invoice');

      return this.next();
    },
  });


  // this.route('message', {
  //   path: '/messages/:id/',
  //   template: 'message',
  //   onBeforeAction: function() {
  //     Session.set('currentRoute', 'message');
  //     return this.next();
  //   }
  // });

  /*
   *  User Routes
   */

  this.route('profile', {
    path: '/profile',
    template: 'user_profile',
    onBeforeAction() {
      Session.set('currentRoute', 'profile');

      return this.next();
    },
  });

  this.route('settings', {
    path: '/settings',
    template: 'settings',
    waitOn() {
      return Meteor.subscribe('userData');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'settings');

      return this.next();
    },
  });

  this.route('contact', {
    path: '/contact',
    template: 'contact',
    onBeforeAction() {
      Session.set('currentRoute', 'contact');

      return this.next();
    },
  });

  /*
   *    User authentication, registrations, password
   *    resets, signups ect.
   */


  this.route('thankyou', {
    path: '/thank-you',
    template: 'thank-you',
    onBeforeAction() {
      Session.set('currentRoute', 'register');

      return this.next();
    },
  });

  this.route('apply', {
    path: '/apply',
    template: 'tutor-apply',
    onBeforeAction() {
      Session.set('currentRoute', 'register');
      Session.set('promoToken', '');

      return this.next();
    },
  });

  this.route('promo/:promo', {
    path: '/promo/:promo',
    template: 'promotional',
    onBeforeAction() {
      Session.set('currentRoute', 'promotional');
      Session.set('promoToken', this.params.promo);

      return this.next();
    },
    waitOn() {
      return Meteor.subscribe('tutorPromo', { promoToken: this.params.promo });
    },
    data() {
      return Meteor.users.findOne({ promoToken: this.params.promo });
    },
    onAfterAction() {
      SEO.set({
        title: 'Tutor App',
        link: { icon: 'https://s3.amazonaws.com/tutorthepeople/content/favicon.png' },
        meta: { description: 'Hey follow my referral link gain credits with me!' },
        og: {
          title: 'Tutor App',
          description: "We're a new type of tutoring platform, we're currently accepting Tutor submissions and will be launching sometime in 2016",
          image: 'https://s3.amazonaws.com/tutorappllc/referral-illustration.png',
        },
      });
    },
  });

  this.route('apply/:promo', {
    path: '/apply/:promo',
    template: 'tutor-apply',
    onBeforeAction() {
      Session.set('currentRoute', 'register');
      Session.set('promoToken', this.params.promo);

      return this.next();
    },
    onAfterAction() {
      SEO.set({
        title: 'Apply to Tutor for Tutor App',
        link: { icon: 'dummyurl' },
        meta: { description: "We're a new type of tutoring platform, Apply now to become a tutor and start earing money teaching!" },
        og: {
          title: 'Tutor App Tutor Application',
          description: "We're a new type of tutoring platform, Apply now to become a tutor and start earing money teaching!",
        },
      });
    },
  });

  this.route('signup', {
    path: '/signup',
    template: 'register',
    onBeforeAction() {
      Session.set('currentRoute', 'register');
      Session.set('promoToken', '');

      return this.next();
    },
  });

  this.route('signup/:promo', {
    path: '/signup/:promo',
    template: 'register',
    onBeforeAction() {
      Session.set('currentRoute', 'register');
      Session.set('promoToken', this.params.promo);

      return this.next();
    },
    onAfterAction() {
      SEO.set({
        title: 'Sign Up for Tutor App',
        link: { icon: 'dummyurl' },
        meta: { description: "We're a new type of tutoring platform, sign up with my promotion code and get $10 for free." },
        og: {
          title: 'Tutor App Student Registration',
          description: "We're a new type of tutoring platform, sign up with my promotion code and get $10 for free.",
        },
      });
    },
  });

  this.route('authorize', {
    path: '/authorize',
    template: 'signup',
    onBeforeAction() {
      Session.set('currentRoute', 'authorize');
      Session.set('betaToken', '');

      return this.next();
    },
  });

  this.route('authorize/:token', {
    path: '/authorize/:token',
    template: 'signup',
    onBeforeAction() {
      Session.set('currentRoute', 'authorize-token');
      Session.set('betaToken', this.params.token);

      return this.next();
    },
  });

  // Policy Routes

  this.route('independent-tutor-agreement', {
    path: '/independent-tutor-agreement',
    template: 'independent-tutor-agreement',
    onBeforeAction() {
      Session.set('currentRoute', 'independent-tutor-agreement');

      return this.next();
    },
  });

  this.route('terms-of-use', {
    path: '/terms-of-use',
    template: 'terms-of-use',
    onBeforeAction() {
      Session.set('currentRoute', 'terms-of-use');

      return this.next();
    },
  });

  this.route('privacy-policy', {
    path: '/privacy-policy',
    template: 'privacy-policy',
    onBeforeAction() {
      Session.set('currentRoute', 'privacy-policy');

      return this.next();
    },
  });

  this.route('tutor-payment-policy', {
    path: '/tutor-payment-policy',
    template: 'tutor-payment-policy',
    onBeforeAction() {
      Session.set('currentRoute', 'tutor-payment-policy');

      return this.next();
    },
  });

  this.route('24-hour-cancellation', {
    path: '/24-hour-cancellation',
    template: 'cancellation',
    onBeforeAction() {
      Session.set('currentRoute', '24-hour-cancellation');

      return this.next();
    },
  });
  this.route('login', {
    path: '/login',
    template: 'login',
    onBeforeAction() {
      Session.set('currentRoute', 'login');

      return this.next();
    },
  });

  this.route('loginError', {
    path: '/login/:error',
    template: 'login',
    onBeforeAction() {
      Session.set('currentRoute', 'login');

      return this.next();
    },
    data() {
      templateData = { error: this.params.query.msg };

      return templateData;
    },
  });

  this.route('recover-password', {
    path: '/recover-password',
    template: 'recoverPassword',
    onBeforeAction() {
      Session.set('currentRoute', 'recover-password');

      return this.next();
    },
  });

  this.route('reset-password', {
    path: '/reset-password/:token',
    template: 'resetPassword',
    onBeforeAction() {
      Session.set('currentRoute', 'reset-password');
      Session.set('resetPasswordToken', this.params.token);

      return this.next();
    },
  });


  // User Settings, historical data

  this.route('tutorSubjects', {
    path: '/settings/subjects',
    template: 'tutorSubjects',
    waitOn() {
      return Meteor.subscribe('tutorSubjects');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'tutor-subjects');

      return this.next();
    },
  });

  this.route('credit-card', {
    path: '/settings/payments',
    template: 'creditCard',
    waitOn() {
      return Meteor.subscribe('userCard');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'account');

      return this.next();
    },
  });

  this.route('transaction-history', {
    path: '/settings/transaction-history',
    template: 'transactions',
    waitOn() {
      return Meteor.subscribe('transactions');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'transactions');

      return this.next();
    },
  });

  this.route('lesson-history', {
    path: '/settings/lesson-history',
    template: 'lessons',
    waitOn() {
      return Meteor.subscribe('lessons');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'lessons');

      return this.next();
    },
  });

  // ADMIN ONLY ROUTES

  this.route('invites', {
    path: '/admin/invites',
    template: 'invites',
    waitOn() {
      return Meteor.subscribe('/admin/invites');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'invites');

      return this.next();
    },
  });


  this.route('adminTutors', {
    path: '/admin/tutors',
    template: 'adminTutors',
    waitOn() {
      return Meteor.subscribe('/admin/tutors');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'verification');

      return this.next();
    },
  });


  this.route('adminVerificationSingle', {
    path: '/admin/tutors/:id',
    template: 'adminVerficationSingle',
    waitOn() {
      return Meteor.subscribe('adminVerficationSingle', { id: this.params.id });
    },
    data() {
      const tutor = Meteor.users.findOne({ _id: this.params.id });

      console.log(tutor);

      return tutor;
    },
    onBeforeAction() {
      Session.set('currentRoute', 'verification');

      return this.next();
    },
  });


  this.route('invitee', {
    path: '/admin/invite/:id',
    template: 'invitee',
    waitOn() {
      return Meteor.subscribe('tutorApproveSingle', { id: this.params.id });
    },
    data() {
      return Tutors.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'invites');

      return this.next();
    },
  });

  this.route('adminChats', {
    path: '/admin/chats',
    waitOn() {
      return Meteor.subscribe('allChats');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'all chats');

      return this.next();
    },
  });

  this.route('adminChatView', {
    path: '/admin/chat/:id',
    template: 'message',
    waitOn() {
      return Meteor.subscribe('adminChatMessages', { chat: this.params.id });
    },
    data() {
      return Chats.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'single chats');

      return this.next();
    },
  });

  this.route('adminReviews', {
    path: '/admin/reviews',
    template: 'listReviews',
    waitOn() {
      return Meteor.subscribe('reviews');
    },
    onBeforeAction() {
      Session.set('currentRoute', 'reviews');
      this.next();
    },
  });

  this.route('adminReview', {
    path: '/admin/review/:id',
    template: 'adminReview',
    waitOn() {
      return Meteor.subscribe('adminReview', { id: this.params.id });
    },
    data() {
      return Reviews.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'review');
      this.next();
    },
  });

  this.route('pages', {
    path: '/admin/pages',
    template: 'listPages',
    waitOn() {
      return Meteor.subscribe('pages');
    },
    data() {
      const copy = {
        name: 'Page',
        nameL: 'page',
        addPage: true,
      };

      return copy;
    },
    onBeforeAction() {
      Session.set('currentRoute', 'pages');
      this.next();
    },
  });

  this.route('posts', {
    path: '/admin/post-lists',
    template: 'blogPostList',
    onBeforeAction() {
      Session.set('currentRoute', 'posts');
      this.next();
    },
  });

  this.route('siteSettings', {
    path: '/admin/settings',
    template: 'site-settings',
    waitOn() {
      return Meteor.subscribe('siteSettings');
    },
    data() {
      return Settings.findOne({});
    },
    onBeforeAction() {
      Session.set('currentRoute', 'siteSettings');
      this.next();
    },
  });

  this.route('newPage', {
    path: '/admin/pages/new',
    template: 'newPage',
    onBeforeAction() {
      Session.set('currentRoute', 'new-page');

      return this.next();
    },
  });

  this.route('editPost', {
    path: '/admin/blog/edit/:id',
    template: 'newPost',
    waitOn() {
      return Meteor.subscribe('editPost', { id: this.params.id });
    },
    data() {
      return Posts.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'edit-post');

      return this.next();
    },
  });

  this.route('editPage', {
    path: '/admin/pages/edit/:id',
    template: 'newPage',
    waitOn() {
      return Meteor.subscribe('pages');
    },
    data() {
      return Pages.findOne({ _id: this.params.id });
    },
    onBeforeAction() {
      Session.set('currentRoute', 'edit-page');

      return this.next();
    },
  });


  // / Client side blog post Routes
  // this.route('singlePost', {
  //   path: '/blog/:slug',
  //   template: 'singlePost',
  //   waitOn() {
  //     return Meteor.subscribe('singlePosts');
  //   },
  //   data() {
  //     return Posts.findOne({ slug: this.params.slug });
  //   },
  //   onAfterAction() {
  //     const page = Posts.findOne({ slug: this.params.slug });
  //     console.log('on after', page);
  //     const title = `${page.metaTitle || page.title} | Tutor the People`;
  //     const description = page.metaDescription;
  //     SEO.set({
  //       title,
  //       meta: {
  //         description,
  //       },
  //       og: {
  //         title,
  //         description,
  //         image: post.featuredImage,
  //       },
  //     });
  //   },
  // });


  // / Client side blog post Routes
  this.route('singleCategory', {
    path: '/blog/category/:slug',
    template: 'blog',
    waitOn() {
      return Meteor.subscribe('categoryPosts', { slug: this.params.slug });
    },
    data() {
      return Posts.find({});
    },
  });

  // / Client side pages Routes
  this.route('singlePage', {
    path: '/:slug',
    template: 'singlePage',
    waitOn() {
      return Meteor.subscribe('pages');
    },
    data() {
      return Pages.findOne({ slug: this.params.slug });
    },
    onAfterAction() {
      const page = Pages.findOne({ slug: this.params.slug });

      console.log('on after', page);
      const title = `${page.metaTitle || page.title} | Tutor the People`;
      const description = page.metaDescription;

      SEO.set({
        title,
        meta: { description },
        og: {
          title,
          description,
          image: 'set a url',
        },
      });
    },
  });
});
