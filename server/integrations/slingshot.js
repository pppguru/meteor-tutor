import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.createDirective('fileUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: Meteor.settings.amazon.ACCESS_KEY,
  AWSSecretAccessKey: Meteor.settings.amazon.SECRET_KEY,
  bucket: Meteor.settings.amazon.bucket,
  region: 'us-east-1',
  acl: 'public-read',

  allowedFileTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'text/plain',
    'application/rtf',
    'application/x-rtf',
    'text/richtext',
    'application/x-iwork-pages-sffpages',
    'application/x-abiword',
    'application/vnd.ms-xpsdocument',
    'application/epub+zip',
    'application/x-mspublisher',
    'application/vnd.fujixerox.docuworks',
    'application/onenote',
    'application/vnd.rig.cryptonote',
    'application/vnd.lotus-notes',
    'application/onenote',
    'application/vnd.lotus-wordpro',
    'application/x-texinfo',
    'application/vnd.ms-word.document.macroenabled.12',
    'image/vnd.ms-modi',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text-web',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.svd',
  ],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).

  authorize() {
    // Deny uploads if user is not logged in.
    // if (!this.userId) {
    //   var message = "Please login before posting files";
    //   throw new Meteor.Error("Login Required", message);
    // }

    return true;
  },

  key(file) {
    // Store file into a directory by the user's username.
    const user = Meteor.users.findOne(this.userId);
    const name = file.name;

    const trimExtension = name.slice(0, -4);
    const imageExtension = name.slice(-4);
    function guid(trimExtension) { return `${trimExtension}-${'xxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })}`; }

    let aws_file = guid(trimExtension) + imageExtension;

    aws_file = aws_file.replace(/\s+/g, '-').toLowerCase();
    return `ta/${aws_file}`;
  },
});
