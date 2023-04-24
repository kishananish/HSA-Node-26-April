const expect = require('chai').expect;
const nock = require('nock');

const getRating = require('../../src/controller/reportCtrl').getRating;
const response = require('./ratingData');

describe('Get Nock Report tests', () => {
	beforeEach(() => {
		nock('http://localhost:3003')
			.get('/api/admin/report/rating')
			.reply(200, response);
	});

	it('Get rating report', (done) => {
		let req = {
			query : {}
		};
		return getRating(req)
			.then(response => {
				expect(typeof response).to.equal('object');
				expect(response.status).to.equal('success');
			}).finally(done());
	});
});