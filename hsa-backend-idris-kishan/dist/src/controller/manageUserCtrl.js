'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAll = exports.remove = exports.updateUser = exports.createserviceprovider = exports.add = exports.history = exports.getById = exports.getAll = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _UserHistory = require('../models/UserHistory');

var _UserHistory2 = _interopRequireDefault(_UserHistory);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _Review = require('../models/Review');

var _Review2 = _interopRequireDefault(_Review);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAll = exports.getAll = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var role, items, page, skip, limit, roleSearch, foundRoles, roleIds, searchData, count, users, result, userIds, filter, servicesCountPromise, serviceProvidersRatingPromise, _ref2, _ref3, servicesCount, serviceProvidersRating, service_request, provider_avg_rating, data;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            role = req.query.role;
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? req.query.page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            roleSearch = role && role !== 'user' ? {
              isDeleted: false,
              $and: [{ name: role }, { name: { $nin: ['admin', 'user'] } }]
            } : { isDeleted: false, name: { $nin: ['admin', 'user'] } };
            _context.next = 8;
            return _Role2.default.find(roleSearch);

          case 8:
            foundRoles = _context.sent;
            roleIds = foundRoles.map(function (role) {
              return role.id;
            });
            searchData = { isDeleted: false, role: { $in: roleIds } };
            _context.next = 13;
            return _User2.default.find(searchData).countDocuments();

          case 13:
            count = _context.sent;
            _context.next = 16;
            return _User2.default.find(searchData).sort({ created_at: 'DESC' }).populate('role', ['name']).skip(skip).limit(limit);

          case 16:
            users = _context.sent;
            result = users;
            userIds = users.map(function (user) {
              return user._id;
            });
            filter = [{ $project: { progress: 1, service_provider_id: 1 } }, { $match: { service_provider_id: { $in: userIds } } }, { $group: { _id: '$service_provider_id', count: { $sum: 1 } } }];
            servicesCountPromise = _Service2.default.aggregate(filter);
            serviceProvidersRatingPromise = _Review2.default.aggregate([{
              $group: {
                _id: '$service_provider_id',
                rating: { $avg: '$service_provider_rating' }
              }
            }]);
            _context.next = 24;
            return _promise2.default.all([servicesCountPromise, serviceProvidersRatingPromise]);

          case 24:
            _ref2 = _context.sent;
            _ref3 = (0, _slicedToArray3.default)(_ref2, 2);
            servicesCount = _ref3[0];
            serviceProvidersRating = _ref3[1];
            service_request = 0;
            provider_avg_rating = 0;

            result = users.map(function (user) {
              user = JSON.parse((0, _stringify2.default)(user));
              servicesCount.map(function (serviceCount) {
                if (user.userId === serviceCount._id) {
                  service_request = serviceCount.count;
                }
              });
              serviceProvidersRating.forEach(function (serviceProviderRating) {
                if (user.userId === serviceProviderRating._id) {
                  provider_avg_rating = serviceProviderRating.rating ? serviceProviderRating.rating : 0;
                }
              });
              var newUser = (0, _assign2.default)(user, { service_request: service_request, provider_avg_rating: provider_avg_rating });
              return newUser;
            });

            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: result
            };

            (0, _formatResponse2.default)(res, data);

          case 33:
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
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var id, user, error;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.next = 3;
            return _User2.default.find({ _id: id, isDeleted: false }).populate('role', ['name']);

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 9;
              break;
            }

            error = new Error('User not found!');

            error.ar_message = 'المستخدم ليس موجود!';
            error.name = 'NotFound';
            return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            (0, _formatResponse2.default)(res, user);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getById(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var history = exports.history = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var items, page, skip, limit, searchData, count, userHistory, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            searchData = req.params.id ? { user_id: req.params.id } : {};
            _context3.next = 7;
            return _UserHistory2.default.find(searchData).countDocuments();

          case 7:
            count = _context3.sent;
            _context3.next = 10;
            return _UserHistory2.default.find(searchData).sort({ operation_date: 'desc' }).populate('operator', ['first_name', 'last_name', 'email']).populate('updatedObj.role', ['name']).populate('prevObj.role', ['name']).skip(skip).limit(limit);

          case 10:
            userHistory = _context3.sent;
            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: userHistory
            };

            (0, _formatResponse2.default)(res, data);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function history(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @apidescription add new service provider user
 * @param {*} req
 * @param {*} res
 */
var add = exports.add = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var operator, email, roleName, foundUser, error, foundRole, _error, newCustomer;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            operator = req.user;

            req.body.active = true;

            email = req.body.email.toLowerCase();
            roleName = req.body.role;
            _context4.next = 6;
            return _User2.default.find({
              mobile_no: req.body.mobile_no,
              active: true
            });

          case 6:
            foundUser = _context4.sent;

            if (!(foundUser.length >= 1)) {
              _context4.next = 12;
              break;
            }

            error = new Error('Mobile No already in use!');

            error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
            error.name = 'userExist';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 12:
            _context4.next = 14;
            return _Role2.default.find({
              $and: [{ name: roleName }, { name: { $ne: 'user' } }]
            });

          case 14:
            foundRole = _context4.sent;

            if (foundRole) {
              _context4.next = 20;
              break;
            }

            _error = new Error('Role not found!');

            _error.ar_message = 'الدور غير موجود!';
            _error.name = 'NotFound';
            return _context4.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 20:

            if (foundUser) {
              req.body.isDeleted = false;
              // if (foundUser.role.indexOf(foundRole._id) === -1) {
              // 	foundUser.role.push(foundRole._id);
              // }
              // delete req.body.role;
              req.body.role = foundRole[0]._id;
              //foundUser.set(req.body);
              // let registeredUser = await foundUser.save();
              // return formatResponse(res, registeredUser);
            }

            req.body.role = foundRole[0]._id;
            _context4.next = 24;
            return _User2.default.create(req.body);

          case 24:
            newCustomer = _context4.sent;


            // const history = new UserHistory({
            //   user_id: newCustomer._id,
            //   operation: config.operations.add,
            //   operator: operator,
            //   prevObj: null,
            //   updatedObj: newCustomer,
            //   operation_date: new Date(),
            // });

            //await history.save();
            (0, _formatResponse2.default)(res, newCustomer);

          case 26:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function add(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

var createserviceprovider = exports.createserviceprovider = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var roleName, foundUser, error, foundRole, _error2, newCustomer;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            roleName = 'service_provider';

            req.body.active = true;

            _context5.next = 4;
            return _User2.default.find({
              mobile_no: req.body.mobile_no,
              active: true
            });

          case 4:
            foundUser = _context5.sent;

            if (!(foundUser.length >= 1)) {
              _context5.next = 10;
              break;
            }

            error = new Error('Mobile No already in use!');

            error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
            error.name = 'userExist';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            _context5.next = 12;
            return _Role2.default.find({
              $and: [{ name: roleName }, { name: { $ne: 'user' } }]
            });

          case 12:
            foundRole = _context5.sent;

            if (foundRole) {
              _context5.next = 18;
              break;
            }

            _error2 = new Error('Role not found!');

            _error2.ar_message = 'الدور غير موجود!';
            _error2.name = 'NotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 18:

            if (foundUser) {
              req.body.isDeleted = false;
              // if (foundUser.role.indexOf(foundRole._id) === -1) {
              //   foundUser.role.push(foundRole._id);
              // }
              //delete req.body.role;
              req.body.role = foundRole[0]._id;

              //foundUser.set(req.body);
              // let registeredUser = await foundUser.save();
              // return formatResponse(res, registeredUser);
            }

            req.body.role = foundRole[0]._id;

            _context5.next = 22;
            return _User2.default.create(req.body);

          case 22:
            newCustomer = _context5.sent;


            // const history = new UserHistory({
            //   user_id: newCustomer._id,
            //   operation: config.operations.add,
            //   operator: operator,
            //   prevObj: null,
            //   updatedObj: newCustomer,
            //   operation_date: new Date(),
            // });

            //await history.save();
            (0, _formatResponse2.default)(res, newCustomer);

          case 24:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function createserviceprovider(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();

var updateUser = exports.updateUser = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
    var operator, id, roleName, foundCustomer, error, foundRole, _error3, origObj, updatedCustomer, history;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            operator = req.user;
            id = req.params.id;
            roleName = req.body.role;
            _context6.next = 5;
            return _User2.default.findById(id);

          case 5:
            foundCustomer = _context6.sent;

            if (foundCustomer) {
              _context6.next = 11;
              break;
            }

            error = new Error('Customer not be registered!');

            error.ar_message = 'الزبون غير مسجل!';
            error.name = 'userExist';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 11:
            _context6.next = 13;
            return _Role2.default.findOne({ name: roleName });

          case 13:
            foundRole = _context6.sent;

            if (foundRole) {
              _context6.next = 19;
              break;
            }

            _error3 = new Error('Role not found!');

            _error3.ar_message = 'الدور غير موجود!';
            _error3.name = 'NotFound';
            return _context6.abrupt('return', (0, _formatResponse2.default)(res, _error3));

          case 19:
            origObj = foundCustomer.toObject();

            req.body.email = req.body.email.toLowerCase();
            foundCustomer.role = foundRole._id;
            // if (foundCustomer.role.indexOf(foundRole._id) === -1) {
            // 	foundCustomer.role.push(foundRole._id);
            // }
            delete req.body.role;
            foundCustomer.set(req.body);
            _context6.next = 26;
            return foundCustomer.save();

          case 26:
            updatedCustomer = _context6.sent;
            history = new _UserHistory2.default({
              user_id: foundCustomer._id,
              operation: _operationConfig2.default.operations.update,
              operator: operator,
              prevObj: origObj,
              updatedObj: updatedCustomer,
              operation_date: new Date()
            });
            _context6.next = 30;
            return history.save();

          case 30:
            (0, _formatResponse2.default)(res, updatedCustomer);

          case 31:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function updateUser(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();

var remove = exports.remove = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var id, foundUser, error;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            //const operator = req.user;
            id = req.params.id;
            _context7.next = 3;
            return _User2.default.find({ _id: id });

          case 3:
            foundUser = _context7.sent;

            if (foundUser) {
              _context7.next = 9;
              break;
            }

            error = new Error('Customer not found!');

            error.ar_message = 'العميل غير موجود!';
            error.name = 'NotFound';
            return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:

            foundUser.isDeleted = true;

            _context7.next = 12;
            return _User2.default.update({ _id: id }, { isDeleted: true, active: false });

          case 12:
            _context7.next = 14;
            return _UserHistory2.default.remove({ user_id: id });

          case 14:

            // const history = new UserHistory({
            // 	user_id: foundUser._id,
            // 	operation: config.operations.remove,
            // 	operator: operator,
            // 	prevObj: foundUser,
            // 	updatedObj: null,
            // 	operation_date: new Date()
            // });

            // await history.save();
            (0, _formatResponse2.default)(res, foundUser);

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function remove(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

var removeAll = exports.removeAll = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
    var userIds, users, user_mobile, mobile_no;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            //const operator = req.user;
            userIds = req.body.ids;
            _context8.next = 3;
            return _User2.default.findOne({ _id: { $in: userIds } });

          case 3:
            users = _context8.sent;

            // if (users.length) {

            // 	const userHistory = users.map(user => ({
            // 		user_id: user._id,
            // 		first_name: user.first_name,
            // 		last_name: user.last_name,
            // 		operation: config.operations.remove,
            // 		operator: operator,
            // 		prevObj: user,
            // 		updatedObj: null,
            // 		operation_date: new Date(),
            // 	}));

            // 	await UserHistory.insertMany(userHistory);
            // }
            user_mobile = users.mobile_no;
            mobile_no = users.mobile_no + new Date();
            _context8.next = 8;
            return _User2.default.update({ _id: { $in: userIds } }, {
              isDeleted: true,
              active: false,
              mobile_no: mobile_no,
              old_mobile_no: user_mobile
            }, { multi: true });

          case 8:
            _context8.next = 10;
            return _UserHistory2.default.remove({ user_id: { $in: userIds } });

          case 10:
            return _context8.abrupt('return', (0, _formatResponse2.default)(res, users));

          case 11:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function removeAll(_x15, _x16) {
    return _ref10.apply(this, arguments);
  };
}();