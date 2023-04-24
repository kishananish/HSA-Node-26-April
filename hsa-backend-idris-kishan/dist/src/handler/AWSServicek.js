'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _awsSdk = require('aws-sdk');

var _clientS = require('@aws-sdk/client-s3');

var _uuid = require('uuid');

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _multerS = require('multer-s3');

var _multerS2 = _interopRequireDefault(_multerS);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');


exports.s3Uploadv2 = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'uploads/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context.abrupt('return', _context.sent);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.uploadCategoryImage = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'category_image/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context2.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context2.abrupt('return', _context2.sent);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.uploadProfilePic = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'profile_pic/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context3.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context3.abrupt('return', _context3.sent);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();

exports.uploadProfilePic = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'profile_pic/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context4.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context4.abrupt('return', _context4.sent);

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.uploadServiceFile = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'service-files/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context5.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context5.abrupt('return', _context5.sent);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();

// exports.uploadServiceFile = async (files) => {
//   const s3 = new S3();

//   const params = files.map((file) => {
//     return {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `service-files/${uuid()}-${file.originalname}`,
//       Body: file.buffer,
//     };
//   });

//   return await Promise.all(params.map((param) => s3.upload(param).promise()));
// };

exports.s3Upload = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(data) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            //const s3 = new S3();
            s3 = new _awsSdk.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY
            });
            params = {
              Bucket: process.env.AWS_BUCKET_NAME + '/service-files',
              Key: Date.now() + '.' + data.type,
              Body: data.base64Data,
              ContentEncoding: 'base64',
              ContentType: 'image/' + data.type
            };
            _context6.next = 4;
            return s3.upload(params).promise();

          case 4:
            return _context6.abrupt('return', _context6.sent);

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}();

exports.uploadFile = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(files) {
    var s3, params;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            s3 = new _awsSdk.S3();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'files/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context7.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3.upload(param).promise();
            }));

          case 4:
            return _context7.abrupt('return', _context7.sent);

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}();

// exports.delete("/delete/:filename", async (req, res) => {
//   const filename = req.params.filename;
//   await s3
//     .deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename })
//     .promise();
//   res.send("File Deleted Successfully");
// });

exports.deleteFile = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(file_name) {
    var filename, s3;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            filename = filename;
            s3 = new _awsSdk.S3();
            _context8.next = 4;
            return s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: file_name }).promise();

          case 4:
            return _context8.abrupt('return', _context8.sent);

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}();

exports.s3Uploadv3 = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(files) {
    var s3client, params;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            s3client = new _clientS.S3Client();
            params = files.map(function (file) {
              return {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'uploads/' + (0, _uuid.v4)() + '-' + file.originalname,
                Body: file.buffer
              };
            });
            _context9.next = 4;
            return _promise2.default.all(params.map(function (param) {
              return s3client.send(new _clientS.PutObjectCommand(param));
            }));

          case 4:
            return _context9.abrupt('return', _context9.sent);

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}();