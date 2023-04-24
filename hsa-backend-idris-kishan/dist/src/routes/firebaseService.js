'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _FCMService = require('../handler/FCMService');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
		var params, result;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						params = {
							'registration_ids': ['dp-ajBKk4Fw:APA91bHwodkdVrXrwUCdaMxljxUQ0JgVf_P5fb3_LDC6p3D12o0Kb8eyj3iD-iGeffMutRr5VBSKd6OVS6VoqI_dpjKehNqdi-KtidtmRqAnQcRaak5FbTwTVOdvniSNZyFRTXmWdWdU', 'fKYfj-mCaK0:APA91bEkRxl5IzHTtI9uG3uqKY1mN1qDZTlVG_ZZjQETPBNIsIRH9tyjxzVg_YxBEf4VVlkdKRCpXdKrQKUNkkI1g6UDCnfiwmDcDQPL9hFy1nYbWTQxB0EaMlRcCUClQsOp1maMuina'],
							data: {
								message: 'Test message from node'
							},
							notification: {
								title: 'HSA title',
								body: 'HSA body'
							}
						};
						_context.next = 4;
						return (0, _FCMService.firebaseNotificationToUserApp)(params);

					case 4:
						result = _context.sent;

						console.log(result);

						result = (0, _stringify2.default)(result);
						res.status(200).send(result.body);
						_context.next = 13;
						break;

					case 10:
						_context.prev = 10;
						_context.t0 = _context['catch'](0);

						res.status(500).send(_context.t0.data);

					case 13:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 10]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

exports.default = router;