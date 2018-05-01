// Template.singlePost.helpers({
//   dynamicContent: function() {
//     var container = $('#dynamicContent');
//     var content = this.content;
//     var htmlContent = '';
//     content.forEach(function(row, index) {
//         if (row.numCols === 1) {
//           var modules = row.content;
//           modules.forEach(function(module, intenalIndex) {
//             switch(module.module_type) {
//               case "text":
//                 htmlContent += module.content;
//                 break;
//               case "image":
//                 htmlContent += '<img src="'+ module.url +'" alt=""/ >';
//                 break;
//             }
//           });
//         } else {
//           var i = 0;
//           htmlContent += '<div class="hw-grid">';
//           while (i <= 1) {
//             htmlContent += '<div>';
//             var modules = row.content;
//             modules[i].forEach(function(module, internalIndex) {
//
//               switch(module.module_type) {
//                 case "text":
//                   htmlContent += module.content;
//                   break;
//                 case "image":
//                   htmlContent += '<img src="'+  module.url  +'" alt=""/ >';
//                   break;
//               }
//             });
//             htmlContent += '</div>';
//             i++;
//           }
//           htmlContent += '</div>';
//         }
//     });
//     return htmlContent;
//   },
//   cleanDate: function(createdAt) {
//     return moment(createdAt).format("MMM Do YY");
//   },
//   getSingleCategories: function(categories) {
//     console.log('dude',categories[0]);
//     var categoryList = '';
//     for (var i = 0; i < categories.length; i++) {
//       var category = Categories.findOne({_id: categories[i]});
//
//       categoryList += '<a href ="/blog/category/' + category.slug + '">';
//       categoryList += category.name + '</a>';
//       if ((categories.length - i) === 1) {
//         // categoryList += ', ';
//       } else {
//         categoryList += ', ';
//       }
//     }
//     return categoryList;
//   },
//   recentPosts: function() {
//     return Posts.find({}, {sort: {createdAt: -1}, limit: 3});
//   },
//   allCategories: function() {
//     return Categories.find({});
//   }
// });
