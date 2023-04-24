'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sesSendEmail = exports.snsSendSMS = exports.s3Upload = exports.uploadServiceFile = exports.uploadFile = exports.uploadCategoryImage = exports.uploadProfilePic = exports.createBucket = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _multerS = require('multer-s3');

var _multerS2 = _interopRequireDefault(_multerS);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
  accessKeyId: _config2.default.AWS.AWS_ACCESS_KEY,
  secretAccessKey: _config2.default.AWS.AWS_SECRET_KEY,
  region: _config2.default.AWS.REGION
});

var s3 = new _awsSdk2.default.S3({ useAccelerateEndpoint: true });
// const sns = new AWS.SNS({ region: 'us-east-1' }); //ap-southeast-1 for mumbai region
var sns = new _awsSdk2.default.SNS({ region: 'us-east-1' });
var s3BucketName = 'hsa-bucket-kishan';

var createBucket = exports.createBucket = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return s3.createBucket({ Bucket: s3BucketName }).promise();

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createBucket() {
    return _ref.apply(this, arguments);
  };
}();

var fileFilter = function fileFilter(req, file, cb) {
  console.log('file.mimetype is ', file);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype === 'video/avi' || file.mimetype === 'video/mov' || file.mimetype === 'video/quicktime') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
var options = { partSize: 1000 * 1024 * 1024, queueSize: 10 }; // 1000 * 1024 * 1024  = 1000 mb

var uploadProfilePic = exports.uploadProfilePic = (0, _multer2.default)({
  storage: (0, _multerS2.default)({
    s3: s3,
    bucket: s3BucketName + '/profile-pics',
    acl: 'public-read',
    key: function key(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

var uploadCategoryImage = exports.uploadCategoryImage = (0, _multer2.default)({
  storage: (0, _multerS2.default)({
    s3: s3,
    bucket: s3BucketName + '/category-images',
    acl: 'public-read',
    key: function key(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

var uploadFile = exports.uploadFile = (0, _multer2.default)({
  storage: (0, _multerS2.default)({
    s3: s3,
    bucket: s3BucketName + '/files',
    acl: 'public-read',
    key: function key(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

var uploadServiceFile = exports.uploadServiceFile = (0, _multer2.default)({
  fileFilter: fileFilter,
  storage: (0, _multerS2.default)({
    s3: s3,
    options: options,
    contentType: _multerS2.default.AUTO_CONTENT_TYPE,
    bucket: s3BucketName + '/service-files',
    acl: 'public-read',
    key: function key(request, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

var s3Upload = exports.s3Upload = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
    var params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              Bucket: s3BucketName + '/service-files',
              ACL: 'public-read',
              Key: Date.now() + '.' + data.type,
              Body: data.base64Data,
              ContentEncoding: 'base64',
              ContentType: 'image/' + data.type
            };
            _context2.next = 3;
            return s3.upload(params).promise();

          case 3:
            return _context2.abrupt('return', _context2.sent);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function s3Upload(_x) {
    return _ref2.apply(this, arguments);
  };
}();

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

var snsSendSMS = exports.snsSendSMS = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(params) {
    var NETPOWER_ID, NETPOWER_PASSWORD, NETPOWER_SENDER, mobileNumber, response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            NETPOWER_ID = 'anfal';
            NETPOWER_PASSWORD = '654321';
            NETPOWER_SENDER = 'HAMEED';
            mobileNumber = params.PhoneNumber.toString().charAt(0) == 0 ? params.PhoneNumber.toString().substr(1, params.PhoneNumber.toString().length) : params.PhoneNumber.toString();
            _context3.prev = 4;
            _context3.next = 7;
            return _axios2.default.get('http://sms.netpowers.net/http/api.php?id=' + NETPOWER_ID + '&password=' + NETPOWER_PASSWORD + '&to=' + mobileNumber + '&sender=' + NETPOWER_SENDER + '&msg=' + params.Message);

          case 7:
            response = _context3.sent;

            // if (response.status == 200) {
            //     console.log('otp sent ');
            // }
            console.log('response : ', response);
            return _context3.abrupt('return', response);

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](4);

            console.log('error :', _context3.t0);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 12]]);
  }));

  return function snsSendSMS(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var sesSendEmail = exports.sesSendEmail = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(params) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log('hi ses');

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function sesSendEmail(_x3) {
    return _ref4.apply(this, arguments);
  };
}();