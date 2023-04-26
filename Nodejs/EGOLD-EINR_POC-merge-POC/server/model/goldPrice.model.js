const mongoose = require('mongoose');

const goldSchema = new mongoose.Schema({
    metal: {
        type: String,
        required: true
    },
    priceUSD: {
        type: Number,
        required: true,
    },
    priceINR: {
        type: Number,
        required: true
    },

}, {
    timestamps: true,
})


const GoldPrice = mongoose.model('goldPrice', goldSchema);

module.exports = { GoldPrice };
