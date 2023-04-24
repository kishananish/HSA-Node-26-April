'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _mongooseAutoIncrementReworked = require('mongoose-auto-increment-reworked');

var _bcryptjs = require('bcryptjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var _addresses = new _mongoose2.default.Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    address: { type: String },
    city: { type: String },
    zipcode: { type: String }
});

_addresses.index({ location: '2dsphere' });

var mangeCustomerSchema = new Schema({
    _id: { type: String, 'default': _shortid2.default.generate },
    //customerID: { type: String, required: [true, 'Customer is required'], unique: true},
    firstName: { type: String, required: [true, 'First is required!'] },
    lastName: { type: String, required: [true, 'Last is required!'] },
    email: {
        type: String,
        //unique: true,
        lowercase: true,
        validate: { validator: function validator(k) {
                return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(k)
                );
            } },
        message: '{VALUE} is not valid email'
    },
    phoneNumber: { type: String, required: [true, 'Phone number is required!'] },
    password: { type: String, required: [true, 'Password is required!'] },
    address_1: { type: _addresses },
    address_2: { type: _addresses },
    preferredLanguage: { type: String, enum: ['English', 'Arabic'] },
    credits: Number,
    rating: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    serviceCompleted: Number,
    serviceCancel: Number,
    status: String,
    dateOfJoining: Date,
    created_at: Date,
    updated_at: Date
}, {
    versionKey: false
});

mangeCustomerSchema.pre('save', function (next) {

    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    var mangeCustomer = this;
    if (!mangeCustomer.isModified('password')) {
        return next();
    }

    (0, _bcryptjs.genSalt)(10, function (err, salt) {
        (0, _bcryptjs.hash)(mangeCustomer.password, salt, function (err, hashPwd) {
            mangeCustomer.password = hashPwd;
            next();
        });
    });
});

mangeCustomerSchema.pre('update', function (next) {

    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    var updateCustomer = this;

    (0, _bcryptjs.genSalt)(10, function (err, salt) {
        (0, _bcryptjs.hash)(updateCustomer.password, salt, function (err, hashPwd) {
            updateCustomer.password = hashPwd;
            next();
        });
    });
});

mangeCustomerSchema.methods.comparePassword = function (password) {
    return (0, _bcryptjs.compare)(password, this.password);
};

mangeCustomerSchema.plugin(_mongooseAutoIncrementReworked.MongooseAutoIncrementID.plugin, { modelName: 'ManageCustomer' });

var ManageCustomer = _mongoose2.default.model('ManageCustomer', mangeCustomerSchema);

exports.default = ManageCustomer;