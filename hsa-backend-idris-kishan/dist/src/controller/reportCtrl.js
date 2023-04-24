'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseTimeReport = exports.activeTimeReport = exports.totalEarning = exports.getRating = exports.serviceRequest = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _Review = require('../models/Review');

var _Review2 = _interopRequireDefault(_Review);

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

var _ActiveTime = require('../models/ActiveTime');

var _ActiveTime2 = _interopRequireDefault(_ActiveTime);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ServiceActivity = require('../models/ServiceActivity');

var _ServiceActivity2 = _interopRequireDefault(_ServiceActivity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceRequest = exports.serviceRequest = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var startDate, endDate, user_id, category_id, searchData, services, uniqueProviders, newServices, i, j;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startDate = req.query.start_date;
            endDate = req.query.end_date;
            user_id = req.query.user_id;
            category_id = req.query.category_id;
            searchData = {
              progress: { $in: ['rejected', 'accepted', 'assigned'] }
            };

            if (startDate) {
              searchData.created_at = {
                $gte: new Date(startDate)
              };
            }
            if (startDate && endDate) {
              searchData.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              };
            }

            if (user_id) {
              searchData.service_provider_id = user_id;
            }

            if (category_id) {
              searchData.category_id = category_id;
            }

            _context.next = 11;
            return _ServiceActivity2.default.aggregate([{ $match: searchData }, {
              $group: {
                _id: {
                  service_provider_id: '$service_provider_id',
                  category_id: '$category_id',
                  progress: '$progress'
                },
                total: { $sum: 1 }
              }
            }, {
              $project: {
                _id: 0,
                provider_id: '$_id.service_provider_id',
                progress: '$_id.progress',
                total: '$total',
                category_id: '$_id.category_id'
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'provider_id',
                foreignField: '_id',
                as: 'provider'
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category_id',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$provider',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 11:
            services = _context.sent;
            uniqueProviders = services.map(function (service) {
              return service.provider_id;
            }).filter(function (value, index, self) {
              return self.indexOf(value) === index;
            });
            newServices = [];

            services.forEach(function (service) {
              var userData = {};
              userData.service_provider_id = service.provider_id;
              userData.date_of_joining = service.provider_id.created_at;
              userData.first_name = service.provider.first_name;
              userData.last_name = service.provider.last_name;
              userData.area_assigned = service.provider.area_assigned || 'NA';
              userData.category_name = service.provider_id.name;
              userData.total = service.total;
              userData.progress = service.progress;

              newServices.push(userData);
            });

            uniqueProviders.forEach(function (provider) {
              newServices.forEach(function (service) {
                if (provider === service.service_provider_id) {
                  service.total_service_assigned = service.progress === 'assigned' ? service.total : 0;
                  service.total_service_accepted = service.progress === 'accepted' ? service.total : 0;
                  service.total_service_rejected = service.progress === 'rejected' ? service.total : 0;
                }
                delete service.progress;
                delete service.total;
              });
            });

            i = 0;

          case 17:
            if (!(i <= newServices.length)) {
              _context.next = 29;
              break;
            }

            j = 1;

          case 19:
            if (!(j <= newServices.length)) {
              _context.next = 25;
              break;
            }

            if (newServices[i].service_provider_id === newServices[j].service_provider_id) {
              newServices[i].total_service_assigned = newServices[i].total_service_assigned + newServices[j].total_service_assigned;
              newServices[i].total_service_accepted = newServices[i].total_service_accepted + newServices[j].total_service_accepted;
              newServices[i].total_service_rejected = newServices[i].total_service_rejected + newServices[j].total_service_rejected;
            }
            return _context.abrupt('break', 25);

          case 22:
            j++;
            _context.next = 19;
            break;

          case 25:
            return _context.abrupt('break', 29);

          case 26:
            i++;
            _context.next = 17;
            break;

          case 29:

            (0, _formatResponse2.default)(res, newServices[i]);

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function serviceRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getRating = exports.getRating = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var startDate, endDate, user_id, user_type, searchData, ratings, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            startDate = req.query.start_date;
            endDate = req.query.end_date;
            user_id = req.query.user_id;
            user_type = req.query.user_type;
            searchData = {
              service_provider_id: { $exists: true },
              user_id: { $exists: true },
              service_id: { $exists: true }
            };

            if (startDate) {
              searchData.created_at = {
                $gte: startDate
              };
            }
            if (startDate && endDate) {
              searchData.created_at = {
                $gte: startDate,
                $lte: endDate
              };
            }

            if (user_type === 'service_provider' && user_id) {
              searchData.$and = [{ service_provider_id: { $exists: true } }, { service_provider_id: user_id }];
              searchData.user_id = { $exists: true };
              searchData.service_id = { $exists: true };
            }
            if (user_type === 'user' && user_id) {
              searchData.service_provider_id = { $exists: true };
              searchData.$and = [{ user_id: { $exists: true } }, { user_id: user_id }];
              searchData.service_id = { $exists: true };
              console.log('>>>>>>>>>>>>searchData', searchData);
            }
            _context2.next = 11;
            return _Review2.default.find(searchData).populate({
              path: 'user_id',
              model: 'Customer',
              select: { first_name: 1, last_name: 1, created_at: 1 }
            }).populate({
              path: 'service_provider_id',
              model: 'User',
              select: { first_name: 1, last_name: 1, created_at: 1 }
            }).populate({
              path: 'service_id',
              model: 'Service',
              select: { created_at: 1, category_id: 1 },
              populate: {
                path: 'category_id',
                model: 'Category',
                select: { name: 1 }
              }
            }).lean();

          case 11:
            ratings = _context2.sent;

            console.log('>>>>>>>>>>>>Rating', ratings);
            result = [];

            ratings.forEach(function (rating) {
              var provider = {
                user_id: rating && rating.service_provider_id && rating.service_provider_id._id ? rating.service_provider_id._id : '',
                service_id: rating && rating.service_id && rating.service_id._id ? rating.service_id._id : '',
                date_of_joining: rating && rating.service_provider_id ? rating.service_provider_id.created_at : '',
                first_name: rating && rating.service_provider_id && rating.service_provider_id.first_name ? rating.service_provider_id.first_name : '',
                last_name: rating && rating.service_provider_id && rating.service_provider_id.last_name ? rating.service_provider_id.last_name : '',
                category_name: rating && rating.service_id && rating.service_id.category_id ? rating.service_id.category_id.name : '',
                service_date: rating && rating.service_id ? rating.service_id.created_at : '',
                rating: rating && rating.service_provider_rating ? rating.service_provider_rating : 0,
                user_type: 'Service Provider'
              };

              var user = {
                user_id: rating && rating.user_id ? rating.user_id._id : '',
                service_id: rating && rating.service_id ? rating.service_id._id : '',
                date_of_joining: rating && rating.user_id ? rating.user_id.created_at : '',
                first_name: rating && rating.user_id ? rating.user_id.first_name : '',
                last_name: rating && rating.user_id ? rating.user_id.last_name : '',
                category_name: rating && rating.service_id && rating.service_id.category_id ? rating.service_id.category_id.name : '',
                service_date: rating && rating.service_id ? rating.service_id.created_at : '',
                rating: rating.user_rating,
                user_type: 'Customer'
              };

              if (user_type === 'user') result.push(user);
              if (user_type === 'service_provider') result.push(provider);
              if (!user_type) result.push(provider, user);
            });
            (0, _formatResponse2.default)(res, result);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getRating(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var totalEarning = exports.totalEarning = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
    var searchData, userSearch, serviceSearch, start_date, end_date, service_provider_id, area_assigned, payment_mode, payments, userArray;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            searchData = {};
            userSearch = {};
            serviceSearch = {};
            start_date = req.query.start_date;
            end_date = req.query.end_date;
            service_provider_id = req.query.service_provider_id;
            area_assigned = req.query.area_assigned;
            payment_mode = req.query.payment_mode;

            //return;

            if (start_date) {
              searchData.created_at = {
                $gte: start_date
              };
            }
            if (start_date && end_date) {
              searchData.created_at = {
                $gte: start_date,
                $lte: end_date
              };
            }
            if (service_provider_id) {
              searchData.service_provider_id = service_provider_id;
            }
            if (area_assigned) {
              userSearch.area_assigned = area_assigned;
            }
            if (payment_mode) {
              searchData.payment_mode = payment_mode;
            }

            console.log('>>>>>>>searchDatakkk', searchData);
            serviceSearch.service_id = { $ne: null };

            _context3.next = 17;
            return _Payment2.default.find(searchData).populate({
              path: 'service_id',
              model: 'Service',
              select: { service_provider_id: 1 },
              populate: {
                path: 'service_provider_id',
                //  match: userSearch,
                model: 'User'
              }
            });

          case 17:
            payments = _context3.sent;
            userArray = [];

            payments.forEach(function (payment) {
              console.log('>>>>>>>>>>', payment.service_id.service_provider_id);
              if (payment.service_provider_id && payment.service_id && payment.service_id._id) {
                console.log('inside if>>>>>>>>>>>>>>>');
                var found = userArray.some(function (el) {
                  console.log(el);

                  return el.service_provider_id === payment.service_provider_id;
                });

                if (!found) {
                  userArray.push({
                    service_provider_id: payment.service_id._id,
                    date_of_joining: payment.service_id.service_provider_id.created_at,
                    first_name: payment.service_id.service_provider_id.first_name,
                    last_name: payment.service_id.service_provider_id.last_name,
                    area_assigned: payment.service_id.service_provider_id.area_assigned || 'NA',
                    payment_mode: payment.payment_mode,
                    total_amount_paid: payment.total_cost,
                    total_cost: 0,
                    total_amount_deposit: payment.total_cost,
                    total_amount_pending: 0
                  });
                }
              }
            });

            userArray.forEach(function (user) {
              payments.forEach(function (payment) {
                if (payment.service_provider_id && payment.service_id && payment.service_id.service_provider_id) {
                  if (user.service_provider_id === payment.service_provider_id) {
                    user.total_amount_paid += payment.total_amount_paid;
                    user.total_cost += payment.total_cost;
                    user.total_amount_deposit += payment.total_amount_paid;
                    user.total_amount_pending += payment.total_amount_pending;
                  }
                }
              });
            });

            (0, _formatResponse2.default)(res, userArray);

          case 22:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function totalEarning(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var activeTimeReport = exports.activeTimeReport = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var startDate, endDate, user_id, searchData, activeTimes, act_app_time, act_work_time, act_time1, scope_user, scope_user_array, active_data, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            startDate = req.query.start_date;
            endDate = req.query.end_date;
            user_id = req.query.user_id;
            //const category_id = req.query.category_id;

            searchData = {};


            if (startDate) {
              searchData.created_at = {
                $gte: startDate
              };
            }
            if (startDate && endDate) {
              searchData.created_at = {
                $gte: startDate,
                $lte: endDate
              };
            }
            if (user_id) {
              searchData.user_id = user_id;
            }
            //  if (category_id) {
            //  	searchData.category_id = category_id;
            //  }
            console.log('>>>>>>serachData', searchData);
            _context4.next = 10;
            return _ActiveTime2.default.find(searchData).populate((0, _defineProperty3.default)({
              path: 'user_id',
              model: 'User',
              select: {
                first_name: 1,
                last_name: 1,
                area_assigned: 1,
                created_at: 1,
                category_id: 1
              },
              populate: { path: 'role', model: 'Role' }
            }, 'populate', { path: 'category_id', model: 'Category' })).lean();

          case 10:
            activeTimes = _context4.sent;
            act_app_time = 0;
            act_work_time = 0;
            act_time1 = [];
            scope_user = '';
            scope_user_array = [];
            active_data = '';

            activeTimes.forEach(function (service) {
              var service_created_date = (0, _moment2.default)(service.created_at); // task start on
              var service_active_time = (0, _moment2.default)(service.time);
              var service_update_time = (0, _moment2.default)(service.updated_at);

              var active_time_work = _moment2.default.duration(service_created_date.diff(service_active_time));
              var active_time_app = _moment2.default.duration(service_created_date.diff(service_update_time));
              service.active_time_of_work = active_time_work.asSeconds();
              service.active_time_on_app = active_time_app.asSeconds();
              if (service.user_id) {
                if (!scope_user_array.includes(service.user_id._id) && service.user_id._id != '') {
                  scope_user = service.user_id._id;
                  scope_user_array.push(scope_user);
                }
              }
            });

            if (scope_user_array.length > 0) {
              scope_user_array.forEach(function (service) {
                if (activeTimes.length > 0) {
                  activeTimes.forEach(function (service1) {
                    if (service1 && service1.user_id && service1.user_id._id == service && act_app_time == 0) {
                      act_app_time = service1.active_time_of_work;
                      act_work_time = service1.active_time_of_work;
                    } else if (service1 && service1.user_id && service1.user_id._id == service && act_app_time != 0) {
                      act_app_time = act_app_time + service1.active_time_of_work;
                      act_work_time = act_work_time + service1.active_time_of_work;
                    }
                  });
                }
                if (activeTimes.length > 0) {
                  activeTimes.forEach(function (service1) {
                    if (service1 && service1.user_id && service1.user_id._id == service) {
                      service1.act_app_time = act_app_time;
                      service1.act_work_time = act_work_time;
                      active_data = service1;
                    }
                  });
                }
                act_time1.push(active_data);
              });
            }

            result = act_time1.map(function (data) {
              return {
                service_provider_id: data.user_id._id,
                first_name: data.user_id.first_name,
                last_name: data.user_id.last_name,
                date_of_joining: data.user_id.created_at,
                location: data.user_id.area_assigned || 'NA',
                category_name: data.user_id && data.user_id.category_id ? data.user_id.category_id.name : 'NA',
                active_time_of_work: Math.abs(data.active_time_of_work),
                active_time_on_app: Math.abs(data.act_work_time)
              };
            });

            (0, _formatResponse2.default)(res, result);

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function activeTimeReport(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var responseTimeReport = exports.responseTimeReport = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var startDate, endDate, user_id, searchData, responseTimes;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            startDate = req.query.start_date;
            endDate = req.query.end_date;
            user_id = req.query.user_id;
            searchData = {
              progress: { $nin: ['assigned', 'new', 'cancel'] }
            };


            if (startDate) {
              searchData.created_at = {
                $gte: new Date(startDate)
              };
            }
            if (startDate && endDate) {
              searchData.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              };
            }
            if (user_id) {
              searchData.service_provider_id = user_id;
            }

            _context5.next = 9;
            return _Service2.default.aggregate([{ $match: searchData }, {
              $project: {
                service_provider_id: 1,
                duration: {
                  $divide: [{ $subtract: ['$respond_at', '$created_at'] }, 3600000]
                }
              }
            }, {
              $group: {
                _id: '$service_provider_id',
                average_duration: { $avg: '$duration' }
              }
            }, {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'provider'
              }
            }, { $unwind: '$provider' }, {
              $project: {
                service_provider_id: '$provider._id',
                date_of_joining: '$provider.created_at',
                first_name: '$provider.first_name',
                last_name: '$provider.last_name',
                location: '$provider.area_assigned',
                response_time: '$average_duration'
              }
            }]);

          case 9:
            responseTimes = _context5.sent;


            (0, _formatResponse2.default)(res, responseTimes);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function responseTimeReport(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();