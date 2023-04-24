'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addActiveTime = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _ActiveTime = require('../models/ActiveTime');

var _ActiveTime2 = _interopRequireDefault(_ActiveTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addActiveTime = exports.addActiveTime = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var activeTime;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        req.body.user_id = req.user;
                        _context.next = 3;
                        return _ActiveTime2.default.create(req.body);

                    case 3:
                        activeTime = _context.sent;

                        (0, _formatResponse2.default)(res, activeTime);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function addActiveTime(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();