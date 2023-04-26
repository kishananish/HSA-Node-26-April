const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        ref: 'transaction',
        required: true
    },
    address: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^0x[0-9a-fA-F]{40}$/.test(v);
            },
            message: props => `${props.value} is not a valid address`
        }
    },
    amount: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

}, {
    timestamps: true,
})


const Transactions = mongoose.model('transaction', transactionSchema);

module.exports = { Transactions };
