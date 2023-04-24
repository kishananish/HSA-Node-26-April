'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _api = require('../../helpers/api');

var ApiLib = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CustomerController', function () {

	describe('CustomerController.sendOtp', function () {

		it('it should send otp on mobile no', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
			var response;
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return ApiLib.Post('/send-otp', {}, { 'country_code': '+91', 'mobile_no': '9897654356' });

						case 2:
							response = _context.sent;


							console.log('response : ', response);

							(0, _chai.expect)(response).to.be.an('object').to.have.property('status', 'success');

						case 5:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		})));
	});
});