'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.giveReviewToCustomer = exports.giveReviewToProvider = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _Review = require('../models/Review');

var _Review2 = _interopRequireDefault(_Review);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var giveReviewToProvider = exports.giveReviewToProvider = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var userId, serviceId, service, review, error, _error, updatedService, service_provider_id, averageReviewCount, user_ratings, average_user_ratings;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        userId = req.user; // customerID

                        serviceId = req.body.service_id;
                        _context.next = 4;
                        return _Service2.default.findById(serviceId);

                    case 4:
                        service = _context.sent;
                        _context.next = 7;
                        return _Review2.default.findOne({ service_id: serviceId });

                    case 7:
                        review = _context.sent;

                        if (!(!service || !review)) {
                            _context.next = 16;
                            break;
                        }

                        error = new Error();

                        error.name = 'DataNotFound';
                        error.message = 'Service request not found!';
                        error.ar_message = 'طلب خدمة غير موجود';
                        return _context.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 16:
                        if (!(!req.body.service_provider_rating || !req.body.service_provider_comment)) {
                            _context.next = 22;
                            break;
                        }

                        _error = new Error();

                        _error.name = 'CantOperate';
                        _error.message = 'Please provide feedback!';
                        _error.ar_message = 'يرجى تقديم ردود الفعل';
                        return _context.abrupt('return', (0, _formatResponse2.default)(res, _error));

                    case 22:
                        review.user_id = userId;
                        review.service_provider_id = service.service_provider_id;
                        review.service_provider_rating = req.body.service_provider_rating;
                        review.service_provider_comment = req.body.service_provider_comment;
                        _context.next = 28;
                        return review.save();

                    case 28:

                        service.set({ review_id: review._id, progress: 'customer_review', progress_at: new Date() });
                        _context.next = 31;
                        return service.save();

                    case 31:
                        updatedService = _context.sent;


                        // update service_provider review Count
                        service_provider_id = service.service_provider_id;
                        _context.next = 35;
                        return _Review2.default.getAverageCount(service_provider_id);

                    case 35:
                        averageReviewCount = _context.sent;
                        user_ratings = averageReviewCount[0].average_user_ratings;
                        average_user_ratings = Math.round(user_ratings * 10) / 10;
                        _context.next = 40;
                        return _User2.default.findByIdAndUpdate({ _id: service_provider_id }, { $set: { rating: average_user_ratings } });

                    case 40:
                        (0, _formatResponse2.default)(res, updatedService);

                    case 41:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function giveReviewToProvider(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var giveReviewToCustomer = exports.giveReviewToCustomer = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var userId, serviceId, service, review, error, _error2, updatedService;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        userId = req.user; // providerID

                        serviceId = req.body.service_id;
                        _context2.next = 4;
                        return _Service2.default.findById(serviceId);

                    case 4:
                        service = _context2.sent;
                        _context2.next = 7;
                        return _Review2.default.findOne({ service_id: serviceId });

                    case 7:
                        review = _context2.sent;

                        if (!(!service || !review)) {
                            _context2.next = 16;
                            break;
                        }

                        error = new Error();

                        error.name = 'DataNotFound';
                        error.message = 'Service request not found!';
                        error.ar_message = 'طلب خدمة غير موجود';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 16:
                        if (!(!req.body.user_rating || !req.body.user_comment)) {
                            _context2.next = 22;
                            break;
                        }

                        _error2 = new Error();

                        _error2.name = 'CantOperate';
                        _error2.message = 'Please provide feedback!';
                        _error2.ar_message = 'يرجى تقديم ردود الفعل';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, _error2));

                    case 22:
                        review.service_provider_id = userId;
                        review.user_id = service.customer_id;
                        review.user_rating = req.body.user_rating;
                        review.user_comment = req.body.user_comment;
                        _context2.next = 28;
                        return review.save();

                    case 28:
                        service.set({ review_id: review._id, progress: 'provider_review', progress_at: new Date() });
                        _context2.next = 31;
                        return service.save();

                    case 31:
                        updatedService = _context2.sent;

                        (0, _formatResponse2.default)(res, updatedService);

                    case 33:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function giveReviewToCustomer(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();