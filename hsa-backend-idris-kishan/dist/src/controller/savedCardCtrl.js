'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchCards = exports.deleteCard = exports.updateCard = exports.addCard = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

var _SavedCards = require('../models/SavedCards');

var _SavedCards2 = _interopRequireDefault(_SavedCards);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API to add the card
 * @param {*} req 
 * @param {*} res 
 */
var addCard = exports.addCard = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var card, error, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        req.body.user_id = req.user;
                        console.log('data :', req.body);
                        _context.next = 4;
                        return _SavedCards2.default.find({ card_number: req.body.card_number });

                    case 4:
                        card = _context.sent;

                        if (!(card && card.length)) {
                            _context.next = 9;
                            break;
                        }

                        error = new Error('Card already exist!');

                        error.name = 'dataExist';
                        return _context.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 9:
                        _context.next = 11;
                        return _SavedCards2.default.create(req.body);

                    case 11:
                        result = _context.sent;

                        result.statusCode = 200;
                        (0, _formatResponse2.default)(res, result);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function addCard(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * API to update the saved card
 * @param {*} req 
 * @param {*} res 
 */
var updateCard = exports.updateCard = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var card, error;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        req.body.user_id = req.user;
                        _context2.next = 3;
                        return _SavedCards2.default.findById(req.params.id);

                    case 3:
                        card = _context2.sent;

                        if (card) {
                            _context2.next = 8;
                            break;
                        }

                        error = new Error('Card not found!');

                        error.name = 'NotFound';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 8:
                        card.card_number = req.body.card_number || card.card_number;
                        card.expiry_date = req.body.expiry_date || card.expiry_date;
                        // card.expiry_year = req.body.expiry_year || card.expiry_year;
                        card.cvv = req.body.cvv || card.cvv;
                        card.card_name = req.body.card_name || card.card_name;
                        card.bank_name = req.body.bank_name || card.bank_name;

                        // If the user selects the card as DEFAULT card

                        if (!(req.query.is_default == 'true')) {
                            _context2.next = 21;
                            break;
                        }

                        card.is_default = true;
                        _context2.next = 17;
                        return card.save();

                    case 17:
                        _context2.next = 19;
                        return _SavedCards2.default.updateMany({ _id: { $ne: card } }, { $set: { is_default: false } }, { multi: true });

                    case 19:
                        card.message = 'Card updated Successfully!';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, card));

                    case 21:
                        _context2.next = 23;
                        return card.save();

                    case 23:
                        card.message = 'Card updated Successfully!';
                        return _context2.abrupt('return', (0, _formatResponse2.default)(res, card));

                    case 25:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function updateCard(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * API to delete the saved card by its id
 * @param {*} req 
 * @param {*} res 
 */
var deleteCard = exports.deleteCard = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var card, result, error;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        card = req.params.id;
                        _context3.next = 3;
                        return _SavedCards2.default.remove({ _id: card });

                    case 3:
                        result = _context3.sent;

                        if (!(result.n == 0)) {
                            _context3.next = 8;
                            break;
                        }

                        error = new Error('Card not found!');

                        error.name = 'NotFound';
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 8:
                        result.message = 'Card Deleted';
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, result));

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function deleteCard(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * API to fetch all the saved cards
 * @param {*} req 
 * @param {*} res 
 */
var fetchCards = exports.fetchCards = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var user, result;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        user = req.user;
                        _context4.next = 3;
                        return _SavedCards2.default.find({ user_id: user });

                    case 3:
                        result = _context4.sent;
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, result));

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function fetchCards(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();