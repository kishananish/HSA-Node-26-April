import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from '../../config/config';
import axios from 'axios';

AWS.config.update({
  accessKeyId: config.AWS.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS.AWS_SECRET_KEY,
  region: config.AWS.REGION,
});

const s3 = new AWS.S3({ useAccelerateEndpoint: true });
// const sns = new AWS.SNS({ region: 'us-east-1' }); //ap-southeast-1 for mumbai region
const sns = new AWS.SNS({ region: 'us-east-1' });
const s3BucketName = 'hsa-bucket-kishan';

export const createBucket = async () => {
  return await s3.createBucket({ Bucket: s3BucketName }).promise();
};

const fileFilter = (req, file, cb) => {
  console.log('file.mimetype is ', file);
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/avi' ||
    file.mimetype === 'video/mov' ||
    file.mimetype === 'video/quicktime'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
var options = { partSize: 1000 * 1024 * 1024, queueSize: 10 }; // 1000 * 1024 * 1024  = 1000 mb

export const uploadProfilePic = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3BucketName + '/profile-pics',
    acl: 'public-read',
    key: function(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

export const uploadCategoryImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3BucketName + '/category-images',
    acl: 'public-read',
    key: function(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

export const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3BucketName + '/files',
    acl: 'public-read',
    key: function(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

export const uploadServiceFile = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    options,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: s3BucketName + '/service-files',
    acl: 'public-read',
    key: function(request, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const s3Upload = async (data) => {
  const params = {
    Bucket: s3BucketName + '/service-files',
    ACL: 'public-read',
    Key: `${Date.now()}.${data.type}`,
    Body: data.base64Data,
    ContentEncoding: 'base64',
    ContentType: `image/${data.type}`,
  };
  return await s3.upload(params).promise();
};

// export const snsService = async () => {
//   try {
//     console.log('config >>>', config.NETPOWER);
//     //old code for sns
//     const appARN =
//       'arn:aws:sns:us-east-1:913992124512:hsa-message:c1c1812b-caa4-41bf-b97c-d9a235162cc7';
//     const deviceToken =
//       'fKYfj-mCaK0:APA91bEkRxl5IzHTtI9uG3uqKY1mN1qDZTlVG_ZZjQETPBNIsIRH9tyjxzVg_YxBEf4VVlkdKRCpXdKrQKUNkkI1g6UDCnfiwmDcDQPL9hFy1nYbWTQxB0EaMlRcCUClQsOp1maMuina';
//     const params = {
//       PlatformApplicationArn: appARN,
//       Token: deviceToken,
//     };
//     const snsData = await sns.createPlatformEndpoint(params).promise();
//     const endpointArn = snsData.EndpointArn;

//     let payload = {
//       //default: 'Hello World',
//       GCM: {
//         data: {
//           message: 'Hello World',
//           // sound: 'default',
//           // badge: 1
//         },
//         notification: {
//           title: 'Test message from node',
//           body: 'body part',
//         },
//       },
//     };

//     // first have to stringify the inner APNS object...
//     payload.GCM = JSON.stringify(payload.GCM);
//     // then have to stringify the entire message payload
//     payload = JSON.stringify(payload);

//     return await sns.publish({
//       TargetArn: endpointArn,
//       Message: payload,
//       MessageStructure: 'json',
//     });
//   } catch (err) {
//     return err;
//   }
// };

export const snsSendSMS = async (params) => {
  const NETPOWER_ID = 'anfal';
  const NETPOWER_PASSWORD = '654321';
  const NETPOWER_SENDER = 'HAMEED';

  const mobileNumber =
    params.PhoneNumber.toString().charAt(0) == 0
      ? params.PhoneNumber.toString().substr(
          1,
          params.PhoneNumber.toString().length
        )
      : params.PhoneNumber.toString();
  try {
    const response = await axios.get(
      `http://sms.netpowers.net/http/api.php?id=${NETPOWER_ID}&password=${NETPOWER_PASSWORD}&to=${mobileNumber}&sender=${NETPOWER_SENDER}&msg=${params.Message}`
    );
    // if (response.status == 200) {
    //     console.log('otp sent ');
    // }
    console.log('response : ', response);
    return response;
  } catch (err) {
    console.log('error :', err);
  }
  //old code
  // sns.setSMSAttributes({
  //     attributes: {
  //         DefaultSenderID: 'HSA',
  //         DefaultSMSType: 'Transactional'
  //     }
  // });

  // return await sns.publish(params, (err, done) => {
  //     // console.log('error from sns.pulish ~~~', err);
  //     console.log('done from sns.pulish ~~~', done);
  // });
};

export const sesSendEmail = async (params) => {
  console.log('hi ses');
};
