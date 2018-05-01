import { Slingshot } from 'meteor/edgee:slingshot';

/**
 * Upload an image and response with promise data.
 * @param  {Object}   event Event object.
 * @return {Promise}        Promise Response
 */
const fileUploadPromise = event =>
  new Promise((resolve, reject) => {
    const file = event.target.files[0];
    const uploader = new Slingshot.Upload('fileUpload');

    uploader.send(file, (err, res) => {
      if (err) {
        reject({
          data: err,
          message: 'An error occurred during upload of file!',
          success: false,
        });
      }
      resolve({
        data: res,
        message: 'File was successfully uploaded!',
        success: true,
      });
    });
  });

export default fileUploadPromise;
