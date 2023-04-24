'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


var Schema = _mongoose2.default.Schema;

var reviewSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    service_id: {
        type: String,
        ref: 'Service',
        unique: true,
        required: [true, 'Service reference is required!']
    },
    user_id: {
        type: String,
        ref: 'Customer'
    },
    service_provider_id: {
        type: String,
        ref: 'User'
    },
    user_rating: { type: Number },
    service_provider_rating: { type: Number },
    user_comment: { type: String },
    service_provider_comment: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

reviewSchema.statics = {
    getAverageCount: function getAverageCount(id) {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var review, error;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            review = void 0;

                            if (!_shortid2.default.isValid(id)) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 4;
                            return _this.aggregate([{ $group: { _id: id, average_user_ratings: { $avg: '$user_rating' } } }]).exec();

                        case 4:
                            review = _context.sent;
                            return _context.abrupt('return', review);

                        case 8:
                            error = new Error('ServiceId not valid!');

                            error.name = 'NotFound';
                            return _context.abrupt('return', (0, _formatResponse2.default)(error));

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    }
};

var Review = _mongoose2.default.model('Review', reviewSchema);

exports.default = Review;