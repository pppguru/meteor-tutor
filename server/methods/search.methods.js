import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const $project = {
  'profile.firstName': 1,
  'profile.lastName': 1,
  'profile.avatar': 1,
  'profile.biography': 1,
  'address.city': 1,
  'address.state': 1,
  slug: 1,
  dist: 1,
  rate: 1,
  status: 1,
  specialities: 1,
  scheduling: 1,
};

/**
 * Builds the search query
 * @method buildQuery
 * @param  {Number}   rateMin           the min rate to look up
 * @param  {Number}   rateMax           the max rate to look up
 * @param  {String}   subject           the subject to search for
 * @param  {Boolean}  online            should we should show online users
 * @param  {Number}   meetingPreference what type of meeting would the user like to see
 * @param  {Object}   availability      check what availability the student has chosen.
 * @return {Object}
 */
const buildQuery = function ({
  rateMin, rateMax, subject, online, meetingPreference, availability,
}) {
  // Create our starting query
  // Populate availability query.
  const query = {
    roles: 'tutor',
    rate: {
      $gte: rateMin,
      $lte: rateMax,
    },
    'specialities.subject': new RegExp(subject, 'gi'),
  };
  if (Object.keys(availability[0]).length === 0) {
    query.$and = [{}];
  } else {
    query.scheduling = {
      $all: _.map(availability, o => (
        {
          $elemMatch: {
            name: o.name || {},
            $or: [
              {
                value: o.value || {},
              },
              {
                value: '4',
              },
            ],
          },
        }
      )),
    };
  }


  // If the user has a preference for online search for the preference
  if (online) {
    query['status.online'] = true;
  }

  // If the user has a preference for in person or online search for the preference
  if (meetingPreference > 0) {
    query.meetingPreference = true;
  }
  // return the new query
  return query;
};

/**
 * Returns the aggregation pipeline to search for users
 * @method searchUsers
 * @param  {Number}    lat    the latitude to search around
 * @param  {Number}    lng    the longitude to search around
 * @param  {Object}    config the remaining search terms
 * @return {Array}
 */
const searchUsers = function ({ lat, lng, ...config }) {
  // the conversion for meters to miles
  const conversion = 1609.34;
  // the max distance in miles to search
  // const maxDistance = 60;
  return [
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng, lat] },
        query: buildQuery(config),
        distanceField: 'dist.calculated',
        includeLocs: 'dist.location',
        distanceMultiplier: 1 / conversion,
        // maxDistance: maxDistance * conversion, // TODO: We need to re-enable this in the future
        spherical: true,
      },
    },
    {
      $project,
    },
    {
      $sort: {
        rate: config.sort,
      },
    },
  ];
};

Meteor.methods({
  /**
   * Searches for tutors around an area
   */
  'search/tutors': function (config) {
    // check the incoming params
    check(config, {
      lat: Number,
      lng: Number,
      rateMin: Number,
      rateMax: Number,
      sort: Number,
      meetingPreference: Number,
      online: Boolean,
      subject: String,
      availability: [Object],
    });
    // run the aggregation
    return Meteor.users.aggregate(searchUsers(config));
  },
});
