import { Meteor } from 'meteor/meteor';
// Returns user name from Meteor.userId() - prints last name using
// first letter and . by default eg: Kevin L. - set truncateLastName to false for full last name
const getUserNameById = (userId, truncateLastName = true) => {
  const user = Meteor.users.findOne({ _id: userId });
  let firstName, lastName;

  if (user) {
    firstName = user.profile.firstName;
    lastName = (truncateLastName) ? `${user.profile.lastName.substring(0, 1)}.` : user.profile.lastName;

    return `${firstName} ${lastName}`;
  }
};

// Return tutors personalized slug
const getTutorUrl = (userId) => {
  const user = Meteor.users.findOne({ _id: userId });

  let state, city, slug;

  if (user) {
    state = user.meta.state;
    city = user.meta.city;
    slug = user.slug;

		// some tutors apparently don't have a city, which leads to urls like this:
		// /tutor/tx//tutor-o
    return `/tutor/${state}/${city}/${slug}`.replace(/\/\//g, '\/-\/');
  }
};

// Return the user's role eg: 'tutor', 'student'
const getUserType = () => {
  const user = Meteor.userId();

  if (!user)
    return;
  if (Roles.userIsInRole(user, ['tutor']))
    return 'tutor';
  if (Roles.userIsInRole(user, ['student']))
    return 'student';
};

// Capital first letter in each word
const capitalizeFirst = (str) => {
  if (str)
    return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

// Calculate lesson cost based on rate and minutes requested
const getLessonCost = (minutesRequested, currentRate) => {
  if (minutesRequested && currentRate)
    return (minutesRequested / 60) * currentRate;
};

// Add dollar sign to a 'number'
const formatUSD = (amt) => {
  if (amt)
    return `$${amt}`;
};

export { getUserNameById, getTutorUrl, getUserType, capitalizeFirst, getLessonCost, formatUSD };
