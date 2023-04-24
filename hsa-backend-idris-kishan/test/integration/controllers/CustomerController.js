import {expect} from 'chai';
import * as ApiLib from '../../helpers/api';

describe('CustomerController', () => {

	describe('CustomerController.sendOtp', () => {

		it('it should send otp on mobile no', async () => {

			const response = await ApiLib.Post(
			    '/send-otp', 
			    {},
			    {'country_code':'+91','mobile_no':'9897654356'}
			);

			console.log('response : ', response);
			
			expect(response).to.be.an('object').to.have.property('status', 'success');
		});
	});
});
