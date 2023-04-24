'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.send = exports.removeAll = exports.remove = exports.add = exports.getNotificationById = exports.getNotifications = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _Notification = require('../models/Notification');

var _Notification2 = _interopRequireDefault(_Notification);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _pushNotification = require('../handler/pushNotification');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNotifications = exports.getNotifications = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var items, page, skip, limit, count, notifications, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context.next = 6;
                        return _Notification2.default.find().countDocuments();

                    case 6:
                        count = _context.sent;
                        _context.next = 9;
                        return _Notification2.default.find().sort({ 'created_at': 'desc' }).populate('user_id', ['first_name', 'last_name']).populate('service_provider_id', ['first_name', 'last_name']).skip(skip).limit(limit);

                    case 9:
                        notifications = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: notifications
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getNotifications(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();
// import { firebaseNotificationToProviderApp, firebaseNotificationToUserApp } from '../handler/FCMService';
var getNotificationById = exports.getNotificationById = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var id, notification;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        id = req.params.id;
                        _context2.next = 3;
                        return _Notification2.default.findById(id).populate('user_id', ['first_name', 'last_name']).populate('service_provider_id', ['first_name', 'last_name']);

                    case 3:
                        notification = _context2.sent;

                        (0, _formatResponse2.default)(res, notification ? notification : {});

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getNotificationById(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var userIds, users, deviceIds, new_notification, params;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        userIds = req.body.user_id;

                        console.log('incoming userIds :', userIds);
                        users = void 0;
                        /**
                        * (req.body.user_type) => User role who 
                        */

                        if (!(req.body.user_type === 'service_provider')) {
                            _context3.next = 10;
                            break;
                        }

                        req.body.onModel = 'User';
                        _context3.next = 7;
                        return _User2.default.find({ _id: { $in: userIds } });

                    case 7:
                        users = _context3.sent;
                        _context3.next = 14;
                        break;

                    case 10:
                        req.body.onModel = 'Customer';
                        _context3.next = 13;
                        return _Customer2.default.find({ _id: { $in: userIds } });

                    case 13:
                        users = _context3.sent;

                    case 14:
                        deviceIds = users.map(function (user) {
                            return user.device_id;
                        }).filter(function (deviceid) {
                            return deviceid != undefined;
                        });

                        console.log('deviceIds~~~~~', deviceIds);

                        _context3.next = 18;
                        return _Notification2.default.create(req.body);

                    case 18:
                        new_notification = _context3.sent;

                        if (!deviceIds.length) {
                            _context3.next = 31;
                            break;
                        }

                        console.log('in side :');
                        params = {};

                        if (!(req.body.user_type === 'user')) {
                            _context3.next = 28;
                            break;
                        }

                        params = {
                            data: {
                                message: 'Test message from admin api',
                                newNotification: new_notification.content,
                                userType: req.body.user_type
                            },
                            notification: {
                                title: new_notification.content,
                                body: 'Custom Body Content'
                            }
                        };

                        _context3.next = 26;
                        return (0, _pushNotification.sendPushNotificationToMultiple)(deviceIds, params, req.body.user_type);

                    case 26:
                        _context3.next = 31;
                        break;

                    case 28:
                        params = {
                            data: {
                                message: 'Test message from admin api',
                                newNotification: new_notification.content,
                                userType: req.body.user_type
                            },
                            notification: {
                                title: req.body.content,
                                body: 'Custom Body Content'
                            }
                        };
                        _context3.next = 31;
                        return (0, _pushNotification.sendPushNotificationToMultiple)(deviceIds, params, req.body.user_type);

                    case 31:
                        (0, _formatResponse2.default)(res, new_notification);

                    case 32:
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

var remove = exports.remove = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var id, notification, error;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        id = req.params.id;
                        _context4.next = 3;
                        return _Notification2.default.findOne({ _id: id });

                    case 3:
                        notification = _context4.sent;

                        if (notification) {
                            _context4.next = 9;
                            break;
                        }

                        error = new Error('Notification not found!');

                        error.ar_message = 'الإخطار غير موجود!';
                        error.name = 'NotFound';
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 9:
                        _context4.next = 11;
                        return _Notification2.default.remove({ _id: id });

                    case 11:
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, notification));

                    case 12:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function remove(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var notificationIds, notifications;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        notificationIds = req.body.ids;
                        _context5.next = 3;
                        return _Notification2.default.find({ _id: { $in: notificationIds } });

                    case 3:
                        notifications = _context5.sent;
                        _context5.next = 6;
                        return _Notification2.default.remove({ _id: { $in: notificationIds } });

                    case 6:
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, notifications));

                    case 7:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function removeAll(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * Send notification to users on devices
 * @param {*} req 
 * @param {*} res 
 */
var send = exports.send = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var tokens, payload;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        tokens = req.body.deviceId;
                        payload = {
                            notification: {
                                title: 'Congrats!',
                                body: 'Customer Has Accepted Your Quote'
                            }
                        };
                        _context6.next = 4;
                        return (0, _pushNotification.sendPushNotificationToMultiple)(tokens, payload).then(function (res) {
                            return console.log('res------', res);
                        }).catch(function (err) {
                            return console.log('err------', err);
                        });

                    case 4:
                        (0, _formatResponse2.default)(res, {});

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function send(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();