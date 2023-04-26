const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./startup/mongoDB')();
require('./startup/routes')(app, express);
require('./routes/cron');


app.listen(process.env.PORT || 4005, () => {
    console.log(`Sever is listening on port ${(process.env.PORT || 4005)}`)
})