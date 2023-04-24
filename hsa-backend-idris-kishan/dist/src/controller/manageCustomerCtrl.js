'use strict';

/**
 * Deprecated not more, as i have marge both user module only
 *
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.add = exports.deleteUser = exports.getById = exports.getAll = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAll = exports.getAll = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var items, page, skip, limit, count, users, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //TODO: pending for aggregate service request

            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? req.query.page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            _context.next = 6;
            return _User2.default.find({ role: 'user' }).countDocuments();

          case 6:
            count = _context.sent;
            _context.next = 9;
            return _User2.default.find({ role: 'user' }).skip(skip).limit(limit);

          case 9:
            users = _context.sent;
            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: users
            };


            (0, _formatResponse2.default)(res, data);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getAll(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getById = exports.getById = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var userId, user, error;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = req.params.id;
            _context2.next = 3;
            return _User2.default.findOne({ _id: userId, role: 'user' });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            error = new Error('User not found!');

            error.name = 'NotFound';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:

            (0, _formatResponse2.default)(res, user);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getById(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var deleteUser = exports.deleteUser = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var userId, foundUser, error;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.params.id;
            _context3.next = 3;
            return _User2.default.findOne({ _id: userId });

          case 3:
            foundUser = _context3.sent;

            if (foundUser) {
              _context3.next = 8;
              break;
            }

            error = new Error('Customer not found!');

            error.name = 'NotFound';
            return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 8:

            foundUser.isDeleted = true;

            _context3.next = 11;
            return _User2.default.update({ _id: userId }, { isDeleted: true, active: false });

          case 11:

            (0, _formatResponse2.default)(res, {});

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function deleteUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var add = exports.add = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var email, password, foundUser, error, newUser, newCustomer;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            email = req.body.email.toLowerCase();
            password = req.body.password;
            _context4.next = 4;
            return _User2.default.findOne({ email: email }, '+password');

          case 4:
            foundUser = _context4.sent;

            if (!foundUser) {
              _context4.next = 9;
              break;
            }

            error = new Error('Customer Already registered!');

            error.name = 'userExist';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            newUser = new _User2.default({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: email,
              password: password,
              country_code: null,
              google_id: null,
              facebook_id: null,
              mobile_no: req.body.mobile_no,
              addresses: req.body.addresses,
              role: 'user',
              country: null,
              city: null,
              preferred_language: req.body.preferred_language,
              resetPasswordToken: null,
              resetPasswordExpires: null,
              active: true,
              isDeleted: false,
              device_id: null,
              dateOfJoining: null,
              credits: req.body.credits,
              rating: 0,
              status: req.body.active,
              created_at: new Date(),
              updated_at: null
            });
            _context4.next = 12;
            return newUser.save();

          case 12:
            newCustomer = _context4.sent;

            (0, _formatResponse2.default)(res, newCustomer);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function add(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var update = exports.update = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var id, email, password, foundCustomer, error, isMatch, updatedCustomer;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            email = req.body.email.toLowerCase();
            password = req.body.password;
            _context5.next = 5;
            return _User2.default.findOne({ _id: id }, '+password');

          case 5:
            foundCustomer = _context5.sent;

            if (foundCustomer) {
              _context5.next = 10;
              break;
            }

            error = new Error('Customer not registered!');

            error.name = 'userExist';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            _context5.next = 12;
            return foundCustomer.comparePassword(password);

          case 12:
            isMatch = _context5.sent;

            if (!isMatch) {
              foundCustomer.password = password;
            }

            foundCustomer.first_name = req.body.first_name;
            foundCustomer.last_name = req.body.last_name;
            foundCustomer.email = email;
            foundCustomer.mobile_no = req.body.mobile_no;
            foundCustomer.password = password;
            foundCustomer.addresses = req.body.addresses;
            foundCustomer.preferred_language = req.body.preferred_language;
            foundCustomer.credits = req.body.credits;
            foundCustomer.rating = req.body.rating;
            foundCustomer.status = req.body.status;
            foundCustomer.dateOfJoining = null;
            foundCustomer.updated_at = new Date();

            _context5.next = 28;
            return foundCustomer.save();

          case 28:
            updatedCustomer = _context5.sent;

            (0, _formatResponse2.default)(res, updatedCustomer);

          case 30:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function update(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();