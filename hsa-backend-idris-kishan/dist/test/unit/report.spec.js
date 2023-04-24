'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = _supertest2.default.agent(_app2.default);

describe('Get Report tests', function () {

	var superUserData = {
		email: 'jitendra.kumar@neosofttech.com',
		password: 'Jitendra@123'
	};

	var token = null;

	before(function (done) {
		server.post('/api/admin/signin').send(superUserData)
		// .expect(200)
		.then(function (err, res) {
			console.log('err==========>', err);
			//console.log('res.body.data==========>',res);

			if (err) {
				return done(err);
			}

			token = res.body.data.token;
			done();
		});
	});

	it('Should return report api', function () {
		var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(done) {
			return _regenerator2.default.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return server.get('/api/admin/report/rating?user_type=service_provider').set({ 'access_token': '' + token })
							// .set({ 'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJob21lX3NlcnZpY2UiLCJzdWIiOiJZNmdMRWVHMUwiLCJpYXQiOjE1NDA1NjAzNDAsImV4cCI6MTYyNjk2MDM3MH0.e0KYDZplyZrcTyAhAEg3hl2DjLBOVkwu4XtVB88AFRM' })
							.expect(200).end(function (err, res) {
								if (err) {
									return done(err);
								}
								(0, _chai.expect)(res.body.status).to.equal('success');
								done();
							});

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x) {
			return _ref.apply(this, arguments);
		};
	}());
});