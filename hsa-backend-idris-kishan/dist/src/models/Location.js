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

var locationsSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    service_id: {
        type: String,
        ref: 'Service',
        unique: true,
        required: [true, 'Service reference is required!']
    },
    provider_id: {
        type: String,
        ref: 'User'
    },
    customer_id: {
        type: String,
        ref: 'Customer'
    },
    start_location_coordinates: {},
    end_location_coordinates: {},
    current_coordinates: [{
        _id: { type: String, 'default': _shortid2.default.generate },
        coordinates: {},
        type: { type: String }
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Locations = _mongoose2.default.model('Location', locationsSchema);

exports.default = Locations;