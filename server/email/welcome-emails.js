import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mandrill } from 'meteor/wylio:mandrill';

Meteor.methods({
  welcomeStudentEmail(student) {
    let emailTemplate;
    check(student, {
      emailAddress: String,
      password: String,
      profile: {
        firstName: String,
        lastName: String,
        avatar: String,
      },
      promoToken: String,
    });
    let promo = false;
    const lookupPromo = Meteor.users.findOne({
      promoToken: student.promoToken,
    });
    if (student.promoToken !== '') {
      if (!lookupPromo) {
        throw new Meteor.Error('customer-exists', 'Bad Promo Code');
      } else {
        promo = true;
      }
    }
    if (promo === false) {
      return Mandrill.messages.sendTemplate({
        template_name: 'student-welcome-to-tutor-app',
        template_content: [
          { name: 'body', content: '<h3>Welcome to Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'Welcome to Tutor App!',
          to: [
            { email: student.emailAddress, name: `${student.profile.firstName} ${student.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'student_name', content: student.profile.firstName },
            { name: 'promo_url', content: `https://tutorapp.com/promo/${student.promoToken}` },
            { name: 'dashboard_url', content: 'https://tutorapp.com/dashboard' },
          ],
        },
      }, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response);
        }
      });
    } else {
      return Mandrill.messages.sendTemplate({
        template_name: 'student-welcome-to-tutor-app',
        template_content: [
          { name: 'body', content: '<h3>Welcome to Tutor App</h3>' },
        ],
        message: {
          from_email: 'hello@tutorapp.com',
          from_name: 'Tutor App',
          subject: 'Welcome to Tutor App!',
          to: [
            { email: student.emailAddress, name: `${student.profile.firstName} ${student.profile.lastName}` },
          ],
          global_merge_vars: [
            { name: 'student_name', content: student.profile.firstName },
            { name: 'promo_url', content: `https://tutorapp.com/promo/${student.promoToken}` },
            { name: 'dashboard_url', content: 'https://tutorapp.com/dashboard' },
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
  },
});
