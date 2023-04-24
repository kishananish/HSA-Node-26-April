'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = exports.searchUsers = exports.changePassword = exports.updatePassword = exports.payment = exports.resetPassword = exports.forgotPassword = exports.getUser = exports.signin = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _mail = require('../handler/mail');

var mail = _interopRequireWildcard(_mail);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var signin = exports.signin = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var email, password, foundUser, error, isPermission, _error, isMatch, _error2;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = req.body.email.toLowerCase();
            password = req.body.password;

            console.log('foundUser :', req.body);
            _context.next = 5;
            return _User2.default.findOne({ email: email }, '+password').populate('role');

          case 5:
            foundUser = _context.sent;


            console.log('>>>>>>>>>>>>>>>>>', foundUser);

            if (foundUser) {
              _context.next = 11;
              break;
            }

            error = new Error(' 1111 Wrong username or password!');

            error.name = 'AuthenticationError';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 11:
            isPermission = false;

            foundUser.role.map(function (role) {
              if (role.name !== _config2.default.authTypes.USER || role.name !== _config2.default.authTypes.SERVICE_PROVIDER) {
                isPermission = true;
              }
            });

            if (isPermission) {
              _context.next = 17;
              break;
            }

            _error = new Error('22222 Wrong username or password');

            _error.name = 'AuthenticationError';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 17:
            _context.next = 19;
            return foundUser.comparePassword(password);

          case 19:
            isMatch = _context.sent;


            console.log(isMatch);

            if (isMatch) {
              _context.next = 27;
              break;
            }

            _error2 = new Error('333 Wrong username or password!!!!!!');

            _error2.name = 'AuthenticationError';
            return _context.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 27:
            foundUser = foundUser.toObject();
            foundUser.role.forEach(function (role) {
              role.access_level.forEach(function (access) {
                if (access.name === 'Manage Customers') {
                  access.link = '/customer-manage';
                  access.sequence = 1;
                }
                if (access.name === 'Manage Users') {
                  access.link = '/service-provider-manage';
                  access.sequence = 2;
                }
                if (access.name === 'Manage Service Request') {
                  access.link = '/service-request-manage';
                  access.sequence = 3;
                }
                if (access.name === 'Manage Category') {
                  access.link = '/category-manage';
                  access.sequence = 4;
                }
                if (access.name === 'Manage Sub-Category') {
                  access.link = '/sub-category-manage';
                  access.sequence = 5;
                }
                if (access.name === 'Manage Material') {
                  access.link = '/material-manage';
                  access.sequence = 6;
                }
                if (access.name === 'Manage FAQ') {
                  access.link = '/faq-manage';
                  access.sequence = 7;
                }
                if (access.name === 'Manage Promo Code') {
                  access.link = '/promo-code-manage';
                  access.sequence = 8;
                }
                if (access.name === 'Manage Query / Suggestion') {
                  access.link = '/query-manage';
                  access.sequence = 9;
                }
                if (access.name === 'Notifications') {
                  access.link = '/notifications';
                  access.sequence = 10;
                }
                if (access.name === 'Manage Roles') {
                  access.link = '/role-manage';
                  access.sequence = 11;
                }
                if (access.name === 'Manage Configuration') {
                  _logger2.default.info({ mess: 'done wjere' });
                  access.link = '/configuration-manage';
                  access.sequence = 12;
                }
                if (access.name === 'Reports') {
                  access.link = '';
                  access.sequence = 13;
                }
              });
            });
            foundUser.token = createToken(foundUser);
            (0, _formatResponse2.default)(res, foundUser);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function signin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getUser = exports.getUser = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var userId, user, error;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = req.user;
            _context2.next = 3;
            return _User2.default.findById(userId);

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            error = new Error('User not found!');

            error.name = 'DataNotFound';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:
            user = user.toObject();
            (0, _formatResponse2.default)(res, user);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var forgotPassword = exports.forgotPassword = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var user, error, resetURL, response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _User2.default.findOne({ email: req.body.email });

          case 2:
            user = _context3.sent;

            if (user) {
              _context3.next = 7;
              break;
            }

            error = new Error('Wrong email!');

            error.name = 'DataNotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 7:
            // Set reset tokens and expiry on their account
            user.resetPasswordToken = (0, _crypto.randomBytes)(20).toString('hex');
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
            _context3.next = 11;
            return user.save();

          case 11:
            // Send them an email with the token
            resetURL = 'http://' + req.headers.host + '/api/admin/reset/' + user.resetPasswordToken;
            _context3.next = 14;
            return mail.send({
              user: user,
              subject: 'Password Reset',
              filename: 'password-reset',
              resetURL: resetURL
            });

          case 14:
            response = {
              message: 'You have been emailed a password reset link.',
              resetURL: resetURL
              // resetToken: user.resetPasswordToken
            };

            //TODO: remove resetToken from response and send it to an email

            return _context3.abrupt('return', (0, _formatResponse2.default)(res, response));

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function forgotPassword(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var resetPassword = exports.resetPassword = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var resetPasswordToken, user, showForm, title;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            resetPasswordToken = req.params.token;
            _context4.next = 3;
            return _User2.default.findOne({
              resetPasswordToken: resetPasswordToken,
              resetPasswordExpires: { $gt: Date.now() }
            });

          case 3:
            user = _context4.sent;
            showForm = false;
            title = 'Password Reset Link Expired';

            if (user) {
              showForm = true;
              title = 'Reset your Password 33333333333333';
            }
            res.render('reset', { title: title, showForm: showForm, resetPasswordToken: resetPasswordToken });

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function resetPassword(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var payment = exports.payment = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var shaString, arrData, key, input, hash, output, resetPasswordToken, user, showForm, title;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            shaString = '';
            arrData = {
              access_code: 'C9znXzHGbZ8mKhP8aZqx',
              amount: '20',
              command: 'AUTHORIZATION',
              currency: 'SAR',
              customer_email: 'test@payfort.com',
              language: 'en',
              merchant_identifier: 'KtIggBZD',
              merchant_reference: 'Code-order-0319',
              order_description: 'iPhone 6-S'
            };


            for (key in arrData) {
              console.log(key + ': ' + arrData[key]);
              shaString += key + '=' + arrData[key];
            }

            console.log(shaString);

            input = '2020@Sharif' + shaString + '2020@Sharif';

            // Create hash object

            hash = _crypto2.default.createHash('sha256');

            // Update hash with input value

            hash.update(input);

            // Get hashed output as hex string
            output = hash.digest('hex');


            console.log(output);

            arrData.signature = output;

            console.log(arrData);

            resetPasswordToken = req.params.token;
            _context5.next = 14;
            return _User2.default.findOne({
              resetPasswordToken: resetPasswordToken,
              resetPasswordExpires: { $gt: Date.now() }
            });

          case 14:
            user = _context5.sent;
            showForm = true;
            title = 'Payment page';
            //   let showForm = false;
            //   let title = "Password Reset Link Expired";
            //   if (user) {
            //     showForm = true;
            //     title = "Reset your Password";
            //   }

            res.render('payment', { title: title, showForm: showForm, resetPasswordToken: resetPasswordToken, arrData: arrData });

          case 18:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function payment(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var updatePassword = exports.updatePassword = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var resetPasswordToken, redirectUrl, showForm, title, user;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            resetPasswordToken = req.params.token;
            redirectUrl = 'http://' + req.headers.host + '/api/admin/reset/' + resetPasswordToken;
            showForm = true;
            title = 'Password Updated Successfully';

            if (!(req.body.password !== req.body['password-confirm'])) {
              _context6.next = 8;
              break;
            }

            showForm = false;
            title = 'Password and confirm password are not same!';
            return _context6.abrupt('return', res.redirect(redirectUrl));

          case 8:
            _context6.next = 10;
            return _User2.default.findOne({
              resetPasswordToken: resetPasswordToken,
              resetPasswordExpires: { $gt: Date.now() }
            });

          case 10:
            user = _context6.sent;

            if (user) {
              _context6.next = 15;
              break;
            }

            showForm = false;
            title = 'Password reset is invalid or has expired!';
            return _context6.abrupt('return', res.redirect(redirectUrl));

          case 15:

            user.set({
              password: req.body.password,
              resetPasswordToken: undefined,
              resetPasswordExpires: undefined
            });
            _context6.next = 18;
            return user.save();

          case 18:
            res.render('update', { title: title, showForm: showForm });

          case 19:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function updatePassword(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var changePassword = exports.changePassword = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var userId, new_password, old_password, foundUser, error, isMatch, _error3;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userId = req.user;
            new_password = req.body.new_password;
            old_password = req.body.old_password;
            _context7.next = 5;
            return _User2.default.findOne({ _id: userId }, '+password');

          case 5:
            foundUser = _context7.sent;

            if (foundUser) {
              _context7.next = 10;
              break;
            }

            error = new Error('Wrong password!');

            error.name = 'AuthenticationError';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            _context7.next = 12;
            return foundUser.comparePassword(old_password);

          case 12:
            isMatch = _context7.sent;

            if (isMatch) {
              _context7.next = 19;
              break;
            }

            _error3 = new Error('Wrong password!');

            _error3.name = 'AuthenticationError';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, _error3));

          case 19:
            foundUser.set({
              password: new_password
            });
            _context7.next = 22;
            return foundUser.save();

          case 22:
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, {}));

          case 23:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function changePassword(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var searchUsers = exports.searchUsers = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var role, userName, roleSearch, foundRoles, roleIds, searchData, collection, users;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            role = req.query.role;
            userName = req.query.name;
            roleSearch = role && role === 'all' ? { isDeleted: false, name: { $ne: 'admin' } } : {
              isDeleted: false,
              $and: [{ name: role }, { name: { $ne: 'admin' } }]
            };
            _context8.next = 5;
            return _Role2.default.find(roleSearch);

          case 5:
            foundRoles = _context8.sent;
            roleIds = foundRoles.map(function (role) {
              return role.id;
            });
            searchData = void 0;
            collection = void 0;

            if (role === 'user') {
              searchData = userName ? {
                $or: [{ first_name: { $regex: userName, $options: 'i' } }, { last_name: { $regex: userName, $options: 'i' } }],
                isDeleted: false,
                role: { $in: roleIds }
              } : { isDeleted: false, role: { $in: roleIds } };
              collection = _Customer2.default.find(searchData);
            } else {
              searchData = userName ? {
                $or: [{ first_name: { $regex: userName, $options: 'i' } }, { last_name: { $regex: userName, $options: 'i' } }],
                isDeleted: false,
                role: { $in: roleIds }
              } : { isDeleted: false, role: { $in: roleIds } };
              collection = _User2.default.find(searchData);
            }
            _context8.next = 12;
            return collection.populate('role', ['name']).lean();

          case 12:
            users = _context8.sent;

            (0, _formatResponse2.default)(res, users);

          case 14:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function searchUsers(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var add = exports.add = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            //const resetPasswordToken = req.params.token;
            res.json('hi');

          case 1:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function add(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();