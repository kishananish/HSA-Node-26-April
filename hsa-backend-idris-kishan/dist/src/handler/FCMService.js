'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.firebaseNotificationToProviderApp = exports.firebaseNotificationToUserApp = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var firebaseNotificationToUserApp = exports.firebaseNotificationToUserApp = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        var url, headers, options;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(data);

                        url = 'https://fcm.googleapis.com/fcm/send';
                        headers = {
                            'Authorization': 'key=AAAAb7Y1RvA:APA91bHamSNlZZso5BibrjiE3vmMgjpT6SDPjSmpHdZ6ZZR4St8-VLD8T-RP3jgdxqz_RHJMnbJ0ZfAhdK6ZTAaXD1lUTDX8XQ10KoEbdz3hRvl-LRV0EB5T7mLjbVdle9YQ7mg2OfTW'
                        };
                        options = {
                            method: 'POST',
                            headers: headers,
                            data: data,
                            url: url
                        };
                        _context.next = 6;
                        return (0, _axios2.default)(options);

                    case 6:
                        return _context.abrupt('return', _context.sent);

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function firebaseNotificationToUserApp(_x) {
        return _ref.apply(this, arguments);
    };
}();

var firebaseNotificationToProviderApp = exports.firebaseNotificationToProviderApp = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
        var url, headers, options;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        url = 'https://fcm.googleapis.com/fcm/send';
                        headers = {
                            'Authorization': 'key=AAAAl61tfAM:APA91bHO76mOcIwykDjNmR8ZclIP6X4wogvvUI-ORX8Yo5RWUFsd6ng4moz5K5_Za8FeNY6e0613J6qL3tfwgCwUUwzrtmQMJB5m3HSnR9lG1tDV8zEHR2NJ7UQvI7wleMTpGQ4PSOAw'
                        };
                        options = {
                            method: 'POST',
                            headers: headers,
                            data: data,
                            url: url
                        };
                        _context2.next = 5;
                        return (0, _axios2.default)(options);

                    case 5:
                        return _context2.abrupt('return', _context2.sent);

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function firebaseNotificationToProviderApp(_x2) {
        return _ref2.apply(this, arguments);
    };
}();