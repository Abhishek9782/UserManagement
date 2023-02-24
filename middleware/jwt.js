const jwt = require('jsonwebtoken')
const Register = require('../models/regScema')

const auth = async (req, res, next) => {
    try {
        const token = req.cookie.jwt;
        let verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(verifyUser)
    } catch (err) {
        res.status(401).send(err)

    }
}