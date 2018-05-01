import { Meteor } from 'meteor/meteor';

// TODO: Apply some logic which will check against this never being ran.
// https://atmospherejs.com/percolate/migrations

const migrate = () => {
  console.log('Running Rate Migration');
  const users = Meteor.users.find({
    rate: { $exists: true },
  }, { fields: { rate: 1 } }).fetch();

  _.each(users, (user) => {
    Meteor.users.update(user._id, {
      $set: {
        rate: parseInt(user.rate, 10),
      },
    });
  });
  console.log('Completed Rate Migration');
};

// migrate();
