const express = require('express');
const router = express.Router();
const { web3Func } = require('../startup/web3');

const { Transactions } = require('../model/transaction.model');

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

const Razorpay = require('razorpay');
let rozarPay = new Razorpay({
    key_id: 'rzp_test_mUTZOW7Dv34UnQ',
    key_secret: process.env.RAZOR_SECRET_TEST,
});

const cors = require("cors");
router.use(cors())


const web3 = require('web3')
const StoH = (str) => {
    return web3.utils.asciiToHex(str).padEnd(66, "0");
}

router.post("/EUSD", cors(), async (req, res) => {
    const { web3, EUSDAddress, EUSDContract } = await web3Func();
    let { transactionId, address, amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

        let transaction = await Transactions.find({ transactionId: paymentIntent.id })

        if (transaction[0].status) {
            throw new Error('Minting for this payment already completed.')
        }
        if (transaction[0].to != "EUSD") {
            throw new Error('Invalid transaction Id for this token.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EUSDAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };

        let receipt = await EUSDContract.methods.mint(address, web3.utils.toWei(("" + amount), "ether")).send(transactionObject);

        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { status: true } },
                { returnOriginal: false });
        }

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EUSD Minted.",
            status: true,
            amount: amount,
            address: address,
            receipt: receipt
        })
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "Minting Failed",
            status: false,
            error: error.message
        })
    }
})

router.post("/EINR", cors(), async (req, res) => {
    const { web3, EINRAddress, EINRContract } = await web3Func();
    let { transactionId, address } = req.body;
    let amount;
    try {
        const orderDetails = await rozarPay.payments.fetch(transactionId);
        amount = orderDetails.amount / 100;
        // console.log(orderDetails.order_id)

        let transaction = await Transactions.find({ transactionId: orderDetails.order_id })
        // console.log(transaction, "b4")

        if (transaction[0].status) {
            throw new Error('Minting for this payment already completed.')
        }
        if (transaction[0].to != "EINR") {
            throw new Error('Invalid transaction Id for this token.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EINRAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };
        let receipt = await EINRContract.methods.mint(address, web3.utils.toWei(("" + amount), "ether")).send(transactionObject);

        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: orderDetails.order_id },
                { $set: { status: true } },
                { returnOriginal: false });
        }

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EINR Minted.",
            status: true,
            amount: amount,
            receipt: receipt
        })

    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "Minting Failed",
            status: false,
            error: error.message
        })
    }


})

router.post("/EGOLD", cors(), async (req, res) => {
    const { web3, EGOLDAddress, EGOLDContract } = await web3Func();
    let { transactionId, address, amount, from } = req.body;
    let paymentIntent, orderDetails, transaction, amountEGold;
    try {

        if (from.includes("INR")) {
            // console.log("INR")
            orderDetails = await rozarPay.payments.fetch(transactionId)
            transactionId = orderDetails.order_id;
            transaction = await Transactions.find({ transactionId: transactionId })
            // console.log(transaction, "b4")
        } else {
            // console.log("USD")
            paymentIntent = await stripe.paymentIntents.retrieve(transactionId)
            transaction = await Transactions.find({ transactionId: paymentIntent.id })
        }
        if (transaction[0].status) {
            throw new Error('Transaction already completed.')
        }
        if (transaction[0].to != "EGOLD") {
            throw new Error('Invalid transaction Id for this token.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EGOLDAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };
        let receipt;

        if (from.includes("INR")) {
            amountEGold = (orderDetails.amount / 100) / web3.utils.fromWei(await EGOLDContract.methods.EGoldPriceINR().call({ from: Account.address }), "ether");
            receipt = await EGOLDContract.methods.buyEGoldINR(web3.utils.toWei("" + amountEGold, "ether"), address, StoH(orderDetails.id)).send(transactionObject);
        } else {
            amountEGold = (paymentIntent.amount / 100) / web3.utils.fromWei(await EGOLDContract.methods.EGoldPriceUSD().call({ from: Account.address }), "ether");
            receipt = await EGOLDContract.methods.buyEGoldUSD(web3.utils.toWei("" + amountEGold, "ether"), address, StoH(paymentIntent.id)).send(transactionObject);
        }
        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { status: true } },
                { returnOriginal: false });
        }

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EGOLD transferred successfully.",
            status: true,
            amount: amount,
            address: address,
            receipt: receipt
        })
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "EGOLD transferred failed.",
            status: false,
            error: error.message
        })
    }


})


module.exports = router;
