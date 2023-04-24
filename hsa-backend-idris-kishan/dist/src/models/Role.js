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

var roleSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    name: { type: String, required: [true, 'Name is required!'] },
    access_level: [{
        _id: { type: String, 'default': _shortid2.default.generate },
        name: { type: String, required: [true, 'Name is required!'] },
        actions: {
            add: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            view: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
            payment: { type: Boolean, default: false }
        }
    }],
    active: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Role = _mongoose2.default.model('Role', roleSchema);

exports.default = Role;