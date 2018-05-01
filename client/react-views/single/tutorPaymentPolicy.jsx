import { Template } from 'meteor/templating';

import React from 'react';

TutorPaymentPolicy = React.createClass({
  renderPage() {
    return (
      <div>
        <SingleNavigation />
        {this.renderPolicy()}
      </div>
    );
  },
  renderPolicy() {
    return (
      <div className="terms-and-conditions single ">
        <h2>Tutor payment policies</h2>

        <p>By registering as a tutor with TutorApp.com (the "website"), you ("Tutor") agree that the following terms and
        </p>

        <p><strong>Conditions for payment for student lessons</strong></p>

        <p>TutorApp is a marketplace for those seeking tutoring services to connect with those seeking to provide tutoring
            services. TutorApp also provides a service to its users whereby payments will be distributed to tutors that
            originate from their students. However, if any of the following conditions are not met and TutorApp becomes
            unable to collect your payment from the parent, student, or other type of account-holder (collectively,
            "student") to whom you gave a lesson, your payment may not be successfully collected, processed and distributed
        </p>
        <ol type="a">
          <li>The information pertaining to the lesson is accurate. This includes the start and end time, location,
              duration, subject and student name. Unless otherwise agreed to by the Tutor and student, the start and end time
              will be considered to be the times of the actual tutoring lesson, not arrival and departure times to and from
          </li>

          <li>Prior to each lesson being given, the student has on file with TutorApp a valid form of payment. This
          </li>

          <li>The Tutor's services are instructive and constitute learning, not cheating. More specifically, the tutor is
              not to complete assignments, write papers, take quizzes or otherwise do work on the student's behalf. Further,
              the services that the Tutor offers must not violate the academic honesty policy or other conduct policies of the
          </li>

          <li>The Tutor must mark the lesson as "completed" in the TutorApp system within 24 hours of the lesson occurring.
              The students may request a refund or otherwise challenge "completed" status. If a lesson is not entered as
              "completed" by the Tutor within this 24-hour window, this may result in non-payment or delayed payment. Also,
              the students have an opportunity to request a refund or otherwise challenge the "completed" status of a lesson,
              in which case the payment for such lesson will be considered "in-dispute". In such instances, TutorApp will (i)
              investigate all such "in-dispute" payments, (ii) resolve any such situation in its sole and absolute discretion,
          </li>

          <li>Prior to a lesson being given, the tutor has received a TutorApp notification that the lesson has been
              accepted and confirmed by the student, and the lesson is not cancelled by the student more than 24 hours prior
              to the time of the lesson. If the lesson is cancelled by the student less than 24 hours prior to the confirmed
              start of the lesson, Tutor may receive payment pursuant to TutorApp’ s 24-hour cancellation policy. This
              will be determined by TutorApp, in its sole discretion, based on its investigation of any such instance of
              cancellation, any "in-dispute" amounts, any excuses for cancellation provided by the student, and any other
              factors deemed relevant by TutorApp in its sole discretion. Naturally, if the lesson is cancelled by the Tutor,
              there will also be no payment for any such cancelled lesson. (Moreover, please note TutorApps’  24-hour
              cancellation policy with respect to cancellations by Tutors &ndash; a cancellation by the Tutor, providing less
              than 24-hours’  notice to the student, will be investigated by TutorApp and may result in disciplinary
          </li>

          <li>The Tutor does not collect or request payment directly from the student by cash, check or otherwise
            <em>e.g.</em>, Paypal, Venmo, Square, etc.) for the lesson.</li>

          <li>The Tutor schedules all lessons with TutorApp students solely and exclusively through the TutorApp platform
              and does not communicate with any such TutorApp students regarding scheduling through personal e-mail, text, IM,
              or telephone. See Independent Tutor Agreement, para. 6 (Non-circumvention): Tutors may not provide lessons to
          </li>

          <li>The Tutor is over 18 years old and is eligible to work in the United States.</li>
        </ol>

        <p><strong>Timing and delivery of payments</strong></p>

        <p>If all the <strong><em>Conditions for payment for student lessons</em></strong> (as set forth above) are met,
            Tutors can expect to receive their funds according to the following. The Tutors will be paid through Stripe in
            accordance with Stripe’ s applicable rules, policies, and procedures as well as the applicable processing
            fees charged by Stripe (and by relevant banks, if any). Accordingly, the Tutors must provide their accurate bank
            account and routing numbers and any and all other information required or requested by TutorApp and/or Stripe in
            order to process payments to the Tutors. Generally, payments are expected to be processed within one week, but
        </p>

        <p><strong>Social Security number requirement</strong></p>
        <ol type="a">
          <li>Prior to payments made in an amount of greater than $50, cumulatively, tutors must submit to TutorApp a valid
              Social Security Number ("SSN"). Such payments may be withheld by TutorApp until the SSN is received, and the
          </li>

          <li>Tutors may use an Employer Identification Number ("EIN") issued by the Internal Revenue Service in place of a
              SSN for payment reporting purposes only. To use an EIN, a tutor must complete, sign and submit to TutorApp an
              IRS Form W-9. However, please note that, as an independent contractor, each Tutor is solely responsible for
              filing and paying his or h<em>e.g.</em>, federal, state,
          </li>
        </ol>
        <p><strong>Calculation of tutor payment amounts</strong></p>
        <ol type="a">
          <li>Tutors set their own hourly rate and may change it at any time.</li>

          <li>Commission and referral fees. TutorApp will charge a commission of 30% (the "Commission") on every payment
              for a lesson arranged between a student and a Tutor through the TutorApp, subject to the terms and conditions
          </li>
          <ol type="i">
            <li>If a Tutor invites a student to the Tutorapp through the Tutor's direct referral link on TutorApp, and the
                student schedules, confirms and completes one or more lessons through TutorApp with that Tutor, then TutorApp
                will not charge the Commission for such lessons, and the Tutor will be paid for such lessons at the Tutor’ s
            </li>

            <li>If a Tutor invites a student to TutorApp, and that student works with another Tutor on the TutorApp
                platform, then the referring Tutor will be paid $50 by TutorApp, once that student has scheduled, confirmed and
            </li>

            <li>If a Tutor invites another tutor to join TutorApp, the referring Tutor will be paid $50 by TutorApp, once
            </li>

          </ol>
          <li>Non-tutoring charges should be incorporated into the hourly rate. Travel, parking, prep time or other
              expenses that you wish to defray to the customer must first be agreed to by the student. The mechanism to assess
              these charges is to adjust your hourly rate. Under no circumstances should the Tutor receive payments directly
          </li>

        </ol>

      </div>
    );
  },
  render() {
    return this.renderPage();
  },
});

Template.tutorPaymentPolicy.helpers({
  TutorPaymentPolicy() {
    return TutorPaymentPolicy;
  },
});
