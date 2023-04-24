import supertest from 'supertest';
import { default as app } from '../../app';
import { expect } from 'chai';
const server = supertest.agent(app);

describe('Get Report tests', () => {

	const superUserData = {
		email: 'jitendra.kumar@neosofttech.com',
		password: 'Jitendra@123'
	};

	let token = null;

	before(done => {
		server
			.post('/api/admin/signin')
			.send(superUserData)
			// .expect(200)
			.then((err, res) => {
				console.log('err==========>',err);
				//console.log('res.body.data==========>',res);
			
				if (err) {
					return done(err);
				}
			
				token = res.body.data.token;
				done();
			});
	});

	it('Should return report api', async done => {

		await server
			.get('/api/admin/report/rating?user_type=service_provider')
			.set({ 'access_token': `${token}` })
			// .set({ 'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJob21lX3NlcnZpY2UiLCJzdWIiOiJZNmdMRWVHMUwiLCJpYXQiOjE1NDA1NjAzNDAsImV4cCI6MTYyNjk2MDM3MH0.e0KYDZplyZrcTyAhAEg3hl2DjLBOVkwu4XtVB88AFRM' })
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				expect(res.body.status).to.equal('success');
				done();
			});
	});
});