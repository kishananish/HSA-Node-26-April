const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const cf = require('cashfree-sdk');
const { Transactions } = require('../model/transaction.model');
const cors = require("cors")
const Razorpay = require('razorpay');

var rozarPay = new Razorpay({
    key_id: 'rzp_test_mUTZOW7Dv34UnQ',
    key_secret: process.env.RAZOR_SECRET_TEST,
});

router.use(cors())

router.post("/stripe", cors(), async (req, res) => {
    let { address, amount, from, to, shipping } = req.body
    let transaction;
    try {

        let payment;
        payment = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: from,
            description: `${from}-${to} {${address}}`,
            confirm: true,
            payment_method: 'pm_card_visa',
            shipping: {
                name: shipping.name,
                address: {
                    line1: shipping.address.line1,
                    postal_code: +shipping.address.postal_code,
                    city: shipping.address.city,
                    country: shipping.address.country,
                },
            },
        })
        transaction = await new Transactions({
            transactionId: payment.id,
            address: address,
            amount: amount,
            from: from,
            to: to,
            status: false
        }).save();

        res.json({
            message: "Payment initiated.",
            success: true,
            secret: payment.client_secret,
        })
    } catch (error) {
        // console.log("Error", error)
        res.status(400).json({
            message: "Payment failed",
            success: false,
            error: error.message
        })
    }
})


router.post('/razorPay', cors(), async (req, res) => {
    let { address, amount, from, to, shipping } = req.body;
    let transaction;

    const options = {
        amount: amount * 100, // amount in paise
        currency: from,
        receipt: `receipt_${Math.floor(Date.now() / 1000)}`,
    };

    try {
        const order = await rozarPay.orders.create(options);

        transaction = await new Transactions({
            transactionId: order.id,
            address: address,
            amount: amount,
            from: from,
            to: to,
            status: false
        }).save();

        res.json({
            message: "Payment initiated.",
            success: true,
            order: order
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Order creation failed",
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
