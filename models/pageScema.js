const mongoose = require('mongoose')
const mongo = mongoose.Schema({
    title: String,
    desc: String,
    longdesc: String,
    images: String
})
module.exports = mongoose.model('home', mongo)