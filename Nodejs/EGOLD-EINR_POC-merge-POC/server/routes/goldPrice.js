const express = require('express');
const router = express.Router();

const { GoldPrice } = require('../model/goldPrice.model');

const cors = require("cors");
router.use(cors())

router.get("/get", cors(),async (req, res) => {
    const date = new Date();
    const startDate = new Date(date.setDate(date.getDate() - parseInt(7)));
    try {
        let goldPrice;
        goldPrice = await GoldPrice.find({
            createdAt: { $gte: startDate.toISOString(), $lte: new Date().toISOString() },
        }).sort({createdAt:1});

        res.send(goldPrice)
    } catch (error) {
        console.log(error)
        res.status(400).end()
    }
})

module.exports = router;
