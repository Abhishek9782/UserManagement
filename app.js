require('dotenv').config()
const express = require('express')
const app = express()
let port = process.env.PORT;

//  cookie parder use here
const cookieParser = require('cookie-parser')
app.use(cookieParser())



//mongoose call 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Mongoose Connect With Server Port')
})

// session for make cookies
const Session = require('express-session')
app.use(Session({
    secret: 'abhi',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }

}))



// view engine mai pade html pages ko use krne k liye 
app.set('view engine', 'ejs');
// post method ki security htaane k liye 
app.use(express.urlencoded({ extended: false }))
// statics filesn use krne k liye 
app.use(express.static('public'))

//router ka conficatin 
const Admin = require('./router/admin/admin')
app.use('/admin', Admin)


const Home = require('./router/pages');
const { Cookie } = require('express-session');

app.use(Home)

app.all('*', (req, res, next) => {
    res.send('wrong url');

})




app.listen(port, () => {
    console.log(`Server Conncted  http://localhost:${port}`)
})