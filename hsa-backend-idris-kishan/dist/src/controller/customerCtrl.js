'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tester = exports.reVerifyingOtp = exports.getLatestDeviceId = exports.reauthenticateOTP = exports.checkuser = exports.contactCheck = exports.socialVerifyContactNumber = exports.addContactForSocialSignup = exports.history = exports.removeAll = exports.remove = exports.updateUser = exports.add = exports.create = exports.getCustomerList = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.appleLoginCheck = exports.appleLogin = exports.googleLogin = exports.facebookLogin = exports.getById = exports.getCustomerById = exports.editCustomer = exports.mobileSignup = exports.mobileSignin = exports.generateOtp = exports.providerVerifyOtp = exports.verifyOtp = exports.sendProviderOtp = exports.sendOtp = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _otpService = require('../../utils/otpService');

var otpService = _interopRequireWildcard(_otpService);

var _AWSService = require('../handler/AWSService');

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _CustomerHistory = require('../models/CustomerHistory');

var _CustomerHistory2 = _interopRequireDefault(_CustomerHistory);

var _ServiceActivity = require('../models/ServiceActivity');

var _ServiceActivity2 = _interopRequireDefault(_ServiceActivity);

var _Review = require('../models/Review');

var _Review2 = _interopRequireDefault(_Review);

var _mail = require('../handler/mail');

var mail = _interopRequireWildcard(_mail);

var _Configuration = require('../models/Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _constants = require('../../utils/constants');

var _constants2 = _interopRequireDefault(_constants);

var _appleSigninAuth = require('apple-signin-auth');

var _appleSigninAuth2 = _interopRequireDefault(_appleSigninAuth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendSms = require('../handler/twilio');
//import { sendSms } from "../handler/twilio";


var createToken = function createToken(user) {
  var payload = {
    iss: 'home_service',
    sub: user.userId,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 86400000,
    language: user.preferred_language
  };
  return _jsonwebtoken2.default.sign(payload, _config2.default.JWT_SECRET);
};

/**
 * Initial Registration API with OTP sending feature
 * @param {*} req
 * @param {*} res
 */
var sendOtp = exports.sendOtp = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var mobile_no, country_code, foundCustomer, otp, params, valid_no;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context.next = 4;
            return _Customer2.default.findOne({ mobile_no: mobile_no });

          case 4:
            foundCustomer = _context.sent;
            otp = otpService.generateOtp();
            params = {
              Message: 'Your HSA One Time Password is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };

            if (foundCustomer && foundCustomer.email) {
              mail.send({
                user: foundCustomer,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
            }
            //await snsSendSMS(params);
            //console.log("1"+foundCustomer);

            valid_no = '+' + country_code + mobile_no;


            sendSms(valid_no, params.Message);

            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number',
              otp: otp
            });

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

var sendProviderOtp = exports.sendProviderOtp = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var mobile_no, country_code, foundUser, otp, params;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context2.next = 4;
            return _User2.default.findOne({ mobile_no: mobile_no });

          case 4:
            foundUser = _context2.sent;
            otp = otpService.generateOtp();
            params = {
              Message: 'Your HSA One Time Password is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };

            if (foundUser && foundUser.email) {
              mail.send({
                user: foundUser,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
            }
            _context2.next = 10;
            return (0, _AWSService.snsSendSMS)(params);

          case 10:

            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number',
              otp: otp
            });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function sendProviderOtp(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * API to verify the OTP after creating initial user doc with just contact no
 * @param {*} req
 * @param {*} res
 */
var verifyOtp = exports.verifyOtp = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var country_code, mobile_no, otp, email, response, otpVerified, foundCustomer, existingData, registeredCustomer, newCustomer, createCustomer;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            country_code = req.body.country_code;
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            email = req.body.email;
            response = {};
            // const otpVerified = await otpService.verifyOtp(otp);

            otpVerified = true;

            if (!otpVerified) {
              _context3.next = 29;
              break;
            }

            _context3.next = 9;
            return _Customer2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              facebook_id: { $exists: false }
            });

          case 9:
            foundCustomer = _context3.sent;

            if (!foundCustomer) {
              _context3.next = 23;
              break;
            }

            existingData = {
              country_code: country_code,
              mobile_no: mobile_no,
              email: email,
              isDeleted: false
            };

            foundCustomer.set(existingData);
            _context3.next = 15;
            return foundCustomer.save();

          case 15:
            registeredCustomer = _context3.sent;

            registeredCustomer = registeredCustomer.toObject();
            registeredCustomer.user = foundCustomer;
            registeredCustomer.isVerified = true;
            registeredCustomer.message = 'Otp verified';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, registeredCustomer));

          case 23:
            newCustomer = {};
            _context3.next = 26;
            return _Customer2.default.create({
              country_code: country_code,
              mobile_no: mobile_no,
              email: email
            }, function (err, user) {
              newCustomer.message = 'Otp verified';
              newCustomer.isVerified = true;
              newCustomer.user = user;
              (0, _formatResponse2.default)(res, newCustomer);
            });

          case 26:
            createCustomer = _context3.sent;

          case 27:
            _context3.next = 31;
            break;

          case 29:
            response = {
              status: 'error',
              message: 'Entered OTP is not correct. Please enter the Correct OTP'
            };
            (0, _formatResponse2.default)(res, response);

          case 31:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function verifyOtp(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var providerVerifyOtp = exports.providerVerifyOtp = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var country_code, mobile_no, otp, email, response, otpVerified, foundCustomer, existingData, registeredCustomer, newCustomer, createCustomer;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            country_code = req.body.country_code;
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            email = req.body.email;
            response = {};
            // const otpVerified = await otpService.verifyOtp(otp);

            otpVerified = true;

            if (!otpVerified) {
              _context4.next = 29;
              break;
            }

            _context4.next = 9;
            return _User2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              facebook_id: { $exists: false }
            });

          case 9:
            foundCustomer = _context4.sent;

            if (!foundCustomer) {
              _context4.next = 23;
              break;
            }

            existingData = {
              country_code: country_code,
              mobile_no: mobile_no,
              email: email,
              isDeleted: false
            };

            foundCustomer.set(existingData);
            _context4.next = 15;
            return foundCustomer.save();

          case 15:
            registeredCustomer = _context4.sent;

            registeredCustomer = registeredCustomer.toObject();
            registeredCustomer.user = foundCustomer;
            registeredCustomer.isVerified = true;
            registeredCustomer.message = 'Otp verified';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, registeredCustomer));

          case 23:
            newCustomer = {};
            _context4.next = 26;
            return _Customer2.default.create({
              country_code: country_code,
              mobile_no: mobile_no,
              email: email
            }, function (err, user) {
              newCustomer.message = 'Otp verified';
              newCustomer.isVerified = true;
              newCustomer.user = user;
              (0, _formatResponse2.default)(res, newCustomer);
            });

          case 26:
            createCustomer = _context4.sent;

          case 27:
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

  return function providerVerifyOtp(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var generateOtp = exports.generateOtp = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var mobile_no, country_code, foundCustomer, error, otp, params;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context5.next = 4;
            return _Customer2.default.find({
              mobile_no: mobile_no
            });

          case 4:
            foundCustomer = _context5.sent;

            if (foundCustomer) {
              _context5.next = 10;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            error.ar_message = 'المستخدم ليس موجود!';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            _context5.next = 12;
            return otpService.generateOtp();

          case 12:
            otp = _context5.sent;
            params = {
              Message: 'Please enter the following code ' + otp + ' to access your Hameed Service account',
              PhoneNumber: '' + country_code + mobile_no
            };

            (0, _AWSService.snsSendSMS)(params);

            if (foundCustomer && !foundCustomer.email) {
              (0, _formatResponse2.default)(res, {
                message: 'OTP sent on your mobile number222',
                otp: otp,
                ar_message: 'أرسلت OTP على رقم هاتفك المحمول'
              });
            }
            if (foundCustomer && foundCustomer.email) {
              console.log('**********************');
              //await sesSendEmail({ user: foundCustomer, subject: 'One Time Password for HSA', filename: 'otp', otp });
              mail.send({
                user: foundCustomer,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
              (0, _formatResponse2.default)(res, {
                message: 'OTP sent on your mobile number333',
                otp: otp,
                ar_message: 'أرسلت OTP على رقم هاتفك المحمول'
              });
            }

          case 17:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function generateOtp(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var mobileSignin = exports.mobileSignin = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var mobile_no, otp, device_id, device_type, response, otpVerified, foundCustomer, error, isPermission, _error;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            device_id = req.body.device_id;
            device_type = req.body.device_type;
            response = {};
            // const otpVerified = otpService.verifyOtp(otp);

            otpVerified = true;

            if (!otpVerified) {
              _context6.next = 31;
              break;
            }

            _context6.next = 9;
            return _Customer2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false
            }).populate('role');

          case 9:
            foundCustomer = _context6.sent;

            if (foundCustomer) {
              _context6.next = 15;
              break;
            }

            error = new Error('This user has been inactivated');

            error.name = 'userInactive';
            error.ar_message = 'تم تعطيل هذا المستخدم';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 15:
            isPermission = false;

            foundCustomer.role.map(function (role) {
              if (role.name === _config2.default.authTypes.USER) {
                isPermission = true;
              }
            });

            if (isPermission) {
              _context6.next = 22;
              break;
            }

            _error = new Error('Unauthorized!');

            _error.name = 'AuthenticationError';
            _error.ar_message = 'غير مصرح';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 22:
            // if (foundCustomer.isDeleted) {
            //     let error = new Error('This user has been inactivated');
            //     error.name = 'userInactive';
            //     error.ar_message = 'تم تعطيل هذا المستخدم';
            //     return formatResponse(res, error);
            // }
            foundCustomer.device_id = device_id ? device_id : foundCustomer.device_id;
            foundCustomer.device_type = device_type ? device_type : foundCustomer.device_type;
            _context6.next = 26;
            return foundCustomer.save();

          case 26:
            foundCustomer = foundCustomer.toObject();
            foundCustomer.token = createToken(foundCustomer);
            (0, _formatResponse2.default)(res, foundCustomer);
            _context6.next = 33;
            break;

          case 31:
            response = {
              status: 'error',
              message: 'Otp not verified'
            };
            (0, _formatResponse2.default)(res, response);

          case 33:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function mobileSignin(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var mobileSignup = exports.mobileSignup = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var customerMailChecker, customerMobileChecker, error, _error2, _error3, foundRole, newCustomer, history;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _Customer2.default.find({
              email: req.body.email,
              active: true
            });

          case 2:
            customerMailChecker = _context7.sent;
            _context7.next = 5;
            return _Customer2.default.find({
              mobile_no: req.body.mobile_no,
              active: true
            });

          case 5:
            customerMobileChecker = _context7.sent;

            if (!(customerMailChecker.length >= 1 && customerMailChecker.length >= 1)) {
              _context7.next = 13;
              break;
            }

            error = new Error('Email and Mobile already in use!');

            error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
            error.name = 'userExist';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 13:
            if (!(customerMailChecker.length >= 1)) {
              _context7.next = 20;
              break;
            }

            _error2 = new Error('Email id already in use!');

            _error2.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
            _error2.name = 'userExist';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 20:
            if (!(customerMobileChecker.length >= 1)) {
              _context7.next = 25;
              break;
            }

            _error3 = new Error('Mobile No already in use!');

            _error3.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
            _error3.name = 'userExist';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, _error3));

          case 25:
            _context7.next = 27;
            return _Role2.default.findOne({ name: 'user' });

          case 27:
            foundRole = _context7.sent;


            // const foundConfiguration = await Configuration.findOne();

            // const creditsFromConfiguration = foundConfiguration.credits;

            req.body.role = foundRole._id;
            req.body.active = true;
            // req.body.credits = creditsFromConfiguration;
            // foundCustomer.set(req.body);
            // let registeredCustomer = await foundCustomer.save();

            _context7.next = 32;
            return _Customer2.default.create(req.body);

          case 32:
            newCustomer = _context7.sent;

            // registeredCustomer = registeredCustomer.toObject();
            // registeredCustomer.token = createToken(registeredCustomer);
            newCustomer.message = 'Customer registered successfully.';

            history = new _CustomerHistory2.default({
              customer_id: newCustomer._id,
              operation: _operationConfig2.default.operations.add,
              // operator: operator,
              operator: 'customer',
              prevObj: null,
              updatedObj: newCustomer,
              operation_date: new Date()
            });
            _context7.next = 37;
            return history.save();

          case 37:

            (0, _formatResponse2.default)(res, newCustomer);

          case 38:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function mobileSignup(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var editCustomer = exports.editCustomer = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var userId, foundCustomer, error, updatedCustomer;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            userId = req.user;
            _context8.next = 3;
            return _Customer2.default.findById(userId);

          case 3:
            foundCustomer = _context8.sent;

            if (foundCustomer) {
              _context8.next = 9;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            error.ar_message = 'المستخدم ليس موجود!';
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            foundCustomer.set({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              mobile_no: req.body.mobile_no,
              country_code: req.body.country_code,
              preferred_language: req.body.preferred_language
            });
            _context8.next = 12;
            return foundCustomer.save();

          case 12:
            updatedCustomer = _context8.sent;

            updatedCustomer = updatedCustomer.toObject();
            (0, _formatResponse2.default)(res, updatedCustomer);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function editCustomer(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var getCustomerById = exports.getCustomerById = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
    var userId, foundCustomer, error;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            userId = req.user;
            _context9.next = 3;
            return _Customer2.default.findById(userId).populate('role');

          case 3:
            foundCustomer = _context9.sent;

            if (foundCustomer) {
              _context9.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'DataNotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context9.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            foundCustomer = foundCustomer.toObject();
            (0, _formatResponse2.default)(res, foundCustomer);

          case 11:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function getCustomerById(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var getById = exports.getById = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(req, res) {
    var id, customer, error;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.next = 3;
            return _Customer2.default.findById(id).populate('role', ['name']);

          case 3:
            customer = _context10.sent;

            if (customer) {
              _context10.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'NotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context10.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            (0, _formatResponse2.default)(res, customer);

          case 10:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function getById(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var facebookLogin = exports.facebookLogin = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(req, res) {
    var graphApiUrl, params, fbData, profile, foundConfiguration, creditsFromConfiguration, foundRole, userEmail, customer, savedCustomer, formatError, error;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            graphApiUrl = 'https://graph.facebook.com/v7.0/me';
            params = {
              access_token: req.body.access_token,
              fields: 'id,name,email,picture,first_name,last_name'
            };
            _context11.next = 5;
            return _axios2.default.get(graphApiUrl, { params: params });

          case 5:
            fbData = _context11.sent;
            profile = fbData.data;
            _context11.next = 9;
            return _Configuration2.default.findOne();

          case 9:
            foundConfiguration = _context11.sent;
            creditsFromConfiguration = foundConfiguration.credits;
            _context11.next = 13;
            return _Role2.default.findOne({ name: 'user' });

          case 13:
            foundRole = _context11.sent;
            _context11.next = 16;
            return _Customer2.default.findOne({ email: profile.email });

          case 16:
            userEmail = _context11.sent;

            if (userEmail) {
              _context11.next = 35;
              break;
            }

            customer = new _Customer2.default();

            customer.first_name = profile.first_name;
            customer.last_name = profile.last_name;
            customer.facebook_id = profile.id;
            customer.role = foundRole._id;
            customer.email = profile.email;
            customer.active = true;
            customer.source = 'social';
            customer.credits = creditsFromConfiguration;
            customer.profile_pic = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            _context11.next = 30;
            return customer.save();

          case 30:
            savedCustomer = _context11.sent;


            savedCustomer = savedCustomer.toObject();
            savedCustomer.token = createToken(savedCustomer);
            savedCustomer.isContactExists = false;
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, savedCustomer));

          case 35:
            if (!(userEmail && !userEmail.mobile_no)) {
              _context11.next = 52;
              break;
            }

            userEmail.facebook_id = profile.id;
            userEmail.first_name = userEmail.first_name ? userEmail.first_name : profile.first_name;
            userEmail.last_name = userEmail.last_name ? userEmail.last_name : profile.last_name;
            userEmail.role = foundRole._id;
            userEmail.source = 'social';
            userEmail.email = profile.email;
            userEmail.credits = creditsFromConfiguration;
            userEmail.device_type = req.body.device_type;
            userEmail.device_id = req.body.device_id;
            userEmail.profile_pic = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            _context11.next = 48;
            return userEmail.save();

          case 48:
            userEmail = userEmail.toObject();
            userEmail.token = createToken(userEmail);
            userEmail.isContactExists = false;
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, userEmail));

          case 52:
            if (!(userEmail && userEmail.mobile_no)) {
              _context11.next = 65;
              break;
            }

            userEmail.facebook_id = profile.id;
            userEmail.source = 'social';
            userEmail.email = profile.email;
            userEmail.device_type = req.body.device_type;
            userEmail.device_id = req.body.device_id;
            userEmail.profile_pic = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            _context11.next = 61;
            return userEmail.save();

          case 61:
            userEmail = userEmail.toObject();
            userEmail.token = createToken(userEmail);
            userEmail.isContactExists = true;
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, userEmail));

          case 65:
            _context11.next = 77;
            break;

          case 67:
            _context11.prev = 67;
            _context11.t0 = _context11['catch'](0);

            if (!(_context11.t0.response && _context11.t0.response.data)) {
              _context11.next = 75;
              break;
            }

            _logger2.default.error(_context11.t0.response.data);
            formatError = _context11.t0.response.data.error ? _context11.t0.response.data.error.message : '';
            error = new Error(formatError);

            error.name = 'OAuthException';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 75:
            _logger2.default.error(_context11.t0);
            return _context11.abrupt('return', res.status(500).send({ err: _context11.t0 }));

          case 77:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[0, 67]]);
  }));

  return function facebookLogin(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();

var googleLogin = exports.googleLogin = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(req, res) {
    var peopleApiUrl;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            peopleApiUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.access_token;
            _context13.next = 3;
            return _axios2.default.get(peopleApiUrl).then(function () {
              var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(googleData) {
                var profile, foundConfiguration, creditsFromConfiguration, foundCustomer, foundRole, customer, savedCustomer;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        profile = googleData.data;
                        // Getting the default credits

                        _context12.next = 3;
                        return _Configuration2.default.findOne();

                      case 3:
                        foundConfiguration = _context12.sent;
                        creditsFromConfiguration = foundConfiguration.credits;
                        _context12.next = 7;
                        return _Customer2.default.findOne({ email: profile.email });

                      case 7:
                        foundCustomer = _context12.sent;

                        if (foundCustomer) {
                          _context12.next = 29;
                          break;
                        }

                        _context12.next = 11;
                        return _Role2.default.findOne({ name: 'user' });

                      case 11:
                        foundRole = _context12.sent;
                        customer = new _Customer2.default();

                        customer.first_name = profile.given_name;
                        customer.last_name = profile.family_name;
                        customer.google_id = profile.sub;
                        customer.email = profile.email;
                        customer.profile_pic = profile.picture.replace('sz=50', 'sz=200');
                        customer.role = foundRole._id;
                        customer.source = 'social';
                        customer.active = true;

                        customer.credits = creditsFromConfiguration;
                        _context12.next = 24;
                        return customer.save();

                      case 24:
                        savedCustomer = _context12.sent;

                        savedCustomer = savedCustomer.toObject();
                        savedCustomer.token = createToken(savedCustomer);
                        savedCustomer.isContactExists = false;
                        return _context12.abrupt('return', (0, _formatResponse2.default)(res, savedCustomer));

                      case 29:
                        if (!(foundCustomer && !foundCustomer.mobile_no)) {
                          _context12.next = 34;
                          break;
                        }

                        foundCustomer = foundCustomer.toObject();
                        foundCustomer.token = createToken(foundCustomer);
                        foundCustomer.isContactExists = false;
                        return _context12.abrupt('return', (0, _formatResponse2.default)(res, foundCustomer));

                      case 34:
                        if (!(foundCustomer && foundCustomer.mobile_no)) {
                          _context12.next = 39;
                          break;
                        }

                        foundCustomer = foundCustomer.toObject();
                        foundCustomer.token = createToken(foundCustomer);
                        foundCustomer.isContactExists = true;
                        return _context12.abrupt('return', (0, _formatResponse2.default)(res, foundCustomer));

                      case 39:
                      case 'end':
                        return _context12.stop();
                    }
                  }
                }, _callee12, undefined);
              }));

              return function (_x25) {
                return _ref13.apply(this, arguments);
              };
            }()).catch(function (err) {
              if (err.response) {
                _logger2.default.error(err.response.data);
                var formatError = err.response.data.error ? err.response.data.error.message : '';
                var error = new Error(formatError);
                error.name = 'OAuthException';
                return (0, _formatResponse2.default)(res, error);
              }
              _logger2.default.error(err);
              return res.status(500).send({ err: {} });
            });

          case 3:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function googleLogin(_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();

var appleLogin = exports.appleLogin = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(req, res) {
    var clientId, _ref15, sub, foundConfiguration, creditsFromConfiguration, foundCustomer, foundRole, customer, savedCustomer, formatError, error;

    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            clientId = 'com.homeservices.consumer';
            _context14.next = 4;
            return _appleSigninAuth2.default.verifyIdToken(req.body.identityToken, {
              audience: clientId,
              ignoreExpiration: true // ignore token expiry (never expires)
            });

          case 4:
            _ref15 = _context14.sent;
            sub = _ref15.sub;
            _context14.next = 8;
            return _Configuration2.default.findOne();

          case 8:
            foundConfiguration = _context14.sent;
            creditsFromConfiguration = foundConfiguration.credits;
            _context14.next = 12;
            return _Customer2.default.findOne({ apple_id: req.body.user });

          case 12:
            foundCustomer = _context14.sent;

            if (foundCustomer) {
              _context14.next = 33;
              break;
            }

            _context14.next = 16;
            return _Role2.default.findOne({ name: 'user' });

          case 16:
            foundRole = _context14.sent;
            customer = new _Customer2.default();


            customer.first_name = req.body.givenName ? req.body.givenName : 'null';
            customer.last_name = req.body.familyName ? req.body.familyName : 'null';
            customer.apple_id = req.body.user;
            customer.email = req.body.email;
            customer.role = foundRole._id;
            customer.source = 'social';
            customer.active = true;
            customer.credits = creditsFromConfiguration;
            _context14.next = 28;
            return customer.save();

          case 28:
            savedCustomer = _context14.sent;

            savedCustomer = savedCustomer.toObject();
            savedCustomer.token = createToken(savedCustomer);
            savedCustomer.isContactExists = false;
            return _context14.abrupt('return', (0, _formatResponse2.default)(res, savedCustomer));

          case 33:
            if (!(foundCustomer && !foundCustomer.mobile_no)) {
              _context14.next = 38;
              break;
            }

            foundCustomer = foundCustomer.toObject();
            foundCustomer.token = createToken(foundCustomer);
            foundCustomer.isContactExists = false;
            return _context14.abrupt('return', (0, _formatResponse2.default)(res, foundCustomer));

          case 38:
            if (!(foundCustomer && foundCustomer.mobile_no)) {
              _context14.next = 43;
              break;
            }

            foundCustomer = foundCustomer.toObject();
            foundCustomer.token = createToken(foundCustomer);
            foundCustomer.isContactExists = true;
            return _context14.abrupt('return', (0, _formatResponse2.default)(res, foundCustomer));

          case 43:
            _context14.next = 55;
            break;

          case 45:
            _context14.prev = 45;
            _context14.t0 = _context14['catch'](0);

            if (!_context14.t0.response) {
              _context14.next = 53;
              break;
            }

            _logger2.default.error(_context14.t0.response.data);
            formatError = _context14.t0.response.data.error ? _context14.t0.response.data.error.message : '';
            error = new Error(formatError);

            error.name = 'OAuthException';
            return _context14.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 53:
            _logger2.default.error(_context14.t0);
            return _context14.abrupt('return', res.status(500).send({ err: {} }));

          case 55:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined, [[0, 45]]);
  }));

  return function appleLogin(_x26, _x27) {
    return _ref14.apply(this, arguments);
  };
}();

var appleLoginCheck = exports.appleLoginCheck = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(req, res) {
    var user, isCustomerExist;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            user = req.body.user;
            _context15.next = 3;
            return _Customer2.default.findOne({
              apple_id: user
            });

          case 3:
            isCustomerExist = _context15.sent;

            if (!isCustomerExist) {
              _context15.next = 8;
              break;
            }

            return _context15.abrupt('return', (0, _formatResponse2.default)(res, 'Customer found'));

          case 8:
            return _context15.abrupt('return', (0, _formatResponse2.default)(res, 'Customer not found'));

          case 9:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  }));

  return function appleLoginCheck(_x28, _x29) {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * @apidescription add customer address
 * @param {*} req
 * @param {*} res
 */
var addAddress = exports.addAddress = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(req, res) {
    var customerId, foundCustomer, error, updatedCustomer;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            customerId = req.user;
            _context16.next = 3;
            return _Customer2.default.findById(customerId);

          case 3:
            foundCustomer = _context16.sent;

            if (foundCustomer) {
              _context16.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'DataNotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context16.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            req.body.addresses.forEach(function (address) {
              foundCustomer.addresses.push(address);
            });

            _context16.next = 12;
            return foundCustomer.save();

          case 12:
            updatedCustomer = _context16.sent;

            updatedCustomer = updatedCustomer.toObject();
            (0, _formatResponse2.default)(res, updatedCustomer);

          case 15:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  }));

  return function addAddress(_x30, _x31) {
    return _ref17.apply(this, arguments);
  };
}();

var updateAddress = exports.updateAddress = function () {
  var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(req, res) {
    var customerId, updatedData;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            customerId = req.user;
            _context17.next = 3;
            return _Customer2.default.findOneAndUpdate({
              _id: customerId,
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
            updatedData = _context17.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  }));

  return function updateAddress(_x32, _x33) {
    return _ref18.apply(this, arguments);
  };
}();

var deleteAddress = exports.deleteAddress = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(req, res) {
    var customerId, updatedData;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            customerId = req.user;
            _context18.next = 3;
            return _Customer2.default.findOneAndUpdate({
              _id: customerId
            }, {
              $pull: { addresses: { _id: req.params.addressId } }
            }, { new: true });

          case 3:
            updatedData = _context18.sent;

            (0, _formatResponse2.default)(res, updatedData ? updatedData : {});

          case 5:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  }));

  return function deleteAddress(_x34, _x35) {
    return _ref19.apply(this, arguments);
  };
}();
/**
 * get customer list by admin
 * @param {*} req page and items
 * @param {*} res list of all customer
 */
var getCustomerList = exports.getCustomerList = function () {
  var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(req, res) {
    var items, page, skip, limit, roleSearch, foundRoles, roleIds, searchData, count, customers, result, customerIds, cancelServiceQuery, completedServiceQuery, serviceCancelPromise, serviceCompletedPromise, usersRatingPromise, _ref21, _ref22, serviceCancelCount, serviceCompletedCount, usersRating, data;

    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? req.query.page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            roleSearch = {
              isDeleted: false,
              $and: [{ name: 'user' }, { name: { $ne: 'admin' } }]
            };
            _context19.next = 7;
            return _Role2.default.find(roleSearch);

          case 7:
            foundRoles = _context19.sent;
            roleIds = foundRoles.map(function (role) {
              return role.id;
            });
            searchData = { isDeleted: false, role: { $in: roleIds } };
            _context19.next = 12;
            return _Customer2.default.find(searchData).countDocuments();

          case 12:
            count = _context19.sent;
            _context19.next = 15;
            return _Customer2.default.find(searchData).sort({ updated_at: 'DESC' }).populate('role', ['name']).skip(skip).limit(limit).lean();

          case 15:
            customers = _context19.sent;
            result = customers;
            customerIds = customers.map(function (customer) {
              return customer._id;
            });
            cancelServiceQuery = [{ $project: { progress: 1, customer_id: 1 } }, { $match: { progress: 'cancel', customer_id: { $in: customerIds } } }, { $group: { _id: '$customer_id', count: { $sum: 1 } } }];
            completedServiceQuery = [{ $project: { progress: 1, customer_id: 1 } }, { $match: { progress: 'accepted', customer_id: { $in: customerIds } } }, { $group: { _id: '$customer_id', count: { $sum: 1 } } }];
            serviceCancelPromise = _Service2.default.aggregate(cancelServiceQuery);
            serviceCompletedPromise = _ServiceActivity2.default.aggregate(completedServiceQuery);
            usersRatingPromise = _Review2.default.aggregate([{ $group: { _id: '$user_id', rating: { $avg: '$user_rating' } } }]);
            _context19.next = 25;
            return _promise2.default.all([serviceCancelPromise, serviceCompletedPromise, usersRatingPromise]);

          case 25:
            _ref21 = _context19.sent;
            _ref22 = (0, _slicedToArray3.default)(_ref21, 3);
            serviceCancelCount = _ref22[0];
            serviceCompletedCount = _ref22[1];
            usersRating = _ref22[2];


            result.forEach(function (cust) {
              cust.userId = cust._id;
              cust.service_completed = 0;
              cust.service_cancelled = 0;
              cust.user_rating = 0;
              serviceCompletedCount.forEach(function (completed) {
                if (cust._id === completed._id) {
                  cust.service_completed = completed.count;
                }
              });
              serviceCancelCount.forEach(function (cancel) {
                if (cust._id === cancel._id) {
                  cust.service_cancelled = cancel.count;
                }
              });
              usersRating.forEach(function (userRating) {
                if (cust._id === userRating._id) {
                  cust.user_rating = userRating.rating ? userRating.rating : 0;
                }
              });
            });

            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: result
            };


            (0, _formatResponse2.default)(res, data);

          case 33:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  }));

  return function getCustomerList(_x36, _x37) {
    return _ref20.apply(this, arguments);
  };
}();

var create = exports.create = function () {
  var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(req, res) {
    var operator, email, mobile, foundCustomer, foundRole, error, registeredUser, newCustomer, history;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            operator = req.user;
            email = req.body.email.toLowerCase();
            mobile = req.body.mobile_no;
            _context20.next = 5;
            return _Customer2.default.findOne({
              $or: [{ email: email }, { mobile_no: mobile }]
            });

          case 5:
            foundCustomer = _context20.sent;
            _context20.next = 8;
            return _Role2.default.findOne({ name: 'user' });

          case 8:
            foundRole = _context20.sent;

            if (foundRole) {
              _context20.next = 14;
              break;
            }

            error = new Error('Role not found!');

            error.name = 'NotFound';
            error.ar_message = 'الدور غير موجود!';
            return _context20.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 14:
            if (!foundCustomer) {
              _context20.next = 22;
              break;
            }

            req.body.isDeleted = false;
            req.body.role = foundRole._id;
            foundCustomer.set(req.body);
            _context20.next = 20;
            return foundCustomer.save();

          case 20:
            registeredUser = _context20.sent;
            return _context20.abrupt('return', (0, _formatResponse2.default)(res, registeredUser));

          case 22:

            req.body.role = foundRole._id;
            _context20.next = 25;
            return _Customer2.default.create(req.body);

          case 25:
            newCustomer = _context20.sent;
            history = new _CustomerHistory2.default({
              customer_id: newCustomer._id,
              operation: _operationConfig2.default.operations.add,
              operator: operator,
              prevObj: null,
              updatedObj: newCustomer,
              operation_date: new Date()
            });
            _context20.next = 29;
            return history.save();

          case 29:
            (0, _formatResponse2.default)(res, newCustomer);

          case 30:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  }));

  return function create(_x38, _x39) {
    return _ref23.apply(this, arguments);
  };
}();

var add = exports.add = function () {
  var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(req, res) {
    var operator, email, mobile, foundCustomer, foundRole, error, registeredUser, newCustomer, history;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            operator = req.user;
            email = req.body.email.toLowerCase();
            mobile = req.body.mobile_no;
            _context21.next = 5;
            return _Customer2.default.findOne({
              $or: [{ email: email }, { mobile_no: mobile }]
            });

          case 5:
            foundCustomer = _context21.sent;
            _context21.next = 8;
            return _Role2.default.findOne({ name: 'user' });

          case 8:
            foundRole = _context21.sent;

            if (foundRole) {
              _context21.next = 14;
              break;
            }

            error = new Error('Role not found!');

            error.name = 'NotFound';
            error.ar_message = 'الدور غير موجود!';
            return _context21.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 14:
            if (!foundCustomer) {
              _context21.next = 22;
              break;
            }

            req.body.isDeleted = false;
            req.body.role = foundRole._id;
            foundCustomer.set(req.body);
            _context21.next = 20;
            return foundCustomer.save();

          case 20:
            registeredUser = _context21.sent;
            return _context21.abrupt('return', (0, _formatResponse2.default)(res, registeredUser));

          case 22:

            req.body.role = foundRole._id;
            _context21.next = 25;
            return _Customer2.default.create(req.body);

          case 25:
            newCustomer = _context21.sent;
            history = new _CustomerHistory2.default({
              customer_id: newCustomer._id,
              operation: _operationConfig2.default.operations.add,
              operator: operator,
              prevObj: null,
              updatedObj: newCustomer,
              operation_date: new Date()
            });
            _context21.next = 29;
            return history.save();

          case 29:
            (0, _formatResponse2.default)(res, newCustomer);

          case 30:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  }));

  return function add(_x40, _x41) {
    return _ref24.apply(this, arguments);
  };
}();

var updateUser = exports.updateUser = function () {
  var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(req, res) {
    var operator, id, foundCustomer, error, origObj, updatedCustomer, history;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            operator = req.user;
            id = req.params.id;
            _context22.next = 4;
            return _Customer2.default.findById(id);

          case 4:
            foundCustomer = _context22.sent;

            if (foundCustomer) {
              _context22.next = 10;
              break;
            }

            error = new Error('Customer not be registered!');

            error.name = 'userExist';
            error.ar_message = 'الزبون غير مسجل!';
            return _context22.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            origObj = foundCustomer.toObject();

            req.body.email = req.body.email.toLowerCase();

            delete req.body.role;
            foundCustomer.set(req.body);
            _context22.next = 16;
            return foundCustomer.save();

          case 16:
            updatedCustomer = _context22.sent;
            history = new _CustomerHistory2.default({
              customer_id: foundCustomer._id,
              operation: _operationConfig2.default.operations.update,
              operator: operator,
              prevObj: origObj,
              updatedObj: updatedCustomer,
              operation_date: new Date()
            });
            _context22.next = 20;
            return history.save();

          case 20:
            (0, _formatResponse2.default)(res, updatedCustomer);

          case 21:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  }));

  return function updateUser(_x42, _x43) {
    return _ref25.apply(this, arguments);
  };
}();

var remove = exports.remove = function () {
  var _ref26 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(req, res) {
    var id, foundCustomer, error;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            id = req.params.id;
            _context24.next = 3;
            return _Customer2.default.findById(id);

          case 3:
            foundCustomer = _context24.sent;

            if (foundCustomer) {
              _context24.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'NotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context24.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:

            foundCustomer.isDeleted = true;
            foundCustomer.active = false;
            foundCustomer.old_mobile_no = foundCustomer.mobile_no;
            foundCustomer.mobile_no = '';
            _context24.next = 15;
            return foundCustomer.save().then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
              return _regenerator2.default.wrap(function _callee23$(_context23) {
                while (1) {
                  switch (_context23.prev = _context23.next) {
                    case 0:
                      _context23.next = 2;
                      return _CustomerHistory2.default.remove({ customer_id: foundCustomer._id });

                    case 2:
                      (0, _formatResponse2.default)(res, foundCustomer);

                    case 3:
                    case 'end':
                      return _context23.stop();
                  }
                }
              }, _callee23, undefined);
            }))).catch(function (err) {
              console.log('error--------->', err);
            });

          case 15:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, undefined);
  }));

  return function remove(_x44, _x45) {
    return _ref26.apply(this, arguments);
  };
}();

var removeAll = exports.removeAll = function () {
  var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(req, res) {
    var customerIds, customers, error;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            customerIds = req.body.ids;
            _context25.next = 3;
            return _Customer2.default.find({ _id: { $in: customerIds } });

          case 3:
            customers = _context25.sent;

            if (customers.length) {
              _context25.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'NotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context25.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            _context25.next = 11;
            return _Customer2.default.update({ _id: { $in: customerIds } }, { isDeleted: true, active: false, mobile_no: '' }, { multi: true });

          case 11:
            _context25.next = 13;
            return _CustomerHistory2.default.remove({ _id: { $in: customerIds } });

          case 13:
            return _context25.abrupt('return', (0, _formatResponse2.default)(res, customers));

          case 14:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, undefined);
  }));

  return function removeAll(_x46, _x47) {
    return _ref28.apply(this, arguments);
  };
}();

var history = exports.history = function () {
  var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(req, res) {
    var items, page, skip, limit, searchData, count, customerHistory, data;
    return _regenerator2.default.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            searchData = req.params.id ? { customer_id: req.params.id } : {};
            _context26.next = 7;
            return _CustomerHistory2.default.find(searchData).countDocuments();

          case 7:
            count = _context26.sent;
            _context26.next = 10;
            return _CustomerHistory2.default.find(searchData).sort({ operation_date: 'desc' }).populate('operator', ['first_name', 'last_name', 'email']).populate('updatedObj.role', ['name']).populate('prevObj.role', ['name']).skip(skip).limit(limit);

          case 10:
            customerHistory = _context26.sent;
            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: customerHistory
            };

            (0, _formatResponse2.default)(res, data);

          case 13:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, undefined);
  }));

  return function history(_x48, _x49) {
    return _ref29.apply(this, arguments);
  };
}();

/**
 * API to ask for the phone_number after the Social Signup
 */
var addContactForSocialSignup = exports.addContactForSocialSignup = function () {
  var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(req, res) {
    var userId, user, error, mobile_no, country_code, userCheck, _error4, otp, params, formatError, _error5;

    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.prev = 0;
            userId = req.user;
            _context27.next = 4;
            return _Customer2.default.findById(userId);

          case 4:
            user = _context27.sent;

            if (!(user && user.mobile_no)) {
              _context27.next = 10;
              break;
            }

            error = new Error('Contact Already Exists');

            error.name = 'dataExist';
            error.ar_message = 'الاتصال موجود بالفعل';
            return _context27.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context27.next = 14;
            return _Customer2.default.findOne({
              mobile_no: mobile_no,
              isDeleted: false,
              active: true
            });

          case 14:
            userCheck = _context27.sent;

            if (!userCheck) {
              _context27.next = 20;
              break;
            }

            _error4 = new Error('Entered mobile number already exists, please enter different number');

            _error4.name = 'dataExist';
            _error4.ar_message = 'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
            return _context27.abrupt('return', (0, _formatResponse2.default)(res, _error4));

          case 20:
            otp = otpService.generateOtp();
            params = {
              Message: 'Your HSA OTP for mobile verification is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };

            if (user && user.email) {
              mail.send({
                user: user,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
            }
            _context27.next = 25;
            return (0, _AWSService.snsSendSMS)(params);

          case 25:

            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number444',
              otp: otp,
              ar_message: 'أرسلت OTP على رقم هاتفك المحمول'
            });
            _context27.next = 39;
            break;

          case 28:
            _context27.prev = 28;
            _context27.t0 = _context27['catch'](0);

            console.log('err1========', _context27.t0);

            if (!_context27.t0.response) {
              _context27.next = 37;
              break;
            }

            _logger2.default.error(_context27.t0.response.data);
            formatError = _context27.t0.response.data.error ? _context27.t0.response.data.error.message : 'Unautherised Access';
            _error5 = new Error(formatError);

            _error5.name = 'OAuthException';
            return _context27.abrupt('return', (0, _formatResponse2.default)(res, _error5));

          case 37:
            _logger2.default.error(_context27.t0);
            return _context27.abrupt('return', res.status(500).send({ err: {} }));

          case 39:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, undefined, [[0, 28]]);
  }));

  return function addContactForSocialSignup(_x50, _x51) {
    return _ref30.apply(this, arguments);
  };
}();

/**
 * Verify the mobile number via OTP (For the first Social LoggedIn users)
 * @param {'*'} req
 * @param {*} res
 */
var socialVerifyContactNumber = exports.socialVerifyContactNumber = function () {
  var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(req, res) {
    var country_code, mobile_no, otp, email, response, otpVerified, foundCustomer, existingData, registeredCustomer, error;
    return _regenerator2.default.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            country_code = req.body.country_code;
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            email = req.body.email;
            response = {};
            // const otpVerified = otpService.verifyOtp(otp);

            otpVerified = true;

            if (!otpVerified) {
              _context28.next = 31;
              break;
            }

            _context28.next = 9;
            return _Customer2.default.findOne({ email: email });

          case 9:
            foundCustomer = _context28.sent;


            console.log('foundCustomer===');
            console.log(foundCustomer);
            console.log('foundCustomer===');

            if (!foundCustomer) {
              _context28.next = 25;
              break;
            }

            existingData = {
              country_code: country_code,
              device_id: req.body.device_id,
              device_type: req.body.device_type,
              mobile_no: mobile_no,
              active: true,
              email: foundCustomer.email ? foundCustomer.email : email,
              isDeleted: false
            };

            foundCustomer.set(existingData);
            _context28.next = 18;
            return foundCustomer.save();

          case 18:
            registeredCustomer = _context28.sent;

            registeredCustomer = registeredCustomer.toObject();
            registeredCustomer.token = createToken(foundCustomer);
            registeredCustomer.message = 'Otp verified';
            return _context28.abrupt('return', (0, _formatResponse2.default)(res, registeredCustomer));

          case 25:
            error = new Error('Customer not found!');

            error.name = 'NotFound';
            error.ar_message = 'العميل غير موجود!';
            return _context28.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 29:
            _context28.next = 33;
            break;

          case 31:
            response = {
              status: 'error',
              message: 'Entered OTP is not correct. Please enter the Correct OTP',
              ar_message: 'تم إدخال OTP غير صحيح. يرجى إدخال OTP الصحيح'
            };
            (0, _formatResponse2.default)(res, response);

          case 33:
          case 'end':
            return _context28.stop();
        }
      }
    }, _callee28, undefined);
  }));

  return function socialVerifyContactNumber(_x52, _x53) {
    return _ref31.apply(this, arguments);
  };
}();

/**
 * ONLY Registration Phase - checking for the existing contact no.
 */
var contactCheck = exports.contactCheck = function () {
  var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29(req, res) {
    var mobile, error, user, _error6;

    return _regenerator2.default.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            mobile = req.body.mobile;

            if (mobile) {
              _context29.next = 6;
              break;
            }

            error = new Error('Please provide the mobile number!');

            error.name = 'DataNotFound';
            error.ar_message = 'يرجى تقديم رقم الجوال!';
            return _context29.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 6:
            _context29.next = 8;
            return _Customer2.default.findOne({ mobile_no: mobile, isDeleted: false });

          case 8:
            user = _context29.sent;

            if (!user) {
              _context29.next = 14;
              break;
            }

            _error6 = new Error('Entered mobile number already exists, please enter different number');

            _error6.ar_message = 'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
            _error6.name = 'userExist';
            return _context29.abrupt('return', (0, _formatResponse2.default)(res, _error6));

          case 14:
            return _context29.abrupt('return', (0, _formatResponse2.default)(res, {
              success: 'Valid mobile number',
              ar_message: 'رقم الجوال صالح'
            }));

          case 15:
          case 'end':
            return _context29.stop();
        }
      }
    }, _callee29, undefined);
  }));

  return function contactCheck(_x54, _x55) {
    return _ref32.apply(this, arguments);
  };
}();

var checkuser = exports.checkuser = function () {
  var _ref33 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30(req, res) {
    var mobile, error, user, _error7;

    return _regenerator2.default.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            mobile = req.body.mobile;

            if (mobile) {
              _context30.next = 6;
              break;
            }

            error = new Error('Please provide the mobile number!');

            error.name = 'DataNotFound';
            error.ar_message = 'يرجى تقديم رقم الجوال!';
            return _context30.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 6:
            _context30.next = 8;
            return _User2.default.findOne({
              mobile_no: mobile,
              isDeleted: false
            });

          case 8:
            user = _context30.sent;

            if (!user) {
              _context30.next = 14;
              break;
            }

            _error7 = new Error('Entered mobile number already exists, please enter different number');

            _error7.ar_message = 'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
            _error7.name = 'userExist';
            return _context30.abrupt('return', (0, _formatResponse2.default)(res, _error7));

          case 14:
            return _context30.abrupt('return', (0, _formatResponse2.default)(res, {
              success: 'Valid mobile number',
              ar_message: 'رقم الجوال صالح'
            }));

          case 15:
          case 'end':
            return _context30.stop();
        }
      }
    }, _callee30, undefined);
  }));

  return function checkuser(_x56, _x57) {
    return _ref33.apply(this, arguments);
  };
}();

var reauthenticateOTP = exports.reauthenticateOTP = function () {
  var _ref34 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31(req, res) {
    var userId, mobile_no, country_code, user, error, otp, params;
    return _regenerator2.default.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            userId = req.user;
            mobile_no = req.body.mobile_no;
            country_code = req.body.country_code;
            _context31.next = 5;
            return _Customer2.default.findById(userId);

          case 5:
            user = _context31.sent;

            if (user) {
              _context31.next = 11;
              break;
            }

            error = new Error('Customer not registered!');

            error.ar_message = 'العميل غير مسجل!';
            error.name = 'DataNotFound';
            return _context31.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 11:
            otp = otpService.generateOtp();
            params = {
              Message: 'Your HSA One Time Password is ' + otp + ', HSA team',
              PhoneNumber: '' + country_code + mobile_no
            };


            if (user && user.email) {
              mail.send({
                user: user,
                subject: 'One Time Password for HSA',
                filename: 'otp',
                otp: otp
              });
            }
            _context31.next = 16;
            return (0, _AWSService.snsSendSMS)(params);

          case 16:
            //console.log("3"+user);
            (0, _formatResponse2.default)(res, {
              message: 'OTP sent on your mobile number555',
              otp: otp,
              ar_message: 'أرسلت OTP على رقم هاتفك المحمول'
            });

          case 17:
          case 'end':
            return _context31.stop();
        }
      }
    }, _callee31, undefined);
  }));

  return function reauthenticateOTP(_x58, _x59) {
    return _ref34.apply(this, arguments);
  };
}();

/**
 * Getting the Latest device token with the background API calls
 */
var getLatestDeviceId = exports.getLatestDeviceId = function () {
  var _ref35 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32(req, res) {
    var userId, user_role, device_id;
    return _regenerator2.default.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.prev = 0;
            userId = req.user;
            user_role = req.params.role;
            device_id = req.body.device_id;

            if (!(user_role === _constants2.default.CUSTOMER)) {
              _context32.next = 7;
              break;
            }

            _context32.next = 7;
            return _Customer2.default.findByIdAndUpdate(userId, {
              $set: { device_id: device_id }
            }).then(function (success) {
              return (0, _formatResponse2.default)(res, {});
            }).catch(function (err) {
              return (0, _formatResponse2.default)(res, err);
            });

          case 7:
            if (!(user_role === _constants2.default.PROVIDER)) {
              _context32.next = 10;
              break;
            }

            _context32.next = 10;
            return _User2.default.findByIdAndUpdate(userId, {
              $set: { device_id: device_id }
            }).then(function (success) {
              return (0, _formatResponse2.default)(res, {});
            }).catch(function (err) {
              return (0, _formatResponse2.default)(res, err);
            });

          case 10:
            _context32.next = 15;
            break;

          case 12:
            _context32.prev = 12;
            _context32.t0 = _context32['catch'](0);

            console.log(_context32.t0);

          case 15:
          case 'end':
            return _context32.stop();
        }
      }
    }, _callee32, undefined, [[0, 12]]);
  }));

  return function getLatestDeviceId(_x60, _x61) {
    return _ref35.apply(this, arguments);
  };
}();

var reVerifyingOtp = exports.reVerifyingOtp = function () {
  var _ref36 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33(req, res) {
    var userId, country_code, mobile_no, otp, response, otpVerified, foundCustomer, registeredCustomer, error;
    return _regenerator2.default.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            userId = req.user;
            country_code = req.body.country_code;
            mobile_no = req.body.mobile_no;
            otp = req.body.otp;
            response = {};
            otpVerified = otpService.verifyOtp(otp);

            if (!otpVerified) {
              _context33.next = 26;
              break;
            }

            _context33.next = 9;
            return _Customer2.default.findById(userId);

          case 9:
            foundCustomer = _context33.sent;

            if (!foundCustomer) {
              _context33.next = 20;
              break;
            }

            foundCustomer.mobile_no = mobile_no;
            foundCustomer.country_code = country_code;
            _context33.next = 15;
            return foundCustomer.save();

          case 15:
            registeredCustomer = _context33.sent;

            registeredCustomer.message = 'Otp verified';
            return _context33.abrupt('return', (0, _formatResponse2.default)(res, registeredCustomer));

          case 20:
            error = new Error('Customer not registered!');

            error.ar_message = 'العميل غير مسجل!';
            error.name = 'DataNotFound';
            return _context33.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 24:
            _context33.next = 28;
            break;

          case 26:
            response = {
              status: 'error',
              message: 'Entered OTP is not correct. Please enter the Correct OTP',
              ar_message: 'تم إدخال OTP غير صحيح. يرجى إدخال OTP الصحيح'
            };
            return _context33.abrupt('return', (0, _formatResponse2.default)(res, response));

          case 28:
          case 'end':
            return _context33.stop();
        }
      }
    }, _callee33, undefined);
  }));

  return function reVerifyingOtp(_x62, _x63) {
    return _ref36.apply(this, arguments);
  };
}();

var tester = exports.tester = function () {
  var _ref37 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34(req, res) {
    var admin, CONSUMER_CERT, payload, options;
    return _regenerator2.default.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            admin = require('firebase-admin');
            CONSUMER_CERT = require('../../config/homeservices-firebase.json');
            // const consumer = admin.initializeApp({
            // credential: admin.credential.cert(CONSUMER_CERT),
            // name: 'tester'
            // });

            payload = {
              notification: {
                title: 'Account Deposit',
                body: 'A deposit to your savings account has just cleared.'
              },
              data: {
                account: 'Savings',
                balance: '$3020.25'
              }
            };
            options = {
              priority: 'normal',
              timeToLive: 60 * 60
            };

            admin.messaging().sendToDevice('c1lYaDHMZ7M:APA91bFru-VMczzZppDnww2CW7T_hEJyweVuICb5mDGsp5kp2BxzYOnS4OyW3dmDDp68wnLvWylEWZueuBvZEmlKaVYMmkVVs3HPLSHtfcZmNdMrUqKKOran5jY7yInhZgexIGxodeOa', payload, options).then(function (response) {
              console.log('Successfully sent message:', response);
            }).catch(function (error) {
              console.log('Error sending message:', error);
            });
            console.log(admin);
            (0, _formatResponse2.default)(res, {});

          case 7:
          case 'end':
            return _context34.stop();
        }
      }
    }, _callee34, undefined);
  }));

  return function tester(_x64, _x65) {
    return _ref37.apply(this, arguments);
  };
}();