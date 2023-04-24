const expect = require('chai').expect;
const nock = require('nock');

const signin = require('../../src/controller/adminCtrl').signin;
const response = require('./userData');

describe('Get Nock User tests', () => {
	beforeEach(() => {
		nock('http://localhost:3003')
			.post('/admin/sign')
			.reply(200, response);
	});

	it('Get token after login', (done) => {
		const req = {
			body: {
				email: 'jitendra.kumar@neosofttech.com', password: 'Jitendra@123'
			}
		};
		return signin(req)
			.then(response => {
				expect(typeof response).to.equal('object');
				expect(response.status).to.equal('success');
			}).finally(done());
	});

});