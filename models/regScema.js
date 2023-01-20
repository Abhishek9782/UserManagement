const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    }


})




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