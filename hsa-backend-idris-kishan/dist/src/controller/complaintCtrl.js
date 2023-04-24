'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = exports.add = exports.getComplaint = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _operationConfig = require('../../config/operationConfig');

var _operationConfig2 = _interopRequireDefault(_operationConfig);

var _Complaint = require('../models/Complaint');

var _Complaint2 = _interopRequireDefault(_Complaint);

var _ComplaintHistory = require('../models/ComplaintHistory');

var _ComplaintHistory2 = _interopRequireDefault(_ComplaintHistory);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getComplaint = exports.getComplaint = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var complaint;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Complaint2.default.find({});

                    case 2:
                        complaint = _context.sent;

                        (0, _formatResponse2.default)(res, complaint);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getComplaint(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var add = exports.add = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var operator, newComplaint, complaint, history;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        operator = req.user;
                        newComplaint = new _Complaint2.default({
                            user_id: operator,
                            request_id: req.params.id,
                            status: req.body.status,
                            complaint_msg: req.body.complaint_msg,
                            created_at: new Date(),
                            updated_at: null
                        });
                        _context2.next = 4;
                        return newComplaint.save();

                    case 4:
                        complaint = _context2.sent;
                        history = new _ComplaintHistory2.default({
                            complaint_id: complaint._id,
                            operation: _operationConfig2.default.operations.add,
                            operator: operator,
                            prevObj: null,
                            updatedObj: complaint,
                            operation_date: new Date()
                        });
                        _context2.next = 8;
                        return history.save();

                    case 8:

                        (0, _formatResponse2.default)(res, complaint);

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function add(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var operator, id, complaint, error, origObj, history;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        operator = req.user;
                        id = req.params.id;
                        _context3.next = 4;
                        return _Complaint2.default.findById(id);

                    case 4:
                        complaint = _context3.sent;

                        if (complaint) {
                            _context3.next = 12;
                            break;
                        }

                        error = new Error('Complaint not found!');

                        error.name = 'NotFound';
                        error.ar_message = 'لم يتم العثور على شكوى!';
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:
                        origObj = new _Complaint2.default({
                            _id: complaint._id,
                            user_id: complaint.operator,
                            request_id: complaint.request_id,
                            status: complaint.status,
                            complaint_msg: complaint.complaint_msg,
                            created_at: complaint.created_at,
                            updated_at: complaint.updated_at
                        });


                        complaint.complaint_msg = req.body.complaint_msg || complaint.complaint_msg;
                        complaint.updated_at = new Date();

                        _context3.next = 17;
                        return complaint.save();

                    case 17:
                        history = new _ComplaintHistory2.default({
                            complaint_id: complaint._id,
                            operation: _operationConfig2.default.operations.update,
                            operator: operator,
                            prevObj: origObj,
                            updatedObj: complaint,
                            operation_date: new Date()
                        });
                        _context3.next = 20;
                        return history.save();

                    case 20:
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, complaint));

                    case 21:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function update(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();