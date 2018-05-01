import { Meteor } from 'meteor/meteor';
import { SearchSource } from 'meteor/meteorhacks:search-source';

function buildRegExp(searchText) {
  const words = searchText.trim().split(/[ \-\:]+/);
  const exps = _.map(words, (word) => {
    return `(?=.*${word})`;
  });
  const fullExp = `${exps.join('')}.+`;
  return new RegExp(fullExp, 'i');
}


SearchSource.defineSource('tutors', (searchText, options) => {
  var options = {
    roles: 'tutor',
    sort: { profile: -1 },
    files: {
      _id: 1,
      profile: 1,
      address: 1,
      geoLocation: 1,
      specialities: 1,
      rate: 1,
      slug: 1,
    },
    limit: 20,
  };

  if (searchText) {
    const regExp = buildRegExp(searchText);
    console.log(regExp);
    const selector = { 'profile.firstName': regExp, 'profile.lastName': regExp };
    console.log('guy');
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({
      roles: 'tutor',
    }, {
      fields: {
        _id: 1,
        profile: 1,
        address: 1,
        geoLocation: 1,
        specialities: 1,
        rate: 1,
        slug: 1,
      } }).fetch();
  }
});
