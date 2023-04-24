'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAdminAuth = exports.ensureServiceProviderAuth = exports.ensureAuth = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ensureAuth = exports.ensureAuth = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var token, decoded, customer, user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers.access_token;

            if (token) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', res.status(401).send({ success: false, msg: 'Auth headers required', data: {} }));

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return (0, _jsonwebtoken.verify)(token, _config2.default.JWT_SECRET);

          case 6:
            decoded = _context.sent;
            _context.next = 9;
            return _Customer2.default.findById(decoded.sub);

          case 9:
            customer = _context.sent;

            if (customer) {
              _context.next = 22;
              break;
            }

            _context.next = 13;
            return _User2.default.findById(decoded.sub);

          case 13:
            user = _context.sent;

            if (user) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', res.status(401).send({ success: false, msg: 'Unauthorized user', data: {} }));

          case 18:
            req.user = decoded.sub;
            next();

          case 20:
            _context.next = 24;
            break;

          case 22:
            req.user = decoded.sub;
            next();

          case 24:
            _context.next = 34;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](3);

            _logger2.default.error(_context.t0.stack);

            if (!(_context.t0.name === 'TokenExpiredError')) {
              _context.next = 31;
              break;
            }

            return _context.abrupt('return', res.status(401).send({ success: false, msg: 'Auth token expired', data: _context.t0 }));

          case 31:
            if (!(_context.t0.name === 'JsonWebTokenError')) {
              _context.next = 33;
              break;
            }

            return _context.abrupt('return', res.status(401).send({ success: false, msg: 'Invalid token', data: _context.t0 }));

          case 33:
            return _context.abrupt('return', res.status(401).send({ success: false, msg: _context.t0.message, data: _context.t0 }));

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 26]]);
  }));

  return function ensureAuth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var ensureServiceProviderAuth = exports.ensureServiceProviderAuth = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
    var token, decoded, user, roles;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = req.headers.access_token;

            if (token) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', res.status(401).send({ success: false, msg: 'Auth headers required', data: {} }));

          case 3:
            _context2.prev = 3;
            _context2.next = 6;
            return (0, _jsonwebtoken.verify)(token, _config2.default.JWT_SECRET);

          case 6:
            decoded = _context2.sent;
            _context2.next = 9;
            return _User2.default.findById(decoded.sub).populate('role', ['name']);

          case 9:
            user = _context2.sent;

            if (user) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', res.status(401).send({ success: false, msg: 'Permission Denied', data: {} }));

          case 12:
            roles = user.role.map(function (role) {
              return role.name;
            });

            if (roles.indexOf('service_provider') > -1) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt('return', res.status(401).send({ success: false, msg: 'Permission Denied', data: {} }));

          case 15:
            req.user = decoded.sub;
            next();
            _context2.next = 27;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2['catch'](3);

            _logger2.default.error(_context2.t0.stack);

            if (!(_context2.t0.name === 'TokenExpiredError')) {
              _context2.next = 24;
              break;
            }

            return _context2.abrupt('return', res.status(401).send({ success: false, msg: 'Auth token expired', data: _context2.t0 }));

          case 24:
            if (!(_context2.t0.name === 'JsonWebTokenError')) {
              _context2.next = 26;
              break;
            }

            return _context2.abrupt('return', res.status(401).send({ success: false, msg: 'Invalid token', data: _context2.t0 }));

          case 26:
            return _context2.abrupt('return', res.status(401).send({ success: false, msg: _context2.t0.message, data: _context2.t0 }));

          case 27:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[3, 19]]);
  }));

  return function ensureServiceProviderAuth(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var ensureAdminAuth = exports.ensureAdminAuth = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
    var token, decoded, user, isPermission;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = req.headers.access_token;

            if (token) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt('return', res.status(401).send({ success: false, msg: 'Auth headers required', data: {} }));

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return (0, _jsonwebtoken.verify)(token, _config2.default.JWT_SECRET);

          case 6:
            decoded = _context3.sent;
            _context3.next = 9;
            return _User2.default.findById(decoded.sub).populate('role');

          case 9:
            user = _context3.sent;

            if (user) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt('return', res.status(401).send({ success: false, msg: 'Permission Denied', data: {} }));

          case 12:
            isPermission = false;

            user.role.map(function (role) {
              if (role.name !== _config2.default.authTypes.USER && role.name !== _config2.default.authTypes.SERVICE_PROVIDER) {
                isPermission = true;
              }
            });

            if (isPermission) {
              _context3.next = 16;
              break;
            }

            return _context3.abrupt('return', res.status(401).send({ success: false, msg: 'Permission Denied', data: {} }));

          case 16:
            req.user = decoded.sub;
            next();
            _context3.next = 28;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3['catch'](3);

            _logger2.default.error(_context3.t0.stack);

            if (!(_context3.t0.name === 'TokenExpiredError')) {
              _context3.next = 25;
              break;
            }

            return _context3.abrupt('return', res.status(401).send({ success: false, msg: 'Auth token expired', data: {} }));

          case 25:
            if (!(_context3.t0.name === 'JsonWebTokenError')) {
              _context3.next = 27;
              break;
            }

            return _context3.abrupt('return', res.status(401).send({ success: false, msg: 'Invalid token', data: {} }));

          case 27:
            return _context3.abrupt('return', res.status(401).send({ success: false, msg: _context3.t0.message, data: _context3.t0 }));

          case 28:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[3, 20]]);
  }));

  return function ensureAdminAuth(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();