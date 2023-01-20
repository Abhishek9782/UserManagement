const mongoose = require('mongoose')
const mongo = mongoose.Schema({
    email: String,
    address: String,
    read: String
})
module.exports = mongoose.model('query', mongo)