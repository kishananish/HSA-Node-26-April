'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeAll = exports.remove = exports.update = exports.add = exports.getFAQHistory = exports.getFAQHistoryById = exports.getFAQStatsByCategory = exports.getFAQByCategory = exports.index = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _FAQ = require('../models/FAQ');

var _FAQ2 = _interopRequireDefault(_FAQ);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _FAQHistory = require('../models/FAQHistory');

var _FAQHistory2 = _interopRequireDefault(_FAQHistory);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var items, page, filter, skip, limit, count, faqs, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        filter = req.query.filter ? { category: req.query.filter } : {};
                        skip = items * (page - 1);
                        limit = parseInt(items);

                        console.log(items, '* (', page, '-', 1, ')');
                        _context.next = 8;
                        return _FAQ2.default.find(filter).countDocuments();

                    case 8:
                        count = _context.sent;
                        _context.next = 11;
                        return _FAQ2.default.find(filter).skip(skip).limit(limit);

                    case 11:
                        faqs = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: faqs
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 14:
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

var getFAQByCategory = exports.getFAQByCategory = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var category, items, page, filter, skip, limit, count, faqs, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        category = req.params.category;
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        filter = { category: category };
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context2.next = 8;
                        return _FAQ2.default.find(filter).countDocuments();

                    case 8:
                        count = _context2.sent;
                        _context2.next = 11;
                        return _FAQ2.default.find(filter).skip(skip).limit(limit);

                    case 11:
                        faqs = _context2.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: faqs
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 14:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getFAQByCategory(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var getFAQStatsByCategory = exports.getFAQStatsByCategory = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return _Category2.default.aggregate([{ $lookup: { from: 'faqs', localField: '_id', foreignField: 'category', as: 'faqs' } }, { $project: { _id: '$_id', name: '$name', numOfFaqs: { $size: '$faqs' } } }, { $match: { 'numOfFaqs': { $gt: 0 } } }]);

                    case 2:
                        result = _context3.sent;

                        (0, _formatResponse2.default)(res, result);

                    case 4:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getFAQStatsByCategory(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var getFAQHistoryById = exports.getFAQHistoryById = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var id, history;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        id = req.params.id;
                        _context4.next = 3;
                        return _FAQHistory2.default.find({ faq_id: id }).populate('operator', ['first_name', 'last_name', 'email']);

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

    return function getFAQHistoryById(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();
var getFAQHistory = exports.getFAQHistory = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var items, page, skip, limit, count, history, data;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context5.next = 6;
                        return _FAQHistory2.default.find().countDocuments();

                    case 6:
                        count = _context5.sent;
                        _context5.next = 9;
                        return _FAQHistory2.default.find({}).skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']);

                    case 9:
                        history = _context5.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: history
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 12:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function getFAQHistory(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var operator, faq, faqCreated, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        faq = new _FAQ2.default({
                            title: req.body.title,
                            description: req.body.description,
                            ar_description: req.body.ar_description,
                            ar_title: req.body.ar_title,
                            category: req.body.category,
                            created_at: new Date(),
                            updated_at: new Date()
                        });
                        _context6.next = 4;
                        return faq.save();

                    case 4:
                        faqCreated = _context6.sent;
                        history = new _FAQHistory2.default({
                            faq_id: faqCreated._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: faqCreated,
                            operation_date: new Date()
                        });
                        _context6.next = 8;
                        return history.save();

                    case 8:

                        (0, _formatResponse2.default)(res, faqCreated);

                    case 9:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function add(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var operator, id, faq, error, origObj, history;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context7.next = 4;
                        return _FAQ2.default.findById(id);

                    case 4:
                        faq = _context7.sent;

                        if (faq) {
                            _context7.next = 12;
                            break;
                        }

                        error = new Error('FAQ not found!');

                        error.ar_message = 'التعليمات غير موجودة!';
                        error.name = 'NotFound';
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        origObj = new _FAQ2.default({
                            title: faq.title,
                            description: faq.description,
                            created_at: faq.created_at,
                            updated_at: new Date()
                        });


                        faq.title = req.body.title || faq.title;
                        faq.description = req.body.description || faq.description;
                        faq.category = req.body.category || faq.category;
                        faq.updated_at = new Date();

                        _context7.next = 19;
                        return faq.save();

                    case 19:
                        history = new _FAQHistory2.default({
                            faq_id: faq._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: origObj,
                            updatedObj: faq,
                            operation_date: new Date()
                        });
                        _context7.next = 22;
                        return history.save();

                    case 22:
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, faq));

                    case 23:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function update(_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var operator, removedFAQ, history;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        operator = req.user;
                        _context8.next = 3;
                        return _FAQ2.default.findByIdAndRemove(req.params.id);

                    case 3:
                        removedFAQ = _context8.sent;

                        if (!removedFAQ) {
                            _context8.next = 8;
                            break;
                        }

                        history = new _FAQHistory2.default({
                            faq_id: removedFAQ._id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: removedFAQ,
                            updatedObj: null,
                            operation_date: new Date()
                        });
                        _context8.next = 8;
                        return history.save();

                    case 8:
                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, removedFAQ ? removedFAQ : {}));

                    case 9:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function remove(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
        var operator, faqIds, FAQs, history;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        operator = req.user;
                        faqIds = req.body.ids;
                        _context9.next = 4;
                        return _FAQ2.default.find({ _id: { $in: faqIds } });

                    case 4:
                        FAQs = _context9.sent;

                        if (!FAQs.length) {
                            _context9.next = 9;
                            break;
                        }

                        history = FAQs.map(function (faq) {
                            return {
                                faq_id: faq._id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: faq,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        _context9.next = 9;
                        return _FAQHistory2.default.insertMany(history);

                    case 9:
                        _context9.next = 11;
                        return _FAQ2.default.deleteMany({ _id: { $in: faqIds } });

                    case 11:
                        return _context9.abrupt('return', (0, _formatResponse2.default)(res, FAQs));

                    case 12:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function removeAll(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}();