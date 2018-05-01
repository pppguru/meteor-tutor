import { Meteor } from 'meteor/meteor';

// TODO: Apply some logic which will check against this never being ran.
// https://atmospherejs.com/percolate/migrations

const migration = () => {
  console.log('Running Geo Migration');
  const users = Meteor.users.find({ geoLocation: { $exists: true } }).fetch();
  _.each(users, (user) => {
    if (user.geoLocation.longitude) {
      Meteor.users.update({
        _id: user._id,
      }, {
        $set: {
          'address.geo': [user.geoLocation.longitude, user.geoLocation.latitude],
        },
      });
    }
  });
  console.log('Completed Geo Migration');
};

// migration();
