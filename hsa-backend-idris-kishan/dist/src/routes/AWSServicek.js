'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _AWSServicek = require('../handler/AWSServicek');

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _auth = require('../middlewares/auth');

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

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
            return _context.abrupt('return', res.json({ status: 'success' }));

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
            return _context2.abrupt('return', res.json({ status: 'success' }));

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
            return _context3.abrupt('return', res.json({ status: 'success' }));

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
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return createBucket();

          case 3:
            result = _context4.sent;
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, result));

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4['catch'](0);
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, _context4.t0));

          case 10:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 7]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
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

// router.post('/uploadBase64Image', ensureAuth, async (req, res) => {
//   try {
//     const binary_image = req.body.binary_image;
//     const base64Data = new Buffer(
//       binary_image.replace(/^data:image\/\w+;base64,/, ''),
//       'base64'
//     );
//     const type = binary_image.split(';')[0].split('/')[1];
//     const params = {
//       base64Data,
//       type,
//     };
//     const result = await s3Upload(params);
//     const data = { image: result.Key };
//     return formatResponse(res, data);
//   } catch (err) {
//     return formatResponse(res, err);
//   }
// });

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

// router.get('/sendNotification', async (req, res) => {
//   try {
//     const params = {
//       Message: 'this is a test message',
//       PhoneNumber: '919657947698',
//     };
//     await snsService(params);
//     //const result = await snsService(params);
//     //console.log('result = ', result.response);

//     //const data = { result };
//     return formatResponse(res, {});
//   } catch (err) {
//     return formatResponse(res, err);
//   }
// });

exports.default = router;