'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.apply = exports.removeAll = exports.remove = exports.update = exports.add = exports.getPromoCodeHistoryById = exports.getPromoCodeHistory = exports.index = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _PromoCode = require('../models/PromoCode');

var _PromoCode2 = _interopRequireDefault(_PromoCode);

var _PromoCodeHistory = require('../models/PromoCodeHistory');

var _PromoCodeHistory2 = _interopRequireDefault(_PromoCodeHistory);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var items, page, skip, limit, searchQuery, count, codes, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        searchQuery = {};

                        if (req.query.category_id && req.query.category_id != null) {
                            searchQuery = {
                                is_removed: false,
                                category_id: req.query.category_id,
                                start_date: { $lte: new Date() },
                                end_date: { $gte: new Date() }
                            };
                        } else {
                            searchQuery = {
                                is_removed: false,
                                start_date: { $lte: new Date() },
                                end_date: { $gte: new Date() }
                            };
                        }

                        _context.next = 8;
                        return _PromoCode2.default.find(searchQuery).countDocuments();

                    case 8:
                        count = _context.sent;
                        _context.next = 11;
                        return _PromoCode2.default.find(searchQuery).skip(skip).limit(limit).sort({ created_at: -1 }).populate('category_id').lean();

                    case 11:
                        codes = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: codes
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

var getPromoCodeHistory = exports.getPromoCodeHistory = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var items, page, skip, limit, count, history, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context2.next = 6;
                        return _PromoCodeHistory2.default.find().countDocuments();

                    case 6:
                        count = _context2.sent;
                        _context2.next = 9;
                        return _PromoCodeHistory2.default.find().skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').lean();

                    case 9:
                        history = _context2.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: history
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getPromoCodeHistory(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var getPromoCodeHistoryById = exports.getPromoCodeHistoryById = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var id, history;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        id = req.params.id;
                        _context3.next = 3;
                        return _PromoCodeHistory2.default.find({ promocode_id: id }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').lean();

                    case 3:
                        history = _context3.sent;

                        (0, _formatResponse2.default)(res, history);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getPromoCodeHistoryById(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var error, existingPromo, _error, operator, code, codeCreated, history;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        if (req.body.code) {
                            _context4.next = 5;
                            break;
                        }

                        error = new Error('Please provide a promo-code');

                        error.name = 'ValidationError';
                        error.ar_message = 'يرجى تقديم الرمز الترويجي';
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 5:
                        _context4.next = 7;
                        return _PromoCode2.default.findOne({ code: req.body.code, is_removed: false }).lean();

                    case 7:
                        existingPromo = _context4.sent;

                        if (!existingPromo) {
                            _context4.next = 13;
                            break;
                        }

                        _error = new Error('Please provide a unique promo-code');

                        _error.name = 'dataExist';
                        _error.ar_message = 'يرجى تقديم الرمز الترويجي الفريد';
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, _error));

                    case 13:
                        operator = req.user;
                        code = new _PromoCode2.default({
                            code: req.body.code,
                            start_date: req.body.start_date,
                            end_date: req.body.end_date,
                            category_id: req.body.category_id,
                            percentage: req.body.percentage,
                            amount: req.body.amount,
                            created_at: new Date()
                        });
                        _context4.next = 17;
                        return code.save();

                    case 17:
                        codeCreated = _context4.sent;
                        history = new _PromoCodeHistory2.default({
                            promocode_id: codeCreated._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: codeCreated,
                            operation_date: new Date()
                        });
                        _context4.next = 21;
                        return history.save();

                    case 21:
                        if (codeCreated && history) {
                            codeCreated.message = 'Promo-code Added Successfully !';
                            codeCreated.ar_message = 'تمت إضافة الرمز الترويجي بنجاح';
                        }
                        (0, _formatResponse2.default)(res, codeCreated);

                    case 23:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function add(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var operator, id, code, error, history;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context5.next = 4;
                        return _PromoCode2.default.findById(id);

                    case 4:
                        code = _context5.sent;

                        if (code) {
                            _context5.next = 12;
                            break;
                        }

                        error = new Error('Promo code not found!');

                        error.ar_message = 'الرمز الترويجي غير موجود';
                        error.name = 'NotFound';
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        code.code = req.body.code;
                        code.start_date = req.body.start_date;
                        code.end_date = req.body.end_date;
                        code.category_id = req.body.category_id;
                        code.percentage = req.body.percentage;
                        code.amount = req.body.amount;
                        code.updated_at = new Date();

                        _context5.next = 21;
                        return code.save();

                    case 21:
                        history = new _PromoCodeHistory2.default({
                            promocode_id: code._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: code,
                            updatedObj: code,
                            operation_date: new Date()
                        });
                        _context5.next = 24;
                        return history.save();

                    case 24:
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, code));

                    case 25:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function update(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var operator, id, code, error, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context6.next = 4;
                        return _PromoCode2.default.findById(id);

                    case 4:
                        code = _context6.sent;

                        if (code) {
                            _context6.next = 12;
                            break;
                        }

                        error = new Error('Promo code not found!');

                        error.ar_message = 'الرمز الترويجي غير موجود';
                        error.name = 'NotFound';
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        code.is_removed = true;
                        code.updated_at = new Date();
                        _context6.next = 16;
                        return code.save();

                    case 16:
                        history = new _PromoCodeHistory2.default({
                            promocode_id: code._id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: null,
                            updatedObj: code,
                            operation_date: new Date()
                        });
                        _context6.next = 19;
                        return history.save();

                    case 19:
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, code));

                    case 20:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function remove(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var operator, promoCodeIds, codes, promoCodeHistory;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        operator = req.user;
                        promoCodeIds = req.body.ids;
                        _context7.next = 4;
                        return _PromoCode2.default.find({ _id: { $in: promoCodeIds } });

                    case 4:
                        codes = _context7.sent;

                        if (!codes.length) {
                            _context7.next = 9;
                            break;
                        }

                        promoCodeHistory = codes.map(function (code) {
                            return {
                                promocode_id: code._id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: code,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        _context7.next = 9;
                        return _PromoCodeHistory2.default.insertMany(promoCodeHistory);

                    case 9:
                        _context7.next = 11;
                        return _PromoCode2.default.update({ _id: { $in: promoCodeIds } }, { is_removed: true, updated_at: new Date() }, { multi: true });

                    case 11:
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, codes));

                    case 12:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function removeAll(_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}();

var apply = exports.apply = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var userId, categoryId, promocode, code, promo_history;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        userId = req.user;
                        categoryId = req.params.category_id;
                        promocode = req.body.code;
                        _context8.next = 5;
                        return _PromoCode2.default.findOne({
                            code: promocode,
                            category_id: categoryId,
                            is_removed: false,
                            start_date: { $lte: new Date() },
                            end_date: { $gte: new Date() }
                        });

                    case 5:
                        code = _context8.sent;

                        if (code) {
                            _context8.next = 10;
                            break;
                        }

                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, { valid: false, message: 'Please enter valid promo code', ar_message: 'الرجاء إدخال الرمز الترويجي الصحيح' }));

                    case 10:
                        promo_history = new _PromoCodeHistory2.default({
                            promocode_id: code._id,
                            operation: _operationConfig2.default.operations.promo_used,
                            operator: userId,
                            prevObj: null,
                            updatedObj: code,
                            operation_date: new Date()
                        });
                        _context8.next = 13;
                        return promo_history.save();

                    case 13:
                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, { valid: true, promocode: code, message: 'Promo-code Applied Successfully', ar_message: 'تطبيق الرمز الترويجي بنجاح' }));

                    case 14:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function apply(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();