'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateResolution = exports.addResolution = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ComplaintResolution = require('../models/ComplaintResolution');

var _ComplaintResolution2 = _interopRequireDefault(_ComplaintResolution);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addResolution = exports.addResolution = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var newComplaintResolution, resolution;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        newComplaintResolution = new _ComplaintResolution2.default({
                            complaintId: req.body.complaintId,
                            adminId: req.body.adminId,
                            message: req.body.message,
                            created_at: new Date(),
                            updated_at: null
                        });
                        _context.next = 3;
                        return newComplaintResolution.save();

                    case 3:
                        resolution = _context.sent;

                        (0, _formatResponse2.default)(res, resolution);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function addResolution(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var updateResolution = exports.updateResolution = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var id, resolution, error;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        id = req.params.id;
                        _context2.next = 3;
                        return _ComplaintResolution2.default.findById(id);

                    case 3:
                        resolution = _context2.sent;

                        if (resolution) {
                            _context2.next = 11;
                            break;
                        }

                        error = new Error('Complaint Resolution not found!');

                        error.ar_message = 'قرار الشكوى غير موجود!';
                        error.name = 'NotFound';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 11:
                        // const origObj = new Category({
                        // 	complaintId: resolution.complaintId,
                        // 	adminId: resolution.adminId,
                        // 	message: resolution.message,
                        // 	created_at: resolution.created_at,
                        // 	updated_at: new Date(),
                        // });

                        resolution.adminId = req.body.adminId || resolution.adminId;
                        resolution.message = req.body.message === '' ? resolution.message : req.body.message;
                        resolution.updated_at = new Date();

                        _context2.next = 16;
                        return resolution.save();

                    case 16:
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, resolution));

                    case 17:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function updateResolution(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();