'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('chai').expect;
var nock = require('nock');

var getRating = require('../../src/controller/reportCtrl').getRating;
var response = require('./ratingData');

describe('Get Nock Report tests', function () {
	beforeEach(function () {
		nock('http://localhost:3003').get('/api/admin/report/rating').reply(200, response);
	});

	it('Get rating report', function (done) {
		var req = {
			query: {}
		};
		return getRating(req).then(function (response) {
			expect(typeof response === 'undefined' ? 'undefined' : (0, _typeof3.default)(response)).to.equal('object');
			expect(response.status).to.equal('success');
		}).finally(done());
	});
});