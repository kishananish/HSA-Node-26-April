'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.searchCategories = exports.removeAll = exports.remove = exports.update = exports.add = exports.getCategoryHistory = exports.getRelatedSubCategories = exports.index = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _SubCategory = require('../models/SubCategory');

var _SubCategory2 = _interopRequireDefault(_SubCategory);

var _CategoryHistory = require('../models/CategoryHistory');

var _CategoryHistory2 = _interopRequireDefault(_CategoryHistory);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _SubCategoryHistory = require('../models/SubCategoryHistory');

var _SubCategoryHistory2 = _interopRequireDefault(_SubCategoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var categories;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Category2.default.find({});

                    case 2:
                        categories = _context.sent;

                        (0, _formatResponse2.default)(res, categories);

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

var getRelatedSubCategories = exports.getRelatedSubCategories = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var subCategories;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _SubCategory2.default.find({ category_id: req.params.id });

                    case 2:
                        subCategories = _context2.sent;

                        (0, _formatResponse2.default)(res, subCategories);

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getRelatedSubCategories(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var getCategoryHistory = exports.getCategoryHistory = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var searchData, history;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        searchData = req.params.id ? { category_id: req.params.id } : {};
                        _context3.next = 3;
                        return _CategoryHistory2.default.find(searchData).populate('operator', ['first_name', 'last_name', 'email']);

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

    return function getCategoryHistory(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var operator, newCategory, category, history;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        operator = req.user;
                        newCategory = new _Category2.default({
                            name: req.body.name,
                            ar_name: req.body.ar_name,
                            imageName: req.body.imageName
                        });
                        _context4.next = 4;
                        return newCategory.save();

                    case 4:
                        category = _context4.sent;
                        history = new _CategoryHistory2.default({
                            category_id: category._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: category,
                            operation_date: new Date()
                        });
                        _context4.next = 8;
                        return history.save();

                    case 8:
                        (0, _formatResponse2.default)(res, category);

                    case 9:
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
        var operator, id, category, error, origObj, history;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context5.next = 4;
                        return _Category2.default.findById(id);

                    case 4:
                        category = _context5.sent;

                        if (category) {
                            _context5.next = 12;
                            break;
                        }

                        error = new Error('Category not found!');

                        error.name = 'NotFound';
                        error.ar_message = 'الفئة غير موجودة!';
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        origObj = category.toObject();


                        category.name = req.body.name || category.name;
                        category.ar_name = req.body.ar_name || category.ar_name;

                        category.imageName = req.body.imageName || category.imageName;
                        _context5.next = 18;
                        return category.save();

                    case 18:
                        history = new _CategoryHistory2.default({
                            category_id: category._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: origObj,
                            updatedObj: category,
                            operation_date: new Date()
                        });
                        _context5.next = 21;
                        return history.save();

                    case 21:
                        return _context5.abrupt('return', (0, _formatResponse2.default)(res, category));

                    case 22:
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
        var operator, removedCategory, history;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        operator = req.user;
                        _context6.next = 3;
                        return _Category2.default.findByIdAndRemove(req.params.id);

                    case 3:
                        removedCategory = _context6.sent;

                        if (!removedCategory) {
                            _context6.next = 8;
                            break;
                        }

                        history = new _CategoryHistory2.default({
                            category_id: removedCategory._id,
                            operation: _operationConfig2.default.operations.remove,
                            operator: operator,
                            prevObj: removedCategory,
                            updatedObj: null,
                            operation_date: new Date()
                        });
                        _context6.next = 8;
                        return history.save();

                    case 8:
                        return _context6.abrupt('return', (0, _formatResponse2.default)(res, removedCategory ? removedCategory : {}));

                    case 9:
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
        var operator, categoryIds, categories, subCategories, catHistory, subCatHistory;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        operator = req.user;
                        categoryIds = req.body.ids;
                        _context7.next = 4;
                        return _Category2.default.find({ _id: { $in: categoryIds } });

                    case 4:
                        categories = _context7.sent;
                        _context7.next = 7;
                        return _SubCategory2.default.find({ category_id: { $in: categoryIds } });

                    case 7:
                        subCategories = _context7.sent;

                        if (!categories.length) {
                            _context7.next = 15;
                            break;
                        }

                        catHistory = categories.map(function (category) {
                            return {
                                category_id: category._id,
                                operation: _operationConfig2.default.operations.remove,
                                operator: operator,
                                prevObj: category,
                                updatedObj: null,
                                operation_date: new Date()
                            };
                        });
                        subCatHistory = subCategories.map(function (subCategory) {
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
                        _context7.next = 13;
                        return _CategoryHistory2.default.insertMany(catHistory);

                    case 13:
                        _context7.next = 15;
                        return _SubCategoryHistory2.default.insertMany(subCatHistory);

                    case 15:
                        _context7.next = 17;
                        return _Category2.default.deleteMany({ _id: { $in: categoryIds } });

                    case 17:
                        _context7.next = 19;
                        return _SubCategory2.default.deleteMany({ category_id: { $in: categoryIds } });

                    case 19:
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, categories));

                    case 20:
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

var searchCategories = exports.searchCategories = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var items, page, skip, limit, category, searchData, result, count, data;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        category = req.query.name;
                        searchData = category ? { 'name': { $regex: category, $options: 'i' } } : {};
                        _context8.next = 8;
                        return _Category2.default.find(searchData).skip(skip).limit(limit).lean();

                    case 8:
                        result = _context8.sent;
                        _context8.next = 11;
                        return _Category2.default.find(searchData).countDocuments();

                    case 11:
                        count = _context8.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: result
                        };

                        if (result.length == 0) {
                            data.message = 'No matching categories found, please enter the name correctly';
                        }
                        (0, _formatResponse2.default)(res, data);

                    case 15:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function searchCategories(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();