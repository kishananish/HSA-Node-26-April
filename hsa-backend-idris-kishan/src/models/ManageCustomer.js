'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
import { MongooseAutoIncrementID } from 'mongoose-auto-increment-reworked';
import { genSalt, compare, hash } from 'bcryptjs';

const Schema = mongoose.Schema;

const _addresses = new mongoose.Schema({
    _id: { type: String, 'default': shortid.generate },
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
});

_addresses.index({ location: '2dsphere' });


const mangeCustomerSchema = new Schema({
    _id: { type: String , 'default': shortid.generate},
    //customerID: { type: String, required: [true, 'Customer is required'], unique: true},
    firstName : { type: String, required: [true, 'First is required!']},
    lastName : { type: String, required: [true, 'Last is required!']},
    email: {
        type: String,
        //unique: true,
        lowercase: true,
        validate: { validator: (k) => { return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(k); } },
        message: '{VALUE} is not valid email',
    },
    phoneNumber : { type: String, required: [true, 'Phone number is required!']},
    password : { type: String, required: [true, 'Password is required!']},
    address_1 : {type :_addresses},
    address_2 : {type : _addresses},
    preferredLanguage : {type : String , enum: ['English', 'Arabic']},
    credits : Number,
    rating : { type : Number , enum: [0,1,2,3,4,5]}, 
    serviceCompleted : Number,
    serviceCancel : Number,
    status: String,
    dateOfJoining: Date,
    created_at: Date,
    updated_at: Date
},
{
    versionKey: false
});

mangeCustomerSchema.pre('save', function (next) {

    const currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    let mangeCustomer = this;
    if (!mangeCustomer.isModified('password')) {
        return next();
    }

    genSalt(10, function (err, salt) {
        hash(mangeCustomer.password, salt, function (err, hashPwd) {
            mangeCustomer.password = hashPwd;
            next();
        });
    });
});

mangeCustomerSchema.pre('update', function (next) {

    const currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    let updateCustomer = this;
	

    genSalt(10, function (err, salt) {
        hash(updateCustomer.password, salt, function (err, hashPwd) {
            updateCustomer.password = hashPwd;
            next();
        });
    });
});

mangeCustomerSchema.methods.comparePassword = function (password) {
    return compare(password, this.password);
};

mangeCustomerSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'ManageCustomer' });

const ManageCustomer = mongoose.model('ManageCustomer', mangeCustomerSchema);

export default ManageCustomer;

