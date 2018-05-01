import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Roles} from 'meteor/alanning:roles';
import {check} from 'meteor/check';
import Categories from '/collections/categories';
import Lessons from '/collections/lessons';
import Pages from '/collections/pages';
import Posts from '/collections/posts';
import Reviews from '/collections/reviews';
import Settings from '/collections/settings';
import Subjects from '/collections/subjects';
import Tutors from '/collections/tutors';
import Chats from '/collections/chats';
import Messages from '/collections/messages';
/*
  Publications
  Define Meteor publications to subscribe to on the client.
 */
Meteor.publish('/admin/invites', function() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Tutors.find({}, {
            fields: {
                "_id": 1,
                "inviteNumber": 1,
                "requested": 1,
                "email": 1,
                "token": 1,
                "profile": 1,
                "dateInvited": 1,
                "invited": 1,
                "accountCreated": 1,
                "promoToken": 1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('/admin/tutors', function() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Meteor.users.find({
            roles: 'tutor'
        }, {
            fields: {
                "_id": 1,
                "profile": 1,
                "geoLocation": 1,
                "specialities": 1,
                "scheduling": 1,
                "pendingVerification": 1,
                "dateUpdated": 1,
                "education": 1,
                "reviews": 1,
                "address": 1,
                "rate": 1,
                "slug": 1,
                "meta": 1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('tutorApproveSingle', function(id) {
    check(id, Object);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Tutors.find({_id: id.id});
    } else {
        this.ready();
    }
});

Meteor.publish('adminVerficationSingle', function(id) {
    check(id, Object);
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Meteor.users.find({_id: id.id});
    } else {
        this.ready();
    }
});

Meteor.publish('allChats', function() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        const chats = Chats.find({}, {
            sort: {
                updatedAt: -1
            },
            fields: {
                _id: 1,
                student_id: 1,
                tutor_id: 1,
                chat_id: 1,
                updatedAt: 1,
                createdAt: 1
            }
        });
        const users = Meteor.users.find({});
        return [chats, users];
    } else {
        this.ready();
    }
});

Meteor.publish('reviews', function() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        const reviews = Reviews.find({}, {
            sort: {
                createdAt: -1
            },
            fields: {
                _id: 1,
                content: 1,
                rating: 1,
                overallRating: 1,
                flagged: 1,
                tutor: 1,
                reviewer: 1,
                createdAt: 1
            }
        });
        const users = Meteor.users.find({});
        return [reviews, users];
    } else {
        this.ready();
    }
});

Meteor.publish('adminReview', function(review) {
    check(review, Object);

    if (Roles.userIsInRole(this.userId, ['admin'])) {
        const reviews = Reviews.find({_id: review.id});
        const reviewSingle = Reviews.findOne({_id: review.id});
        const tutors = Meteor.users.find({_id: reviewSingle.tutor});

        return [reviews, tutors];
    } else {
        this.ready();
    }
});

Meteor.publish('adminChatMessages', function(chat) {
    check(chat, {chat: String});
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        messages = Messages.find({chat_id: chat.chat});
        chats = Chats.find({_id: chat.chat});
        message = Messages.findOne({chat_id: chat.chat});
        if (message) {
            from = Meteor.users.find({
                _id: {
                    $in: [message.student_id, message.tutor_id]
                }
            });
            return [messages, from, chats];
        } else {
            this.ready();
        }
    } else {
        this.ready();
    }
});

Meteor.publish('siteSettings', function() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        var settings = Settings.find({});
        var pages = Pages.find({});
        return [pages, settings];
    } else {
        this.ready();
    }
});

Meteor.publish('siteSettingsHeader', () => {
    return Settings.find({});
});

Meteor.publish('inviteCount', () => {
    return Tutors.find({}, {
        fields: {
            _id: 1
        }
    });
});

Meteor.publish('userData', function() {
    currentUser = this.userId;
    if (currentUser) {
        var user = Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                "_id": 1,
                "emails[0].address": 1,
                "profile": 1,
                "rate": 1,
                "payment": 1,
                "brainPoints": 1,
                "recipient": 1,
                "learnedMinutes": 1,
                "promoToken": 1,
                "education": 1,
                "hasReviewed": 1,
                "amountReferred": 1,
                "referredBy": 1,
                "pendingVerification": 1,
                "minutesTaught": 1,
                "specialities": 1,
                "customerId": 1,
                "completedProfile": 1,
                "scheduling": 1,
                "meetingPreference": 1,
                "hasHadSession": 1,
                "referred": 1,
                "reviews": 1,
                "lastActive": 1,
                "needStripeAccount": 1,
                "studentsTaught": 1,
                "geoLocation": 1,
                "address": 1,
                "completedPhoto": 1,
                "completedSingleSubject": 1,
                "completedAvailiability": 1

            }
        });
        return [user];
    } else {
        this.ready();
    }
});

Meteor.publish('tutorProfile', function() {
    currentUser = this.userId;
    if (currentUser) {
        let reviews;
        reviews = Reviews.find({
            $and: [
                {
                    tutor: {
                        $eq: this.userId
                    }
                }
            ]
        }, {
            fields: {
                content: 1,
                createdAt: 1,
                rating: 1,
                tutor: 1,
                overallRating: 1,
                reviewer: 1
            }
        });

        const reviewers = [];
        reviews.forEach((review) => {
            reviewers.push(review.reviewer);
        });

        var users = Meteor.users.find({
            _id: {
                $in: reviewers
            }
        }, {
            fields: {
                _id: 1,
                profile: 1
            }
        });
        // console.log('users', users);

        Counts.publish(this, 'total-reviews', Reviews.find({
            $and: [
                {
                    tutor: {
                        $eq: this.userId
                    }
                }
            ]
        }));
        return [users, reviews];
    }
});

Meteor.publish('referredUsers', function() {
    const currentUser = this.userId;
    if (currentUser) {
        var user = Meteor.users.findOne({_id: this.userId});

        return Meteor.users.find({
            _id: {
                $in: user.referred
            }
        }, {
            fields: {
                _id: 1,
                profile: 1,
                roles: 1,
                minutesTaught: 1,
                learnedMinutes: 1,
                learnedTen: 1,
                studentsTaught: 1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('pages', function() {
    return Pages.find({});
});

Meteor.publish('editPost', function(id) {
    check(id, {id: String});

    const posts = Posts.find({_id: id.id});
    const categories = Categories.find({}, {
        fields: {
            "_id": 1,
            "name": 1
        }
    });
    return [posts, categories];
});

Meteor.publish('pageEdit', function(id) {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
        return Pages.find({});
    } else {
        this.ready();
    }
});

Meteor.publish('posts', function() {
    var categories = Categories.find({}, {
        fields: {
            "_id": 1,
            "name": 1,
            "slug": 1
        }
    });
    const posts = Posts.find({});
    return [posts, categories];
});

Meteor.publish('singlePosts', function() {
    var allCategories = Categories.find({}, {
        fields: {
            "_id": 1,
            "name": 1,
            "slug": 1
        }
    });
    const posts = Posts.find({});
    return [posts, allCategories];
});

Meteor.publish('categoryPosts', function(slug) {
    check(slug, {slug: String});
    var category = Categories.findOne({
        slug: slug.slug
    }, {
        fields: {
            "_id": 1
        }
    });
    var posts = Posts.find({
        'categories': category._id
    }, {
        fields: {
            "_id": 1,
            "title": 1,
            "categories": 1,
            "featuredImage": 1,
            "slug": 1,
            "content": 1,
            "createdAt": 1
        }
    });

    const categories = Categories.find({}, {
        fields: {
            "_id": 1,
            "slug": 1,
            "name": 1
        }
    });
    return [posts, categories];
});

Meteor.publish('categories', function() {
    return Categories.find({}, {
        "_id": 1,
        "name": 1,
        "slug": 1
    });
});

Meteor.publish('userCard', function() {
    currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
            _id: currentUser
        }, {
            fields: {
                'emails[0].address': 1,
                payment: 1,
                brainPoints: 1,
                recipient: 1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('tutors', function() {
    var reviews;
    var tutors = Meteor.users.find({
        roles: 'tutor'
    }, {
        fields: {
            "_id": 1,
            "profile.firstName": 1,
            "profile.lastName": 1,
            "profile.avatar": 1,
            "profile.biography": 1,
            "geoLocation": 1,
            "specialities": 1,
            "scheduling": 1,
            "reviews": 1,
            "address.city": 1,
            "address.state": 1,
            "rate": 1,
            "slug": 1,
            "meta": 1
        }
    });
    var subjects = Subjects.find({}, {
        fields: {
            "_id": 1,
            "type": 1,
            "name": 1
        }
    });

    return [tutors, subjects];
});

// Meteor.publish('tutorSingle', function(tutor) {
//   check(tutor, Object);
//   var reviews;
//   var tutors = Meteor.users.find(
//     {
//       roles: 'tutor'
//     }, {
//     fields: {
//       "_id": 1,
//       "profile": 1,
//       "geoLocation": 1,
//       "specialities": 1,
//       "studentsTaught": 1,
//       "scheduling": 1,
//       "reviews": 1,
//       "address": 1,
//       "education": 1,
//       "rate":1,
//       "slug":1,
//       "meta": 1
//     }
//   });
//
//
//   var tutorSingle = Meteor.users.findOne(
//     {
//       $and: [
//         {slug: {$eq: tutor.slug}},
//         {'meta.city': {$eq: tutor.city}},
//         {'meta.state': {$eq: tutor.state}}
//       ]
//     }, {
//       fields: {
//         "_id": 1,
//         "profile": 1,
//         "geoLocation": 1,
//         "specialities": 1,
//         "studentsTaught": 1,
//         "scheduling": 1,
//         "reviews": 1,
//         "address": 1,
//         "rate":1,
//         "slug":1,
//         "meta": 1
//       }
//     }
//   );
//
//   if (Roles.userIsInRole(currentUser, ['admin'])) {
//     reviews = Reviews.find({});
//     Counts.publish(this, 'total-reviews', Reviews.find());
//   } else {
//     reviews = Reviews.find({
//       $and: [
//         {flagged: {$ne: true}},
//         {tutor: {$eq: tutorSingle._id}}
//       ]
//     });
//
//     Counts.publish(this, 'total-reviews', Reviews.find({
//       $and: [
//         {flagged: {$ne: true}},
//         {tutor: {$eq: tutorSingle._id}}
//       ]
//     }));
//   }
//
//   return [tutors, reviews];
// });

Meteor.publish('tutorPromo', (tutor) => {
    check(tutor, Object);
    return Meteor.users.find({
        promoToken: tutor.promoToken
    }, {
        fields: {
            _id: 1,
            'profile.firstName': 1
        }
    });
});

Meteor.publish('tutorSingle', function(tutor) {
    check(tutor, Object);
    var reviews;
    var tutors = Meteor.users.find({
        roles: 'tutor'
    }, {
        fields: {
            "_id": 1,
            "profile": 1,
            "geoLocation": 1,
            "specialities": 1,
            "scheduling": 1,
            "studentsTaught": 1,
            "education": 1,
            "meetingPreference": 1,
            "reviews": 1,
            "address": 1,
            "rate": 1,
            "slug": 1,
            "meta": 1
        }
    });

    var tutorSingle = Meteor.users.findOne({
        $and: [
            {
                slug: {
                    $eq: tutor.slug
                }
            }, {
                'meta.city': {
                    $eq: tutor.city
                }
            }, {
                'meta.state': {
                    $eq: tutor.state
                }
            }
        ]
    }, {
        fields: {
            "_id": 1
        }
    });

    if (Roles.userIsInRole(currentUser, ['admin'])) {
        reviews = Reviews.find({});
        Counts.publish(this, 'total-reviews', Reviews.find());
    } else {
        reviews = Reviews.find({
            $and: [
                {
                    flagged: {
                        $ne: true
                    }
                }, {
                    tutor: {
                        $eq: tutorSingle._id
                    }
                }
            ]
        });

        Counts.publish(this, 'total-reviews', Reviews.find({
            $and: [
                {
                    flagged: {
                        $ne: true
                    }
                }, {
                    tutor: {
                        $eq: tutorSingle._id
                    }
                }
            ]
        }));
    }

    return [tutors, reviews];
});

Meteor.publish('tutorSubjects', function() {
    var user = "",
        subjects = "";
    if (currentUser) {
        return [
            Subjects.find({}, {
                "_id": 1,
                "type": 1,
                "name": 1
            }),
            Meteor.users.find({
                _id: currentUser
            }, {
                fields: {
                    "emails[0].address": 1,
                    "specialities": 1
                }
            })
        ];
    }
});

Meteor.publish('tutorsCategory', function(category) {
    check(category, {category: String});
    var categories = Subjects.find({
        type: category.category
    }, {
        fields: {
            "_id": 1
        }
    }).fetch();
    for (i = 0; i < categories.length; i++) {
        categories[i].specialities = categories[i]._id;
        delete categories[i]._id;
    }
    var tutors = Meteor.users.find({
        roles: 'tutor',
        $or: categories
    }, {
        fields: {
            "_id": 1,
            "profile": 1,
            "address": 1,
            "geoLocation": 1,
            "specialities": 1,
            "scheduling": 1,
            "rate": 1,
            "slug": 1
        }
    });

    const subjects = Subjects.find({}, {
        fields: {
            "_id": 1,
            "type": 1,
            "name": 1
        }
    });
    return [tutors, subjects];
});

// Subscribe to an invoice

Meteor.publish('lessons', function() {
    currentUser = this.userId;
    if (Roles.userIsInRole(this.userId, ['tutor'])) {
        return Lessons.find({tutor_id: this.userId});
    } else if (Roles.userIsInRole(this.userId, ['student'])) {
        return Lessons.find({student_id: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish('transactions', function() {
    currentUser = this.userId;
    if (Roles.userIsInRole(this.userId, ['tutor'])) {
        return Lessons.find({
            $and: [
                {
                    "tutor_id": this.userId
                }, {
                    "payment": {
                        $eq: "resolved"
                    }
                }
            ]
        });
    } else if (Roles.userIsInRole(this.userId, ['student'])) {
        return Lessons.find({
            $and: [
                {
                    "student_id": this.userId
                }, {
                    "payment": {
                        $eq: "resolved"
                    }
                }
            ]
        });
    } else {
        this.ready();
    }
});

Meteor.publish('singleInvoice', function(data) {
    check(data, Object);
    currentUser = this.userId;
    if (Roles.userIsInRole(currentUser, ['tutor'])) {
        return Invoices.find({_id: data.invoice});
    } else {
        this.ready();
    }
});

// subscribe to messages

Meteor.publish('messages', function() {
    currentUser = this.userId;
    var messages,
        chats,
        users;
    if (Roles.userIsInRole(this.userId, ['tutor'])) {
        chats = Chats.find({
            "tutor_id": this.userId
        }, {
            sort: {
                updatedAt: -1
            },
            fields: {
                "_id": 1,
                "student_id": 1,
                "tutor_id": 1,
                "updatedAt": 1,
                "createdAt": 1
            }
        });
        messages = Messages.find({
            "tutor_id": this.userId
        }, {
            fields: {
                "_id": 1,
                "student_id": 1,
                "student_name": 1,
                "chat_id": 1,
                "message": 1,
                "time": 1,
                "from_id": 1,
                "read": 1
            }
        });
        const students = [];
        chats.forEach((chat) => {
            students.push(chat.student_id);
        });

        users = Meteor.users.find({
            _id: {
                $in: students
            }
        }, {
            fields: {
                "_id": 1,
                "profile": 1
            }
        });

    } else if (Roles.userIsInRole(this.userId, ['student'])) {
        chats = Chats.find({
            "student_id": this.userId
        }, {
            sort: {
                updatedAt: -1
            }
        });
        messages = Messages.find({
            "student_id": this.userId
        }, {
            fields: {
                "_id": 1,
                "tutor_id": 1,
                "chat_id": 1,
                "tutor_name": 1,
                "from": 1,
                "read": 1,
                "time": 1,
                "message": 1
            }
        });
        const tutors = [];

        chats.forEach((chat) => {
            tutors.push(chat.tutor_id);
        });

        users = Meteor.users.find({
            _id: {
                $in: tutors
            }
        }, {
            fields: {
                _id: 1,
                'profile.firstName': 1,
                'profile.lastName': 1,
                'profile.avatar': 1,
                'profile.biography': 1,
                'address.city': 1,
                'address.state': 1,
                promoToken: 1,
                rate: 1
            }
        });
    }
    return [chats, messages, users];
});

Meteor.publish('notifications', function() {
    currentUser = this.userId;
    Counts.publish(this, 'notification-count', Messages.find({
        $and: [
            {
                read: false
            }, {
                from_id: {
                    $ne: currentUser
                }
            }, {
                $or: [
                    {
                        tutor_id: currentUser
                    }, {
                        student_id: currentUser
                    }
                ]
            }
        ]
    }));
});

Meteor.publish('chatMessages', function(chat) {
    check(chat, {chat: String});
    messages = Messages.find({"chat_id": chat.chat});
    message = Messages.findOne({"chat_id": chat.chat});
    lessons = Lessons.find({"chat_id": chat.chat});
    if (message) {
        var msgFrom = Meteor.users.find({
            _id: {
                $in: [message.student_id, message.tutor_id]
            }
        }, {
            fields: {
                profile: 1,
                emails: 1
            }
        });
        return [messages, msgFrom, lessons];
    } else {
        this.ready();
    }
});

Meteor.publish('userPresence', function() {
    var filter = {
        userId: {
            $exists: true
        }
    };
    return Presences.find(filter, {
        fields: {
            state: true,
            userId: true
        }
    });
});

Meteor.publish('user/invite', (promoToken) => {
    check(promoToken, String);
    const config = {
        fields: {
            'profile.firstName': 1,
            promoToken: 1
        }
    };
    return Meteor.users.find({
        promoToken
    }, config);
});

Meteor.publish(null, function() {
    return Meteor.roles.find({})
})
