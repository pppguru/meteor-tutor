import { Meteor } from 'meteor/meteor';
import { AlgoliaSearch } from 'meteor/acemtp:algolia';
import { check } from 'meteor/check';
import { GeoCoder } from 'meteor/aldeed:geocoder';
import { Mandrill } from 'meteor/wylio:mandrill';

const client = AlgoliaSearch(Meteor.settings.algolia.applicationId, Meteor.settings.algolia.api_key);
const index = client.initIndex(Meteor.settings.algolia.tutorIndex);

Meteor.methods({
  updateAvatar(user, url, update) {
    check(user, { _id: String });
    check(url, String);
    check(update, Boolean);
    return Meteor.users.update({
      _id: Meteor.user()._id,
    }, {
      $set: {
        'profile.avatar': url,
        completedPhoto: true,
      },
    }, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  },
  updateUser(update, user) {
    console.log('test', user);
    check(user, {
      profile: {
        firstName: String,
        lastName: String,
      },
    });
    check(update, {
      _id: String,
    });

    return Meteor.users.update({
      _id: Meteor.user()._id,
    }, {
      $set: {
        'profile.firstName': user.profile.firstName,
        'profile.lastName': user.profile.lastName,
      },
    }, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  },
  updateUserLogin(id) {
    check(id, String);
    return Meteor.users.update({
      _id: id,
    }, {
      $set: {
        lastActive: new Date(),
      },
    });
  },
  updateSubjects(update, subject) {
    let specialityExists;
    check(update, {
      _id: String,
    });
    check(subject, String);
    specialityExists = Meteor.users.findOne({
      _id: update._id,
      specialities: subject,
    });

    if (specialityExists) {
      console.log('remove subject from tutor:', subject);
      return Meteor.users.update({
        _id: update._id,
      }, {
        $pull: {
          specialities: subject,
        },
      });
    } else {
      console.log('update tutor with this subject:', subject);
      return Meteor.users.update({
        _id: update._id,
      }, {
        $push: {
          specialities: subject,
        },
      });
    }
  },
  updateTutor(update, user) {
    // Initialize the geocoder
    const geo = new GeoCoder({
      httpAdapter: 'https',
    });

    check(user, {
      profile: {
        firstName: String,
        lastName: String,
        biography: String,
      },
      address: {
        address: String,
        city: String,
        state: String,
        postal: String,
      },
      rate: String,
      meetingPreference: String,
      scheduling: Array,
      specialities: Array,
      education: Array,
    });

    check(update, {
      _id: String,
    });

    let city = user.address.city;
    city = city.replace(/\s+/g, '-').toLowerCase();

    let state = user.address.state;
    state = state.replace(/\s+/g, '-').toLowerCase();

    let geoLocation;
    // Add Geolocation to tutor creation
    if (user.address.address) {
      const fullAddress = `${user.address.address} ${user.address.city}, ${user.address.state}`;
      const geoPull = geo.geocode(fullAddress);
      if (geoPull.length > 0) {
        geoLocation = {
          latitude: geoPull[0].latitude,
          longitude: geoPull[0].longitude,
          zipcode: geoPull[0].zipcode,
        };
      }
    }
    let singleSubject = false;
    let availiability = false;
    let pendingVerification = false;
    let notifyAdminVerification = false;
    if (user.specialities.length >= 1) {
      singleSubject = true;
      user.specialities.map((subject) => {
        if (subject.approvalNeeded === true && subject.adminApproved === false) {
          notifyAdminVerification = true;
          pendingVerification = true;
        }
      });
    }

    if (user.education.length >= 1) {
      user.education.map((education) => {
        if (education.approvalNeeded === true && education.adminApproved === false) {
          notifyAdminVerification = true;
          pendingVerification = true;
        }
      });
    }
    [].forEach.call(user.scheduling, (schedule) => {
      if (schedule.value >= 1) {
        availiability = true;
      }
    });
    return Meteor.users.update({
      _id: Meteor.userId(),
    }, {
      $set: {
        'profile.firstName': user.profile.firstName,
        'profile.lastName': user.profile.lastName,
        'profile.biography': user.profile.biography,
        'profile.travelPolicy': user.profile.travelPolicy,
        'address.address': user.address.address,
        'address.city': user.address.city,
        'address.state': user.address.state,
        'address.addressExt': user.address.addressExt,
        'address.postal': user.address.postal,
        'address.geo': [geoLocation.longitude, geoLocation.latitude],
        rate: parseInt(user.rate),
        meetingPreference: parseInt(user.meetingPreference),
        'profile.specialityDesc': user.profile.specialityDesc,
        'meta.city': city,
        geoLocation,
        'meta.state': state,
        dateUpdated: new Date(),
        pendingVerification,
        completedSingleSubject: singleSubject,
        completedAvailiability: availiability,
        scheduling: user.scheduling,
        education: user.education,
        specialities: user.specialities,
      },
    }, (error) => {
      if (error) {
        return console.log(error);
      } else {
        const existingUser = Meteor.users.findOne({ _id: Meteor.userId() });
        index.partialUpdateObject({
          objectID: Meteor.userId(),
          profile: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            phoneNumber: user.profile.phoneNumber,
            specialities: user.profile.specialities,
            videoId: user.profile.videoId,
            resume: user.profile.resume,
            avatar: existingUser.profile.avatar,
          },
          address: {
            address: user.address.address,
            city: user.address.city,
            state: user.address.state,
            postal: user.address.postal,
            geo: [geoLocation.longitude, geoLocation.latitude],
          },
          _geoloc: {
            lat: geoLocation.latitude,
            lng: geoLocation.longitude,
          },
          meta: {
            state,
            city,
          },
          dateUpdated: new Date(),
          pendingVerification,
          slug: existingUser.slug,
          completedPhoto: existingUser.completedPhoto,
          completedSingleSubject: existingUser.completedSingleSubject,
          completedAvailiability: existingUser.completedAvailiability,
          meetingPreference: parseInt(user.meetingPreference),
          rate: parseInt(user.rate),
          education: user.education,
          specialities: user.specialities,
          id: Meteor.userId(),
        });
        if (notifyAdminVerification === true) {
          Mandrill.messages.sendTemplate({
            template_name: 'subject-education-submitted-for-verification',
            template_content: [
              { name: 'body', content: '<h3>Your profile is incomplete on Tutor App</h3>' },
            ],
            message: {
              from_email: 'verify@tutorapp.com',
              from_name: 'Tutor App',
              subject: 'Verification Submitted',
              to: [
                { email: 'verify@tutorapp.com', name: 'Tutor App' },
              ],
              global_merge_vars: [
                { name: 'tutor_name', content: existingUser.profile.firstName },
                { name: 'verification_submission', content: 'Education or Subject documents' },
                { name: 'pending_verification', content: Router.url('adminVerificationSingle', { id: Meteor.userId() }) },
              ],
            },
          }, (error, response) => {
            if (error) {
              console.log(error);
            } else {
              console.log(response);
            }
          });
        }
      }
    });
  },
  educationApproval(tutor, eduIndex) {
    check(tutor, Object);
    check(eduIndex, Number);

    const user = Meteor.users.findOne({ _id: tutor._id });
    const education = user.education;
    let pendingVerification = false;

    education[eduIndex].adminApproved = true;
    education[eduIndex].approvalNeeded = false;

    if (user.specialities.length >= 1) {
      singleSubject = true;
      user.specialities.map((subject) => {
        if (subject.approvalNeeded === true && subject.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    if (user.education.length >= 1) {
      user.education.map((education) => {
        if (education.approvalNeeded === true && education.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    return Meteor.users.update({
      _id: tutor._id,
    }, {
      $set: {
        education,
        pendingVerification,
      },
    }, (err) => {
      if (err) {
        return console.log(err);
      } else {
        index.partialUpdateObject({
          objectID: Meteor.userId(),
          dateUpdated: new Date(),
          education,
          pendingVerification,
        });
      }
    });
  },
  educationDeny(tutor, eduIndex) {
    check(tutor, Object);
    check(eduIndex, Number);

    const user = Meteor.users.findOne({ _id: tutor._id });
    const education = user.education;
    let pendingVerification = false;

    education[eduIndex].adminApproved = false;
    education[eduIndex].approvalNeeded = false;

    if (user.specialities.length >= 1) {
      singleSubject = true;
      user.specialities.map((subject) => {
        if (subject.approvalNeeded === true && subject.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    if (user.education.length >= 1) {
      user.education.map((education) => {
        if (education.approvalNeeded === true && education.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    return Meteor.users.update({
      _id: tutor._id,
    }, {
      $set: {
        education,
        pendingVerification,
      },
    }, (err) => {
      if (err) {
        return console.log(err);
      } else {
        index.partialUpdateObject({
          objectID: Meteor.userId(),
          dateUpdated: new Date(),
          education,
          pendingVerification,
        });
      }
    });
  },
  subjectApproval(tutor, subject) {
    check(tutor, Object);
    check(subject, Number);

    const user = Meteor.users.findOne({ _id: tutor._id });
    const subjects = user.specialities;
    let pendingVerification = false;

    subjects[subject].adminApproved = true;
    subjects[subject].approvalNeeded = false;

    if (user.specialities.length >= 1) {
      singleSubject = true;
      user.specialities.map((subject) => {
        if (subject.approvalNeeded === true && subject.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    if (user.education.length >= 1) {
      user.education.map((education) => {
        if (education.approvalNeeded === true && education.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    return Meteor.users.update({
      _id: tutor._id,
    }, {
      $set: {
        specialities: subjects,
        pendingVerification,
      },
    }, (err) => {
      if (err) {
        return console.log(err);
      } else {
        index.partialUpdateObject({
          objectID: Meteor.userId(),
          dateUpdated: new Date(),
          specialities: subjects,
          pendingVerification,
        });
      }
    });
  },
  subjectDeny(tutor, subject) {
    check(tutor, Object);
    check(subject, Number);

    const user = Meteor.users.findOne({ _id: tutor._id });
    const subjects = user.specialities;
    let pendingVerification = false;

    subjects[subject].adminApproved = false;
    subjects[subject].approvalNeeded = false;

    if (user.specialities.length >= 1) {
      singleSubject = true;
      user.specialities.map((subject) => {
        if (subject.approvalNeeded === true && subject.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    if (user.education.length >= 1) {
      user.education.map((education) => {
        if (education.approvalNeeded === true && education.adminApproved === false) {
          pendingVerification = true;
        }
      });
    }

    return Meteor.users.update({
      _id: tutor._id,
    }, {
      $set: {
        specialities: subjects,
        pendingVerification,
      },
    }, (err) => {
      if (err) {
        return console.log(err);
      } else {
        index.partialUpdateObject({
          objectID: Meteor.userId(),
          dateUpdated: new Date(),
          specialities: subjects,
          pendingVerification,
        });
      }
    });
  },
  tutorVerificationEmail(tutor) {
    check(tutor, String);

    const user = Meteor.users.findOne({ _id: tutor });
    const tutorUrl = `https://tutorapp.com/tutor/${user.meta.state}/${user.meta.city}/${user.slug}`;

    return Mandrill.messages.sendTemplate({
      template_name: 'verification-approved',
      template_content: [
        { name: 'body', content: '<h3>Your profile is incomplete on Tutor App</h3>' },
      ],
      message: {
        from_email: 'verify@tutorapp.com',
        from_name: 'Tutor App',
        subject: 'Verification Approved!',
        to: [
          { email: user.emails[0].address, name: `${user.profile.firstName} ${user.profile.lastName}` },
        ],
        global_merge_vars: [
          { name: 'first_name', content: user.profile.firstName },
          { name: 'verification_submission', content: 'Education or Subject documents' },
          { name: 'tutor_profile', content: tutorUrl },
        ],
      },
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  },
});
