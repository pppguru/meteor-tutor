import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { AlgoliaSearch } from 'meteor/acemtp:algolia';
import { check } from 'meteor/check';
import { GeoCoder } from 'meteor/aldeed:geocoder';
import { Roles } from 'meteor/alanning:roles';

import Tutors from '/collections/tutors';

let secret;


if (process.env.NODE_ENV === 'production') {
  secret = Meteor.settings.private.stripe.liveSecretKey;
} else {
  secret = Meteor.settings.private.stripe.testSecretKey;
}

const stripe = StripeAPI(secret);
const client = AlgoliaSearch(Meteor.settings.algolia.applicationId, Meteor.settings.algolia.api_key);
const index = client.initIndex(Meteor.settings.algolia.tutorIndex);

/*
  Beta Tokens
  Collection of methods for handling beta tokens.
 */
Meteor.methods({
  validateBetaToken(user) {
    // Initialize the geocoder
    const geo = new GeoCoder({
      httpAdapter: 'https',
    });


    let id, invite;
    check(user, {
      email: String,
      password: String,
      betaToken: String,
    });
    invite = Tutors.findOne({
      email: user.email,
      token: user.betaToken,
    }, {
      fields: {
        _id: 1,
        email: 1,
        profile: 1,
        address: 1,
        token: 1,
        promoToken: 1,
      },
    });


    if (!invite) {
      throw new Meteor.Error('bad-match', "Hmm, this token doesn't match your email. Try again?");
    } else {
      let promo = false;
      const lookupPromo = Meteor.users.findOne({
        promoToken: invite.promoToken,
      });
      if (invite.promoToken !== '') {
        if (!lookupPromo) {
          // throw new Meteor.Error('customer-exists', 'Bad Promo Code');
        } else {
          promo = true;
        }
      }

      const token = `promo${Random.hexString(10)}`;
      id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          firstName: invite.profile.firstName,
          lastName: invite.profile.lastName,
          phoneNumber: invite.profile.phoneNumber,
          specialities: invite.profile.specialities,
          videoId: invite.profile.videoId,
          videoShare: invite.profile.videoShare,
          resume: invite.profile.resume,
          avatar: invite.profile.avatar,
        },
      });

      // Generate a Slug
      const combineName = `${invite.profile.firstName}-${invite.profile.lastName.substring(0, 1)}`;
      let nameSlug = combineName.toLowerCase();
      let _nameUsed = true;
      let _nameInc = 0;
      while (_nameUsed == true) {
        checkSlug = Meteor.users.findOne({
          slug: nameSlug,
        });
        if (!checkSlug) {
          Meteor.users.update({ _id: id }, { $set: { slug: nameSlug } });
          _nameUsed = false;
        } else {
          _nameInc++;
          const nameNum = _nameInc.toString();
          nameSlug += `-${nameNum}`;
        }
      }

      // Handle promotional token information

      if (lookupPromo) {
        Meteor.users.update(id, { $set: { referredBy: lookupPromo._id } });
        Meteor.users.update({
          promoToken: invite.promoToken,
        }, {
          $push: { referred: id },
        });
        if (Roles.userIsInRole(lookupPromo, ['student'])) {
          stripe.customers.retrieve(lookupPromo.customerId, (err, customer) => {
            account_balance = customer.account_balance;
            account_balance = account_balance - 1000;
            stripe.customers.update(lookupPromo.customerId, {
              account_balance,
            });
          });
        }
      }

      /*
      /  Set important things for later, referred are all the people they refer,
      /  hours taught is for whoever promotes them (and visual to the profile), reviews
      /  will be an array of IDS to pull in the reviews publication, and rate is set
      /  default to 25
      */

      let city = invite.address.city;
      city = city.replace(/\s+/g, '-').toLowerCase();

      let state = invite.address.state;
      state = state.replace(/\s+/g, '-').toLowerCase();

      Meteor.users.update({ _id: id }, {
        $set: {
          promoToken: token,
          referred: [],
          minutesTaught: 0,
          taughtTen: false,
          studentsTaught: [],
          lessons: [],
          reviews: [],
          specialities: [],
          invoices: [],
          notifications: true,
          amountReferred: 0,
          meetingPreference: 0,
          scheduling: [
            { name: 'monday', value: 0 },
            { name: 'tuesday', value: 0 },
            { name: 'wednesday', value: 0 },
            { name: 'thursday', value: 0 },
            { name: 'friday', value: 0 },
            { name: 'saturday', value: 0 },
            { name: 'sunday', value: 0 },
          ],
          education: [],
          address: {
            address: invite.address.address,
            city: invite.address.city,
            state: invite.address.state,
            postal: invite.address.postal,
          },
          ratings: [],
          needStripeAccount: true,
          rate: 45,
          'meta.city': city,
          'meta.state': state,
          pendingVerification: false,
          cronEmails: {
            complete: false,
            incompleted: false,
            referral: false,
            session: false,
            login: false,
          },
          completedPhoto: false,
          completedSingleSubject: false,
          completedAvailiability: false,
        },
      });

      Roles.addUsersToRoles(id, ['tutor']);
      Tutors.update(invite._id, {
        $set: {
          accountCreated: true,
        },
        $unset: {
          token: '',
        },
      });
      let geoLocation;
      // Add Geolocation to tutor creation
      if (invite.address.address) {
        const fullAddress = `${invite.address.address} ${invite.address.city}, ${invite.address.state}`;
        const geoPull = geo.geocode(fullAddress);
        if (geoPull.length > 0) {
          geoLocation = {
            geoLocation: {
              latitude: geoPull[0].latitude,
              longitude: geoPull[0].longitude,
              zipcode: geoPull[0].zipcode,
            },
          };
          Meteor.users.update({ _id: id }, { $set: geoLocation });
        }
      }

      // Insert Users into algolia


      index.partialUpdateObject({
        objectID: id,
        profile: {
          firstName: invite.profile.firstName,
          lastName: invite.profile.lastName,
          phoneNumber: invite.profile.phoneNumber,
          specialities: invite.profile.specialities,
          videoId: invite.profile.videoId,
          resume: invite.profile.resume,
          avatar: invite.profile.avatar,
        },
        pendingVerification: false,
        online: 0,
        address: {
          address: invite.address.address,
          city: invite.address.city,
          state: invite.address.state,
          postal: invite.address.postal,
        },
        _geoloc: {
          lat: geoLocation.geoLocation.latitude,
          lng: geoLocation.geoLocation.longitude,
        },
        completedProfile: {
          photo: false,
          singleSubject: false,
          availiability: false,
        },
        meetingPreference: 0,
        rate: 45,
        id,
      });

      return true;
    }
  },
});
