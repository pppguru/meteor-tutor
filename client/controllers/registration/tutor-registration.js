// Template.tutorRegister.rendered = function() {
//   return $('#submit-tutor').validate({
//     rules: {
//       resumeUrl: {
//         required: true
//       },
//       specialities: {
//         required: true
//       },
//       terms: {
//         required: true
//       }
//     },
//     submitHandler: function() {
//       var tutor, tutorEmail;
//       tutor = {
//         email: $('#tutor-register [name="emailAddress"]').val().toLowerCase(),
//         profile: {
//           firstName: $('#tutor-register [name="firstName"]').val(),
//           lastName: $('#tutor-register [name="lastName"]').val(),
//           phoneNumber: $('#tutor-register [name="phoneNumber"]').val(),
//           resume: $('#submit-tutor [name="resumeUrl"]').val(),
//           videoId: $('#video-step [name="videoId"]').val(),
//           specialities: $('#submit-tutor [name="specialities"]').val(),
//           avatar: 'https://s3.amazonaws.com/tutorthepeople/temp/default-avatar.png'
//         },
//         address: {
//           address:  $('#tutor-register [name="address"]').val(),
//           addressExt:  $('#tutor-register [name="address-1"]').val(),
//           city:  $('#tutor-register [name="city"]').val(),
//           state: $('#tutor-register [name="state"]').val(),
//           postal:  $('#tutor-register [name="postal"]').val()
//         },
//         invited: false,
//         requested: (new Date()).getTime(),
//         promoToken: $('#tutor-register [name="promoToken"]').val()
//       };
//       tutorEmail = {
//         email: $('#tutor-register [name="emailAddress"]').val().toLowerCase(),
//         profile: {
//           firstName: $('#tutor-register [name="firstName"]').val(),
//           lastName: $('#tutor-register [name="lastName"]').val()
//         }
//       };
//
//
//
//       return Meteor.call('validateEmailAddress', tutor.email, function(error, response) {
//         if (error) {
//           return alert(error.reason);
//         } else {
//           if (response.error) {
//             return alert(response.error);
//           } else {
//             return Meteor.call('addToTutorsList', tutor, function(error, response) {
//               if (error) {
//                 console.log('call failed with:', error.reason);
//                 return alert(error.reason);
//               } else {
//                 return Meteor.call('welcomePendingTutorEmail', tutorEmail, function(error, response) {
//                   if (error) {
//                     return console.log(error);
//                   } else {
//                     console.log('Email sent to ' +tutor.email+"!");
//                     return Router.go('thankyou');
//                   }
//                 });
//               }
//             });
//           }
//         }
//       });
//     }
//   });
// };
//
//
//
// Template.tutorRegister.events({
//     "change .file_bag": function() {
//       var files = $(".file_bag")[0].files
//       S3.upload({
//           files: files,
//           path: "resumes"
//         },function(e,r){
//         $('#submit-tutor [name="resumeUrl"]').val(r.url);
//       });
//     },
//     'submit form.tutor': function(e) {
//       return e.preventDefault();
//     }
// });
//
// Template.tutorRegister.helpers({
//     "files": function(){
//         return S3.collection.find();
//     }
// });
//
// Template.tutorStepOne.helpers({
//   promoToken: function() {
//     return Session.get('promoToken');
//   }
// })
//
// Template.tutorStepOne.events({
//   'submit form': function(e) {
//     e.preventDefault();
//   }
// });
//
// Template.tutorStepOne.rendered = function() {
//   return $('#tutor-register').validate({
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
//       phoneNumber: {
//         required: true
//       },
//       address: {
//         required: true
//       },
//       city: {
//         required: true
//       },
//       state: {
//         required: true
//       },
//       postal: {
//         required: true
//       }
//     },
//     submitHandler: function() {
//       console.log('guy');
//       $('.step-1').addClass('complete');
//       $('.step-2').addClass('visible');
//       $('.js-step-1').addClass('complete').removeClass('active');
//       $('.js-step-2').addClass('active');
//     }
//   });
// };
//
// Template.tutorStepTwo.events({
//   'submit form': function(e) {
//     e.preventDefault();
//   }
// });
//
// Template.tutorStepTwo.rendered = function() {
//   return $('#video-step').validate({
//     rules: {
//       videoId: {
//         required: true
//       },
//     },
//     messages: {
//       videoId: {
//         required: 'Please record a video, after the video is recorded and uploaded you can proceed.'
//       }
//     },
//     submitHandler: function() {
//       console.log('guy');
//       $('.step-2').addClass('complete');
//       $('.step-3').addClass('visible');
//       $('.js-step-2').addClass('complete').removeClass('active');
//       $('.js-step-3').addClass('active');
//     }
//   });
// }
