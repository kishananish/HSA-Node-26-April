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

var notificationSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    content: { type: String, required: [true, 'Content is required!'] },
    user_id: [{ type: String, required: true, refPath: 'onModel' }],
    onModel: { type: String, enum: ['User', 'Customer'], required: true },
    user_type: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Notifications = _mongoose2.default.model('Notification', notificationSchema);

exports.default = Notifications;