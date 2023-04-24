'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeAll = exports.remove = exports.update = exports.add = exports.getMaterialById = exports.getMaterialByIdForProvider = exports.getMaterialsForProvider = exports.getMaterialHistoryById = exports.getMaterialHistory = exports.getMaterials = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _Material = require('../models/Material');

var _Material2 = _interopRequireDefault(_Material);

var _MaterialHistory = require('../models/MaterialHistory');

var _MaterialHistory2 = _interopRequireDefault(_MaterialHistory);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMaterials = exports.getMaterials = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var items, page, skip, limit, count, materials, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? req.query.page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context.next = 6;
                        return _Material2.default.find({ isDeleted: false }).countDocuments();

                    case 6:
                        count = _context.sent;
                        _context.next = 9;
                        return _Material2.default.find({ isDeleted: false }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).skip(skip).limit(limit);

                    case 9:
                        materials = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: materials
                        };

                        (0, _formatResponse2.default)(res, data);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getMaterials(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getMaterialHistory = exports.getMaterialHistory = function () {
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
                        return _MaterialHistory2.default.find().countDocuments();

                    case 6:
                        count = _context2.sent;
                        _context2.next = 9;
                        return _MaterialHistory2.default.find().skip(skip).limit(limit).sort({ 'created_at': 'desc' }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.material_id').lean();

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

    return function getMaterialHistory(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var getMaterialHistoryById = exports.getMaterialHistoryById = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var id, history;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        id = req.params.id;
                        _context3.next = 3;
                        return _MaterialHistory2.default.find({ material_id: id }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.material_id').lean();

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

    return function getMaterialHistoryById(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var getMaterialsForProvider = exports.getMaterialsForProvider = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var userId, materials;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        userId = req.user;
                        // const materials = await Material.find({ isDeleted: false, service_provider_id: userId }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).lean();

                        _context4.next = 3;
                        return _Material2.default.find({ isDeleted: false }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).lean();

                    case 3:
                        materials = _context4.sent;


                        (0, _formatResponse2.default)(res, materials);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function getMaterialsForProvider(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

var getMaterialByIdForProvider = exports.getMaterialByIdForProvider = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var id, userId, material;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        id = req.params.id;
                        userId = req.user;
                        _context5.next = 4;
                        return _Material2.default.findOne({ _id: id, isDeleted: false, service_provider_id: userId }).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']);

                    case 4:
                        material = _context5.sent;

                        (0, _formatResponse2.default)(res, material ? material : {});

                    case 6:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function getMaterialByIdForProvider(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

var getMaterialById = exports.getMaterialById = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var id, material;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        id = req.params.id;
                        _context6.next = 3;
                        return _Material2.default.findOne({ _id: id, isDeleted: false }).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']);

                    case 3:
                        material = _context6.sent;

                        (0, _formatResponse2.default)(res, material ? material : {});

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function getMaterialById(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();
/**
 * @apiDescription add material by admin and provider 
 * @param {*} req 
 * @param {*} res 
 */
var add = exports.add = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var userId, materialNameChecker, error, loggedInProvider, material, _error;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        userId = req.user;

                        req.body.service_provider_id = userId;
                        // check it has permission to add material

                        _context7.next = 4;
                        return _Material2.default.findOne({ material_category_id: req.body.material_category_id, material_sub_category_id: req.body.material_sub_category_id, name: { $in: [req.body.name] } });

                    case 4:
                        materialNameChecker = _context7.sent;

                        if (!materialNameChecker) {
                            _context7.next = 10;
                            break;
                        }

                        error = new Error('Material Name already in use!');

                        error.ar_message = 'اسم المادة قيد الاستخدام بالفعل!';
                        error.name = 'dataExist';
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 10:
                        _context7.next = 12;
                        return _User2.default.findById({ _id: userId, isDeleted: false });

                    case 12:
                        loggedInProvider = _context7.sent;

                        if (!(loggedInProvider.add_material_flag == true)) {
                            _context7.next = 22;
                            break;
                        }

                        _context7.next = 16;
                        return _Material2.default.create(req.body);

                    case 16:
                        material = _context7.sent;
                        _context7.next = 19;
                        return _MaterialHistory2.default.create({
                            material_id: material._id,
                            material_category_id: material.material_category_id,
                            material_sub_category_id: material.material_sub_category_id,
                            operation: _operationConfig2.default.operations.add,
                            operator: userId,
                            prevObj: null,
                            updatedObj: material,
                            operation_date: new Date()
                        });

                    case 19:
                        (0, _formatResponse2.default)(res, material);
                        _context7.next = 26;
                        break;

                    case 22:
                        _error = new Error('User has no permission to add material!');

                        _error.name = 'ValidationError';
                        _error.ar_message = 'المستخدم ليس لديه إذن لإضافة المواد!';
                        return _context7.abrupt('return', (0, _formatResponse2.default)(res, _error));

                    case 26:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function add(_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(req, res) {
        var id, userId, material, loggedInProvider, error, _error2, prevObj;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        id = req.params.id;
                        userId = req.user;
                        _context8.next = 4;
                        return _Material2.default.findById(id).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']);

                    case 4:
                        material = _context8.sent;
                        _context8.next = 7;
                        return _User2.default.findById({ _id: userId, isDeleted: false });

                    case 7:
                        loggedInProvider = _context8.sent;

                        if (!(loggedInProvider.add_material_flag == false)) {
                            _context8.next = 13;
                            break;
                        }

                        error = new Error('User has no permission to update material!');

                        error.name = 'ValidationError';
                        error.ar_message = 'المستخدم ليس لديه إذن لإضافة المواد!';
                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 13:
                        if (material) {
                            _context8.next = 20;
                            break;
                        }

                        _error2 = new Error('Material not found!');

                        _error2.name = 'NotFound';
                        _error2.ar_message = 'المواد غير موجودة!';
                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, _error2));

                    case 20:
                        prevObj = material.toObject();

                        material.set(req.body);
                        _context8.next = 24;
                        return material.save();

                    case 24:
                        _context8.next = 26;
                        return _MaterialHistory2.default.create({
                            material_id: material._id,
                            material_category_id: material.material_category_id,
                            material_sub_category_id: material.material_sub_category_id,
                            operation: _operationConfig2.default.operations.update,
                            operator: userId,
                            prevObj: prevObj,
                            updatedObj: material,
                            operation_date: new Date()
                        });

                    case 26:
                        return _context8.abrupt('return', (0, _formatResponse2.default)(res, material));

                    case 27:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function update(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(req, res) {
        var id, material, error;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        id = req.params.id;
                        _context9.next = 3;
                        return _Material2.default.findOne({ _id: id, isDeleted: false });

                    case 3:
                        material = _context9.sent;

                        if (material) {
                            _context9.next = 9;
                            break;
                        }

                        error = new Error('Material not found!');

                        error.ar_message = 'المواد غير موجودة!';
                        error.name = 'NotFound';
                        return _context9.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 9:
                        material.isDeleted = true;
                        _context9.next = 12;
                        return material.save();

                    case 12:
                        return _context9.abrupt('return', (0, _formatResponse2.default)(res, material));

                    case 13:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function remove(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}();

var removeAll = exports.removeAll = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(req, res) {
        var materialIds, materials;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        materialIds = req.body.ids;
                        _context10.next = 3;
                        return _Material2.default.find({ _id: { $in: materialIds }, isDeleted: false });

                    case 3:
                        materials = _context10.sent;
                        _context10.next = 6;
                        return _Material2.default.update({ _id: { $in: materialIds }, isDeleted: false }, { isDeleted: true }, { multi: true });

                    case 6:
                        return _context10.abrupt('return', (0, _formatResponse2.default)(res, materials));

                    case 7:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function removeAll(_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
}();