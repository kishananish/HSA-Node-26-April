'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _bcryptjs = require('bcryptjs');

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shortid2.default.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


var IMAGE_SERVER_URL = _config2.default.IMAGE_SERVER_URL;

var _addresses = new _mongoose2.default.Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    type: { type: String, enum: ['home', 'office'] },
    mapAddress: { type: String },
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    isDefault: { type: Boolean, default: false },
    location: {
        coordinates: [],
        type: { type: String, enum: ['Point'] }
    }
});

_addresses.index({ location: '2dsphere' });

var userSchema = new _mongoose2.default.Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    first_name: { type: String },
    last_name: { type: String },
    email: {
        type: String,
        lowercase: true,
        validate: { validator: function validator(k) {
                return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(k)
                );
            } },
        message: '{VALUE} is not valid email'
    },
    password: { type: String, select: false },
    country_code: { type: String },
    google_id: { type: String },
    facebook_id: { type: String },
    apple_id: { type: String },
    mobile_no: { type: String, unique: true },
    old_mobile_no: { type: String },
    role: [{ type: String, ref: 'Role' }],
    // role: { type: String, enum: ['user', 'service_provider', 'admin'], default: 'user' },
    country: { type: String },
    city: { type: String },
    preferred_language: { type: String, default: 'en' },
    addresses: [_addresses],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    active: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    device_id: { type: String },
    device_type: { type: String },
    profile_pic: { type: String },
    dateOfJoining: Date,
    credits: Number,
    rating: { type: Number, default: 0 },
    category_id: {
        type: String,
        ref: 'Category'
        //required: [true, 'Must provide its specialized category']
    },
    add_material_flag: { type: Boolean, default: true },
    area_assigned: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false
});

userSchema.set('toJSON', {
    transform: function transform(doc, ret) {
        ret.userId = ret._id;
        ret.profile_pic_url = IMAGE_SERVER_URL + ret.profile_pic;
        delete ret.password;
        delete ret._id;
        return ret;
    }
});

userSchema.set('toObject', {
    transform: function transform(doc, ret) {
        ret.userId = ret._id;
        ret.profile_pic_url = ret.profile_pic_url ? IMAGE_SERVER_URL + ret.profile_pic : '';
        delete ret.password;
        delete ret._id;
        return ret;
    }
});
/**
 * Virtual fields are the additional fields for the given model. 
 * Their values can be set manually or automatically with defined functionality
 * Keep in mind: virtual properties dont get persisted in the database. 
 * They only exist logically and are not written to the document's collection. 
 */
userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

userSchema.pre('save', function (next) {

    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    (0, _bcryptjs.genSalt)(10, function (err, salt) {
        (0, _bcryptjs.hash)(user.password, salt, function (err, hashPwd) {
            user.password = hashPwd;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password) {
    return (0, _bcryptjs.compare)(password, this.password);
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;