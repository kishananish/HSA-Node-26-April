'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeAll = exports.remove = exports.update = exports.add = exports.getSubCategoryHistory = exports.index = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _SubCategory = require('../models/SubCategory');

var _SubCategory2 = _interopRequireDefault(_SubCategory);

var _SubCategoryHistory = require('../models/SubCategoryHistory');

var _SubCategoryHistory2 = _interopRequireDefault(_SubCategoryHistory);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var subCategories;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _SubCategory2.default.find({}).populate('category_id');

                    case 2:
                        subCategories = _context.sent;

                        (0, _formatResponse2.default)(res, subCategories);

                    case 4:
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

var getSubCategoryHistory = exports.getSubCategoryHistory = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var searchData, history;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        searchData = req.params.id ? { sub_category_id: req.params.id } : {};
                        _context2.next = 3;
                        return _SubCategoryHistory2.default.find(searchData).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').populate('sub_category_id');

                    case 3:
                        history = _context2.sent;

                        (0, _formatResponse2.default)(res, history);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getSubCategoryHistory(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var operator, newSubCategory, subCategory, history;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        operator = req.user;
                        newSubCategory = new _SubCategory2.default({
                            name: req.body.name,
                            ar_name: req.body.ar_name,
                            category_id: req.body.category_id
                        });
                        _context3.next = 4;
                        return newSubCategory.save();

                    case 4:
                        subCategory = _context3.sent;
                        history = new _SubCategoryHistory2.default({
                            sub_category_id: subCategory._id,
                            category_id: subCategory.category_id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: subCategory,
                            operation_date: new Date()
                        });
                        _context3.next = 8;
                        return history.save();

                    case 8:
                        (0, _formatResponse2.default)(res, subCategory);

                    case 9:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function add(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var operator, subCategory, origObj, history, error;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        operator = req.user;
                        _context4.next = 3;
                        return _SubCategory2.default.findById(req.params.id);

                    case 3:
                        subCategory = _context4.sent;

                        if (!subCategory) {
                            _context4.next = 17;
                            break;
                        }

                        origObj = subCategory.toObject();


                        subCategory.name = req.body.name;
                        subCategory.category_id = req.body.category_id ? req.body.category_id : subCategory.category_id;
                        subCategory.ar_name = req.body.ar_name;
                        _context4.next = 11;
                        return subCategory.save();

                    case 11:
                        history = new _SubCategoryHistory2.default({
                            sub_category_id: subCategory._id,
                            category_id: subCategory.category_id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: origObj,
                            updatedObj: subCategory,
                            operation_date: new Date()
                        });
                        _context4.next = 14;
                        return history.save();

                    case 14:
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, subCategory));

                    case 17:
                        error = new Error('SubCategory not found!');

                        error.ar_message = 'الفئة الفرعية غير موجودة!';
                        error.name = 'NotFound';
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 21:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function update(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var operator, removedSubCategory, history;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        operator = req.user;
                        _context5.next = 3;
                        return _SubCategory2.default.findByIdAndRemove(req.params.id);

                    case 3:
                        removedSubCategory = _context5.sent;

                        if (!removedSubCategory) {
                            _context5.next = 8;
                            break;
                        }

                        history = new _SubCategoryHistory2.default({
                            sub_category_id: removedSubCategory._id,
                            category_id: removedSubCategory.category_id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: removedSubCategory,
                            updatedObj: null,
                            operation_date: new Date()
                        });
                        _context5.next = 8;
                        return history.save();

                    case 8:
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, removedSubCategory ? removedSubCategory : {}));

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function remove(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var operator, subCategoryIds, subCategories, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        subCategoryIds = req.body.ids;
                        _context6.next = 4;
                        return _SubCategory2.default.find({ _id: { $in: subCategoryIds } });

                    case 4:
                        subCategories = _context6.sent;

                        if (!subCategories.length) {
                            _context6.next = 9;
                            break;
                        }

                        history = subCategories.map(function (subCategory) {
                            return {
                                sub_category_id: subCategory._id,
                                category_id: subCategory.category_id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: subCategory,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        _context6.next = 9;
                        return _SubCategoryHistory2.default.insertMany(history);

                    case 9:
                        _context6.next = 11;
                        return _SubCategory2.default.deleteMany({ _id: { $in: subCategoryIds } });

                    case 11:
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, subCategories));

                    case 12:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function removeAll(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();