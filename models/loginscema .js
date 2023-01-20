const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const mongod = mongoose.Schema({
    name: String,
    password: String
})




module.exports = mongoose.model('login', mongod)