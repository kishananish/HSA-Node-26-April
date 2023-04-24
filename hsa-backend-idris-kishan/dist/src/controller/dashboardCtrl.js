'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.customerGrowthGraph = exports.saleGrowthGraph = exports.dashboard = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _Role = require('../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _Payment = require('../models/Payment');

var _Payment2 = _interopRequireDefault(_Payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashboard = exports.dashboard = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var serviceProviderRoleId, serviceCount, customerCount, providerCount, amount_gain_last_day, amount_gain_last_week, amount_gain_last_month, amount_gain_last_year, total_amount, projection, totalAmountResultPromise, currentDate, lastDayDate, totalAmountLastDayResultPromise, lastWeekDate, totalAmountLastWeekPromise, lastMonthDate, totalAmountLastMonthPromise, lastYearDate, totalAmountLastYearPromise, _ref2, _ref3, customer, provider, request_serviced, totalAmountResult, totalAmountLastDayResult, totalAmountLastWeekResult, totalAmountLastMonthResult, totalAmountLastYearResult, data;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Role2.default.findOne({ name: 'service_provider' }, { _id: true });

                    case 2:
                        serviceProviderRoleId = _context.sent;
                        serviceCount = _Service2.default.find({ progress: { $in: ['task_done', 'payment_done', 'review'] } }).countDocuments();
                        customerCount = _Customer2.default.find({ isDeleted: { $in: ['false'] } }).countDocuments();
                        providerCount = _User2.default.find({ isDeleted: { $in: ['false'] }, role: { $in: [serviceProviderRoleId._id] } }).countDocuments();

                        // Payment Calculation

                        amount_gain_last_day = '0';
                        amount_gain_last_week = '0';
                        amount_gain_last_month = '0';
                        amount_gain_last_year = '0';
                        total_amount = '0';
                        projection = {
                            total_amount_paid: 1
                        };
                        _context.next = 14;
                        return _Payment2.default.find({
                            total_amount_paid: {
                                $gt: 0
                            }
                        }, projection);

                    case 14:
                        totalAmountResultPromise = _context.sent;

                        totalAmountResultPromise.forEach(function (ele) {
                            total_amount = parseInt(total_amount) + ele.total_amount_paid;
                            (0, _stringify2.default)(total_amount);
                        });
                        console.log('totalAmountResultPromise :', total_amount);

                        // Last Day
                        currentDate = new Date();
                        lastDayDate = new Date();

                        lastDayDate.setDate(currentDate.getDate() - 1);
                        _context.next = 22;
                        return _Payment2.default.find({
                            created_at: { '$gt': lastDayDate, '$lte': currentDate }
                        }, projection);

                    case 22:
                        totalAmountLastDayResultPromise = _context.sent;

                        totalAmountLastDayResultPromise.forEach(function (ele) {
                            amount_gain_last_day = parseInt(amount_gain_last_day) + ele.total_amount_paid;
                            (0, _stringify2.default)(amount_gain_last_day);
                        });
                        console.log('amount_gain_last_day :', amount_gain_last_day);

                        // Last Week
                        lastWeekDate = new Date();

                        lastWeekDate.setDate(currentDate.getDate() - 7);
                        _context.next = 29;
                        return _Payment2.default.find({
                            created_at: { '$gte': lastWeekDate, '$lt': currentDate }
                        }, projection);

                    case 29:
                        totalAmountLastWeekPromise = _context.sent;

                        totalAmountLastWeekPromise.forEach(function (ele) {
                            amount_gain_last_week = parseInt(amount_gain_last_week) + ele.total_amount_paid;
                            (0, _stringify2.default)(amount_gain_last_week);
                        });
                        console.log('amount_gain_last_week :', amount_gain_last_week);

                        // Last Month
                        lastMonthDate = new Date();

                        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
                        _context.next = 36;
                        return _Payment2.default.find({
                            created_at: { '$gte': lastMonthDate, '$lt': currentDate }
                        }, projection);

                    case 36:
                        totalAmountLastMonthPromise = _context.sent;

                        totalAmountLastMonthPromise.forEach(function (ele) {
                            amount_gain_last_month = parseInt(amount_gain_last_month) + ele.total_amount_paid;
                            (0, _stringify2.default)(amount_gain_last_month);
                        });

                        // Last Year
                        lastYearDate = new Date();

                        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
                        _context.next = 42;
                        return _Payment2.default.find({
                            created_at: { '$gte': lastYearDate, '$lt': currentDate }
                        }, projection);

                    case 42:
                        totalAmountLastYearPromise = _context.sent;

                        totalAmountLastYearPromise.forEach(function (ele) {
                            amount_gain_last_year = parseInt(amount_gain_last_year) + ele.total_amount_paid;
                            (0, _stringify2.default)(amount_gain_last_year);
                        });
                        console.log('amount_gain_last_year :', amount_gain_last_year);

                        _context.next = 47;
                        return _promise2.default.all([customerCount, providerCount, serviceCount, totalAmountResultPromise, totalAmountLastDayResultPromise, totalAmountLastWeekPromise, totalAmountLastMonthPromise, totalAmountLastYearPromise]);

                    case 47:
                        _ref2 = _context.sent;
                        _ref3 = (0, _slicedToArray3.default)(_ref2, 8);
                        customer = _ref3[0];
                        provider = _ref3[1];
                        request_serviced = _ref3[2];
                        totalAmountResult = _ref3[3];
                        totalAmountLastDayResult = _ref3[4];
                        totalAmountLastWeekResult = _ref3[5];
                        totalAmountLastMonthResult = _ref3[6];
                        totalAmountLastYearResult = _ref3[7];
                        data = { customer: customer, provider: provider, request_serviced: request_serviced, amount_gain_last_day: amount_gain_last_day, amount_gain_last_week: amount_gain_last_week, amount_gain_last_month: amount_gain_last_month, amount_gain_last_year: amount_gain_last_year, total_amount: total_amount };


                        (0, _formatResponse2.default)(res, data);

                    case 59:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function dashboard(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var saleGrowthGraph = exports.saleGrowthGraph = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var year, results, months, data, total, graphData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        year = new Date().getFullYear();
                        _context2.next = 3;
                        return _Service2.default.aggregate([{ $project: { progress: 1, created_at: 1, month: { $month: '$created_at' }, year: { $year: '$created_at' } } }, { $match: { year: year, progress: { $in: ['task_done', 'payment_done', 'review'] } } }, { $group: { _id: '$month', count: { $sum: 1 } } }]);

                    case 3:
                        results = _context2.sent;
                        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        data = new Array(months.length).fill(0);

                        results.map(function (result) {
                            data[result._id - 1] = result.count;
                        });
                        total = data.reduce(function (total, num) {
                            return total + num;
                        });
                        graphData = { months: months, total: total, data: data };

                        (0, _formatResponse2.default)(res, graphData);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function saleGrowthGraph(_x3, _x4) {
        return _ref4.apply(this, arguments);
    };
}();

var customerGrowthGraph = exports.customerGrowthGraph = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var year, results, months, data, total, graphData;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        year = new Date().getFullYear();
                        _context3.next = 3;
                        return _Customer2.default.aggregate([{ $project: { isDeleted: 1, created_at: 1, month: { $month: '$created_at' }, year: { $year: '$created_at' } } }, { $match: { year: year, isDeleted: { $in: [false] } } }, { $group: { _id: '$month', count: { $sum: 1 } } }]);

                    case 3:
                        results = _context3.sent;
                        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        data = new Array(months.length).fill(0);

                        results.map(function (result) {
                            data[result._id - 1] = result.count;
                        });
                        total = data.reduce(function (total, num) {
                            return total + num;
                        });
                        graphData = { months: months, total: total, data: data };

                        (0, _formatResponse2.default)(res, graphData);

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function customerGrowthGraph(_x5, _x6) {
        return _ref5.apply(this, arguments);
    };
}();