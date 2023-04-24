'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendPushNotificationToMultiple = exports.sendPushNotification = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _constants = require('../../src/handler/constants');

var constants = _interopRequireWildcard(_constants);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var admin = require('firebase-admin');


var CONSUMER_CERT = require('../../config/homeservices-firebase.json');
var PROVIDER_CERT = require('../../config/homeservices-firebase_provider.json');

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var consumer = admin.initializeApp({
    credential: admin.credential.cert(CONSUMER_CERT)
});

var provider = admin.initializeApp({
    credential: admin.credential.cert(PROVIDER_CERT)
}, 'provider');

var sendPushNotification = exports.sendPushNotification = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(tokens, payloads, roleToSend) {
        var options, error, _error;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (payloads) {
                            _context.next = 4;
                            break;
                        }

                        throw new Error('You must provide a payload object');

                    case 4:
                        if (!(tokens && tokens.filter(function (str) {
                            return str && str.trim().length > 0;
                        }).length > 0)) {
                            _context.next = 23;
                            break;
                        }

                        if (!(tokens instanceof Array && typeof tokens[0] === 'string')) {
                            _context.next = 19;
                            break;
                        }

                        options = {
                            priority: 'high',
                            timeToLive: 60 * 60 * 24
                        };

                        console.log('roleToSend :', roleToSend);

                        if (!(roleToSend === constants.CUSTOMER)) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('return', consumer.messaging().sendToDevice(tokens, payloads, options).then(function (res) {
                            return console.log('response---->', tokens, '<><>', res.results[0].error);
                        }).catch(function (err) {
                            return console.log('err-----', err);
                        }));

                    case 12:
                        if (!(roleToSend === constants.SERVICE_PROVIDER)) {
                            _context.next = 16;
                            break;
                        }

                        return _context.abrupt('return', provider.messaging().sendToDevice(tokens, payloads, options).then(function (res) {
                            return console.log('response---->', tokens, '<><>', res.results[0].error);
                        }).catch(function (err) {
                            return console.log('err-----', err);
                        }));

                    case 16:
                        return _context.abrupt('return', admin.messaging().sendToDevice(tokens, payloads, options).then(function (res) {
                            return console.log('other response---->', tokens, res.results[0].error);
                        }).catch(function (err) {
                            return console.log('err-----', err);
                        }));

                    case 17:
                        _context.next = 21;
                        break;

                    case 19:
                        error = new Error('Invalid device token, tokens must be array of string!');
                        throw error;

                    case 21:
                        _context.next = 25;
                        break;

                    case 23:
                        _error = new Error('Invalid device token, tokens must be array of string!');
                        throw _error;

                    case 25:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function sendPushNotification(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var sendPushNotificationToMultiple = exports.sendPushNotificationToMultiple = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(devices, payloads, roleToSend) {
        var options, error;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        console.log('devices -->', devices);

                        if (payloads) {
                            _context2.next = 5;
                            break;
                        }

                        throw new Error('You must provide a payload object');

                    case 5:
                        if (!(devices instanceof Array && typeof devices[0] === 'string')) {
                            _context2.next = 10;
                            break;
                        }

                        options = {
                            priority: 'high',
                            timeToLive: 60 * 60 * 24
                        };

                        if (roleToSend === constants.CUSTOMER) {
                            // console.log('in customer');
                            devices.map(function (deviceId) {
                                consumer.messaging().sendToDevice(deviceId, payloads, options).then(function (res) {
                                    return console.log('customer response---->', res, res.results[0].error);
                                }).catch(function (err) {
                                    return console.log('err-----', err);
                                });
                            });
                        } else if (roleToSend === constants.SERVICE_PROVIDER) {
                            console.log('service provider :');
                            devices.map(function (deviceId) {
                                provider.messaging().sendToDevice(deviceId, payloads, options).then(function (res) {
                                    return console.log('service response---->', res, res.results[0].error);
                                }).catch(function (err) {
                                    return console.log('err-----', err);
                                });
                            });
                        } else {
                            devices.map(function (deviceId) {
                                consumer.messaging().sendToDevice(deviceId, payloads, options).then(function (res) {
                                    return console.log('service response---->', res.results[0].error);
                                }).catch(function (err) {
                                    return console.log('err-----', err);
                                });
                            });
                        }
                        _context2.next = 12;
                        break;

                    case 10:
                        error = new Error('Invalid device token, tokens must be array of string!');
                        throw error;

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function sendPushNotificationToMultiple(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();