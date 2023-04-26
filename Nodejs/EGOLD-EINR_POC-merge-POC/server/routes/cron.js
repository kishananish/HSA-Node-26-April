var myHeaders = new Headers();
myHeaders.append("x-access-token", `${process.env.GOLD_PRICE}`);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

const { web3Func } = require('../startup/web3')
const { GoldPrice } = require('../model/goldPrice.model');
const cron = require('node-cron');

// Schedule a task to run every 3 hours
// cron.schedule('0 */3 * * *', async () => {

// Schedule the cron job to run every minute
// cron.schedule('* * * * *', async () => {

// Schedule a job to run every day at 12:00 AM
cron.schedule('0 0 * * *', async () => {
    let { web3, EGOLDContract, EGOLDAddress } = await web3Func();

    try {
        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);
        ///*
        let priceINR, priceUSD;

        await fetch("https://www.goldapi.io/api/XAU/INR", requestOptions)
            .then(response => response.json())
            .then(async (result) => {
                // console.log(result, "result")
                priceINR = Math.round(result.price_gram_24k);
                // console.log(result.price_gram_24k)
                const transactionObject = {
                    from: Account.address,
                    to: EGOLDAddress,
                    gas: 200000,
                    gasPrice: '10000000000',
                    nonce: await web3.eth.getTransactionCount(Account.address),
                };
                await EGOLDContract.methods.setEGoldPriceINR(web3.utils.toWei(("" + priceINR), "ether")).send(transactionObject)
                    .then(e => {
                        console.log("Gold INR price set = ",priceINR)
                    })
            })

        await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
            .then(response => response.json())
            .then(async (result) => {
                // console.log(result)
                priceUSD = Math.round(result.price_gram_24k);
                // console.log(result.price_gram_24k)
                const transactionObject = {
                    from: Account.address,
                    to: EGOLDAddress,
                    gas: 200000,
                    gasPrice: '10000000000',
                    nonce: await web3.eth.getTransactionCount(Account.address),
                };
                await EGOLDContract.methods.setEGoldPriceUSD(web3.utils.toWei(("" + priceUSD), "ether")).send(transactionObject)
                    .then(e => {
                        console.log("Gold USD price set = ",priceUSD)
                    })
            })
        await new GoldPrice({
            metal: "Gold",
            priceUSD: priceUSD,
            priceINR: priceINR,
        }).save();
        //*/

        /*
        let priceUSD = 59, priceINR = 4890;
                    let transactionObject = {
                        from: Account.address,
                        to: EGOLDAddress,
                        gas: 200000,
                        gasPrice: '10000000000',
                        nonce: await web3.eth.getTransactionCount(Account.address),
                    };
                    await EGOLDContract.methods.setEGoldPriceINR(web3.utils.toWei(("" + priceINR), "ether")).send(transactionObject)
                        .then(e => {
                            // console.log("Gold INR price set.")
                        });
                    transactionObject = {
                        from: Account.address,
                        to: EGOLDAddress,
                        gas: 200000,
                        gasPrice: '10000000000',
                        nonce: await web3.eth.getTransactionCount(Account.address),
                    };
                    await EGOLDContract.methods.setEGoldPriceUSD(web3.utils.toWei(("" + priceUSD), "ether")).send(transactionObject)
                        .then(e => {
                            // console.log("Gold USD price set.")
                        });
        */
        
        web3.eth.accounts.wallet.remove(Account.address);

    } catch (error) {
        console.log(error)
    }
});

