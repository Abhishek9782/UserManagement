const jwt = require('jsonwebtoken')
const registrePage = require('../models/regScema')
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwttokens
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        next()
    } catch (err) {
        res.status(401).send(err)
    }
}
module.exports = auth