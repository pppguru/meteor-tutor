//
// Template.blog.helpers({
//   posts: function() {
//
//     return this;
//   },
//   cleanDate: function(createdAt) {
//     return moment(createdAt).format("MMM Do YY");
//   },
//   getCategories: function(categories) {
//     var categoryList = '';
//     for (var i = 0; i < categories.length; i++) {
//       var category = Categories.findOne({_id: categories[i]});
//       categoryList += '<a href ="/blog/category/' + category.slug + '">';
//       categoryList += category.name + '</a>';
//       if ((categories.length - i) === 1) {
//         // categoryList += ', ';
//       } else {
//         categoryList += ', ';
//       }
//     }
//     return categoryList;
//   }
// });
