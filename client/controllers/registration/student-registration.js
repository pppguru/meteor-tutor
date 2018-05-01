// Template.studentRegister.events({
//   'submit form': function(event, template) {
//     event.preventDefault();
//   }
// });
//
// Template.studentRegister.helpers({
//   promoToken: function() {
//     return Session.get('promoToken');
//   }
// });
//
// Template.studentRegister.rendered = function() {
//   return $('#student-register').validate({
//     rules: {
//       emailAddress: {
//         email: true,
//         required: true
//       },
//       firstName: {
//         required: true
//       },
//       lastName: {
//         required: true
//       },
//       password: {
//         required: true
//       },
//     },
//     messages: {
//       emailAddress: {
//         email: "Please use a valid email address.",
//         required: "An email address is required to join"
//       },
//       password: {
//         required: ""
//       },
//       firstName: {
//         required: ""
//       },
//       lastName: {
//         required: ""
//       },
//     },
//     submitHandler: function() {
//       var student = {
//         emailAddress: $('#student-register [name="emailAddress"]').val(),
//         password:$('#student-register [name="password"]').val(),
//         profile: {
//           firstName:$('#student-register [name="firstName"]').val(),
//           lastName:$('#student-register [name="lastName"]').val(),
//           avatar: "https://s3.amazonaws.com/tutorthepeople/temp/default-avatar.png"
//         },
//         promoToken: $('#student-register [name="promoToken"]').val()
//       }
//
//       var submitButton = $('input[type="submit"]').val("Loading");
//
//       return Meteor.call('validateEmailAddress', student.emailAddress, function(error, response) {
//         if (error) {
//           return alert(error.reason);
//         } else {
//
//           Meteor.call('createStudent', student, function(error, response) {
//             if (error) {
//               alert(error.reason);
//               submitButton.val("Reset");
//             } else {
//               if (response.error) {
//                 alert(response.message);
//                 submitButton.val("Reset");
//               } else {
//                 Meteor.loginWithPassword(student.emailAddress, student.password, function(error) {
//                   if (error) {
//                     alert(error.reason);
//                     submitButton.val("Reset");
//                   } else {
//                     Router.go('/');
//                     submitButton.val("Reset");
//                     return Meteor.call('welcomeStudentEmail', student, function(error) {
//                       if (error) {
//                         return console.log(error);
//                       } else {
//                         return console.log("Invite sent to " + student.email + "!");
//                       }
//                     });
//
//                   }
//                 })
//               }
//             }
//           });
//         }
//       });
//     }
//   });
// };
