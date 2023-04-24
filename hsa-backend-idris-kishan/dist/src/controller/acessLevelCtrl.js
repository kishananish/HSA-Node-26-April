'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.add = exports.getAccessLevels = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _AccessLevels = require('../models/AccessLevels');

var _AccessLevels2 = _interopRequireDefault(_AccessLevels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAccessLevels = exports.getAccessLevels = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var access_level;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        access_level = [{
                            name: 'admin',
                            active: true,
                            isDeleted: false,
                            access_level: [{
                                name: 'Manage Customers',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Users',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Service Request',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Category',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Sub-Category',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Material',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage FAQ',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Promo Code',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Query / Suggestion',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Notifications',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Manage Roles',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }, {
                                name: 'Reports',
                                actions: {
                                    add: false,
                                    edit: false,
                                    view: false,
                                    delete: false,
                                    payment: false
                                }
                            }]
                        }];

                        (0, _formatResponse2.default)(res, access_level);

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getAccessLevels(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var data, access_levels;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        data = [{ 'name': 'Customer Management', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Service Request', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Category', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Sub Category', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Users', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage FAQ', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Promo', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Query', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Report', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Notification', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }, { 'name': 'Manage Role', 'actions': { 'add': false, 'edit': false, 'view': false, 'delete': false, 'payment': false } }];
                        _context2.next = 3;
                        return _AccessLevels2.default.insertMany(data);

                    case 3:
                        access_levels = _context2.sent;

                        (0, _formatResponse2.default)(res, access_levels);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function add(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();