const mongoose = require('mongoose')
const hello = mongoose.Schema({
    name: String,
    password: String
})
module.exports = mongoose.model('admin2', hello)