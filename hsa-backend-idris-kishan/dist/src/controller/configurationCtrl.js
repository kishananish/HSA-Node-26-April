'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addConfiguration = exports.getConfiguration = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Configuration = require('../models/Configuration');

var _Configuration2 = _interopRequireDefault(_Configuration);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getConfiguration = exports.getConfiguration = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var configuration;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Configuration2.default.findOne();

                    case 2:
                        configuration = _context.sent;

                        (0, _formatResponse2.default)(res, configuration);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getConfiguration(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var addConfiguration = exports.addConfiguration = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var findObject, newConfiguration, configuration, updateField, oldConfiguration, updateConfiguration, updatedConfiguration, error;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        req.body.range = req.body.range * 1000;
                        _context2.next = 3;
                        return _Configuration2.default.find().countDocuments();

                    case 3:
                        findObject = _context2.sent;
                        _context2.t0 = findObject;
                        _context2.next = _context2.t0 === 0 ? 7 : _context2.t0 === 1 ? 14 : 25;
                        break;

                    case 7:
                        newConfiguration = new _Configuration2.default({
                            //range: req.body.range,
                            range: req.body.range,
                            credits: req.body.credits
                        });
                        _context2.next = 10;
                        return newConfiguration.save();

                    case 10:
                        configuration = _context2.sent;

                        configuration.message = 'Configuration created';
                        (0, _formatResponse2.default)(res, configuration);
                        return _context2.abrupt('break', 29);

                    case 14:
                        updateField = req.body;
                        _context2.next = 17;
                        return _Configuration2.default.findOne();

                    case 17:
                        oldConfiguration = _context2.sent;
                        updateConfiguration = (0, _assign2.default)(oldConfiguration, updateField);
                        _context2.next = 21;
                        return updateConfiguration.save();

                    case 21:
                        updatedConfiguration = _context2.sent;

                        updatedConfiguration.message = 'Configuration updated';
                        (0, _formatResponse2.default)(res, updatedConfiguration);
                        return _context2.abrupt('break', 29);

                    case 25:
                        error = new Error('Configuration data not found!');

                        error.ar_message = 'لم يتم العثور على بيانات التكوين!';
                        error.name = 'DataNotFound';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 29:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function addConfiguration(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();