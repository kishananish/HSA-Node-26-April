const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect(`mongodb+srv://shubhamverma:${process.env.MONGODB_PASS}@cluster0.0il92pl.mongodb.net/${process.env.MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true })
    // mongoose.connect('mongodb://localhost:27017/EGOLD')
        .then(() => console.log("dbConnected"))
        .catch(err => console.error("dbNotConnected", err));
}