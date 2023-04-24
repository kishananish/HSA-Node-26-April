'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updatePaymentStatus = exports.getPayfortMerchantUrl = exports.getpayfortTokenSignature = exports.getCardDetails = exports.updatePayment = exports.addPayment = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * @apiDescription calculating total cost credits used remaining credits in user wallet 
 * @param {*} customerId 
 * @param {*} requestObject 
 * @param {*} service 
 */
var savePaymentData = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(customerId, requestObject, service) {
		var customer, credits, total_service_charge, promo, total_amount_paid, remaining_credits, payment, providerParams, serviceObject, providerDeviceId, sendToRole, updatedService;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return _Customer2.default.findById(customerId);

					case 2:
						customer = _context.sent;
						credits = customer.credits;
						total_service_charge = service.total_service_charge;
						promo = service.promo_amount;
						total_amount_paid = 0;
						remaining_credits = 0;

						//check Promo applied

						if (!service.isPromoApplied) {
							_context.next = 46;
							break;
						}

						if (!(total_service_charge >= promo)) {
							_context.next = 37;
							break;
						}

						if (!(credits <= 0)) {
							_context.next = 16;
							break;
						}

						// only promo-code deduction required (if any)
						total_amount_paid = Math.abs(total_service_charge - promo);
						requestObject.total_amount_paid = total_amount_paid;
						requestObject.promocode_id = service.promocode_id;

						_context.next = 35;
						break;

					case 16:
						if (!(credits > 0 && credits >= total_service_charge)) {
							_context.next = 26;
							break;
						}

						//promo applied and credits is greater than total_service_charge in user wallet
						total_amount_paid = Math.abs(total_service_charge - promo);
						remaining_credits = Math.abs(credits - total_amount_paid);
						requestObject.total_amount_paid = 0;
						requestObject.used_credits = Math.abs(credits - remaining_credits);
						requestObject.promocode_id = service.promocode_id;
						// update credits in user wallet and total_amount_paid in payment
						_context.next = 24;
						return _Customer2.default.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });

					case 24:
						_context.next = 35;
						break;

					case 26:
						if (!(credits > 0 && credits <= total_service_charge)) {
							_context.next = 35;
							break;
						}

						//credits is less than total_service_charge in user wallet
						total_amount_paid = Math.abs(total_service_charge - promo);
						total_amount_paid = Math.abs(total_amount_paid - credits);
						requestObject.total_amount_paid = total_amount_paid;
						requestObject.promocode_id = service.promocode_id;
						remaining_credits = 0;
						requestObject.used_credits = Math.abs(credits - remaining_credits);
						// update credits in user wallet and total_amount_paid in payment
						_context.next = 35;
						return _Customer2.default.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });

					case 35:
						_context.next = 44;
						break;

					case 37:
						if (!(total_service_charge <= promo)) {
							_context.next = 44;
							break;
						}

						//if total_service_charge is less than promo amount;
						requestObject.total_amount_paid = 0;
						requestObject.promocode_id = service.promocode_id;
						requestObject.used_credits = 0;
						remaining_credits = Math.abs(credits);
						// update credits in user wallet and total_amount_paid in payment
						_context.next = 44;
						return _Customer2.default.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });

					case 44:
						_context.next = 65;
						break;

					case 46:
						if (!(credits <= 0)) {
							_context.next = 50;
							break;
						}

						//if not apply promo and credits not available in user wallet
						requestObject.total_amount_paid = total_service_charge;
						_context.next = 65;
						break;

					case 50:
						if (!(credits > 0 && credits >= total_service_charge)) {
							_context.next = 58;
							break;
						}

						//not apply promo and credits is greater than total_service_charge in user wallet
						remaining_credits = Math.abs(credits - total_service_charge);
						requestObject.total_amount_paid = 0;
						requestObject.used_credits = Math.abs(credits - remaining_credits);
						// update credits in user wallet and total_amount_paid in payment
						_context.next = 56;
						return _Customer2.default.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });

					case 56:
						_context.next = 65;
						break;

					case 58:
						if (!(credits > 0 && credits <= total_service_charge)) {
							_context.next = 65;
							break;
						}

						total_amount_paid = Math.abs(total_service_charge - credits);
						requestObject.total_amount_paid = total_amount_paid;
						remaining_credits = 0;
						requestObject.used_credits = Math.abs(credits - remaining_credits);
						// update credits in user wallet and total_amount_paid in payment
						_context.next = 65;
						return _Customer2.default.findByIdAndUpdate({ _id: customer._id }, { $set: { credits: remaining_credits } });

					case 65:

						requestObject.total_cost = service.total_service_charge;
						requestObject.user_id = customerId;
						requestObject.service_provider_id = service.service_provider_id;
						requestObject.total_amount_pending = 0;
						requestObject.payment_status = true;
						_context.next = 72;
						return _Payment2.default.create(requestObject);

					case 72:
						payment = _context.sent;
						providerParams = {};

						if (!(requestObject.payment_mode == 'cash')) {
							_context.next = 86;
							break;
						}

						service.set({ payment_id: payment._id, progress: 'payment_done', payment_status: 'pending', progress_at: new Date() });
						// send notification to service_provider by cash payment
						_context.next = 78;
						return _Service2.default.findOne({ _id: service._id, customer_id: service.customer_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);

					case 78:
						serviceObject = _context.sent;
						providerDeviceId = serviceObject.service_provider_id.device_id;
						sendToRole = constants.SERVICE_PROVIDER;

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
						_context.next = 84;
						return (0, _pushNotification.sendPushNotification)([providerDeviceId], providerParams, sendToRole);

					case 84:
						_context.next = 87;
						break;

					case 86:
						service.set({ payment_id: payment._id, progress: 'task_done', payment_status: 'pending', progress_at: new Date() });

					case 87:
						_context.next = 89;
						return service.save();

					case 89:
						updatedService = _context.sent;
						return _context.abrupt('return', updatedService);

					case 91:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function savePaymentData(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

/**
 *@apiDescription add payment by using cash or card 
 * @param {*} req 
 * @param {*} res 
 */


var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _payfortSignature = require('../handler/payfortSignature');

var _payfortSignature2 = _interopRequireDefault(_payfortSignature);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _pushNotification = require('../handler/pushNotification');

var _constants = require('../../src/handler/constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addPayment = exports.addPayment = function () {
	var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
		var userId, serviceId, paymentMode, service, error, savedPaymentRequest, _service, _error, _savedPaymentRequest;

		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						userId = req.user;
						serviceId = req.body.service_id;
						paymentMode = req.body.payment_mode;
						_context2.t0 = paymentMode;
						_context2.next = _context2.t0 === 'cash' ? 6 : _context2.t0 === 'card' ? 17 : 28;
						break;

					case 6:
						_context2.next = 8;
						return _Service2.default.findById(serviceId);

					case 8:
						service = _context2.sent;

						if (service) {
							_context2.next = 13;
							break;
						}

						error = new Error('Service request not found!');

						error.name = 'DataNotFound';
						return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

					case 13:
						_context2.next = 15;
						return savePaymentData(userId, req.body, service);

					case 15:
						savedPaymentRequest = _context2.sent;
						return _context2.abrupt('return', (0, _formatResponse2.default)(res, savedPaymentRequest));

					case 17:
						_context2.next = 19;
						return _Service2.default.findById(serviceId);

					case 19:
						_service = _context2.sent;

						if (_service) {
							_context2.next = 24;
							break;
						}

						_error = new Error('Service request not found!');

						_error.name = 'DataNotFound';
						return _context2.abrupt('return', (0, _formatResponse2.default)(res, _error));

					case 24:
						_context2.next = 26;
						return savePaymentData(userId, req.body, _service);

					case 26:
						_savedPaymentRequest = _context2.sent;
						return _context2.abrupt('return', (0, _formatResponse2.default)(res, _savedPaymentRequest));

					case 28:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function addPayment(_x4, _x5) {
		return _ref2.apply(this, arguments);
	};
}();

var updatePayment = exports.updatePayment = function () {
	var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
		var depositAmount, serviceId, paymentId, service, payment, error, totalPendingAmount, totalPaidAmount;
		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						depositAmount = req.body.deposit_amount;
						serviceId = req.body.service_id;
						paymentId = req.body.payment_id;
						_context3.next = 5;
						return _Service2.default.findOne({ _id: serviceId, payment_id: paymentId });

					case 5:
						service = _context3.sent;
						_context3.next = 8;
						return _Payment2.default.findById(paymentId);

					case 8:
						payment = _context3.sent;

						if (!(!service || !payment)) {
							_context3.next = 13;
							break;
						}

						error = new Error('Service request not found!');

						error.name = 'DataNotFound';
						return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

					case 13:
						if (!payment.total_amount_pending) {
							_context3.next = 19;
							break;
						}

						totalPendingAmount = Number(payment.total_amount_pending) - Number(depositAmount);
						totalPaidAmount = Number(payment.total_amount_paid) + Number(depositAmount);

						payment.set({ total_amount_paid: totalPaidAmount, total_amount_pending: totalPendingAmount });
						_context3.next = 19;
						return payment.save();

					case 19:
						(0, _formatResponse2.default)(res, service);

					case 20:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function updatePayment(_x6, _x7) {
		return _ref3.apply(this, arguments);
	};
}();

/**
 * @apiDescription  open card details page
 * @param {*} req 
 * @param {*} res 
 */
var getCardDetails = exports.getCardDetails = function () {
	var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
		var serviceId, data, requestId, service, response_code, response_message, _response_code, _response_message, _response_code2, _response_message2, payment, _response_code3, _response_message3, _response_code4, _response_message4;

		return _regenerator2.default.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						serviceId = req.params.id;
						data = serviceId.split('=');
						requestId = data[1];
						_context4.next = 5;
						return _Service2.default.findOne({ _id: requestId });

					case 5:
						service = _context4.sent;

						if (!(requestId == null || requestId == '')) {
							_context4.next = 12;
							break;
						}

						response_code = '400';
						response_message = 'RequestId can not be blank';
						return _context4.abrupt('return', res.render('error', { response_message: response_message, response_code: response_code }));

					case 12:
						if (!(service == null)) {
							_context4.next = 18;
							break;
						}

						_response_code = 404;
						_response_message = 'RequestId is not Found';
						return _context4.abrupt('return', res.render('error', { response_message: _response_message, response_code: _response_code }));

					case 18:
						if (!(service.payment_id == undefined)) {
							_context4.next = 24;
							break;
						}

						_response_code2 = 404;
						_response_message2 = 'paymentId is not Found';
						return _context4.abrupt('return', res.render('error', { response_message: _response_message2, response_code: _response_code2 }));

					case 24:
						_context4.next = 26;
						return _Payment2.default.findById({ _id: service.payment_id });

					case 26:
						payment = _context4.sent;

						if (!(payment == null)) {
							_context4.next = 33;
							break;
						}

						_response_code3 = 404;
						_response_message3 = 'RequestId is not Found';
						return _context4.abrupt('return', res.render('error', { response_message: _response_message3, response_code: _response_code3 }));

					case 33:
						if (!payment.payfort_token) {
							_context4.next = 39;
							break;
						}

						_response_code4 = '00066';
						_response_message4 = 'Merchant reference already exists';
						return _context4.abrupt('return', res.render('error', { response_message: _response_message4, response_code: _response_code4 }));

					case 39:
						res.render('index', { serviceId: data[1] });

					case 40:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function getCardDetails(_x8, _x9) {
		return _ref4.apply(this, arguments);
	};
}();

/**
 * @apiDescription  generate signautre for tokenization and merchant url
 * @param {*} req 
 * @param {*} res 
 */
var getpayfortTokenSignature = exports.getpayfortTokenSignature = function () {
	var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
		var passphrase, cardData, tokenObject;
		return _regenerator2.default.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						passphrase = _config2.default.PASSPHARSE;
						cardData = req.body;
						// generate signautre for tokenization

						tokenObject = {
							'service_command': 'TOKENIZATION',
							'access_code': _config2.default.ACCESS_CODE,
							'merchant_identifier': _config2.default.MERCHANT_IDENTIFIER,
							'merchant_reference': cardData.merchant_reference,
							'language': cardData.language
						};
						//create signature for merchant tokenaization process

						_context5.next = 5;
						return _payfortSignature2.default.create_signature(passphrase, tokenObject);

					case 5:
						cardData.signature = _context5.sent;
						return _context5.abrupt('return', res.json(cardData));

					case 7:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function getpayfortTokenSignature(_x10, _x11) {
		return _ref5.apply(this, arguments);
	};
}();

/**
 * @apiDescription  give response from payfort  and save into db
 * @param {*} req 
 * @param {*} res 
 */
var getPayfortMerchantUrl = exports.getPayfortMerchantUrl = function () {
	var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
		var token, serviceId, responseCode, payfortToken, tokenData, filter, update, savedPayfortResponse, paymentObj, passphrase, total_cost, signature3dUrlObj, token3dUrlObj, token3dUrl, _filter, _update, paymentObject, payment, updateService, _serviceId, service, serviceObject, providerDeviceId, sendToRole, providerParams, _filter2, _update2, _paymentObject, notSavedToken;

		return _regenerator2.default.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						token = req.body;
						serviceId = token.merchant_reference;
						responseCode = token.response_code;
						payfortToken = token.token_name;
						tokenData = token;
						_context6.t0 = responseCode;
						_context6.next = _context6.t0 === '18000' ? 8 : _context6.t0 === '14000' ? 27 : 50;
						break;

					case 8:
						filter = { service_id: serviceId };
						update = { payfort_token: payfortToken, payfort_response: tokenData };
						_context6.next = 12;
						return _Payment2.default.findOneAndUpdate(filter, update);

					case 12:
						savedPayfortResponse = _context6.sent;
						_context6.next = 15;
						return _Payment2.default.findById({ _id: savedPayfortResponse._id });

					case 15:
						paymentObj = _context6.sent;

						// get token and generate signature for 3durl
						passphrase = _config2.default.PASSPHARSE;
						// convert amount 

						total_cost = paymentObj.total_amount_paid * 100;
						signature3dUrlObj = {
							command: 'PURCHASE',
							access_code: paymentObj.payfort_response.access_code,
							merchant_identifier: paymentObj.payfort_response.merchant_identifier,
							merchant_reference: paymentObj.payfort_response.merchant_reference,
							amount: total_cost,
							currency: _config2.default.CURRENCY,
							language: paymentObj.payfort_response.language,
							customer_email: 'info@hameedservice.com',
							token_name: paymentObj.payfort_token
						};
						_context6.next = 21;
						return _payfortSignature2.default.create_signature(passphrase, signature3dUrlObj);

					case 21:
						signature3dUrlObj.signature = _context6.sent;
						_context6.next = 24;
						return _payfortSignature2.default.create_payfort_url(signature3dUrlObj);

					case 24:
						token3dUrlObj = _context6.sent;
						token3dUrl = token3dUrlObj['3ds_url'];
						return _context6.abrupt('return', res.set('location', token3dUrl).status(301).send());

					case 27:
						_filter = { service_id: token.merchant_reference };
						_update = { payfort_response: token, payment_status: true };
						_context6.next = 31;
						return _Payment2.default.findOneAndUpdate(_filter, _update);

					case 31:
						paymentObject = _context6.sent;
						_context6.next = 34;
						return _Payment2.default.findById({ _id: paymentObject._id });

					case 34:
						payment = _context6.sent;

						// update service progress status after card payment done
						updateService = { payment_id: paymentObject._id, progress: 'payment_done', payment_status: 'paid', progress_at: new Date() };
						_serviceId = { _id: payment.service_id };
						// const service = await Service.updateOne(serviceId, {
						// 	$set: {
						// 		payment_id: paymentObject._id, progress: 'payment_done', payment_status: 'paid', progress_at: new Date()
						// 	}
						// });

						_context6.next = 39;
						return _Service2.default.findOneAndUpdate(_serviceId, updateService);

					case 39:
						service = _context6.sent;
						_context6.next = 42;
						return _Service2.default.findOne({ _id: service._id, customer_id: service.customer_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);

					case 42:
						serviceObject = _context6.sent;
						providerDeviceId = serviceObject.service_provider_id.device_id;
						sendToRole = constants.SERVICE_PROVIDER;
						providerParams = {};

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
						_context6.next = 49;
						return (0, _pushNotification.sendPushNotification)([providerDeviceId], providerParams, sendToRole);

					case 49:
						return _context6.abrupt('return', res.render('success', {
							success: true
						}));

					case 50:
						_filter2 = { service_id: serviceId };
						_update2 = { payfort_response: token };
						_context6.next = 54;
						return _Payment2.default.findOneAndUpdate(_filter2, _update2);

					case 54:
						_paymentObject = _context6.sent;
						_context6.next = 57;
						return _Payment2.default.findById({ _id: _paymentObject._id });

					case 57:
						notSavedToken = _context6.sent;
						return _context6.abrupt('return', res.render('error', { response_message: notSavedToken.payfort_response.response_message, response_code: notSavedToken.payfort_response.response_code }));

					case 59:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, undefined);
	}));

	return function getPayfortMerchantUrl(_x12, _x13) {
		return _ref6.apply(this, arguments);
	};
}();

/**
 * @apiDescription  change  payment  by accepting service id
 * @param {*} req 
 * @param {*} res 
 */
var updatePaymentStatus = exports.updatePaymentStatus = function updatePaymentStatus(req, res) {
	_Payment2.default.findOne({
		service_id: req.body.service_id,
		'payfort_response.response_code': '14000'
	}, {
		_id: 1,
		service_id: 1,
		user_id: 1
	}, function () {
		var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(err, result) {
			var serviceObject;
			return _regenerator2.default.wrap(function _callee7$(_context7) {
				while (1) {
					switch (_context7.prev = _context7.next) {
						case 0:
							_context7.next = 2;
							return _Service2.default.findOne({ _id: req.body.service_id, customer_id: result.user_id }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);

						case 2:
							serviceObject = _context7.sent;

							if (result) {
								_Service2.default.updateOne({
									_id: result.service_id
								}, {
									$set: {
										payment_status: 'paid',
										payment_id: result._id,
										progress: 'payment_done',
										progress_at: new Date()
									}
								}, function (err, result) {
									(0, _formatResponse2.default)(res, serviceObject);
								});
							} else {
								(0, _formatResponse2.default)(res, serviceObject);
							}

						case 4:
						case 'end':
							return _context7.stop();
					}
				}
			}, _callee7, undefined);
		}));

		return function (_x14, _x15) {
			return _ref7.apply(this, arguments);
		};
	}());
};