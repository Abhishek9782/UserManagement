const express = require('express')
const app = express()
port = 8080

//mongoose call 
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/NewProject', () => {
    console.log('Mongoose Connect With Server Port')
})

// session for make cookies
const Session = require('express-session')
app.use(Session({
    secret: 'abhi',
    resave: false,
    saveUninitialized: false

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
    console.log('Server Conncted with Port 5000 ')
})