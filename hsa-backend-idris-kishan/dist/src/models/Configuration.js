'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
var Schema = _mongoose2.default.Schema;

var configurationSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    range: { type: Number, required: true },
    credits: { type: Number, required: true }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Configuration = _mongoose2.default.model('Configuration', configurationSchema);

exports.default = Configuration;