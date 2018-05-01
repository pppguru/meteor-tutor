import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mandrill } from 'meteor/wylio:mandrill';

Meteor.methods({
  referralEmail(email, user, promo) {
    let emailTemplate;
    check(email, String);
    check(user, String);
    check(promo, String);

    const referralUser = Meteor.users.findOne({
      promoToken: promo,
    });

    return Mandrill.messages.sendTemplate({
      template_name: 'you-ve-been-invited-to-join-ta',
      template_content: [
        { name: 'body', content: "<h3>You've Been Inited to Join TA!</h3>" },
      ],
      message: {
        from_email: 'hello@tutorapp.com',
        from_name: 'Tutor App',
        subject: `${referralUser.profile.firstName} ${referralUser.profile.lastName} Invited to Join Tutor App!`,
        to: [
          { email },
        ],
        global_merge_vars: [
          { name: 'full_name', content: `${referralUser.profile.firstName} ${referralUser.profile.lastName}` },
          { name: 'promo_url', content: `http://tutorapp.com/promo/${promo}` },
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
