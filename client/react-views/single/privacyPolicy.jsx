import { Template } from 'meteor/templating';

PrivacyPolicy = React.createClass({
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
      <div className="terms-and-conditions  single privacy">
        <h2>Privacy Policy</h2>
        <p>This Application collects some Personal Data from its Users.</p>
        <p><strong>Policy summary</strong></p>
        <p><strong>Personal Data collected for the following purposes and using the following services:</strong></p>
        <p />
        <h4>Advertising</h4>
        <h5>Outbrain</h5>
        <p>Personal Data: Cookies and various types of Data as specified in the privacy policy of the service</p>
        <h4>Analytics</h4>
        <h5>Alexa Metrics, Display Advertising extension for Google Analytics, Google AdWords conversion tracking, Google Analytics, Twitter Ads conversion tracking and Wordpress Stats</h5>
        <p>Personal Data: Cookies and Usage data</p>
        <h5>Facebook Analytics for Apps</h5>
        <p>Personal Data: Usage data and various types of Data as specified in the privacy policy of the service</p>
        <h4>Contacting the User</h4>
        <h5>Contact form</h5>
        <p>Personal Data: address, city, company name, country, date of birth, email address, fax number, first name, gender, last name, phone number, profession, province, state, Tax ID, Various types of Data, VAT Number and ZIP/Postal code</p>
        <h4>Displaying content from external platforms</h4>
        <h5>Google Fonts</h5>
        <p>Personal Data: Usage data and various types of Data as specified in the privacy policy of the service</p>
        <h5>Google Maps widget, Instagram widget and YouTube video widget</h5>
        <p>Personal Data: Cookies and Usage data</p>
        <h5>Gravatar</h5>
        <p>Personal Data: email address and Usage data</p>
        <h4>Handling activity data</h4>
        <h5>Activity data tracked by your device</h5>
        <p>Personal Data: gender and general activity data</p>
        <h4>Handling payments</h4>
        <h5>PayPal and Stripe</h5>
        <p>Personal Data: various types of Data as specified in the privacy policy of the service</p>
        <h4>Heat mapping</h4>
        <h5>Crazyegg</h5>
        <p>Personal Data: Cookies and Usage data</p>
        <h4>Hosting and backend infrastructure</h4>
        <h5>Google Cloud Storage</h5>
        <p>Personal Data: various types of Data as specified in the privacy policy of the service</p>
        <h4>Interaction with external social networks and platforms</h4>
        <h5>Google+ +1 button and social widgets, LinkedIn button and social widgets, Paypal button and widgets, Facebook button and social widgets, Instagram button and social widgets, Twitter Tweet button and social widgets</h5>
        <p>Personal Data: Cookies and Usage data</p>
        <h4>Managing contacts and sending messages</h4>
        <h5>MailChimp and Mailgun</h5>
        <p>Personal Data: email address</p>
        <h4>Registration and authentication</h4>
        <h5>Stripe OAuth</h5>
        <p>Personal Data: various types of Data as specified in the privacy policy of the service</p>
        <h4>Remarketing and Behavioral Targeting</h4>
        <h5>AdRoll, AdWords Remarketing, Facebook Remarketing, Remarketing through Google Analytics for Display Advertising and Twitter Remarketing</h5>
        <p>Personal Data: Cookies and Usage data</p>
        <h5>Twitter Tailored Audiences</h5>
        <p>Personal Data: Cookies and email address</p>
        <h4>Social features</h4>
        <h5>Inviting and suggesting friends</h5>
        <p>Personal Data: Various types of Data</p>
        <h4>SPAM protection</h4>
        <h5>Akismet</h5>
        <p>Personal Data: various types of Data as specified in the privacy policy of the service</p>
        <h4>User database management</h4>
        <h5>Intercom</h5>
        <p>Personal Data: email address and various types of Data as specified in the privacy policy of the service</p>
        <p />
        <h3>Contact information</h3>
        <p />
        <p><strong>Data owner</strong></p>
        <p>Tutor App LLC - 87 Lafayette Street - New York, NY 10013, hello@tutorapp.com</p>
        <p><strong>Full policy</strong></p>
        <h4>Data Controller and Owner</h4>
        <p>Tutor App LLC - 87 Lafayette Street - New York, NY 10013,<br /> tech@tutorthepeople.com</p>
        <h4>Types of Data collected</h4>
        <p>Among the types of Personal Data that this Application collects, by itself or through third parties, there are: general activity data, gender, Cookies, Usage data, first name, last name, date of birth, phone number, VAT Number, company name, profession, address, fax number, country, state, province, email address, ZIP/Postal code, Various types of Data, city and Tax ID.</p>
        <p>Other Personal Data collected may be described in other sections of this privacy policy or by dedicated explanation text contextually with the Data collection.<br /> The Personal Data may be freely provided by the User, or collected automatically when using this Application.<br /> Any use of Cookies - or of other tracking tools - by this Application or by the owners of third party services used by this Application, unless stated otherwise, serves to identify Users and remember their preferences, for the sole purpose of providing the service required by the User.<br /> Failure to provide certain Personal Data may make it impossible for this Application to provide its services.</p>
        <p>Users are responsible for any Personal Data of third parties obtained, published or shared through this Application and confirm that they have the third party's consent to provide the Data to the Owner.</p>
        <h4>Mode and place of processing the Data</h4>
        <h5>Methods of processing</h5>
        <p>The Data Controller processes the Data of Users in a proper manner and shall take appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.<br /> The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Data Controller, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of the site (administration, sales, marketing, legal, system administration) or external parties (such as third party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Data Controller at any time.</p>
        <p><strong>Place</strong></p>
        <p>The Data is processed at the Data Controller's operating offices and in any other places where the parties involved with the processing are located. For further information, please contact the Data Controller.</p>
        <p><strong>Retention time</strong></p>
        <p>The Data is kept for the time necessary to provide the service requested by the User, or stated by the purposes outlined in this document, and the User can always request that the Data Controller suspend or remove the data.</p>
        <h4>The use of the collected Data</h4>
        <p>The Data concerning the User is collected to allow the Owner to provide its services, as well as for the following purposes: Handling activity data, Remarketing and Behavioral Targeting, SPAM protection, Analytics, Contacting the User, Heat mapping, Displaying content from external platforms, Hosting and backend infrastructure, Interaction with external social networks and platforms, User database management, Social features, Managing contacts and sending messages, Advertising, Handling payments and Registration and authentication.</p>
        <p>The Personal Data used for each purpose is outlined in the specific sections of this document.</p>
        <h4>Detailed information on the processing of Personal Data</h4>
        <p>Personal Data is collected for the following purposes and using the following services:</p>
        <h6>Advertising</h6>
        <p>This type of services allows User Data to be utilized for advertising communication purposes displayed in the form of banners and other advertisements on this Application, possibly based on User interests.<br /> This does not mean that all Personal Data are used for this purpose. Information and conditions of use are shown below.<br /> Some of the services listed below may use Cookies to identify Users or they may use the behavioral retargeting technique, i.e. displaying ads tailored to the User&rsquo;s interests and behavior, including those detected outside this Application. For more information, please check the privacy policies of the relevant services.</p>
        <p><strong>OUTBRAIN (OUTBRAIN INC.)</strong></p>
        <p>Outbrain is an advertising service provided by Outbrain Inc.</p>
        <p>Personal Data collected: Cookies and various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://www.outbrain.com/legal/privacy">Privacy Policy</a> &ndash; <a href="https://www.outbrain.com/legal/privacy#optout">Opt Out</a></p>
        <h6>Analytics</h6>
        <p>The services contained in this section enable the Owner to monitor and analyze web traffic and can be used to keep track of User behavior.</p>
        <p><strong>ALEXA METRICS (ALEXA INTERNET, INC.)</strong></p>
        <p>Alexa Metrics is an analytics service provided by Alexa Internet, Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.alexa.com/help/privacy">Privacy Policy</a> &ndash; <a href="https://www.alexa.com/settings/optout">Opt Out</a></p>
        <p><strong>DISPLAY ADVERTISING EXTENSION FOR GOOGLE ANALYTICS (GOOGLE INC.)</strong></p>
        <p>Google Analytics on this Application might use Google's Interest-based advertising, 3rd-party audience data and information from the DoubleClick Cookie to extend analytics with demographics, interests and ads interaction data.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/policies/privacy/">Privacy Policy</a> &ndash; <a href="https://tools.google.com/dlpage/gaoptout">Opt Out</a></p>
        <p><strong>FACEBOOK ANALYTICS FOR APPS (FACEBOOK, INC.)</strong></p>
        <p>Facebook Analytics for Apps is an analytics service provided by Facebook, Inc.</p>
        <p>Personal Data collected: Usage data and various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://www.facebook.com/about/privacy/">Privacy Policy</a></p>
        <p><strong>GOOGLE ADWORDS CONVERSION TRACKING (GOOGLE INC.)</strong></p>
        <p>Google AdWords conversion tracking is an analytics service provided by Google Inc. that connects data from the Google AdWords advertising network with actions performed on this Application.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/en/policies/privacy/">Privacy Policy</a></p>
        <p><strong>GOOGLE ANALYTICS (GOOGLE INC.)</strong></p>
        <p>Google Analytics is a web analysis service provided by Google Inc. ("Google"). Google utilizes the Data collected to track and examine the use of this Application, to prepare reports on its activities and share them with other Google services.<br /> Google may use the Data collected to contextualize and personalize the ads of its own advertising network.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/en/policies/privacy/">Privacy Policy</a> &ndash; <a href="https://tools.google.com/dlpage/gaoptout?hl=en">Opt Out</a></p>
        <p><strong>TWITTER ADS CONVERSION TRACKING (TWITTER, INC.)</strong></p>
        <p>Twitter Ads conversion tracking is an analytics service provided by Twitter, Inc. that connects data from the Twitter advertising network with actions performed on this Application.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://twitter.com/privacy">Privacy Policy</a></p>
        <p><strong>WORDPRESS STATS (AUTOMATTIC INC.)</strong></p>
        <p>Wordpress Stats is an analytics service provided by Automattic Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://automattic.com/privacy/">Privacy Policy</a></p>
        <h6>Contacting the User</h6>
        <p><strong>CONTACT FORM (THIS APPLICATION)</strong></p>
        <p>By filling in the contact form with their Data, the User authorizes this Application to use these details to reply to requests for information, quotes or any other kind of request as indicated by the form&rsquo;s header.</p>
        <p>Personal Data collected: address, city, company name, country, date of birth, email address, fax number, first name, gender, last name, phone number, profession, province, state, Tax ID, Various types of Data, VAT Number and ZIP/Postal code.</p>
        <p><strong>Displaying content from external platforms</strong></p>
        <p>This type of services allows you to view content hosted on external platforms directly from the pages of this Application and interact with them.<br /> This type of service might still collect web traffic data for the pages where the service is installed, even when Users do not use it.</p>
        <p><strong>GOOGLE FONTS (GOOGLE INC.)</strong></p>
        <p>Google Fonts is a typeface visualization service provided by Google Inc. that allows this Application to incorporate content of this kind on its pages.</p>
        <p>Personal Data collected: Usage data and various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.it/intl/policies/privacy/">Privacy Policy</a></p>
        <p><strong>GOOGLE MAPS WIDGET (GOOGLE INC.)</strong></p>
        <p>Google Maps is a maps visualization service provided by Google Inc. that allows this Application to incorporate content of this kind on its pages.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.it/intl/en/policies/privacy/">Privacy Policy</a></p>
        <p><strong>GRAVATAR (AUTOMATTIC INC.)</strong></p>
        <p>Gravatar is an image visualization service provided by Automattic Inc. that allows this Application to incorporate content of this kind on its pages.<br /> Please note that if Gravatar images are used for comment forms, the commenter's email address or parts of it may be sent to Gravatar - even if the commenter has not signed up for that service.</p>
        <p>Personal Data collected: email address and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://automattic.com/privacy/">Privacy Policy</a></p>
        <p><strong>INSTAGRAM WIDGET (INSTAGRAM, INC.)</strong></p>
        <p>Instagram is an image visualization service provided by Instagram, Inc. that allows this Application to incorporate content of this kind on its pages.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.instagram.com/about/legal/privacy/">Privacy Policy</a></p>
        <p><strong>YOUTUBE VIDEO WIDGET (GOOGLE INC.)</strong></p>
        <p>YouTube is a video content visualization service provided by Google Inc. that allows this Application to incorporate content of this kind on its pages.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="http://www.google.it/intl/en/policies/privacy/">Privacy Policy</a></p>
        <h6>Handling activity data</h6>
        <p>This type of services allows the Owner to use the activity data collected by your device in order for this Application to operate or to provide specific features. This may include movements, heartbeat, change in altitude or data about the surroundings.<br /> Depending on what is described below, third parties may be involved in the activity tracking.<br /> Most devices allow for the User to control which Data is accessed or stored.</p>
        <p><strong>ACTIVITY DATA TRACKED BY YOUR DEVICE (THIS APPLICATION)</strong></p>
        <p>This Application uses some activity data tracked by your device to operate or to provide specific features.</p>
        <p>Personal Data collected: gender and general activity data.</p>
        <p><strong>Handling payments</strong></p>
        <p>Payment processing services enable this Application to process payments by credit card, bank transfer or other means. To ensure greater security, this Application shares only the information necessary to execute the transaction with the financial intermediaries handling the transaction.<br /> Some of these services may also enable the sending of timed messages to the User, such as emails containing invoices or notifications concerning the payment.</p>
        <p><strong>PAYPAL (PAYPAL INC.)</strong></p>
        <p>PayPal is a payment service provided by PayPal Inc., which allows Users to make online payments using their PayPal credentials.</p>
        <p>Personal Data collected: various types of Data as specified in the privacy policy of the service.</p>
        <p><a href="https://www.paypal.com/cgi-bin/webscr?cmd=p/gen/ua/policy_privacy-outside">Privacy Policy</a></p>
        <p><strong>STRIPE (STRIPE INC)</strong></p>
        <p>Stripe is a payment service provided by Stripe Inc.</p>
        <p>Personal Data collected: various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://stripe.com/terms/US">Privacy Policy</a></p>
        <h6>Heat mapping</h6>
        <p>Heat Mapping services are used to display the areas of a page where Users most frequently move the mouse or click. This shows where the points of interest are. These services make it possible to monitor and analyze web traffic and keep track of User behavior.</p>
        <p><strong>CRAZYEGG (CRAZYEGG)</strong></p>
        <p>Crazyegg is a heat mapping service provided by Crazy Egg Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.crazyegg.com/privacy">Privacy Policy</a></p>
        <h6>Hosting and backend infrastructure</h6>
        <p>This type of services has the purpose of hosting data and files that enable this Application to run and be distributed as well as to provide a ready-made infrastructure to run specific features or parts of this Application. Some of these services work through geographically distributed servers, making it difficult to determine the actual location where the Personal Data are stored.</p>
        <p><strong>GOOGLE CLOUD STORAGE (GOOGLE INC.)</strong></p>
        <p>Google Cloud Storage is a hosting service provided by Google Inc.</p>
        <p>Personal Data collected: various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/policies/privacy/">Privacy Policy</a></p>
        <h6>Interaction with external social networks and platforms</h6>
        <p>This type of services allow interaction with social networks or other external platforms directly from the pages of this Application.<br /> The interaction and information obtained through this Application are always subject to the User&rsquo;s privacy settings for each social network.<br /> This type of service might still collect traffic data for the pages where the service is installed, even when Users do not use it.</p>
        <p><strong>GOOGLE+ +1 BUTTON AND SOCIAL WIDGETS (GOOGLE INC.)</strong></p>
        <p>The Google+ +1 button and social widgets are services allowing interaction with the Google+ social network provided by Google Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/policies/privacy/">Privacy Policy</a></p>
        <p><strong>LINKEDIN BUTTON AND SOCIAL WIDGETS (LINKEDIN CORPORATION)</strong></p>
        <p>The LinkedIn button and social widgets are services allowing interaction with the LinkedIn social network provided by LinkedIn Corporation.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.linkedin.com/legal/privacy-policy">Privacy Policy</a></p>
        <p><strong>PAYPAL BUTTON AND WIDGETS (PAYPAL INC.)</strong></p>
        <p>The PayPal button and widgets are services allowing interaction with the PayPal platform provided by PayPal Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: See the PayPal privacy policy &ndash; <a href="https://www.paypal.com/cgi-bin/webscr?cmd=p/gen/ua/policy_privacy-outside">Privacy Policy</a></p>
        <p><strong>TWITTER TWEET BUTTON AND SOCIAL WIDGETS (TWITTER, INC.)</strong></p>
        <p>The Twitter Tweet button and social widgets are services allowing interaction with the Twitter social network provided by Twitter, Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://twitter.com/privacy">Privacy Policy</a></p>
        <h6>Managing contacts and sending messages</h6>
        <p>This type of services makes it possible to manage a database of email contacts, phone contacts or any other contact information to communicate with the User.<br /> These services may also collect data concerning the date and time when the message was viewed by the User, as well as when the User interacted with it, such as by clicking on links included in the message.</p>
        <p><strong>MAILCHIMP (THE ROCKET SCIENCE GROUP, LLC.)</strong></p>
        <p>MailChimp is an email address management and message sending service provided by The Rocket Science Group, LLC.</p>
        <p>Personal Data collected: email address.</p>
        <p>Place of processing: US &ndash; <a href="https://mailchimp.com/legal/privacy/">Privacy Policy</a></p>
        <p><strong>MAILGUN (MAILGUN, INC.)</strong></p>
        <p>Mailgun is an email address management and message sending service provided by Mailgun, Inc.</p>
        <p>Personal Data collected: email address.</p>
        <p>Place of processing: US &ndash; <a href="https://www.mailgun.com/privacy">Privacy Policy</a></p>
        <h6>Registration and authentication</h6>
        <p>By registering or authenticating, Users allow this Application to identify them and give them access to dedicated services.<br /> Depending on what is described below, third parties may provide registration and authentication services. In this case, this Application will be able to access some Data, stored by these third party services, for registration or identification purposes.</p>
        <p><strong>STRIPE OAUTH (STRIPE INC)</strong></p>
        <p>Stripe OAuth is a registration and authentication service provided by Stripe, Inc. and is connected to the Stripe network.</p>
        <p>Personal Data collected: various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://stripe.com/us/privacy">Privacy Policy</a></p>
        <h6>Remarketing and Behavioral Targeting</h6>
        <p>This type of services allows this Application and its partners to inform, optimize and serve advertising based on past use of this Application by the User.<br /> This activity is performed by tracking Usage Data and by using Cookies, information that is transferred to the partners that manage the remarketing and behavioral targeting activity.</p>
        <p><strong>ADROLL (SEMANTIC SUGAR, INC.)</strong></p>
        <p>AdRoll is an advertising service provided by Semantic Sugar, Inc.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.adroll.com/about/privacy">Privacy Policy</a> &ndash; <a href="https://info.evidon.com/pub_info/573?v=1&amp;nt=1&amp;nw=false">Opt Out</a></p>
        <p><strong>ADWORDS REMARKETING (GOOGLE INC.)</strong></p>
        <p>AdWords Remarketing is a Remarketing and Behavioral Targeting service provided by Google Inc. that connects the activity of this Application with the Adwords advertising network and the Doubleclick Cookie.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="http://www.google.com/intl/en/policies/privacy/">Privacy Policy</a> &ndash; <a href="http://www.google.com/settings/ads/onweb/optout">Opt Out</a></p>
        <p><strong>FACEBOOK REMARKETING (FACEBOOK, INC.)</strong></p>
        <p>Facebook Remarketing is a Remarketing and Behavioral Targeting service provided by Facebook, Inc. that connects the activity of this Application with the Facebook advertising network.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.facebook.com/about/privacy/">Privacy Policy</a> &ndash; <a href="https://www.aboutads.info/choices/">Opt Out</a></p>
        <p><strong>REMARKETING THROUGH GOOGLE ANALYTICS FOR DISPLAY ADVERTISING (GOOGLE INC.)</strong></p>
        <p>Google Analytics for Display Advertising is a Remarketing and Behavioral Targeting service provided by Google Inc. that connects the tracking activity performed by Google Analytics and its Cookies with the Adwords advertising network and the Doubleclick Cookie.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://www.google.com/intl/en/policies/privacy/">Privacy Policy</a> &ndash; <a href="https://www.google.com/settings/ads/onweb/optout">Opt Out</a></p>
        <p><strong>TWITTER TAILORED AUDIENCES (TWITTER, INC.)</strong></p>
        <p>Twitter Tailored Audiences is a Remarketing and Behavioral Targeting service provided by Twitter, Inc. that connects the activity of this Application with the Twitter advertising network.</p>
        <p>Personal Data collected: Cookies and email address.</p>
        <p>Place of processing: US &ndash; <a href="https://twitter.com/privacy">Privacy Policy</a> &ndash; <a href="https://support.twitter.com/articles/20170405">Opt Out</a></p>
        <p><strong>TWITTER REMARKETING (TWITTER, INC.)</strong></p>
        <p>Twitter Remarketing is a Remarketing and Behavioral Targeting service provided by Twitter, Inc. that connects the activity of this Application with the Twitter advertising network.</p>
        <p>Personal Data collected: Cookies and Usage data.</p>
        <p>Place of processing: US &ndash; <a href="https://twitter.com/privacy">Privacy Policy</a> &ndash; <a href="https://support.twitter.com/articles/20170405">Opt Out</a></p>
        <p><strong>Social features</strong></p>
        <p><strong>INVITING AND SUGGESTING FRIENDS (THIS APPLICATION)</strong></p>
        <p>This Application may use the Personal Data provided to allow Users to invite their friends - for example through the address book, if access has been provided - and to suggest friends or connections inside it.</p>
        <p>Personal Data collected: Various types of Data.</p>
        <p><strong>SPAM protection</strong></p>
        <p>This type of services analyzes the traffic of this Application, potentially containing Users' Personal Data, with the purpose of filtering it from parts of traffic, messages and content that are recognized as SPAM.</p>
        <p><strong>AKISMET (AUTOMATTIC INC.)</strong></p>
        <p>Akismet is a SPAM protection service provided by Automattic Inc.</p>
        <p>Personal Data collected: various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://automattic.com/privacy/">Privacy Policy</a></p>
        <h6>User database management</h6>
        <p>This type of services allows the Owner to build user profiles by starting from an email address, a personal name, or other information that the User provides to this Application, as well as to track User activities through analytics features. This Personal Data may also be matched with publicly available information about the User (such as social networks' profiles) and used to build private profiles that the Owner can display and use for improving this Application.<br /> Some of these services may also enable the sending of timed messages to the User, such as emails based on specific actions performed on this Application.</p>
        <p><strong>INTERCOM (INTERCOM INC.)</strong></p>
        <p>Intercom is a User database management service provided by Intercom Inc. Intercom can also be used as a medium for communications, either through email, or through messages within our product(s).</p>
        <p>Personal Data collected: email address and various types of Data as specified in the privacy policy of the service.</p>
        <p>Place of processing: US &ndash; <a href="https://docs.intercom.io/pricing-and-terms/privacy">Privacy Policy</a></p>
        <p />
        <h3>Cookie Policy</h3>
        <p>This Application uses Cookies. To learn more and for a detailed cookie notice, you may consult the <a href="https://www.iubenda.com/privacy-policy/383904/cookie-policy">Cookie Policy</a>.</p>
        <h3>Additional information about Data collection and processing</h3>
        <h6>Legal action</h6>
        <p>The User's Personal Data may be used for legal purposes by the Data Controller, in Court or in the stages leading to possible legal action arising from improper use of this Application or the related services.<br /> The User declares to be aware that the Data Controller may be required to reveal personal data upon request of public authorities.</p>
        <h6>Additional information about User's Personal Data</h6>
        <p>In addition to the information contained in this privacy policy, this Application may provide the User with additional and contextual information concerning particular services or the collection and processing of Personal Data upon request.</p>
        <h6>System Logs and Maintenance</h6>
        <p>For operation and maintenance purposes, this Application and any third party services may collect files that record interaction with this Application (System Logs) or use for this purpose other Personal Data (such as IP Address).</p>
        <h6>Information not contained in this policy</h6>
        <p>More details concerning the collection or processing of Personal Data may be requested from the Data Controller at any time. Please see the contact information at the beginning of this document.</p>
        <h6>The rights of Users</h6>
        <p>Users have the right, at any time, to know whether their Personal Data has been stored and can consult the Data Controller to learn about their contents and origin, to verify their accuracy or to ask for them to be supplemented, cancelled, updated or corrected, or for their transformation into anonymous format or to block any data held in violation of the law, as well as to oppose their treatment for any and all legitimate reasons. Requests should be sent to the Data Controller at the contact information set out above.</p>
        <p>This Application does not support "Do Not Track" requests.<br /> To determine whether any of the third party services it uses honor the "Do Not Track" requests, please read their privacy policies.</p>
        <h6>Changes to this privacy policy</h6>
        <p>The Data Controller reserves the right to make changes to this privacy policy at any time by giving notice to its Users on this page. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom. If a User objects to any of the changes to the Policy, the User must cease using this Application and can request that the Data Controller removes the Personal Data. Unless stated otherwise, the then-current privacy policy applies to all Personal Data the Data Controller has about Users.</p>
        <h6>Information about this privacy policy</h6>
        <p>The Data Controller is responsible for this privacy policy, prepared starting from the modules provided by Iubenda and hosted on Iubenda's servers.</p>
        <h6>Definitions and legal references</h6>
        <p><strong>PERSONAL DATA (OR DATA)</strong></p>
        <p>Any information regarding a natural person, a legal person, an institution or an association, which is, or can be, identified, even indirectly, by reference to any other information, including a personal identification number.</p>
        <p><strong>USAGE DATA</strong></p>
        <p>Information collected automatically from this Application (or third party services employed in this Application), which can include: the IP addresses or domain names of the computers utilized by the Users who use this Application, the URI addresses (Uniform Resource Identifier), the time of the request, the method utilized to submit the request to the server, the size of the file received in response, the numerical code indicating the status of the server's answer (successful outcome, error, etc.), the country of origin, the features of the browser and the operating system utilized by the User, the various time details per visit (e.g., the time spent on each page within the Application) and the details about the path followed within the Application with special reference to the sequence of pages visited, and other parameters about the device operating system and/or the User's IT environment.</p>
        <p><strong>USER</strong></p>
        <p>The individual using this Application, which must coincide with or be authorized by the Data Subject, to whom the Personal Data refers.</p>
        <p><strong>DATA SUBJECT</strong></p>
        <p>The legal or natural person to whom the Personal Data refers.</p>
        <p><strong>DATA PROCESSOR (OR DATA SUPERVISOR)</strong></p>
        <p>The natural person, legal person, public administration or any other body, association or organization authorized by the Data Controller to process the Personal Data in compliance with this privacy policy.</p>
        <p><strong>DATA CONTROLLER (OR OWNER)</strong></p>
        <p>The natural person, legal person, public administration or any other body, association or organization with the right, also jointly with another Data Controller, to make decisions regarding the purposes, and the methods of processing of Personal Data and the means used, including the security measures concerning the operation and use of this Application. The Data Controller, unless otherwise specified, is the Owner of this Application.</p>
        <p><strong>THIS APPLICATION</strong></p>
        <p>The hardware or software tool by which the Personal Data of the User is collected.</p>
        <p><strong>COOKIES</strong></p>
        <p>Small piece of data stored in the User's device.</p>
        <p><strong>LEGAL INFORMATION</strong></p>
        <p>Notice to European Users: this privacy statement has been prepared in fulfillment of the obligations under Art. 10 of EC Directive n. 95/46/EC, and under the provisions of Directive 2002/58/EC, as revised by Directive 2009/136/EC, on the subject of Cookies.</p>
        <p>This privacy policy relates solely to this Application.</p>
        <p>Latest update: June 21, 2016</p>
        <p><a href="https://www.iubenda.com/">iubenda</a> hosts this page and collects <a href="https://www.iubenda.com/privacy-policy/877900">some personal data</a> about users</p>
        <p />
      </div>
    );
  },
  render() {
    return this.renderPage();
  },
});

Template.privacyPolicy.helpers({
  PrivacyPolicy() {
    return PrivacyPolicy;
  },
});
