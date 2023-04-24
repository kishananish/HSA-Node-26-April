'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeAll = exports.remove = exports.update = exports.add = exports.getRoleById = exports.getRoles = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _RoleHistory = require('../models/RoleHistory');

var _RoleHistory2 = _interopRequireDefault(_RoleHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRoles = exports.getRoles = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var items, page, skip, limit, count, role, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context.next = 6;
                        return _Role2.default.find({ isDeleted: false, name: { $ne: 'admin' } }).countDocuments();

                    case 6:
                        count = _context.sent;
                        _context.next = 9;
                        return _Role2.default.find({ isDeleted: false, name: { $ne: 'admin' } }).skip(skip).limit(limit);

                    case 9:
                        role = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: role
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getRoles(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getRoleById = exports.getRoleById = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var id, role;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        id = req.params.id;
                        _context2.next = 3;
                        return _Role2.default.findOne({ _id: id, isDeleted: false, name: { $ne: 'admin' } });

                    case 3:
                        role = _context2.sent;

                        (0, _formatResponse2.default)(res, role ? role : {});

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getRoleById(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();
var add = exports.add = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var operator, existingRole, newRole, role, history, updatedRole, err;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        operator = req.user;
                        _context3.next = 3;
                        return _Role2.default.findOne({ name: req.body.name });

                    case 3:
                        existingRole = _context3.sent;

                        if (existingRole) {
                            _context3.next = 15;
                            break;
                        }

                        newRole = new _Role2.default({
                            name: req.body.name,
                            isDeleted: req.body.isDeleted,
                            active: req.body.active,
                            access_level: req.body.access_level
                        });
                        _context3.next = 8;
                        return newRole.save();

                    case 8:
                        role = _context3.sent;
                        history = new _RoleHistory2.default({
                            role_id: role._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: role,
                            operation_date: new Date()
                        });
                        _context3.next = 12;
                        return history.save();

                    case 12:
                        (0, _formatResponse2.default)(res, role);
                        _context3.next = 25;
                        break;

                    case 15:
                        if (!existingRole.isDeleted) {
                            _context3.next = 21;
                            break;
                        }

                        existingRole.isDeleted = false;
                        _context3.next = 19;
                        return existingRole.save();

                    case 19:
                        updatedRole = _context3.sent;
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, updatedRole));

                    case 21:
                        err = new Error('Role exists!');

                        err.ar_message = 'الدور موجود!';
                        err.name = 'dataExist';
                        (0, _formatResponse2.default)(res, err);

                    case 25:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function add(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var operator, id, role, error, prevObj, history;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context4.next = 4;
                        return _Role2.default.findById(id);

                    case 4:
                        role = _context4.sent;

                        if (role) {
                            _context4.next = 12;
                            break;
                        }

                        error = new Error('Role not found!');

                        error.ar_message = 'الدور غير موجود!';
                        error.name = 'NotFound';
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        prevObj = role.toObject();

                        role.set({
                            name: req.body.name,
                            active: req.body.active,
                            access_level: req.body.access_level
                        });
                        _context4.next = 16;
                        return role.save();

                    case 16:
                        history = new _RoleHistory2.default({
                            role_id: role._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: prevObj,
                            updatedObj: role,
                            operation_date: new Date()
                        });
                        _context4.next = 19;
                        return history.save();

                    case 19:
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, role));

                    case 20:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function update(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var operator, id, role, error, history;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context5.next = 4;
                        return _Role2.default.findOne({ _id: id });

                    case 4:
                        role = _context5.sent;

                        if (role) {
                            _context5.next = 10;
                            break;
                        }

                        error = new Error('Role not found!');

                        error.ar_message = 'الدور غير موجود!';
                        error.name = 'NotFound';
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 10:

                        role.isDeleted = true;
                        role.active = false;

                        _context5.next = 14;
                        return role.save();

                    case 14:
                        history = new _RoleHistory2.default({
                            role_id: role._id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: role,
                            updatedObj: null,
                            operation_date: new Date()

                        });
                        _context5.next = 17;
                        return history.save();

                    case 17:
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, role));

                    case 18:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function remove(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var operator, roleIds, roles, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        roleIds = req.body.ids;
                        _context6.next = 4;
                        return _Role2.default.find({ _id: { $in: roleIds } });

                    case 4:
                        roles = _context6.sent;

                        if (!roles.length) {
                            _context6.next = 9;
                            break;
                        }

                        history = roles.map(function (role) {
                            return {
                                role_id: role._id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: role,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        _context6.next = 9;
                        return _RoleHistory2.default.insertMany(history);

                    case 9:
                        _context6.next = 11;
                        return _Role2.default.deleteMany({ _id: { $in: roleIds } });

                    case 11:
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, roles));

                    case 12:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function removeAll(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();