/*
* Allow
*/

Meteor.users.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});

/*
* Deny
*/

Meteor.users.deny({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

if(Meteor.isServer) {
  Meteor.users._ensureIndex({"profile.firstName": 1, "profile.lastName": 1, "address.city": 1, "slug": 1, "rate": 1});
  Meteor.users._ensureIndex({ 'address.geo': '2dsphere' }, { sparse: 1 });
}

EasySearch.createSearchIndex('users', {
  field: ['profile.firstName', 'address.city', 'profile.lastName', 'roles', 'slug', 'rate'],
  collection: Meteor.users,
  use: 'mongo-db',
  limit: 10,
  query: function (searchString, opts) {
    // Default query that is used for searching
    console.log('searchstring', searchString);
    // if (this.props.filteredCategories.length > 0) {
    //     console.log('props', this.props);
    //   query.categories = {'profile.position': {$in : ['dev']} };
    // }

    var query = EasySearch.getSearcher(this.use).defaultQuery(this, '^'+searchString);
    query.roles = { $in : ['tutor']};
    console.log(query);
    // if (this.props.filteredCategories) {
    //   searchString = 'd';
    //   query = '';
    //   query = EasySearch.getSearcher(this.use).defaultQuery(this, this.props.filteredCategories);
    //   console.log(this.props.filteredCategories);
    //
    // } else {
    //
    // }
    // console.log(query.$or);



    return query;
  }
});
