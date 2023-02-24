const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()

const mongo = new mongoose.Schema({
    name: {
        type: String,

    },
    password: {
        type: String,

    },
    password123: {
        type: String,

    },
    mobile: {
        type: Number,

    }
    , status: {
        type: String,
        default: "suspended"

    },
    role: {
        type: String,
        default: "public"

    },
    email: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]


})

mongo.methods.genrateToken = async function () {
    console.log(this._id)
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY)
        //  For token saved in mongodb
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token
        console.log(token)

    } catch (err) {
        console.log("model " + err)

    }

}








//  we are secure password by hashing like a middleware 

// mongo.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash('password', 12)
//         this.password123 = await bcrypt.hash('password123', 12)
//     }
//     next();
// })
// mongo.post('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash('password', 12)
//         this.password123 = await bcrypt.hash('password123', 12)
//     }
//     next();
// })


module.exports = mongoose.model('reg', mongo)