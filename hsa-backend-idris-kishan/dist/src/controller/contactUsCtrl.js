'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.infoPage = exports.removeAll = exports.remove = exports.update = exports.add = exports.getContactUsHistoryById = exports.getContactUsHistory = exports.queryForAdmin = exports.index = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ContactUs = require('../models/ContactUs');

var _ContactUs2 = _interopRequireDefault(_ContactUs);

var _ContactUsHistory = require('../models/ContactUsHistory');

var _ContactUsHistory2 = _interopRequireDefault(_ContactUsHistory);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var userId, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        userId = req.user;
                        _context.next = 3;
                        return _ContactUs2.default.find({ query_by: userId }).sort({ 'created_at': 'desc' }).lean();

                    case 3:
                        result = _context.sent;


                        (0, _formatResponse2.default)(res, result);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var queryForAdmin = exports.queryForAdmin = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var items, page, skip, limit, contactUsPromise, countPromise, _ref3, _ref4, contactUs, count, data;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        contactUsPromise = _ContactUs2.default.find({}).populate('query_by', ['first_name', 'last_name']).sort({ 'created_at': 'desc' }).skip(skip).limit(limit).lean();
                        countPromise = _ContactUs2.default.find({}).countDocuments();
                        _context2.next = 8;
                        return _promise2.default.all([contactUsPromise, countPromise]);

                    case 8:
                        _ref3 = _context2.sent;
                        _ref4 = (0, _slicedToArray3.default)(_ref3, 2);
                        contactUs = _ref4[0];
                        count = _ref4[1];
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: contactUs
                        };


                        (0, _formatResponse2.default)(res, data);

                    case 14:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function queryForAdmin(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var getContactUsHistory = exports.getContactUsHistory = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var items, page, skip, limit, countPromise, historyPromise, _ref6, _ref7, history, count, data;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        countPromise = _ContactUsHistory2.default.find().countDocuments();
                        historyPromise = _ContactUsHistory2.default.find().skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']);
                        _context3.next = 8;
                        return _promise2.default.all([historyPromise, countPromise]);

                    case 8:
                        _ref6 = _context3.sent;
                        _ref7 = (0, _slicedToArray3.default)(_ref6, 2);
                        history = _ref7[0];
                        count = _ref7[1];
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: history
                        };


                        (0, _formatResponse2.default)(res, data);

                    case 14:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getContactUsHistory(_x5, _x6) {
        return _ref5.apply(this, arguments);
    };
}();
var getContactUsHistoryById = exports.getContactUsHistoryById = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var contact_us_id, history;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        contact_us_id = req.params.id;
                        _context4.next = 3;
                        return _ContactUsHistory2.default.find({ contact_us_id: contact_us_id }).populate('operator', ['first_name', 'last_name', 'email']);

                    case 3:
                        history = _context4.sent;


                        (0, _formatResponse2.default)(res, history);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function getContactUsHistoryById(_x7, _x8) {
        return _ref8.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var operator, newContactUs, contactUs, history;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        operator = req.user;
                        newContactUs = new _ContactUs2.default({
                            title: req.body.title,
                            description: req.body.description,
                            query_by: operator
                        });
                        _context5.next = 4;
                        return newContactUs.save();

                    case 4:
                        contactUs = _context5.sent;
                        history = new _ContactUsHistory2.default({
                            contact_us_id: contactUs._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: contactUs,
                            operation_date: new Date()
                        });
                        _context5.next = 8;
                        return history.save();

                    case 8:
                        (0, _formatResponse2.default)(res, contactUs);

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function add(_x9, _x10) {
        return _ref9.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var operator, id, contactUs, error, origObj, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context6.next = 4;
                        return _ContactUs2.default.findById(id);

                    case 4:
                        contactUs = _context6.sent;

                        if (contactUs) {
                            _context6.next = 12;
                            break;
                        }

                        error = new Error('ContactUs not found!');

                        error.ar_message = 'ContactUs غير موجود!';
                        error.name = 'NotFound';
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        origObj = new _ContactUs2.default({
                            _id: contactUs._id,
                            title: contactUs.title,
                            description: contactUs.description,
                            response: contactUs.response
                        });


                        contactUs.title = req.body.title || contactUs.title;
                        contactUs.description = req.body.description || contactUs.description;
                        contactUs.response = req.body.response || contactUs.response;

                        _context6.next = 18;
                        return contactUs.save();

                    case 18:
                        history = new _ContactUsHistory2.default({
                            contact_us_id: contactUs._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: origObj,
                            updatedObj: contactUs,
                            operation_date: new Date()
                        });
                        _context6.next = 21;
                        return history.save();

                    case 21:
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, contactUs));

                    case 22:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function update(_x11, _x12) {
        return _ref10.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var operator, removedObj, history;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        operator = req.user;
                        _context7.next = 3;
                        return _ContactUs2.default.findByIdAndRemove(req.params.id);

                    case 3:
                        removedObj = _context7.sent;

                        if (!removedObj) {
                            _context7.next = 8;
                            break;
                        }

                        history = new _ContactUsHistory2.default({
                            contact_us_id: removedObj._id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: removedObj,
                            updatedObj: null,
                            operation_date: new Date()
                        });
                        _context7.next = 8;
                        return history.save();

                    case 8:
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, removedObj));

                    case 9:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function remove(_x13, _x14) {
        return _ref11.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var operator, contactUsIds, results, history;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        operator = req.user;
                        contactUsIds = req.body.ids;
                        _context8.next = 4;
                        return _ContactUs2.default.find({ _id: { $in: contactUsIds } });

                    case 4:
                        results = _context8.sent;

                        if (!results.length) {
                            _context8.next = 9;
                            break;
                        }

                        history = results.map(function (result) {
                            return {
                                contact_us_id: result._id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: result,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        _context8.next = 9;
                        return _ContactUsHistory2.default.insertMany(history);

                    case 9:
                        _context8.next = 11;
                        return _ContactUs2.default.deleteMany({ _id: { $in: contactUsIds } });

                    case 11:
                        (0, _formatResponse2.default)(res, results);

                    case 12:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function removeAll(_x15, _x16) {
        return _ref12.apply(this, arguments);
    };
}();

var infoPage = exports.infoPage = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        res.render('business-template', {
                            android_link: _operationConfig2.default.ANDROID_LINK,
                            ios_link: _operationConfig2.default.IOS_LINK,
                            title: 'Home Service Application'
                        });

                    case 1:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function infoPage(_x17, _x18) {
        return _ref13.apply(this, arguments);
    };
}();