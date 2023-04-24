'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _AWSServicek = require('../handler/AWSServicek');

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

var storage = _multer2.default.memoryStorage();

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new _multer2.default.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};

// ["image", "jpeg"]

var upload = (0, _multer2.default)({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000000, files: 2 }
});
// app.post("/upload", upload.array("file"), async (req, res) => {
//   try {
//     const results = await s3Uploadv2(req.files);
//     console.log(results);
//     return res.json({ status: "success" });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post('/upload', upload.array('file'), function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var results;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _AWSServicek.s3Uploadv3)(req.files);

          case 3:
            results = _context.sent;

            console.log(results);
            return _context.abrupt('return', res.json({
              status: 'success',
              key: results[0].key,
              imageurl: results[0].Location
            }));

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

router.post('/uploadCategoryImage', upload.array('category_image'), function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var results;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _AWSServicek.uploadCategoryImage)(req.files);

          case 3:
            results = _context2.sent;

            console.log(results);
            return _context2.abrupt('return', res.json({
              status: 'success',
              key: results[0].key,
              imageurl: results[0].Location
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 8]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.post('/uploadProfilePic', upload.array('profile_pic'), function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var results;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _AWSServicek.uploadProfilePic)(req.files);

          case 3:
            results = _context3.sent;

            console.log(results);
            return _context3.abrupt('return', res.json({
              status: 'success',
              key: results[0].key,
              imageurl: results[0].Location
            }));

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 8]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

router.post('/uploadServiceFile', upload.array('service_files'), function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var results;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _AWSServicek.uploadServiceFile)(req.files);

          case 3:
            results = _context4.sent;

            console.log(results);
            return _context4.abrupt('return', res.json({
              status: 'success',
              key: results[0].key,
              imageurl: results[0].Location
            }));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);

            console.log(_context4.t0);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 8]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

router.post('/uploadFile', auth.ensureAuth, upload.array('file'), function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var userId, user, results, error;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            userId = req.user;
            _context5.next = 4;
            return _Customer2.default.findById(userId);

          case 4:
            user = _context5.sent;

            if (!(user.mobile_no != '')) {
              _context5.next = 19;
              break;
            }

            _context5.next = 8;
            return (0, _AWSServicek.uploadFile)(req.files);

          case 8:
            results = _context5.sent;

            console.log(results);
            _logger2.default.info({ mess: 'Uploaded file data info' });

            _logger2.default.info({ mess: results });
            _logger2.default.info({ mess: 'Uploaded file data info' });

            _logger2.default.info({ mess: 'Uploaded file data debug' });
            _logger2.default.debug((0, _stringify2.default)(results));

            _logger2.default.info({ mess: 'Uploaded file data debug' });

            // logger.info({ mess: 'Error in Uploaded file data 11111' });
            // logger.info({ mess: err });
            // logger.info({ mess: 'Error in Uploaded file data 111' });

            //logger.error({ awsUpload: err, file: req.file });
            return _context5.abrupt('return', res.json({
              status: 'success',
              key: results[0].key,
              imageurl: results[0].Location
            }));

          case 19:
            error = new Error('Customer not registered!');

            error.ar_message = 'العميل غير مسجل!';
            error.name = 'DataNotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 23:
            _context5.next = 31;
            break;

          case 25:
            _context5.prev = 25;
            _context5.t0 = _context5['catch'](0);

            _logger2.default.info({ mess: 'Error in Uploaded file data' });
            _logger2.default.error({ mess: _context5.t0 });
            _logger2.default.info({ mess: 'Error in Uploaded file data' });
            console.log(_context5.t0);

          case 31:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 25]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

// router.delete("/delete/:filename", async (req, res) => {
//   const filename = req.body.key;
//   await s3
//     .deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: filename })
//     .promise();
//   res.send("File Deleted Successfully");
// });

router.post('/deleteFile', function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var filename, results;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            filename = req.body.key;
            _context6.prev = 1;
            _context6.next = 4;
            return (0, _AWSServicek.deleteFile)(filename);

          case 4:
            results = _context6.sent;

            console.log(results);
            return _context6.abrupt('return', res.json({
              status: 'success',
              key: req.body.key,
              message: 'File deleted successfully'
            }));

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6['catch'](1);

            console.log(_context6.t0);

          case 12:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[1, 9]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

router.post('/uploadBase64Image', function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var binary_image, base64Data, type, params, result, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            binary_image = req.body.binary_image;

            // const type = "PNG";
            // // const params = {
            // //   binary_image,
            // //   type,
            // // };

            // const params = {
            //   base64Data: binary_image,
            //   type: type,
            // };

            base64Data = new Buffer(binary_image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            type = binary_image.split(';')[0].split('/')[1];
            params = {
              base64Data: base64Data,
              type: type
            };
            _context7.next = 7;
            return (0, _AWSServicek.s3Upload)(params);

          case 7:
            result = _context7.sent;
            data = { image: result.Key };
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, data));

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7['catch'](0);
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, _context7.t0));

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[0, 12]]);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());

// router.post(
//   '/uploadFile',
//   ensureAuth,
//   uploadFile.single('file'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname}/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadCategoryImage',
//   ensureAuth,
//   uploadCategoryImage.single('category_image'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

router.use(function (error, req, res, next) {
  console.log(error);
  if (error instanceof _multer2.default.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'file is too large'
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'File limit reached'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'File must be an image'
      });
    }
  }
});

router.get('/createBucket', _auth.ensureAdminAuth, function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return createBucket();

          case 3:
            result = _context8.sent;
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, result));

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8['catch'](0);
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, _context8.t0));

          case 10:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 7]]);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());

// router.post(
//   '/upload',
//   ensureAuth,
//   uploadServiceFile.single('service_file'),
//   (req, res) => {
//     console.log('upload info-->', req.file);

//     try {
//       const image = `${req.file.fieldname
//         .replace(/ /g, '')
//         .replace('_', '-')}s/${req.file.key.replace(/ /g, '')}`;
//       console.log('upload image====>', image);

//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       logger.error({ awsUpload: err, file: req.file });

//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadProfilePic',
//   ensureAuth,
//   uploadProfilePic.single('profile_pic'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadCategoryImage',
//   ensureAuth,
//   uploadCategoryImage.single('category_image'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname.replace('_', '-')}s/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.post(
//   '/uploadFile',
//   ensureAuth,
//   uploadFile.single('file'),
//   async (req, res) => {
//     try {
//       const image = `${req.file.fieldname}/${req.file.key}`;
//       let data = { image };
//       return formatResponse(res, data);
//     } catch (err) {
//       return formatResponse(res, err);
//     }
//   }
// );

// router.get('/sendSMS', async (req, res) => {
//   try {
//     const params = {
//       Message: 'this is a test message',
//       PhoneNumber: '919970776148',
//     };
//     const result = await snsSendSMS(params);
//     //const data = { result };
//     return formatResponse(res, result);
//   } catch (err) {
//     return formatResponse(res, err);
//   }
// });

router.get('/sendNotification', function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
    var params;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            params = {
              Message: 'this is a test message',
              PhoneNumber: '+917291864691'
            };
            _context9.next = 4;
            return snsService(params);

          case 4:
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, {}));

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9['catch'](0);
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, _context9.t0));

          case 10:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[0, 7]]);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());

exports.default = router;