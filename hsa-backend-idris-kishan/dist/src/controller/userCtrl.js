'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomerList = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.appleLogin = exports.googleLogin = exports.facebookLogin = exports.getUser = exports.editUser = exports.mobileSignup = exports.mobileSignin = exports.generateOtp = exports.verifyOtp = exports.sendOtp = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _otpService = require('../../utils/otpService');

var otpService = _interopRequireWildcard(_otpService);

var _AWSService = require('../handler/AWSService');

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _mail = require('../handler/mail');

var mail = _interopRequireWildcard(_mail);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendSms = require('../handler/twilio');


var createToken = function createToken(user) {
  var payload = {
    iss: 'home_service',
    sub: user.userId,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 86400000
  };
  return _jsonwebtoken2.default.sign(payload, _config2.default.JWT_SECRET);
};

var sendOtp = exports.sendOtp = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var mobile_no, country_code, foundUser, otp, params, valid_no;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context.next = 4;
            return _User2.default.findOne({ mobile_no: mobile_no });

          case 4:
            foundUser = _context.sent;

            // if (foundUser) {
            // 	let error = new Error('Mobile number already registered!');
            // 	error.name = 'userExist';
            // 	return formatResponse(res, error);
            // }
            otp = otpService.generateOtp();
            params = {
              Message: 'Your OTP is ' + otp + ' sent at ' + new Date() + ' by HSA',
              PhoneNumber: '' + country_code + mobile_no,
              Subject: 'HSA'
            };
            // await snsSendSMS(params, (err, done) => {
            //   console.log(err);
            // });

            valid_no = '+' + country_code + mobile_no;


            sendSms(valid_no, params.Message);

            //console.log("6"+foundUser);
            if (foundUser) mail.send({
              user: foundUser,
              subject: 'One Time Password for HSA',
              filename: 'otp',
              otp: otp
            });

            (0, _formatResponse2.default)(res, {});

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function sendOtp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var verifyOtp = exports.verifyOtp = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var country_code, mobile_no, otp, response, otpVerified, foundUser, existingData, registeredUser, createUser;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            country_code = req.body.country_code;
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            response = {};
            otpVerified = otpService.verifyOtp(otp);

            if (!otpVerified) {
              _context2.next = 27;
              break;
            }

            _context2.next = 8;
            return _User2.default.findOne({ mobile_no: mobile_no });

          case 8:
            foundUser = _context2.sent;

            if (!foundUser) {
              _context2.next = 20;
              break;
            }

            existingData = {
              country_code: country_code,
              mobile_no: mobile_no,
              active: true,
              isDeleted: false
            };

            foundUser.set(existingData);
            _context2.next = 14;
            return foundUser.save();

          case 14:
            registeredUser = _context2.sent;

            registeredUser = registeredUser.toObject();
            registeredUser.message = 'Otp verified';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, registeredUser));

          case 20:
            _context2.next = 22;
            return _User2.default.create({
              country_code: country_code,
              mobile_no: mobile_no,
              active: true
            });

          case 22:
            createUser = _context2.sent;

            createUser.message = 'Otp verified';
            (0, _formatResponse2.default)(res, createUser);

          case 25:
            _context2.next = 29;
            break;

          case 27:
            response = {
              status: 'error',
              message: 'Entered OTP is not correct. Please enter the Correct OTP'
            };
            (0, _formatResponse2.default)(res, response);

          case 29:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function verifyOtp(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var generateOtp = exports.generateOtp = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var mobile_no, country_code, foundUser, error, _error, otp, params, valid_no;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context3.next = 4;
            return _User2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              active: true
            });

          case 4:
            foundUser = _context3.sent;

            if (!(foundCustomer && foundCustomer.country_code != country_code)) {
              _context3.next = 9;
              break;
            }

            error = new Error('You might have provided an incorrect country code');

            error.name = 'DataNotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            if (foundUser) {
              _context3.next = 13;
              break;
            }

            _error = new Error('Mobile number not registered!');

            _error.name = 'DataNotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 13:
            otp = otpService.generateOtp();
            params = {
              Message: 'Your HSA One Time Password is ' + otp + ' send by HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };

            // await snsSendSMS(params);

            valid_no = '+' + country_code + mobile_no;


            sendSms(valid_no, params.Message);

            //console.log("7"+foundUser);
            mail.send({
              user: foundUser,
              subject: 'One Time Password for HSA',
              filename: 'otp',
              otp: otp
            });
            (0, _formatResponse2.default)(res, {});

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function generateOtp(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var mobileSignin = exports.mobileSignin = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var mobile_no, otp, device_id, device_type, response, otpVerified, foundUser, error, isPermission, _error2;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            device_id = req.body.device_id;
            device_type = req.body.device_type;
            response = {};
            otpVerified = otpService.verifyOtp(otp);

            if (!otpVerified) {
              _context4.next = 29;
              break;
            }

            _context4.next = 9;
            return _User2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              active: true
            }).populate('role');

          case 9:
            foundUser = _context4.sent;

            if (foundUser) {
              _context4.next = 14;
              break;
            }

            error = new Error('Unauthorized!');

            error.name = 'AuthenticationError';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 14:
            isPermission = false;

            foundUser.role.map(function (role) {
              if (role.name === _config2.default.authTypes.USER) {
                isPermission = true;
              }
            });

            if (isPermission) {
              _context4.next = 20;
              break;
            }

            _error2 = new Error('Unauthorized!');

            _error2.name = 'AuthenticationError';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 20:
            foundUser.device_id = device_id ? device_id : foundUser.device_id;
            foundUser.device_type = device_type ? device_type : foundUser.device_type;
            _context4.next = 24;
            return foundUser.save();

          case 24:
            foundUser = foundUser.toObject();
            foundUser.token = createToken(foundUser);
            (0, _formatResponse2.default)(res, foundUser);
            _context4.next = 31;
            break;

          case 29:
            response = {
              status: 'error',
              message: 'Entered OTP is not correct. Please enter the Correct OTP'
            };
            (0, _formatResponse2.default)(res, response);

          case 31:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function mobileSignin(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var mobileSignup = exports.mobileSignup = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var user, error, foundRole, registeredUser;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _User2.default.findById(req.body.txnId);

          case 2:
            user = _context5.sent;

            if (user) {
              _context5.next = 7;
              break;
            }

            error = new Error('Wrong txtId!');

            error.name = 'DataNotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 7:
            _context5.next = 9;
            return _Role2.default.findOne({ name: 'user' });

          case 9:
            foundRole = _context5.sent;

            req.body.role = foundRole._id;
            req.body.active = true;
            user.set(req.body);
            _context5.next = 15;
            return user.save();

          case 15:
            registeredUser = _context5.sent;

            registeredUser = registeredUser.toObject();
            registeredUser.token = createToken(registeredUser);
            registeredUser.message = 'Customer registered successfully.';
            (0, _formatResponse2.default)(res, registeredUser);

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function mobileSignup(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var editUser = exports.editUser = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var userId, user, error, updatedUser;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userId = req.user;
            _context6.next = 3;
            return _User2.default.findById(userId);

          case 3:
            user = _context6.sent;

            if (user) {
              _context6.next = 8;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:
            user.set({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              city: req.body.city,
              preferred_language: req.body.preferred_language
            });
            _context6.next = 11;
            return user.save();

          case 11:
            updatedUser = _context6.sent;

            updatedUser = updatedUser.toObject();
            (0, _formatResponse2.default)(res, updatedUser);

          case 14:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function editUser(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var getUser = exports.getUser = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var userId, user, error;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userId = req.user;
            _context7.next = 3;
            return _User2.default.findById(userId);

          case 3:
            user = _context7.sent;

            if (user) {
              _context7.next = 8;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:
            user = user.toObject();
            (0, _formatResponse2.default)(res, user);

          case 10:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function getUser(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var facebookLogin = exports.facebookLogin = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var graphApiUrl, params, fbData, profile, foundUser, foundRole, user, savedUser, formatError, error;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            graphApiUrl = 'https://graph.facebook.com/v7.0/me';
            params = {
              access_token: req.body.access_token,
              fields: 'id,name,email,picture,first_name,last_name'
            };
            // Step 1. Exchange authorization code for access token.

            // Step 2. Retrieve profile information about the current user.

            _context8.next = 5;
            return _axios2.default.get(graphApiUrl, { params: params });

          case 5:
            fbData = _context8.sent;
            profile = fbData.data;
            // Step 3. Create a new user account or return an existing one.

            _context8.next = 9;
            return _User2.default.findOne({ facebook_id: profile.id });

          case 9:
            foundUser = _context8.sent;

            if (!foundUser) {
              _context8.next = 14;
              break;
            }

            foundUser = foundUser.toObject();
            foundUser.token = createToken(foundUser);
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, foundUser));

          case 14:
            _context8.next = 16;
            return _Role2.default.findOne({ name: 'user' });

          case 16:
            foundRole = _context8.sent;
            user = new _User2.default();

            user.first_name = profile.first_name;
            user.last_name = profile.last_name;
            user.facebook_id = profile.id;
            user.role = foundRole._id;
            user.active = true;
            // user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            _context8.next = 25;
            return user.save();

          case 25:
            savedUser = _context8.sent;

            savedUser = savedUser.toObject();
            savedUser.token = createToken(savedUser);
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, savedUser));

          case 31:
            _context8.prev = 31;
            _context8.t0 = _context8['catch'](0);

            if (!_context8.t0.response.data) {
              _context8.next = 39;
              break;
            }

            _logger2.default.error(_context8.t0.response.data);
            formatError = _context8.t0.response.data.error ? _context8.t0.response.data.error.message : '';
            error = new Error(formatError);

            error.name = 'OAuthException';
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 39:
            _logger2.default.error(_context8.t0);
            return _context8.abrupt('return', res.status(500).send({ err: _context8.t0 }));

          case 41:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 31]]);
  }));

  return function facebookLogin(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var googleLogin = exports.googleLogin = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
    var peopleApiUrl, params, googleData, profile, foundUser, foundRole, user, savedUser, formatError, error;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
            params = {
              access_token: req.body.access_token
            };
            // Step 1. Exchange authorization code for access token.

            // Step 2. Retrieve profile information about the current user.

            _context9.next = 5;
            return _axios2.default.get(peopleApiUrl, { params: params });

          case 5:
            googleData = _context9.sent;
            profile = googleData.data;
            _context9.next = 9;
            return _User2.default.findOne({ google_id: profile.sub });

          case 9:
            foundUser = _context9.sent;

            if (!foundUser) {
              _context9.next = 14;
              break;
            }

            foundUser = foundUser.toObject();
            foundUser.token = createToken(foundUser);
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, foundUser));

          case 14:
            _context9.next = 16;
            return _Role2.default.findOne({ name: 'user' });

          case 16:
            foundRole = _context9.sent;
            user = new _User2.default();

            user.first_name = profile.given_name;
            user.last_name = profile.family_name;
            user.google_id = profile.sub;
            user.email = profile.email;
            // user.picture = profile.picture.replace('sz=50', 'sz=200');
            user.role = foundRole._id;
            user.active = true;
            _context9.next = 26;
            return user.save();

          case 26:
            savedUser = _context9.sent;

            savedUser = savedUser.toObject();
            savedUser.token = createToken(savedUser);
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, savedUser));

          case 32:
            _context9.prev = 32;
            _context9.t0 = _context9['catch'](0);

            if (!_context9.t0.response) {
              _context9.next = 40;
              break;
            }

            _logger2.default.error(_context9.t0.response.data);
            formatError = _context9.t0.response.data.error ? _context9.t0.response.data.error.message : '';
            error = new Error(formatError);

            error.name = 'OAuthException';
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 40:
            _logger2.default.error(_context9.t0);
            return _context9.abrupt('return', res.status(500).send({ err: {} }));

          case 42:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[0, 32]]);
  }));

  return function googleLogin(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var appleLogin = exports.appleLogin = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(req, res) {
    var foundUser, foundRole, user, savedUser, formatError, error;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log('wowwwww');
            _context10.prev = 1;
            _context10.next = 4;
            return _User2.default.findOne({ apple_id: req.body.user });

          case 4:
            foundUser = _context10.sent;

            console.log('user : ', foundUser);

            if (!foundUser) {
              _context10.next = 10;
              break;
            }

            foundUser = foundUser.toObject();
            foundUser.token = createToken(foundUser);
            return _context10.abrupt('return', (0, _formatResponse2.default)(res, foundUser));

          case 10:
            _context10.next = 12;
            return _Role2.default.findOne({ name: 'user' });

          case 12:
            foundRole = _context10.sent;
            user = new _User2.default();

            user.first_name = req.body.given_name;
            user.last_name = req.body.family_name;
            user.apple_id = req.body.user;
            user.email = req.body.email;
            user.role = foundRole._id;
            user.active = true;
            _context10.next = 22;
            return user.save();

          case 22:
            savedUser = _context10.sent;

            savedUser = savedUser.toObject();
            savedUser.token = createToken(savedUser);
            return _context10.abrupt('return', (0, _formatResponse2.default)(res, savedUser));

          case 28:
            _context10.prev = 28;
            _context10.t0 = _context10['catch'](1);

            if (!_context10.t0.response) {
              _context10.next = 36;
              break;
            }

            _logger2.default.error(_context10.t0.response.data);
            formatError = _context10.t0.response.data.error ? _context10.t0.response.data.error.message : '';
            error = new Error(formatError);

            error.name = 'OAuthException';
            return _context10.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 36:
            _logger2.default.error(_context10.t0);
            return _context10.abrupt('return', res.status(500).send({ err: {} }));

          case 38:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[1, 28]]);
  }));

  return function appleLogin(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var addAddress = exports.addAddress = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(req, res) {
    var userId, user, error, updatedUser;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userId = req.user;
            _context11.next = 3;
            return _User2.default.findById(userId);

          case 3:
            user = _context11.sent;

            if (user) {
              _context11.next = 8;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:
            req.body.addresses.forEach(function (address) {
              user.addresses.push(address);
            });
            _context11.next = 11;
            return user.save();

          case 11:
            updatedUser = _context11.sent;

            updatedUser = updatedUser.toObject();
            (0, _formatResponse2.default)(res, updatedUser);

          case 14:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }));

  return function addAddress(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var updateAddress = exports.updateAddress = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(req, res) {
    var userId, updatedData;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            userId = req.user;
            _context12.next = 3;
            return _User2.default.findOneAndUpdate({
              _id: userId,
              'addresses._id': req.params.addressId
            }, {
              $set: {
                'addresses.$.type': req.body.type,
                'addresses.$.address': req.body.address,
                'addresses.$.city': req.body.city,
                'addresses.$.mapAddress': req.body.mapAddress,
                'addresses.$.zipcode': req.body.zipcode,
                'addresses.$.country': req.body.country,
                'addresses.$.location.coordinates': req.body.location.coordinates,
                'addresses.$.location.type': req.body.location.type,
                'addresses.$.isDefault': req.body.isDefault
              }
            }, { new: true });

          case 3:
            updatedData = _context12.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  }));

  return function updateAddress(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var deleteAddress = exports.deleteAddress = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(req, res) {
    var userId, updatedData;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            userId = req.user;
            _context13.next = 3;
            return _User2.default.findOneAndUpdate({
              _id: userId
            }, {
              $pull: { addresses: { _id: req.params.addressId } }
            }, { new: true });

          case 3:
            updatedData = _context13.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function deleteAddress(_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();

var getCustomerList = exports.getCustomerList = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(req, res) {
    var items, page, skip, limit, roleSearch, foundRoles, roleIds, searchData, count, users, result, userIds, filter, servicesCount, done, accepted, declined, data;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? req.query.page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            roleSearch = {
              isDeleted: false,
              $and: [{ name: 'user' }, { name: { $ne: 'admin' } }]
            };
            _context14.next = 7;
            return _Role2.default.find(roleSearch);

          case 7:
            foundRoles = _context14.sent;
            roleIds = foundRoles.map(function (role) {
              return role.id;
            });
            searchData = { isDeleted: false, role: { $in: roleIds } };
            _context14.next = 12;
            return _User2.default.find(searchData).countDocuments();

          case 12:
            count = _context14.sent;
            _context14.next = 15;
            return _User2.default.find(searchData).populate('role', ['name']).skip(skip).limit(limit);

          case 15:
            users = _context14.sent;
            result = users;
            userIds = users.map(function (user) {
              return user._id;
            });
            filter = [{ $project: { progress: 1, service_provider_id: 1 } }, { $match: { service_provider_id: { $in: userIds } } }, { $group: { _id: '$progress', count: { $sum: 1 } } }];
            _context14.next = 21;
            return _Service2.default.aggregate(filter);

          case 21:
            servicesCount = _context14.sent;
            done = 0;
            accepted = 0;
            declined = 0;

            result = users.map(function (user) {
              user = JSON.parse((0, _stringify2.default)(user));
              servicesCount.map(function (serviceCount) {
                done = serviceCount._id === 'task_done' || serviceCount._id === 'payment_done' || serviceCount._id === 'review' ? serviceCount.count + done : done;

                accepted = serviceCount._id === 'accepted' || serviceCount._id === 'quote_provided' || serviceCount._id === 'quote_accepted' || serviceCount._id === 'quote_rejected' || serviceCount._id === 'leave_for_the_job' || serviceCount._id === 'ongoing' || serviceCount._id === 'task_done' || serviceCount._id === 'payment_done' || serviceCount._id === 'review' ? serviceCount.count + accepted : accepted;

                declined = serviceCount._id === 'rejected' ? serviceCount.count + declined : declined;
              });
              var newUser = (0, _assign2.default)(user, {
                service_completed: 0,
                service_cancelled: 0
              });
              return newUser;
            });

            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: result
            };


            (0, _formatResponse2.default)(res, data);

          case 28:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }));

  return function getCustomerList(_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}();