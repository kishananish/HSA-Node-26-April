
import supertest from 'supertest';
// import app from '../../app';


const server = supertest.agent('http://localhost:3000/api');

export const Post = (url, auth,  params) => {

	return new Promise((resolve, reject) => {

			
		server
			.post(url)
			.expect('Content-type',/json/)
			.send(params)
			.expect(200)
			.end(function(err, res) {
				if(err)
					reject(err);
				else
					resolve(res.body);
			});
	});
	
    
};