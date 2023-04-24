import formatResponse from '../../utils/formatResponse';
import Payment from '../models/Payment';
import Service from '../models/Service';
import config from '../../config/config';
import payfort from '../handler/payfortSignature';
import Customer from '../models/Customer';
import { sendPushNotification } from '../handler/pushNotification';
import * as constants from '../../src/handler/constants';


/**
 * @apiDescription calculating total cost credits used remaining credits in user wallet 
 * @param {*} customerId 
 * @param {*} requestObject 
 * @param {*} service 
 */
async function savePaymentData(customerId, requestObject, service) {
	const customer = await Customer.findById(customerId);
	let credits = customer.credits;
	let total_service_charge = service.total_service_charge;
	const promo = service.promo_amount;

	let total_amount_paid = 0;
	let remaining_credits = 0;


	//check Promo applied
	if (service.isPromoApplied) {
		//total_service_charge is greater than promo amount
		if (total_service_charge >= promo) {
			//total_service_charge is greater than promo amount
			// No credits available
			if (credits <= 0) {
				// only promo-code deduction required (if any)
				total_amount_paid = Math.abs(total_service_charge - promo);
				requestObject.total_amount_paid = total_amount_paid;
				requestObject.promocode_id = service.promocode_id;

			}
			else if (credits > 0 && credits >= total_service_charge) {
				//promo applied and credits is greater than total_service_charge in user wallet
				total_amount_paid = Math.abs(total_service_charge - promo);
				remaining_credits = Math.abs(credits - total_amount_paid);
				requestObject.total_amount_paid = 0;
				requestObject.used_credits = Math.abs(credits - remaining_credits);
				requestObject.promocode_id = service.promocode_id;
				// update credits in user wallet and total_amount_paid in payment
				await Customer.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });
			} else if (credits > 0 && credits <= total_service_charge) {
				//credits is less than total_service_charge in user wallet
				total_amount_paid = Math.abs(total_service_charge - promo);
				total_amount_paid = Math.abs(total_amount_paid - credits);
				requestObject.total_amount_paid = total_amount_paid;
				requestObject.promocode_id = service.promocode_id;
				remaining_credits = 0;
				requestObject.used_credits = Math.abs(credits - remaining_credits);
				// update credits in user wallet and total_amount_paid in payment
				await Customer.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });
			}
		} else if (total_service_charge <= promo) {
			//if total_service_charge is less than promo amount;
			requestObject.total_amount_paid = 0;
			requestObject.promocode_id = service.promocode_id;
			requestObject.used_credits = 0;
			remaining_credits = Math.abs(credits);
			// update credits in user wallet and total_amount_paid in payment
			await Customer.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });
		}
	} else {
		// No credits available no promocode apply
		if (credits <= 0) {
			//if not apply promo and credits not available in user wallet
			requestObject.total_amount_paid = total_service_charge;
		} else if (credits > 0 && credits >= total_service_charge) {
			//not apply promo and credits is greater than total_service_charge in user wallet
			remaining_credits = Math.abs(credits - total_service_charge);
			requestObject.total_amount_paid = 0;
			requestObject.used_credits = Math.abs(credits - remaining_credits);
			// update credits in user wallet and total_amount_paid in payment
			await Customer.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });
		} else if (credits > 0 && credits <= total_service_charge) {
			total_amount_paid = Math.abs(total_service_charge - credits);
			requestObject.total_amount_paid = total_amount_paid;
			remaining_credits = 0;
			requestObject.used_credits = Math.abs(credits - remaining_credits);
			// update credits in user wallet and total_amount_paid in payment
			await Customer.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });
		}
	}

	requestObject.total_cost = service.total_service_charge;
	requestObject.user_id = customerId;
	requestObject.service_provider_id = service.service_provider_id;
	requestObject.total_amount_pending = 0;
	requestObject.payment_status = true;
	const payment = await Payment.create(requestObject);
	let providerParams = {};
	if (requestObject.payment_mode == 'cash') {
		service.set({ payment_id: payment._id, progress: 'payment_done', payment_status: 'pending', progress_at: new Date() });
		// send notification to service_provider by cash payment
		const serviceObject = await Service.findOne({ _id: service._id, customer_id: service.customer_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);
		const providerDeviceId = serviceObject.service_provider_id.device_id;
		const sendToRole = constants.SERVICE_PROVIDER;
		providerParams = {
			data: {
				requestId: service._id,
				status: service.progress,
				user: 'Service Provider',
				targetScreen: 'RequestStatus'
			},
			notification: {
				title: 'Congrats!',
				body: 'Payment Done by Customer'
			}
		};
		await sendPushNotification([providerDeviceId], providerParams, sendToRole);

	} else {
		service.set({ payment_id: payment._id, progress: 'task_done', payment_status: 'pending', progress_at: new Date() });
	}

	const updatedService = await service.save();
	return updatedService;
}

/**
 *@apiDescription add payment by using cash or card 
 * @param {*} req 
 * @param {*} res 
 */
export const addPayment = async (req, res) => {
	const userId = req.user;
	const serviceId = req.body.service_id;
	const paymentMode = req.body.payment_mode;
	switch (paymentMode) {
		case 'cash': {

			const service = await Service.findById(serviceId);
			if (!service) {
				const error = new Error('Service request not found!');
				error.name = 'DataNotFound';
				return formatResponse(res, error);
			}
			const savedPaymentRequest = await savePaymentData(userId, req.body, service);
			return formatResponse(res, savedPaymentRequest);
		}
		case 'card': {
			const service = await Service.findById(serviceId);
			if (!service) {
				const error = new Error('Service request not found!');
				error.name = 'DataNotFound';
				return formatResponse(res, error);
			}
			const savedPaymentRequest = await savePaymentData(userId, req.body, service);
			return formatResponse(res, savedPaymentRequest);
		}
	}
};



export const updatePayment = async (req, res) => {
	const depositAmount = req.body.deposit_amount;
	const serviceId = req.body.service_id;
	const paymentId = req.body.payment_id;
	const service = await Service.findOne({ _id: serviceId, payment_id: paymentId });
	const payment = await Payment.findById(paymentId);
	if (!service || !payment) {
		const error = new Error('Service request not found!');
		error.name = 'DataNotFound';
		return formatResponse(res, error);
	}
	if (payment.total_amount_pending) {
		let totalPendingAmount = Number(payment.total_amount_pending) - Number(depositAmount);
		let totalPaidAmount = Number(payment.total_amount_paid) + Number(depositAmount);
		payment.set({ total_amount_paid: totalPaidAmount, total_amount_pending: totalPendingAmount });
		await payment.save();
	}
	formatResponse(res, service);
};

/**
 * @apiDescription  open card details page
 * @param {*} req 
 * @param {*} res 
 */
export const getCardDetails = async (req, res) => {

	const serviceId = req.params.id;
	const data = serviceId.split('=');
	let requestId = data[1];
	let service = await Service.findOne({ _id: requestId });

	if (requestId == null || requestId == '') {
		let response_code = '400';
		let response_message = 'RequestId can not be blank';
		return res.render('error', { response_message: response_message, response_code: response_code });
	} else if (service == null) {
		let response_code = 404;
		let response_message = 'RequestId is not Found';
		return res.render('error', { response_message: response_message, response_code: response_code });
	} else if (service.payment_id == undefined) {
		let response_code = 404;
		let response_message = 'paymentId is not Found';
		return res.render('error', { response_message: response_message, response_code: response_code });
	} else {
		let payment = await Payment.findById({ _id: service.payment_id });		
		//check paymentId and serviceId is valid or not
		if (payment == null) {
			let response_code = 404;
			let response_message = 'RequestId is not Found';
			return res.render('error', { response_message: response_message, response_code: response_code });
		} else if (payment.payfort_token) {
			let response_code = '00066';
			let response_message = 'Merchant reference already exists';
			return res.render('error', { response_message: response_message, response_code: response_code });
		} else {
			res.render('index', { serviceId: data[1] });
		}
	}


};

/**
 * @apiDescription  generate signautre for tokenization and merchant url
 * @param {*} req 
 * @param {*} res 
 */
export const getpayfortTokenSignature = async (req, res) => {
	const passphrase = config.PASSPHARSE;
	const cardData = req.body;
	// generate signautre for tokenization
	var tokenObject = {
		'service_command': 'TOKENIZATION',
		'access_code': config.ACCESS_CODE,
		'merchant_identifier': config.MERCHANT_IDENTIFIER,
		'merchant_reference': cardData.merchant_reference,
		'language': cardData.language,
	};
	//create signature for merchant tokenaization process
	cardData.signature = await payfort.create_signature(passphrase, tokenObject);
	return res.json(cardData);
};



/**
 * @apiDescription  give response from payfort  and save into db
 * @param {*} req 
 * @param {*} res 
 */
export const getPayfortMerchantUrl = async (req, res) => {
	const token = req.body;
	const serviceId = token.merchant_reference;
	var responseCode = token.response_code;
	const payfortToken = token.token_name;
	const tokenData = token;
	switch (responseCode) {
		// Tokenization success from payfort
		case '18000': {
			const filter = { service_id: serviceId };
			const update = { payfort_token: payfortToken, payfort_response: tokenData };
			const savedPayfortResponse = await Payment.findOneAndUpdate(filter, update);
			var paymentObj = await Payment.findById({ _id: savedPayfortResponse._id });
			// get token and generate signature for 3durl
			var passphrase = config.PASSPHARSE;
			// convert amount 
			const total_cost = (paymentObj.total_amount_paid) * 100;
			const signature3dUrlObj = {
				command: 'PURCHASE',
				access_code: paymentObj.payfort_response.access_code,
				merchant_identifier: paymentObj.payfort_response.merchant_identifier,
				merchant_reference: paymentObj.payfort_response.merchant_reference,
				amount: total_cost,
				currency: config.CURRENCY,
				language: paymentObj.payfort_response.language,
				customer_email: 'info@hameedservice.com',
				token_name: paymentObj.payfort_token,
			};

			signature3dUrlObj.signature = await payfort.create_signature(passphrase, signature3dUrlObj);
			// send request to payfort and save payfortResponse
			const token3dUrlObj = await payfort.create_payfort_url(signature3dUrlObj);
			const token3dUrl = token3dUrlObj['3ds_url'];
			return res.set('location', token3dUrl)
				.status(301).send();
		}
		// purchase success from payfort
		case '14000': {
			const filter = { service_id: token.merchant_reference };
			const update = { payfort_response: token, payment_status: true };
			const paymentObject = await Payment.findOneAndUpdate(filter, update);
			const payment = await Payment.findById({ _id: paymentObject._id });
			// update service progress status after card payment done
			const updateService = { payment_id: paymentObject._id, progress: 'payment_done', payment_status: 'paid', progress_at: new Date() };
			const serviceId = { _id: payment.service_id };
			// const service = await Service.updateOne(serviceId, {
			// 	$set: {
			// 		payment_id: paymentObject._id, progress: 'payment_done', payment_status: 'paid', progress_at: new Date()
			// 	}
			// });
			const service = await Service.findOneAndUpdate(serviceId, updateService);
			const serviceObject = await Service.findOne({ _id: service._id, customer_id: service.customer_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);
			const providerDeviceId = serviceObject.service_provider_id.device_id;
			const sendToRole = constants.SERVICE_PROVIDER;
			let providerParams = {};
			providerParams = {
				data: {
					requestId: serviceObject._id,
					status: serviceObject.progress,
					user: 'Service Provider',
					targetScreen: 'RequestStatus'
				},
				notification: {
					title: 'Congrats!',
					body: 'Payment Done by Customer'
				}
			};
			await sendPushNotification([providerDeviceId], providerParams, sendToRole);
			return res.render('success', {
				success: true
			});
		}
		// payment error from payfort
		default: {
			const filter = { service_id: serviceId };
			const update = { payfort_response: token };
			const paymentObject = await Payment.findOneAndUpdate(filter, update);
			let notSavedToken = await Payment.findById({ _id: paymentObject._id });
			return res.render('error', { response_message: notSavedToken.payfort_response.response_message, response_code: notSavedToken.payfort_response.response_code });
		}

	}

};


/**
 * @apiDescription  change  payment  by accepting service id
 * @param {*} req 
 * @param {*} res 
 */
export const updatePaymentStatus = (req, res) => {
	Payment.findOne({
		service_id: req.body.service_id,
		'payfort_response.response_code': '14000',
	}, {
		_id: 1,
		service_id: 1,
		user_id: 1
	}, async (err, result) => {
		const serviceObject = await Service.findOne({ _id: req.body.service_id, customer_id: result.user_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);
		if (result) {
			Service.updateOne({
				_id: result.service_id,
			}, {
				$set: {
					payment_status: 'paid',
					payment_id: result._id,
					progress: 'payment_done',
					progress_at: new Date()
				}
			}, (err, result) => {
				formatResponse(res, serviceObject);
			});
		} else {
			formatResponse(res, serviceObject);
		}
	});
};






