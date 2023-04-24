'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRequest = exports.rejectNewServiceByUser = exports.addComplainResolution = exports.addComplainForService = exports.serviceProviderStatistics = exports.getServiceHistory = exports.deleteServiceByAdmin = exports.deleteSingleServiceByAdmin = exports.updateServiceRequestByAdmin = exports.serviceByIdForUser = exports.serviceListForUserByProgress = exports.serviceListForProviderByProgress = exports.serviceListForUser = exports.serviceByIdForProvider = exports.serviceListForProvider = exports.serviceByIdForAdmin = exports.serviceListForAdmin = exports.acceptOrRejectServiceQuoteByUser = exports.updateServiceRequestByProvider = exports.serviceProviderList = exports.add = exports.scheduler = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _ServiceHistory = require('../models/ServiceHistory');

var _ServiceHistory2 = _interopRequireDefault(_ServiceHistory);

var _ServiceActivity = require('../models/ServiceActivity');

var _ServiceActivity2 = _interopRequireDefault(_ServiceActivity);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _pushNotification = require('../handler/pushNotification');

var _Configuration = require('../models/Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

var _Review = require('../models/Review');

var _Review2 = _interopRequireDefault(_Review);

var _PromoCode = require('../models/PromoCode');

var _PromoCode2 = _interopRequireDefault(_PromoCode);

var _constants = require('../../src/handler/constants');

var constants = _interopRequireWildcard(_constants);

var _AWSService = require('./../handler/AWSService');

var uploadHelper = _interopRequireWildcard(_AWSService);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_IMAGE_SERVER_URL = _config2.default.IMAGE_SERVER_URL;

//import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

var scheduler = exports.scheduler = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var startOfDay, endOfDay, roleToSend, todays_pending_requests;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(); // 00:00AM

            endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString(); // 23:59PM

            roleToSend = constants.SERVICE_PROVIDER;
            _context3.next = 5;
            return _Service2.default.find({
              is_future_request_fired: false,
              schedule_at: { $gte: startOfDay, $lt: endOfDay }
            });

          case 5:
            todays_pending_requests = _context3.sent;

            if (todays_pending_requests && todays_pending_requests.length) {
              todays_pending_requests.map(function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(item) {
                  var payload;
                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          payload = {
                            notification: {
                              title: 'New Service Request',
                              body: 'Please update service request'
                            },
                            data: {
                              requestId: item._id,
                              status: 'new',
                              user: 'Service Provider',
                              targetScreen: 'MyRequests'
                            }
                          };


                          item.notified_providers.forEach(function () {
                            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(i) {
                              var users, deviceIds;
                              return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.next = 2;
                                      return _User2.default.findById(i);

                                    case 2:
                                      users = _context.sent;
                                      deviceIds = users.device_id;
                                      // if (getLanguage(users._id) !== 'en') {

                                      payload.notification = {
                                        title: 'طلب خدمة جديد',
                                        body: ' الرجاء تحديث حالة الطلب'
                                      };
                                      // }

                                      item.is_future_request_fired = true, item.save().then(function (success) {
                                        return (0, _pushNotification.sendPushNotificationToMultiple)([deviceIds], payload, roleToSend);
                                      }).catch(function (err) {
                                        return console.log('error on saving is_future_request_fired for serviceID: ' + item._id + ' with ' + err);
                                      });

                                    case 6:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, undefined);
                            }));

                            return function (_x2) {
                              return _ref3.apply(this, arguments);
                            };
                          }());

                        case 2:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function scheduler() {
    return _ref.apply(this, arguments);
  };
}();

// const getLanguage = async (req) => {
// 	const user = await User.findOne({ _id: req.user });
// 	return user.preferred_language;
// }
var add = exports.add = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var _req$body, latitude, longitude, userId, promoId, categoryId, providers, roleToSend, error, code, _error, date, createdRequest, serviceActivityData, deviceIds, notificationBody, payload;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body = req.body, latitude = _req$body.latitude, longitude = _req$body.longitude;
            userId = req.user;

            // const userId = 'ZXXW9Ikwa';
            // const preferredLanguage = getLanguage(req);

            promoId = req.body.promo;
            categoryId = req.body.category_id;

            req.body.customer_id = userId;

            _context5.next = 7;
            return findServiceProviders(latitude, longitude, categoryId);

          case 7:
            providers = _context5.sent;
            roleToSend = constants.SERVICE_PROVIDER;

            if (providers.length) {
              _context5.next = 14;
              break;
            }

            error = new Error('Service providers not available in your area!');

            error.ar_message = 'مزودي الخدمة غير متوفرين في منطقتك!';
            error.name = 'DataNotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 14:
            if (!promoId) {
              _context5.next = 28;
              break;
            }

            _context5.next = 17;
            return _PromoCode2.default.findById(promoId);

          case 17:
            code = _context5.sent;

            console.log('prpo code :', code);

            if (code) {
              _context5.next = 24;
              break;
            }

            _error = new Error('Invalid Promo-code!');

            _error.ar_message = 'الرمز الترويجي غير صالح!';
            _error.name = 'DataNotFound';
            return _context5.abrupt('return', (0, _formatResponse2.default)(res, _error));

          case 24:
            req.body.promocode_id = code._id;
            req.body.isPromoApplied = true;
            req.body.promo_amount = code.amount;
            req.body.promo_percentage = code.percentage;

          case 28:
            date = req.body.request_date;

            req.body.schedule_at = date ? (0, _moment2.default)('' + date) : (0, _moment2.default)();
            if (req.body.schedule_at) {
              if (new Date(req.body.schedule_at) > new Date()) req.body.progress = 'queue';
            }
            if (req.body.request_date) {
              req.body.is_future_request_fired = false;
            }
            console.log(req.body);
            _context5.next = 35;
            return _Service2.default.create(req.body);

          case 35:
            createdRequest = _context5.sent;
            serviceActivityData = providers.map(function (provider) {
              if (provider) {
                return {
                  service_id: createdRequest._id,
                  category_id: req.body.category_id,
                  sub_category_id: req.body.sub_category_id,
                  customer_id: userId,
                  service_provider_id: provider._id,
                  progress: 'assigned'
                };
              }
            });
            _context5.next = 39;
            return _ServiceActivity2.default.insertMany(serviceActivityData);

          case 39:
            deviceIds = providers ? providers.map(function (provider) {
              return provider.device_id;
            }) : '';
            _context5.next = 42;
            return providers.map(function (provider) {
              return createdRequest.notified_providers.push(provider._id);
            });

          case 42:

            deviceIds = deviceIds.filter(function (e) {
              return e;
            });

            notificationBody = {};
            payload = {
              notification: notificationBody,
              data: {
                requestId: createdRequest._id,
                status: 'new',
                user: 'Service Provider',
                targetScreen: 'MyRequests'
              }
            };
            _context5.next = 47;
            return createdRequest.save();

          case 47:
            if (createdRequest.progress == 'new') {
              deviceIds.forEach(function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id) {
                  var serviceProvider, preferredLanguage;
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return _User2.default.findOne({ device_id: id });

                        case 2:
                          serviceProvider = _context4.sent;
                          preferredLanguage = serviceProvider.preferred_language;

                          if (preferredLanguage === 'en') {
                            payload.notification = {
                              title: 'New Service Request',
                              body: 'Please update service request'
                            };
                          } else {
                            payload.notification = {
                              title: 'طلب خدمة جديد',
                              body: ' الرجاء تحديث حالة الطلب'
                            };
                          }
                          (0, _pushNotification.sendPushNotification)([id], payload, roleToSend);

                        case 6:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, undefined);
                }));

                return function (_x5) {
                  return _ref5.apply(this, arguments);
                };
              }());
              // await sendPushNotification([id], payload, roleToSend);
              // sendPushNotificationToMultiple(deviceIds, payload, roleToSend);
            }

            // For now only admin history maintained
            /* const history = new ServiceHistory({
            		service_id: createdRequest._id,
            		operation: operationConfig.operations.add,
            		operator: userId,
            		prevObj: null,
            		updatedObj: createdRequest,
            		operation_date: new Date()
            	});
            	await history.save(); */
            (0, _formatResponse2.default)(res, createdRequest);

          case 49:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function add(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var findServiceProviders = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(latitude, longitude, categoryId) {
    var foundRole, defaultRadiusDistance, range;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _Role2.default.findOne({
              name: 'service_provider',
              isDeleted: false
            });

          case 2:
            foundRole = _context6.sent;

            if (foundRole) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt('return', []);

          case 5:
            _context6.next = 7;
            return _Configuration2.default.findOne();

          case 7:
            defaultRadiusDistance = _context6.sent;
            range = defaultRadiusDistance.range;
            return _context6.abrupt('return', _User2.default.find({
              role: { $in: foundRole._id },
              category_id: { $in: categoryId },
              'addresses.location': {
                $near: {
                  $geometry: {
                    type: 'Point',
                    //coordinates: [longitude, latitude]
                    coordinates: [latitude, longitude]
                  },
                  $maxDistance: range
                }
              }
            }));

          case 10:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function findServiceProviders(_x6, _x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

var serviceProviderList = exports.serviceProviderList = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
    var latitude, longitude, foundRole, defaultRadiusDistance, range, serviceProviders;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            latitude = req.query.latitude;
            longitude = req.query.longitude;
            _context7.next = 4;
            return _Role2.default.findOne({
              name: 'service_provider',
              isDeleted: false
            });

          case 4:
            foundRole = _context7.sent;

            if (foundRole) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', []);

          case 7:
            _context7.next = 9;
            return _Configuration2.default.findOne();

          case 9:
            defaultRadiusDistance = _context7.sent;
            range = defaultRadiusDistance.range;
            _context7.next = 13;
            return _User2.default.find({
              role: { $in: foundRole._id },
              'addresses.location': {
                $near: {
                  $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                  },
                  $maxDistance: range
                }
              }
            }).lean();

          case 13:
            serviceProviders = _context7.sent;

            (0, _formatResponse2.default)(res, serviceProviders);

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function serviceProviderList(_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * API for Provider to update the NEW request from the customer
 * @param {*} req
 * @param {*} res
 */
//sp
var updateServiceRequestByProvider = exports.updateServiceRequestByProvider = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(req, res) {
    var userId, new_array, requestId, service, sendToRole, error, _error2, _error3, date, prevObj, _error4, _error5, total, service_cost, _new_array, updated_service, new_service_acitivity, userDeviceId, provider, loggedInProvider, serviceProviderDeviceId, payload, notified_providers_devices, review, notified_providers, payloads, customer, language, _customer, _language, _customer2, _language2, _customer3, _language3, _customer4, _language4, _customer5, _language5, _customer6, _language6, _customer7, _language7, _customer8, _language8, _customer9, _language9;

    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userId = req.user;
            // const language = getLanguage(userId);

            new_array = [];
            requestId = req.params.id;
            _context11.next = 5;
            return _Service2.default.findById(requestId).populate('service_provider_id', ['device_id']).populate('customer_id', ['device_id']);

          case 5:
            service = _context11.sent;
            sendToRole = constants.CUSTOMER;

            if (service) {
              _context11.next = 13;
              break;
            }

            error = new Error();

            error.name = 'DataNotFound';
            error.message = 'Service request not found!';
            error.ar_message = 'طلب خدمة غير موجود';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 13:
            if (!(service.reschedule_at && req.body.progress === 'rescheduled')) {
              _context11.next = 19;
              break;
            }

            _error2 = new Error();

            _error2.name = 'CantProceed';
            _error2.message = 'Cant reschedule any more!';
            _error2.ar_message = 'لا يمكن إعادة جدولة أي أكثر';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, _error2));

          case 19:
            if (!(req.body.progress === 'accepted' && service.progress !== 'new' && service.progress !== 'queue')) {
              _context11.next = 25;
              break;
            }

            _error3 = new Error();

            _error3.name = 'dataExist';
            _error3.message = 'Service request already accepted!';
            _error3.ar_message = 'طلب الخدمة قبلت بالفعل';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, _error3));

          case 25:
            date = req.body.reschedule_at;

            if (date) {
              req.body.reschedule_at = (0, _moment2.default)(date).format('MM/DD/YYYY h:mm a');
            }

            // Rejecting a request will make the user as uninterested, hence, wont list into his tasks any further

            if (!(req.body.progress === 'rejected' && service.progress === 'new')) {
              _context11.next = 31;
              break;
            }

            _context11.next = 30;
            return _Service2.default.update({ _id: requestId }, { $pull: { notified_providers: userId } });

          case 30:
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, {}));

          case 31:
            prevObj = service.toObject();

            if (!prevObj.hasOwnProperty('respond_at')) {
              req.body.respond_at = new Date();
            }
            req.body.service_provider_id = userId;
            req.body.progress_at = new Date();

            // provider cancels his started journey

            if (!(req.body.progress === 'journey_cancelled' && !req.body.cancel_comment)) {
              _context11.next = 41;
              break;
            }

            _error4 = new Error();

            _error4.name = 'DataNotFound';
            _error4.message = 'Cancellation Reason missing';
            _error4.ar_message = 'سبب الإلغاء مفقود';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, _error4));

          case 41:
            if (req.body.progress === 'journey_cancelled' && req.body.cancel_comment) {
              req.body.cancellation_commment_by_provider = req.body.cancel_comment;
            }

            if (!(req.body.progress === 'paid' && service.progress !== 'payment_done' && service.progress !== 'customer_review')) {
              _context11.next = 48;
              break;
            }

            _error5 = new Error();

            _error5.name = 'ValidationError';
            _error5.message = 'Not available';
            _error5.ar_message = 'غير متوفر';
            return _context11.abrupt('return', (0, _formatResponse2.default)(res, _error5));

          case 48:
            if (req.body.progress === 'paid' && (service.progress === 'payment_done' || service.progress === 'customer_review')) {
              req.body.payment_status = 'paid';
            }
            if (req.body.quote && req.body.quote.length) {
              total = 0;

              req.body.quote.map(function (quote) {
                total = total + Number(quote.cost);
              });
              service_cost = req.body.service_cost ? req.body.service_cost : 0;
              // Calculating the "total_service_charge" => Quotes + provider's service_cost

              req.body.total_service_charge = total + Number(service_cost);
            }
            if (req.body.progress === 'task_done') {
              new_array = service.media.filter(function (item) {
                return item.type != 'after';
              });
              (_new_array = new_array).push.apply(_new_array, (0, _toConsumableArray3.default)(req.body.media));
              service.progress = 'task_done';
              service.media = new_array;
            } else {
              service.set(req.body);
            }
            _context11.next = 53;
            return service.save();

          case 53:
            updated_service = _context11.sent;
            _context11.next = 56;
            return _ServiceActivity2.default.create({
              service_id: service._id,
              category_id: service.category_id,
              sub_category_id: service.sub_category_id,
              customer_id: service.customer_id,
              service_provider_id: userId,
              progress: req.body.progress
            });

          case 56:
            new_service_acitivity = _context11.sent;


            _promise2.default.all([updated_service, new_service_acitivity]);

            userDeviceId = updated_service && updated_service.customer_id && updated_service.customer_id.device_id ? updated_service.customer_id.device_id : null;
            provider = updated_service.service_provider_id._id ? updated_service.service_provider_id._id : updated_service.service_provider_id;
            _context11.next = 62;
            return _User2.default.findById(provider);

          case 62:
            loggedInProvider = _context11.sent;
            serviceProviderDeviceId = loggedInProvider && loggedInProvider.device_id;
            payload = {}, notified_providers_devices = [];

            if (!(req.body.progress === 'accepted')) {
              _context11.next = 77;
              break;
            }

            review = new _Review2.default({
              service_id: service._id,
              user_id: service.customer_id,
              service_provider_id: userId
            });
            _context11.next = 69;
            return review.save();

          case 69:
            notified_providers = updated_service.notified_providers;
            _context11.next = 72;
            return _promise2.default.all(notified_providers.map(function () {
              var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(item) {
                var devices;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return _User2.default.findById(item);

                      case 2:
                        devices = _context8.sent;

                        if (devices && devices.device_id && devices.device_id !== '') {
                          notified_providers_devices.push(devices.device_id);
                        }

                      case 4:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, undefined);
              }));

              return function (_x13) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 72:
            if (serviceProviderDeviceId && notified_providers_devices.length > 0) {
              notified_providers_devices = notified_providers_devices.filter(function (i) {
                return i !== serviceProviderDeviceId;
              });
            }
            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '1',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };
            payloads = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '2',
                user: 'Service Provider',
                targetScreen: 'RequestStatus'
              }
            };


            if (userDeviceId) {
              [userDeviceId].forEach(function () {
                var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(deviceid) {
                  var cust, language;
                  return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          _context9.next = 2;
                          return _Customer2.default.findOne({ device_id: deviceid });

                        case 2:
                          cust = _context9.sent;
                          language = cust.preferred_language;


                          payload.notification = {
                            title: language === 'en' ? 'Congrats!' : 'تهانينا',
                            body: language === 'en' ? 'Your Service Request for ' + service.description + ' is Accepted!' : ' \u062A\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0629 \u0644 ' + service.description
                          };
                          console.log([deviceid]);
                          console.log(payload);
                          console.log(sendToRole);
                          _context9.next = 10;
                          return (0, _pushNotification.sendPushNotification)([deviceid], payload, sendToRole);

                        case 10:
                        case 'end':
                          return _context9.stop();
                      }
                    }
                  }, _callee9, undefined);
                }));

                return function (_x14) {
                  return _ref10.apply(this, arguments);
                };
              }() // sending confirmation notification to the Request-creating User
              );
            }
            notified_providers_devices.forEach(function () {
              var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(device) {
                var user, language;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return _User2.default.findOne({
                          device_id: device
                        });

                      case 2:
                        user = _context10.sent;
                        language = user.preferred_language;

                        payloads.notification = {
                          title: language === 'en' ? 'Assigned' : 'تحويل',
                          body: language === 'en' ? updated_service.description + ' Assigned to other Service Provider' : '\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0637\u0644\u0628 \u0627\u0644\u0649 \u0641\u0646\u064A \u0627\u062E\u0631 - ' + updated_service.description
                        };
                        _context10.next = 7;
                        return (0, _pushNotification.sendPushNotification)([device], payloads, 'service_provider');

                      case 7:
                      case 'end':
                        return _context10.stop();
                    }
                  }
                }, _callee10, undefined);
              }));

              return function (_x15) {
                return _ref11.apply(this, arguments);
              };
            }() // sending SERVICE confirmation notification to the remaining Providers
            );
            // await sendPushNotificationToMultiple(notified_providers_devices, payloads, 'service_provider'); // sending SERVICE confirmation notification to the remaining Providers

          case 77:
            if (!(req.body.progress === 'quote_provided')) {
              _context11.next = 87;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '4',
                user: 'User',
                targetScreen: 'QuoteDetails'
              }
            };

            if (!userDeviceId) {
              _context11.next = 87;
              break;
            }

            _context11.next = 82;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 82:
            customer = _context11.sent;
            language = customer.preferred_language;


            payload.notification = {
              title: language == 'en' ? 'Congrats!' : 'تهانينا',
              body: language == 'en' ? 'Service Provider has provided a Quote on ' + updated_service.description : ' ' + updated_service.description + ' \u0642\u0627\u0645 \u0627\u0644\u0641\u0646\u064A \u0628\u0627\u0631\u0633\u0627\u0644 \u0639\u0631\u0636 \u0627\u0644\u0633\u0639\u0631'
            };
            _context11.next = 87;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 87:
            if (!(req.body.progress === 'reschedule_inprogress')) {
              _context11.next = 97;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '11',
                user: 'User',
                targetScreen: 'QuoteDetails'
              }
            };

            if (!userDeviceId) {
              _context11.next = 97;
              break;
            }

            _context11.next = 92;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 92:
            _customer = _context11.sent;
            _language = _customer.preferred_language;

            payload.notification = {
              title: _language === 'en' ? 'Congrats!' : 'تهانينا',
              body: _language === 'en' ? 'Service Provider started working on ' + updated_service.description : updated_service.description + ' \u064A\u0642\u0648\u0645 \u0627\u0644\u0641\u0646\u064A \u0628\u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u064A \u0627\u0644\u0637\u0644\u0628'
            };
            _context11.next = 97;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 97:
            if (!(req.body.progress === 'leave_for_the_job')) {
              _context11.next = 107;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '5',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 107;
              break;
            }

            _context11.next = 102;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 102:
            _customer2 = _context11.sent;
            _language2 = _customer2.preferred_language;


            payload.notification = {
              title: _language2 === 'en' ? 'Congrats!' : 'تهانينا',
              body: _language2 === 'en' ? 'Service Provider On the Way' : ' الفني في طريقه الى الموقع'
            };
            _context11.next = 107;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 107:
            if (!(req.body.progress === 'location_reached')) {
              _context11.next = 117;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '9',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 117;
              break;
            }

            _context11.next = 112;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 112:
            _customer3 = _context11.sent;
            _language3 = _customer3.preferred_language;

            payload.notification = {
              title: _language3 === 'en' ? 'Service Provider reached your location' : 'وصل الفني للموقع',
              body: _language3 === 'en' ? 'Please grant him access to fix your issue.' : ' الرجاء السماح له بالدخول وفحص المشكلة'
            };
            _context11.next = 117;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 117:
            if (!(req.body.progress === 'task_done')) {
              _context11.next = 127;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '6',
                user: 'User',
                targetScreen: 'TaskDetails'
              }
            };

            if (!userDeviceId) {
              _context11.next = 127;
              break;
            }

            _context11.next = 122;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 122:
            _customer4 = _context11.sent;
            _language4 = _customer4.preferred_language;

            payload.notification = {
              title: _language4 === 'en' ? 'Congrats!' : 'تهانينا',
              body: _language4 === 'en' ? 'Service Request Completed' : ' تم انجاز الطلب'
            };
            _context11.next = 127;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 127:
            if (!(req.body.progress === 'paid')) {
              _context11.next = 137;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '11',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 137;
              break;
            }

            _context11.next = 132;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 132:
            _customer5 = _context11.sent;
            _language5 = _customer5.preferred_language;

            payload.notification = {
              title: _language5 === 'en' ? 'Greetings' : 'شكرا لك',
              body: _language5 === 'en' ? 'Thanks for the payment!' : 'تم استلام المبلغ'
            };
            _context11.next = 137;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 137:
            if (!(req.body.progress === 'rescheduled')) {
              _context11.next = 150;
              break;
            }

            // this status comes into schenario after the Quote acception from the customer
            service.set(req.body);
            _context11.next = 141;
            return service.save();

          case 141:
            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '7',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 150;
              break;
            }

            _context11.next = 145;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 145:
            _customer6 = _context11.sent;
            _language6 = _customer6.preferred_language;

            payload.notification = {
              title: _language6 === 'en' ? 'Rescheduled!' : 'إعادة جدولة',
              body: _language6 === 'en' ? 'Your Service for ' + service.description + ' has been rescheduled for ' + _moment2.default.utc(service.reschedule_at).format('dddd, MMMM Do YYYY, h:mm A') : '\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u062C\u062F\u0648\u0644\u0629 \u062E\u062F\u0645\u062A\u0643 \u0644\u0640 ' + service.description + ' \u0628\u062A\u0627\u0631\u064A\u062E ' + _moment2.default.utc(service.reschedule_at).format('dddd, MMMM Do YYYY, h:mm A')
            };
            _context11.next = 150;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 150:
            if (!(req.body.progress === 'no_response')) {
              _context11.next = 160;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '8',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 160;
              break;
            }

            _context11.next = 155;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 155:
            _customer7 = _context11.sent;
            _language7 = _customer7.preferred_language;

            payload.notification = {
              title: _language7 === 'en' ? 'Alert on service: ' + updated_service.description : updated_service.description + ': \u062A\u0646\u0628\u064A\u0647 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0629',
              body: _language7 === 'en' ? 'Provider returned as we are not getting any response from your end. You will need to raise a new request again.' : '  الفني يعالج حالة طارئة سيتم التحديث في اقرب وقت'
            };
            _context11.next = 160;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 160:
            if (!(req.body.progress === 'journey_cancelled')) {
              _context11.next = 170;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '10',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 170;
              break;
            }

            _context11.next = 165;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 165:
            _customer8 = _context11.sent;
            _language8 = _customer8.preferred_language;

            payload.notification = {
              title: _language8 === 'en' ? 'Sorry' : 'نأسف',
              body: _language8 === 'en' ? 'Provider got stuck in some emergency, will soon update the proceedings' : '  الفني يعالج حالة طارئة سيتم التحديث في اقرب وقت'
            };
            _context11.next = 170;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 170:
            if (!(req.body.progress === 'rejected')) {
              _context11.next = 180;
              break;
            }

            payload = {
              data: {
                requestId: service._id,
                status: req.body.progress,
                flag: '3',
                user: 'User',
                targetScreen: 'RequestStatus'
              }
            };

            if (!userDeviceId) {
              _context11.next = 180;
              break;
            }

            _context11.next = 175;
            return _Customer2.default.findOne({ device_id: userDeviceId });

          case 175:
            _customer9 = _context11.sent;
            _language9 = _customer9.preferred_language;

            payload.notification = {
              title: _language9 === 'en' ? 'Sorry!' : ' نأسف',
              body: _language9 === 'en' ? 'Your Service Request has been rejected' : 'تم رفض طلب الخدمة '
            };
            _context11.next = 180;
            return (0, _pushNotification.sendPushNotification)([userDeviceId], payload, sendToRole);

          case 180:
            // For now only admin history maintained
            /* const history = new ServiceHistory({
            service_id: updated_service._id,
            operation: operationConfig.operations.update,
            operator: userId,
            prevObj: prevObj,
            updatedObj: updated_service,
            operation_date: new Date()
            }); */
            //await history.save();
            (0, _formatResponse2.default)(res, updated_service);

          case 181:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }));

  return function updateServiceRequestByProvider(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * API for Customer to accept/reject the recieved Qoute from the Provider
 * @param {*} req
 * @param {*} res
 */
//one consumer
var acceptOrRejectServiceQuoteByUser = exports.acceptOrRejectServiceQuoteByUser = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(req, res) {
    var userId, user, requestId, service, sendToRole, error, total_percentage_value, updated_service, providerDeviceId, providerParams, serviceProvider, _user, notificationBody, _providerParams, _serviceProvider, language, _serviceProvider2, _language10;

    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            userId = req.user;
            user = _User2.default.findOne({ _id: userId });
            requestId = req.params.id;
            _context12.next = 5;
            return _Service2.default.findOne({ _id: requestId, customer_id: userId }).populate('customer_id', ['device_id']).populate('service_provider_id', ['device_id']);

          case 5:
            service = _context12.sent;
            sendToRole = constants.SERVICE_PROVIDER;

            if (service) {
              _context12.next = 12;
              break;
            }

            error = new Error('Service request not found!');

            error.ar_message = 'طلب الخدمة غير موجود!';
            error.name = 'DataNotFound';
            return _context12.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 12:
            total_percentage_value = service.promo_amount ? service.promo_amount : service.total_service_charge / 100 * service.promo_percentage;

            service.set({
              progress: req.body.progress,
              progress_at: new Date(),
              promo_amount: total_percentage_value,
              quote_rejection_comment_by_user: req.body.reason ? req.body.reason : ''
            });
            _context12.next = 16;
            return service.save();

          case 16:
            updated_service = _context12.sent;
            providerDeviceId = updated_service.service_provider_id.device_id;
            providerParams = {};

            if (!(req.body.progress === 'quote_accepted')) {
              _context12.next = 29;
              break;
            }

            _context12.next = 22;
            return _User2.default.findOne({ device_id: providerDeviceId });

          case 22:
            serviceProvider = _context12.sent;
            _user = serviceProvider;
            notificationBody = {};

            if (_user.preferred_language === 'en') {
              notificationBody = {
                title: 'Congrats!',
                body: 'Customer Has Accepted Your Quote'
              };
            } else {
              notificationBody = {
                title: ' تهانينا',
                body: ' العميل قبل عرض السعر'
              };
            }
            _providerParams = {
              notification: notificationBody,
              data: {
                requestId: service._id,
                status: 'quote_accepted',
                user: 'Service Provider',
                targetScreen: 'RequestStatus'
              }
            };
            _context12.next = 29;
            return (0, _pushNotification.sendPushNotification)([providerDeviceId], _providerParams, sendToRole);

          case 29:
            if (!(req.body.progress === 'payment_done')) {
              _context12.next = 37;
              break;
            }

            _context12.next = 32;
            return _User2.default.findOne({ device_id: providerDeviceId });

          case 32:
            _serviceProvider = _context12.sent;
            language = _serviceProvider.preferred_language;

            providerParams = {
              data: {
                service_id: service._id,
                status: req.body.progress,
                user: 'Service Provider',
                targetScreen: 'RequestStatus'
              },
              notification: {
                title: language == 'en' ? 'Congrats!' : ' تهانينا',
                body: language == 'en' ? 'Payment Done by Customer' : 'الدفع عن طريق العميل'
              }
            };
            _context12.next = 37;
            return (0, _pushNotification.sendPushNotification)([providerDeviceId], providerParams, sendToRole);

          case 37:
            if (!(req.body.progress === 'quote_rejected')) {
              _context12.next = 45;
              break;
            }

            _context12.next = 40;
            return _User2.default.findOne({ device_id: providerDeviceId });

          case 40:
            _serviceProvider2 = _context12.sent;
            _language10 = _serviceProvider2.preferred_language;

            providerParams = {
              data: {
                service_id: service._id,
                status: req.body.progress,
                user: 'Service Provider',
                targetScreen: 'RequestStatus'
              },
              notification: {
                title: _language10 == 'en' ? 'Oops!' : 'وجه الفتاة!',
                body: _language10 == 'en' ? 'Customer has rejected your Qoute' : 'رفض العميل عرض أسعارك'
              }
            };
            // await firebaseNotificationToProviderApp(providerParams);
            _context12.next = 45;
            return (0, _pushNotification.sendPushNotification)([providerDeviceId], providerParams, sendToRole);

          case 45:

            // For now only admin history maintained
            /* const history = new ServiceHistory({
            service_id: updated_service._id,
            operation: operationConfig.operations.update,
            operator: userId,
            prevObj: prevObj,
            updatedObj: updated_service,
            operation_date: new Date()
            }); */
            //await history.save();
            (0, _formatResponse2.default)(res, updated_service);

          case 46:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  }));

  return function acceptOrRejectServiceQuoteByUser(_x16, _x17) {
    return _ref12.apply(this, arguments);
  };
}();

var serviceListForAdmin = exports.serviceListForAdmin = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(req, res) {
    var items, page, skip, limit, searchParams, count, services, data;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            items = req.query.items ? req.query.items : 10;
            page = req.query.page ? req.query.page : 1;
            skip = items * (page - 1);
            limit = parseInt(items);
            searchParams = {
              progress: { $ne: 'cancel' }
            };
            _context13.next = 7;
            return _Service2.default.find(searchParams).countDocuments();

          case 7:
            count = _context13.sent;
            _context13.next = 10;
            return _Service2.default.find(searchParams).sort({ updated_at: 'desc' }).populate('category_id').populate('sub_category_id').populate('customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('payment_id').populate('review_id').skip(skip).limit(limit).lean();

          case 10:
            services = _context13.sent;


            if (services.length) {
              services.map(function (service) {
                if (service && service.media && service.media.length) {
                  service.media.map(function (image) {
                    image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                  });
                }
              });
            }
            data = {
              total: count,
              pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
              result: services
            };


            (0, _formatResponse2.default)(res, data);

          case 14:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  }));

  return function serviceListForAdmin(_x18, _x19) {
    return _ref13.apply(this, arguments);
  };
}();

var serviceByIdForAdmin = exports.serviceByIdForAdmin = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(req, res) {
    var service_id, searchParams, service;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            service_id = req.params.id;
            searchParams = {
              _id: service_id
              //progress: { $ne: 'cancel' },
            };
            _context14.next = 4;
            return _Service2.default.findOne(searchParams).populate('category_id').populate('customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('sub_category_id').populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('payment_id').populate('review_id').lean();

          case 4:
            service = _context14.sent;

            if (service) {
              service.media.map(function (image) {
                image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
              });
            }
            (0, _formatResponse2.default)(res, service ? service : {});

          case 7:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }));

  return function serviceByIdForAdmin(_x20, _x21) {
    return _ref14.apply(this, arguments);
  };
}();

/**
 * API to get whole list of services as per the query param
 * @param {*} req
 * @param {*} res
 */
var serviceListForProvider = exports.serviceListForProvider = function () {
  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(req, res) {
    var progress, searchParams, services;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            // const userId = req.user;

            progress = req.query.progress;
            // const searchParams = { service_provider_id: userId };

            searchParams = {};

            if (progress) {
              searchParams.progress = progress;
            }
            _context15.next = 5;
            return _Service2.default.find(searchParams).populate('category_id').populate('sub_category_id').populate('customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('payment_id').populate('review_id').lean();

          case 5:
            services = _context15.sent;


            if (services.length) {
              services.map(function (service) {
                if (service && service.media && service.media.length) {
                  service.media.map(function (image) {
                    image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                  });
                }
              });
            }
            (0, _formatResponse2.default)(res, services);

          case 8:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  }));

  return function serviceListForProvider(_x22, _x23) {
    return _ref15.apply(this, arguments);
  };
}();

var serviceByIdForProvider = exports.serviceByIdForProvider = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(req, res) {
    var error, id, service;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            if (req.params.id) {
              _context16.next = 5;
              break;
            }

            error = new Error('Service not found!');

            error.ar_message = 'الخدمة غير موجودة!';
            error.name = 'DataNotFound';
            return _context16.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 5:
            id = req.params.id;
            _context16.next = 8;
            return _Service2.default.findById(id).populate('category_id').populate('sub_category_id').populate('customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('payment_id').populate('review_id').lean();

          case 8:
            service = _context16.sent;


            if (service && service.media && service.media.length) {
              service.media.map(function (image) {
                if (image) {
                  image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                }
              });
            }
            (0, _formatResponse2.default)(res, service ? service : {});

          case 11:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  }));

  return function serviceByIdForProvider(_x24, _x25) {
    return _ref16.apply(this, arguments);
  };
}();

/**
 * Consumer API to get whole list of services including cancelled ones
 * @param {*} req
 * @param {*} res
 */
var serviceListForUser = exports.serviceListForUser = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(req, res) {
    var userId, searchParams, services;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            userId = req.user;
            searchParams = {
              customer_id: userId
            };
            _context17.next = 4;
            return _Service2.default.find(searchParams).sort({ created_at: 'DESC' }).populate('category_id').populate('sub_category_id').populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('review_id').lean();

          case 4:
            services = _context17.sent;

            if (services && services.length) {
              services.map(function (service) {
                service.media.map(function (image) {
                  image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                });
                service.quote.map(function (service) {
                  totalAmount += parseInt(service.cost, 10);
                });
                var totalAmount = 0;
                var vatTotal = totalAmount + service.total_service_charge * 0.15;
                service = (0, _assign2.default)(service, { vatTotal: vatTotal });
                service.total_service_charge += vatTotal;
                service.total_service_charge = service.total_service_charge;
                return service;
              });
              // console.log(services)
            }
            (0, _formatResponse2.default)(res, services);

          case 7:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  }));

  return function serviceListForUser(_x26, _x27) {
    return _ref17.apply(this, arguments);
  };
}();

/**
 * Service provider's requests in different schenario
 * @param {*} req
 * @param {*} res
 */
var serviceListForProviderByProgress = exports.serviceListForProviderByProgress = function () {
  var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(req, res) {
    var userId, searchParams, services, new_req, ongoing, completed, allRequests, new_services, request_later_services, merging, all, myComparator, sorted, data;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            myComparator = function myComparator(a, b) {
              return b.created_at - a.created_at;
            };

            userId = req.user;
            searchParams = {
              progress: { $nin: ['rejected', 'no_response'] }
            };
            _context18.next = 5;
            return _Service2.default.find({
              $and: [{ service_provider_id: userId }, searchParams]
            }).populate('category_id').populate('sub_category_id').populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('review_id').sort({ created_at: 'desc' }).lean();

          case 5:
            services = _context18.sent;

            console.log('services : ', services);
            new_req = [], ongoing = [], completed = [], allRequests = [];

            if (services && services.length) {
              services.map(function (service) {
                if (service && service.media && service.media.length) {
                  service.media.map(function (image) {
                    image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                  });
                }
                if (service.quote.length) {
                  var total = 0;
                  service.quote.map(function (quote) {
                    total = total + Number(quote.cost);
                  });
                  var service_cost = service.service_cost ? service.service_cost : 0;
                  service.total_service_charge = total + Number(service_cost);
                }
                allRequests.push(service);
                if (service.progress === 'quote_provided' || service.progress === 'quote_accepted' || service.progress === 'quote_rejected' || service.progress === 'leave_for_the_job' || service.progress === 'ongoing' || service.progress === 'task_done' || service.progress === 'rescheduled' || service.progress == 'journey_cancelled') {
                  ongoing.push(service);
                }
                if (service.progress === 'payment_done' || service.progress === 'customer_review' || service.progress === 'provider_review') {
                  completed.push(service);
                }
              });
            }

            // Services which are still not assigned or taken by any provider
            _context18.next = 11;
            return _Service2.default.find({
              $and: [{ progress: { $in: ['new'] } }, { service_provider_id: { $exists: false } }, { notified_providers: { $in: [userId] } }]
            }).populate('category_id').populate('sub_category_id').sort({ created_at: 'desc' }).lean();

          case 11:
            new_services = _context18.sent;


            if (new_services && new_services.length) {
              new_services.map(function (item) {
                if (item) {
                  if (item && item.media && item.media.length) {
                    item.media.map(function (image) {
                      image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                    });
                  }
                  new_req.push(item);
                }
              });
            }

            _context18.next = 15;
            return _Service2.default.find({
              $and: [{ progress: { $in: ['queue'] } }, { service_provider_id: { $exists: false } }, { notified_providers: { $in: [userId] } }]
            }).populate('category_id').populate('sub_category_id').sort({ created_at: 'desc' }).lean();

          case 15:
            request_later_services = _context18.sent;


            if (request_later_services && request_later_services.length) {
              request_later_services.map(function (item) {
                var scheduled_day_five_am = (0, _moment2.default)(item.schedule_at).utcOffset(0);
                scheduled_day_five_am.set({
                  hour: 0,
                  minute: 0,
                  second: 0,
                  millisecond: 0
                });
                scheduled_day_five_am.add(5, 'hours');
                var current_time = (0, _moment2.default)(new Date());
                if (item && (0, _moment2.default)(current_time).isSameOrAfter(scheduled_day_five_am)) {
                  item.progress = 'new';
                  if (item && item.media && item.media.length) {
                    item.media.map(function (image) {
                      image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                    });
                  }
                  new_req.push(item);
                }
              });
            }
            merging = allRequests.concat(new_req);
            all = merging.filter(function (item, pos) {
              return merging.indexOf(item) === pos;
            });
            sorted = all.sort(myComparator);
            data = { all: sorted, new_req: new_req, ongoing: ongoing, completed: completed };


            (0, _formatResponse2.default)(res, data);

          case 22:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  }));

  return function serviceListForProviderByProgress(_x28, _x29) {
    return _ref18.apply(this, arguments);
  };
}();

var serviceListForUserByProgress = exports.serviceListForUserByProgress = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(req, res) {
    var userId, searchParams, services, new_req, accepted, quote_provided, quote_accepted, quote_rejected, leave_for_the_job, ongoing, task_done, payment_done, review, rescheduled, data;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            userId = req.user;
            //TODO : optimise query

            searchParams = {
              customer_id: userId,
              progress: { $ne: 'cancel' }
            };
            _context19.next = 4;
            return _Service2.default.find(searchParams).populate('category_id').populate('sub_category_id').populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('review_id').sort({ created_at: 'desc' }).lean();

          case 4:
            services = _context19.sent;
            new_req = [], accepted = [], quote_provided = [], quote_accepted = [], quote_rejected = [], leave_for_the_job = [], ongoing = [], task_done = [], payment_done = [], review = [], rescheduled = [];


            if (services && services.length) {
              services.map(function (service) {
                if (service && service.media && service.media.length) {
                  service.media.map(function (image) {
                    image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                  });
                }
                if (service.quote.length) {
                  var total = 0;
                  service.quote.map(function (quote) {
                    total = total + Number(quote.cost);
                  });
                  var service_cost = service.service_cost ? service.service_cost : 0;
                  service.total_service_charge = total + Number(service_cost);
                }

                if (service.progress === 'new') {
                  new_req.push(service);
                }
                if (service.progress === 'accepted') {
                  accepted.push(service);
                }
                if (service.progress === 'quote_provided') {
                  quote_provided.push(service);
                }
                if (service.progress === 'quote_accepted') {
                  quote_accepted.push(service);
                }
                if (service.progress === 'quote_rejected') {
                  quote_rejected.push(service);
                }
                if (service.progress === 'leave_for_the_job') {
                  leave_for_the_job.push(service);
                }
                if (service.progress === 'ongoing') {
                  ongoing.push(service);
                }
                if (service.progress === 'task_done') {
                  task_done.push(service);
                }
                if (service.progress === 'payment_done') {
                  payment_done.push(service);
                }
                if (service.progress === 'review') {
                  review.push(service);
                }

                if (service.progress === 'rescheduled') {
                  rescheduled.push(service);
                }
              });
            }
            data = {
              new_req: new_req,
              accepted: accepted,
              quote_provided: quote_provided,
              quote_accepted: quote_accepted,
              quote_rejected: quote_rejected,
              leave_for_the_job: leave_for_the_job,
              ongoing: ongoing,
              task_done: task_done,
              payment_done: payment_done,
              review: review
            };

            (0, _formatResponse2.default)(res, data);

          case 9:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  }));

  return function serviceListForUserByProgress(_x30, _x31) {
    return _ref19.apply(this, arguments);
  };
}();

var serviceByIdForUser = exports.serviceByIdForUser = function () {
  var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(req, res) {
    var userId, service_id, searchParams, service, promo, total, service_cost;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            console.log('wow');
            userId = req.user;
            service_id = req.params.id;
            searchParams = {
              _id: service_id,
              customer_id: userId,
              progress: { $ne: 'cancel' }
            };
            _context20.next = 6;
            return _Service2.default.findOne(searchParams).populate('customer_id', ['credits', 'first_name', 'last_name']).populate('category_id').populate('sub_category_id').populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('review_id').lean();

          case 6:
            service = _context20.sent;
            _context20.next = 9;
            return _PromoCode2.default.findOne({ _id: service.promocode_id });

          case 9:
            promo = _context20.sent;

            service.promo = promo;
            if (service && service.media && service.media.length) {
              service.media.map(function (image) {
                if (image) {
                  image.fileUrl = SERVICE_IMAGE_SERVER_URL + image.fileId;
                }
              });
              if (service.quote && service.quote.length) {
                total = 0;

                service.quote.map(function (quote) {
                  if (quote) {
                    total = total + Number(quote.cost);
                  }
                });
                service_cost = service.service_cost ? service.service_cost : 0;

                service.total_service_charge = total + Number(service_cost);
                service.vatTotal = service.total_service_charge * 0.15;
                service.total_service_charge += service.vatTotal;
              }
            }
            (0, _formatResponse2.default)(res, service ? service : {});

          case 13:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  }));

  return function serviceByIdForUser(_x32, _x33) {
    return _ref20.apply(this, arguments);
  };
}();

/**
 * @apiDescription update service request by admin user
 * @param {*} req
 * @param {*} res
 */
var updateServiceRequestByAdmin = exports.updateServiceRequestByAdmin = function () {
  var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(req, res) {
    var operator, requestId, service, error, prevObj, updatedData, history;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            operator = req.user;
            requestId = req.params.id;
            _context21.next = 4;
            return _Service2.default.findById(requestId);

          case 4:
            service = _context21.sent;

            if (service) {
              _context21.next = 10;
              break;
            }

            error = new Error('Service request not found!');

            error.name = 'DataNotFound';
            error.ar_message = 'طلب الخدمة غير موجود!';
            return _context21.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            prevObj = service.toObject();

            console.log('prevObj===========', prevObj);
            service.address.address = req.body.address.address || service.address.address;
            service.address.city = req.body.address.city || service.address.city;
            service.address.zipcode = req.body.address.zipcode || service.address.zipcode;
            // service.progress_at = new Date();
            _context21.next = 17;
            return service.save();

          case 17:
            updatedData = _context21.sent;
            history = new _ServiceHistory2.default({
              service_id: updatedData._id,
              operation: _operationConfig2.default.operations.update,
              operator: operator,
              prevObj: prevObj,
              updatedObj: updatedData,
              operation_date: new Date()
            });
            _context21.next = 21;
            return history.save();

          case 21:
            (0, _formatResponse2.default)(res, updatedData);

          case 22:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  }));

  return function updateServiceRequestByAdmin(_x34, _x35) {
    return _ref21.apply(this, arguments);
  };
}();

var deleteSingleServiceByAdmin = exports.deleteSingleServiceByAdmin = function () {
  var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22(req, res) {
    var id, operator, removedService, history;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            id = req.params.id;
            operator = req.user;
            _context22.next = 4;
            return _Service2.default.findByIdAndRemove(id);

          case 4:
            removedService = _context22.sent;

            if (!removedService) {
              _context22.next = 9;
              break;
            }

            history = new _ServiceHistory2.default({
              service_id: removedService._id,
              operation: _operationConfig2.default.operations.remove,
              operator: operator,
              prevObj: removedService,
              updatedObj: null,
              operation_date: new Date()
            });
            _context22.next = 9;
            return history.save();

          case 9:

            (0, _formatResponse2.default)(res, removedService ? removedService : {});

          case 10:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  }));

  return function deleteSingleServiceByAdmin(_x36, _x37) {
    return _ref22.apply(this, arguments);
  };
}();

var deleteServiceByAdmin = exports.deleteServiceByAdmin = function () {
  var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(req, res) {
    var ids, operator, services, history;
    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            ids = req.body.ids;
            operator = req.user;
            _context23.next = 4;
            return _Service2.default.find({ _id: { $in: ids } });

          case 4:
            services = _context23.sent;

            if (!services.length) {
              _context23.next = 9;
              break;
            }

            history = services.map(function (service) {
              return {
                service_id: service._id,
                operation: _operationConfig2.default.operations.remove,
                operator: operator,
                prevObj: service,
                updatedObj: null,
                operation_date: new Date()
              };
            });
            _context23.next = 9;
            return _ServiceHistory2.default.insertMany(history);

          case 9:
            _context23.next = 11;
            return _Service2.default.remove({ _id: { $in: ids } });

          case 11:
            (0, _formatResponse2.default)(res, services);

          case 12:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, undefined);
  }));

  return function deleteServiceByAdmin(_x38, _x39) {
    return _ref23.apply(this, arguments);
  };
}();

var getServiceHistory = exports.getServiceHistory = function () {
  var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(req, res) {
    var searchData, history;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            searchData = req.params.id ? { service_id: req.params.id } : {};
            _context24.next = 3;
            return _ServiceHistory2.default.find(searchData).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).populate('updatedObj.customer_id', ['first_name', 'last_name', 'email', 'mobile_no', 'addresses']).sort({ operation_date: 'desc' });

          case 3:
            history = _context24.sent;

            (0, _formatResponse2.default)(res, history);

          case 5:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, undefined);
  }));

  return function getServiceHistory(_x40, _x41) {
    return _ref24.apply(this, arguments);
  };
}();

var serviceProviderStatistics = exports.serviceProviderStatistics = function () {
  var _ref25 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25(req, res) {
    var userId, month, year, filter, projection, whereClause, myresult, arrkey, arrvalue, result, done, accepted, declined, cash_payment_received, card_payment_received, total_vat_tax, total_cash_vat_tax, total_card_vat_tax, finished, cancelled, pending, start_date, end_date, servicesCount, paymentCount, data, mydata;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            //TODO: add payment
            userId = req.user;
            month = Number(req.query.month);
            year = Number(req.query.year);
            filter = void 0, projection = void 0, whereClause = void 0;
            _context25.next = 6;
            return _ServiceActivity2.default.aggregate([{ $match: { service_provider_id: userId } }, { $group: { _id: '$progress', number: { $sum: 1 } } }]);

          case 6:
            myresult = _context25.sent;
            arrkey = [];
            arrvalue = [];
            //es6

            (0, _entries2.default)(myresult).forEach(function (_ref26) {
              var _ref27 = (0, _slicedToArray3.default)(_ref26, 2),
                  key = _ref27[0],
                  value = _ref27[1];

              //console.log(key , value); // key ,value

              arrkey.push(value._id);
              arrvalue.push(value.number);
            });

            result = {};

            arrkey.forEach(function (arrkey, i) {
              return result[arrkey] = arrvalue[i];
            });
            console.log(result);

            console.log(result.assigned);

            //   var done = 0;
            //   var accepted = 0;
            //   var declined = 0;
            //   var cash_payment_received = 0;
            //   var card_payment_received = 0;
            //   var total_vat_tax = 0;
            //   var pp = 110;
            //   var total_cash_vat_tax = 0;
            //   var total_card_vat_tax = 0;

            done = typeof result.task_done === 'undefined' ? 0 : result.task_done;
            accepted = typeof result.accepted === 'undefined' ? 0 : result.accepted;
            declined = typeof result.rejected === 'undefined' ? 0 : result.rejected;
            cash_payment_received = typeof result.paid === 'undefined' ? 0 : result.paid;
            card_payment_received = typeof result.paid === 'undefined' ? 0 : result.paid;
            total_vat_tax = typeof result.myVar === 'undefined' ? 0 : result.myVar;
            total_cash_vat_tax = typeof result.myVar === 'undefined' ? 0 : result.myVar;
            total_card_vat_tax = typeof result.myVar === 'undefined' ? 0 : result.myVar;
            finished = (typeof result.task_done === 'undefined' ? 0 : result.task_done) + (typeof result.paid === 'undefined' ? 0 : result.paid);
            cancelled = (typeof result.journey_cancelled === 'undefined' ? 0 : result.journey_cancelled) + (typeof result.rejected === 'undefined' ? 0 : result.rejected);
            pending = (typeof result.no_response === 'undefined' ? 0 : result.no_response) + (typeof result.ongoing === 'undefined' ? 0 : result.ongoing) + (typeof result.rescheduled === 'undefined' ? 0 : result.rescheduled);


            if (month && year) {
              filter = [{
                $project: {
                  progress: 1,
                  service_provider_id: 1,
                  month: { $month: '$requested_at' },
                  year: { $year: '$requested_at' }
                }
              }, { $match: { service_provider_id: userId, month: month, year: year } }, { $group: { _id: { progress: '$progress' }, count: { $sum: 1 } } }];
              projection = {
                payment_mode: 1,
                service_provider_id: 1,
                payment_status: 1,
                total_cost: 1
              };
              start_date = new Date(year, Number(req.query.month) - 1, 1);
              end_date = new Date(year, Number(req.query.month) - 1, 31);

              whereClause = {
                service_provider_id: userId,
                updated_at: { $gt: start_date, $lt: end_date },
                payment_status: true
              };
            } else {
              filter = [{ $match: { service_provider_id: userId } }, { $group: { _id: { progress: '$progress' }, count: { $sum: 1 } } }];
              projection = { total_cost: 1, payment_mode: 1, payment_status: 1 };
              whereClause = { service_provider_id: userId, payment_status: true };
            }
            _context25.next = 28;
            return _Service2.default.aggregate(filter);

          case 28:
            servicesCount = _context25.sent;
            _context25.next = 31;
            return _Payment2.default.find(whereClause, projection);

          case 31:
            paymentCount = _context25.sent;


            // console.log('paymentCount :', paymentCount);
            servicesCount.map(function (serviceCount) {
              done = serviceCount._id.progress === 'task_done' || serviceCount._id.progress === 'payment_done' || serviceCount._id.progress === 'provider_review' || serviceCount._id.progress === 'customer_review' ? serviceCount.count + done : done;

              accepted = serviceCount._id.progress === 'accepted' || serviceCount._id.progress === 'quote_provided' || serviceCount._id.progress === 'quote_accepted' || serviceCount._id.progress === 'quote_rejected' || serviceCount._id.progress === 'leave_for_the_job' || serviceCount._id.progress === 'ongoing' || serviceCount._id.progress === 'task_done' || serviceCount._id.progress === 'payment_done' || serviceCount._id.progress === 'provider_review' || serviceCount._id.progress === 'customer_review' ? serviceCount.count + accepted : accepted;

              declined = serviceCount._id.progress === 'rejected' ? serviceCount.count + declined : declined;
            });
            console.log('paymentCount :', paymentCount);
            paymentCount.map(function (paymentCount) {
              cash_payment_received = paymentCount.payment_mode === 'cash' && paymentCount.payment_status === true ? paymentCount.total_cost + cash_payment_received : cash_payment_received;
              card_payment_received = paymentCount.payment_mode === 'card' && paymentCount.payment_status === true ? paymentCount.total_cost + card_payment_received : card_payment_received;
            });
            // console.log('cash_payment_received, card_payment_received :', cash_payment_received, card_payment_received)
            total_cash_vat_tax = cash_payment_received * 0.15;
            total_card_vat_tax = card_payment_received * 0.15;
            cash_payment_received = cash_payment_received + total_cash_vat_tax;
            card_payment_received = card_payment_received + total_card_vat_tax;
            data = {
              done: done,
              accepted: accepted,
              declined: declined,
              cash_payment_received: cash_payment_received,
              card_payment_received: card_payment_received,
              total_cash_vat_tax: total_cash_vat_tax,
              total_card_vat_tax: total_card_vat_tax
            };
            mydata = {
              Finished: finished,
              Cancelled: cancelled,
              Pending: pending
            };


            (0, _formatResponse2.default)(res, mydata);

          case 42:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, undefined);
  }));

  return function serviceProviderStatistics(_x42, _x43) {
    return _ref25.apply(this, arguments);
  };
}();

/**
 * API posting complaint against a Service
 * @param {*} req
 * @param {*} res
 */
var addComplainForService = exports.addComplainForService = function () {
  var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(req, res) {
    var serviceId, service, error;
    return _regenerator2.default.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            serviceId = req.body.service_id;
            _context26.next = 3;
            return _Service2.default.findById(serviceId).populate('review_id');

          case 3:
            service = _context26.sent;

            if (service) {
              _context26.next = 9;
              break;
            }

            error = new Error('Service not found!');

            error.ar_message = 'الخدمة غير موجودة!';
            error.name = 'DataNotFound';
            return _context26.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            service.set({
              user_complain: req.body.user_complain,
              user_complain_date: new Date()
            });
            _context26.next = 12;
            return service.save();

          case 12:
            (0, _formatResponse2.default)(res, service);

          case 13:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, undefined);
  }));

  return function addComplainForService(_x44, _x45) {
    return _ref28.apply(this, arguments);
  };
}();

var addComplainResolution = exports.addComplainResolution = function () {
  var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27(req, res) {
    var serviceId, service, error;
    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            serviceId = req.body.service_id;
            _context27.next = 3;
            return _Service2.default.findById(serviceId);

          case 3:
            service = _context27.sent;

            if (service) {
              _context27.next = 9;
              break;
            }

            error = new Error('Service not found!');

            error.ar_message = 'الخدمة غير موجودة!';
            error.name = 'DataNotFound';
            return _context27.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 9:
            if (!service.user_complain) {
              _context27.next = 13;
              break;
            }

            service.set({
              complain_resolution: req.body.complain_resolution,
              complain_resolution_date: new Date()
            });
            _context27.next = 13;
            return service.save();

          case 13:
            (0, _formatResponse2.default)(res, service);

          case 14:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, undefined);
  }));

  return function addComplainResolution(_x46, _x47) {
    return _ref29.apply(this, arguments);
  };
}();

/**
 * Customer cancels the newly created request with the cancellation_commment
 * @param {*} req
 * @param {*} res
 */
var rejectNewServiceByUser = exports.rejectNewServiceByUser = function () {
  var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28(req, res) {
    var userId, requestId, service, error, _error6;

    return _regenerator2.default.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            userId = req.user;
            requestId = req.params.service_id;
            _context28.next = 4;
            return _Service2.default.findOne({
              _id: requestId,
              customer_id: userId
            });

          case 4:
            service = _context28.sent;

            if (service) {
              _context28.next = 10;
              break;
            }

            error = new Error('Service request not found!');

            error.ar_message = 'طلب الخدمة غير موجود!';
            error.name = 'DataNotFound';
            return _context28.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 10:
            if (!(service && service.progress === 'cancel')) {
              _context28.next = 15;
              break;
            }

            _error6 = new Error('Request already cancelled');

            _error6.ar_message = 'تم إلغاء الطلب بالفعل';
            _error6.name = 'DataNotFound';
            return _context28.abrupt('return', (0, _formatResponse2.default)(res, _error6));

          case 15:

            service.set({
              progress: req.body.progress,
              progress_at: new Date(),
              cancellation_commment_by_user: req.body.comment
            });
            _context28.next = 18;
            return service.save();

          case 18:

            (0, _formatResponse2.default)(res, { message: 'Request cancelled!' });

          case 19:
          case 'end':
            return _context28.stop();
        }
      }
    }, _callee28, undefined);
  }));

  return function rejectNewServiceByUser(_x48, _x49) {
    return _ref30.apply(this, arguments);
  };
}();

var addRequest = exports.addRequest = function () {
  var _ref31 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30(req, res) {
    var userId, promoId, providers, media, roleToSend, error, code, _error7, date, time, createdRequest, serviceActivityData, deviceIds;

    return _regenerator2.default.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            userId = req.user;
            promoId = req.query.promo;

            req.body.customer_id = userId;
            _context30.next = 5;
            return findServiceProviders(req);

          case 5:
            providers = _context30.sent;
            media = req.body.media;

            if (media && media.length) {
              media.map(function () {
                var _ref32 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29(item) {
                  var x, image, data;
                  return _regenerator2.default.wrap(function _callee29$(_context29) {
                    while (1) {
                      switch (_context29.prev = _context29.next) {
                        case 0:
                          console.log('item-----', item);

                          _context29.next = 3;
                          return uploadHelper.uploadServiceFile.array('service_file', 5);

                        case 3:
                          x = _context29.sent;
                          image = item.fieldName.replace('_', '-') + 's/' + x.key;

                          console.log('IMAGE----------', x);

                          data = { image: image };

                        case 7:
                        case 'end':
                          return _context29.stop();
                      }
                    }
                  }, _callee29, undefined);
                }));

                return function (_x52) {
                  return _ref32.apply(this, arguments);
                };
              }());
            }
            roleToSend = constants.SERVICE_PROVIDER;

            if (providers.length) {
              _context30.next = 14;
              break;
            }

            error = new Error('Service providers not available in your area!');

            error.ar_message = 'مزودي الخدمة غير متوفرين في منطقتك!';
            error.name = 'DataNotFound';
            return _context30.abrupt('return', (0, _formatResponse2.default)(res, error));

          case 14:
            if (!promoId) {
              _context30.next = 26;
              break;
            }

            _context30.next = 17;
            return _PromoCode2.default.findById(promoId);

          case 17:
            code = _context30.sent;

            if (code) {
              _context30.next = 23;
              break;
            }

            _error7 = new Error('Invalid Promo-code!');

            _error7.ar_message = 'الرمز الترويجي غير صالح!';
            _error7.name = 'DataNotFound';
            return _context30.abrupt('return', (0, _formatResponse2.default)(res, _error7));

          case 23:
            req.body.promocode_id = code._id;
            req.body.isPromoApplied = true;
            req.body.promo_amount = code.amount;

          case 26:
            date = req.body.request_date;
            time = req.body.request_time;
            // const {date, time} = req.body;

            req.body.schedule_at = date && time ? (0, _moment2.default)(date + ' ' + time).format('MM/DD/YYYY h:mm a') : (0, _moment2.default)();

            _context30.next = 31;
            return _Service2.default.create(req.body);

          case 31:
            createdRequest = _context30.sent;
            serviceActivityData = providers.map(function (provider) {
              if (provider) {
                return {
                  service_id: createdRequest._id,
                  category_id: req.body.category_id,
                  sub_category_id: req.body.sub_category_id,
                  customer_id: userId,
                  service_provider_id: provider._id,
                  progress: 'assigned'
                };
              }
            });
            _context30.next = 35;
            return _ServiceActivity2.default.insertMany(serviceActivityData);

          case 35:
            console.log('providersIDs------------', providers.userId);

            deviceIds = providers.map(function (provider) {
              return provider.device_id;
            });
            _context30.next = 39;
            return providers.map(function (provider) {
              return createdRequest.notified_providers.push(provider._id);
            });

          case 39:

            console.log('deviceIds~~~~~~~~', deviceIds);

            // let payload = {
            // 	notification: {
            // 		title: 'New Service Request',
            // 		body: 'Please update service request'
            // 	},
            // 	data: {
            // 		requestId: createdRequest._id,
            // 		status: 'new',
            // 		user: 'Service Provider',
            // 		targetScreen: 'Dashboard'
            // 	}
            // };
            // await createdRequest.save();
            // await sendPushNotificationToMultiple(deviceIds, payload, roleToSend);

            // For now only admin history maintained
            /* const history = new ServiceHistory({
            service_id: createdRequest._id,
            operation: operationConfig.operations.add,
            operator: userId,
            prevObj: null,
            updatedObj: createdRequest,
            operation_date: new Date()
            });
            await history.save(); */
            (0, _formatResponse2.default)(res, createdRequest);

          case 41:
          case 'end':
            return _context30.stop();
        }
      }
    }, _callee30, undefined);
  }));

  return function addRequest(_x50, _x51) {
    return _ref31.apply(this, arguments);
  };
}();