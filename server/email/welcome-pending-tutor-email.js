import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mandrill } from 'meteor/wylio:mandrill';

Meteor.methods({
  welcomePendingTutorEmail(tutor) {
    let emailTemplate;
    check(tutor, {
      email: String,
      profile: {
        firstName: String,
        lastName: String,
      },
    });

    return Mandrill.messages.sendTemplate({
      template_name: 'we-are-reviewing-your-application',
      template_content: [
        { name: 'body', content: '<h3>Your Tutor Profile is pending!</h3>' },
      ],
      message: {
        from_email: 'hello@tutorapp.com',
        from_name: 'Tutor App',
        subject: 'Your Tutor Profile is Pending',
        to: [
          { email: tutor.email, name: `${tutor.profile.firstName} ${tutor.profile.lastName}` },
        ],
        global_merge_vars: [
          { name: 'first_name', content: tutor.profile.firstName },
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
