'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.getUser = exports.editUser = exports.resendOtp = exports.mobileSignin = exports.sendOtp = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _otpService = require('../../utils/otpService');

var otpService = _interopRequireWildcard(_otpService);

var _mail = require('../handler/mail');

var mail = _interopRequireWildcard(_mail);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { snsSendSMS } from "../handler/AWSService";
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
    var mobile_no, country_code, foundUser, error, checkRole, role, _error, _error2, isPermission, _error3, otp, params, valid_no;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            // console.log('req body=========', req.body);

            _context.next = 4;
            return _User2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              active: true
            });

          case 4:
            foundUser = _context.sent;

            if (!(foundUser && foundUser.country_code != country_code)) {
              _context.next = 10;
              break;
            }

            error = new Error('You might have provided an incorrect country code');

            error.ar_message = 'ربما قدمت رمز بلد غير صحيح';
            error.name = 'DataNotFound';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            checkRole = void 0;
            role = void 0;

            if (!(foundUser && foundUser.role.length)) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return _Role2.default.findOne({ _id: foundUser.role[0] });

          case 15:
            role = _context.sent;

            console.log('role :', role);
            checkRole = role.name;

          case 18:
            if (foundUser) {
              _context.next = 23;
              break;
            }

            _error = new Error('Mobile number not registered!');

            _error.ar_message = 'رقم الجوال غير مسجل!';
            _error.name = 'DataNotFound';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 23:
            if (!(checkRole != 'service_provider')) {
              _context.next = 28;
              break;
            }

            _error2 = new Error('User does\'nt have role to access this service');

            _error2.ar_message = 'رقم الجوال غير مسجل!';
            _error2.name = 'ValidationError';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 28:
            isPermission = false;

            if (role.name === _config2.default.authTypes.SERVICE_PROVIDER) {
              isPermission = true;
            }

            if (isPermission) {
              _context.next = 35;
              break;
            }

            _error3 = new Error('Mobile number not registered!');

            _error3.ar_message = 'رقم الجوال غير مسجل!';
            _error3.name = 'DataNotFound';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, _error3));

          case 35:
            otp = otpService.generateOtp();

            console.log('OTP for ' + mobile_no + ' = ' + otp);

            params = {
              Message: 'Your HSA One Time Password is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };

            console.log('params ==> ' + params);

            // await snsSendSMS(params);

            valid_no = '+' + country_code + mobile_no;


            sendSms(valid_no, params.Message);

            // //console.log("4"+foundUser);
            // mail.send({
            //   user: foundUser,
            //   subject: "One Time Password for HSA",
            //   filename: "otp",
            //   otp,
            // });
            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number',
              otp: otp,
              ar_message: 'أرسلت OTP على رقم هاتفك المحمول'
            });

          case 42:
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

var mobileSignin = exports.mobileSignin = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var mobile_no, otp, response, otpVerified, foundUser, error, isPermission, _error4, _error5;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            response = {};
            //const otpVerified = otpService.verifyOtp(otp);

            otpVerified = true;
            // logger.info(mobile_no, otp, otpVerified);
            // console.log('mobileSignin ===>', mobile_no, otp, otpVerified);

            if (!otpVerified) {
              _context2.next = 33;
              break;
            }

            _context2.next = 7;
            return _User2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              active: true
            }).populate('role').populate('category_id');

          case 7:
            foundUser = _context2.sent;

            if (foundUser) {
              _context2.next = 13;
              break;
            }

            error = new Error('Unauthorized User!');

            error.ar_message = 'مستخدم غير مصرح به!';
            error.name = 'AuthenticationError';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 13:
            isPermission = false;

            foundUser.role.map(function (role) {
              if (role.name === _config2.default.authTypes.SERVICE_PROVIDER) {
                isPermission = true;
              }
            });

            if (isPermission) {
              _context2.next = 20;
              break;
            }

            _error4 = new Error('Mobile number not registered!');

            _error4.ar_message = 'رقم الجوال غير مسجل!';
            _error4.name = 'DataNotFound';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, _error4));

          case 20:
            if (foundUser.active) {
              _context2.next = 25;
              break;
            }

            _error5 = new Error('User Not Active!');

            _error5.ar_message = 'العضو غير نشط!';
            _error5.name = 'userInactive';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, _error5));

          case 25:
            foundUser.device_id = req.body.device_id;
            _context2.next = 28;
            return foundUser.save();

          case 28:
            foundUser = foundUser.toObject();
            foundUser.token = createToken(foundUser);
            (0, _formatResponse2.default)(res, foundUser);
            _context2.next = 35;
            break;

          case 33:
            response = {
              status: 'error',
              message: 'Otp not verified'
            };
            (0, _formatResponse2.default)(res, response);

          case 35:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function mobileSignin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var resendOtp = exports.resendOtp = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var mobile_no, country_code, foundUser, error, _error6, otp, params, valid_no;

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

            if (!(foundUser && foundUser.country_code != country_code)) {
              _context3.next = 10;
              break;
            }

            error = new Error('You might have provided an incorrect country code');

            error.ar_message = 'ربما قدمت رمز بلد غير صحيح';
            error.name = 'DataNotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            if (foundUser) {
              _context3.next = 15;
              break;
            }

            _error6 = new Error('Mobile number not registered!');

            _error6.ar_message = 'رقم الجوال غير مسجل!';
            _error6.name = 'DataNotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, _error6));

          case 15:
            otp = otpService.generateOtp();

            console.log('OTP for ' + mobile_no + ' = ' + otp);

            params = {
              Message: 'Your HSA One Time Password is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };


            if (foundUser) {
              mail.send({
                user: foundUser,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
            }

            //await snsSendSMS(params);

            valid_no = '+' + country_code + mobile_no;


            sendSms(valid_no, params.Message);

            //console.log("5"+foundUser);
            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number777',
              otp: otp
            });

          case 22:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function resendOtp(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var editUser = exports.editUser = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var userId, user, error, updatedUser;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userId = req.user;
            _context4.next = 3;
            return _User2.default.findById(userId).populate('category_id');

          case 3:
            user = _context4.sent;

            if (user) {
              _context4.next = 9;
              break;
            }

            error = new Error('User not found!');

            error.ar_message = 'المستخدم ليس موجود!';
            error.name = 'DataNotFound';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            user.set({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              city: req.body.city,
              preferred_language: req.body.preferred_language
            });
            _context4.next = 12;
            return user.save();

          case 12:
            updatedUser = _context4.sent;

            updatedUser = updatedUser.toObject();
            (0, _formatResponse2.default)(res, updatedUser);

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function editUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getUser = exports.getUser = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var userId, user, error;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = req.user;
            _context5.next = 3;
            return _User2.default.findById(userId).populate('category_id');

          case 3:
            user = _context5.sent;

            if (user) {
              _context5.next = 9;
              break;
            }

            error = new Error('User not found!');

            error.ar_message = 'المستخدم ليس موجود!';
            error.name = 'DataNotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            user = user.toObject();
            (0, _formatResponse2.default)(res, user);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var addAddress = exports.addAddress = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var userId, user, error, updatedUser;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log('req.body.addresses==');
            console.log(req.body.addresses);
            console.log('==req.body.addresses');

            userId = req.user;
            _context6.next = 6;
            return _User2.default.findById(userId);

          case 6:
            user = _context6.sent;

            if (user) {
              _context6.next = 12;
              break;
            }

            error = new Error('User not found!');

            error.ar_message = 'المستخدم ليس موجود!';
            error.name = 'DataNotFound';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 12:
            req.body.addresses.forEach(function (address) {
              console.log('address==');
              console.log(address);
              console.log('==address');
              user.addresses.push(address);
            });
            _context6.next = 15;
            return user.save();

          case 15:
            updatedUser = _context6.sent;

            updatedUser = updatedUser.toObject();
            (0, _formatResponse2.default)(res, updatedUser);

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function addAddress(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var updateAddress = exports.updateAddress = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var userId, updatedData;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userId = req.user;
            _context7.next = 3;
            return _User2.default.findOneAndUpdate({
              _id: userId,
              'addresses._id': req.params.addressId
            }, {
              $set: {
                'addresses.$.type': req.body.type,
                'addresses.$.address': req.body.address,
                'addresses.$.city': req.body.city,
                'addresses.$.zipcode': req.body.zipcode,
                'addresses.$.country': req.body.country,
                'addresses.$.location.coordinates': req.body.location.coordinates,
                'addresses.$.location.type': req.body.location.type,
                'addresses.$.isDefault': req.body.isDefault
              }
            }, { new: true });

          case 3:
            updatedData = _context7.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function updateAddress(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var deleteAddress = exports.deleteAddress = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var userId, updatedData;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            userId = req.user;
            _context8.next = 3;
            return _User2.default.findOneAndUpdate({
              _id: userId
            }, {
              $pull: { addresses: { _id: req.params.addressId } }
            }, { new: true });

          case 3:
            updatedData = _context8.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function deleteAddress(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();