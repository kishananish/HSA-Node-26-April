'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('chai').expect;
var nock = require('nock');

var signin = require('../../src/controller/adminCtrl').signin;
var response = require('./userData');

describe('Get Nock User tests', function () {
	beforeEach(function () {
		nock('http://localhost:3003').post('/admin/sign').reply(200, response);
	});

	it('Get token after login', function (done) {
		var req = {
			body: {
				email: 'jitendra.kumar@neosofttech.com', password: 'Jitendra@123'
			}
		};
		return signin(req).then(function (response) {
			expect(typeof response === 'undefined' ? 'undefined' : (0, _typeof3.default)(response)).to.equal('object');
			expect(response.status).to.equal('success');
		}).finally(done());
	});
});