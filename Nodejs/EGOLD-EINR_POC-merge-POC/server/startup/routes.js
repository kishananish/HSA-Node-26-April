const payments = require('../routes/payments');
const crypto = require('../routes/crypto');
const goldPrice = require('../routes/goldPrice');

module.exports = function (app, express) {
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send(welcome);
    });

    app.use('/payments', payments);

    app.use('/crypto', crypto);
    
    app.use('/goldPrice', goldPrice);
}