const router = require('express').Router()
const Banner = require('../models/pageScema')
const Login = require('../models/loginscema ')
const Reg = require('../models/regScema')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')





//  Middlee Ware 
function handlelogincheck(req, res, next) {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect('/login')
  }
}

async function handlecheckrole(req, res, next) {
  const regrecord123 = await Reg.findOne({ name: sess.name })

  // isme hm role ke basis pr kr rhe hai ager hame kisi sapcific user ke liye hi krna ho to ?
  // hm use karenge 
  // if(regrecoard123.name =='abhishek')
  if (regrecord123.role == 'pvt') {
    next()
  } else {
    res.send('please contact with your admin')
  }

}




//it's variable for global value catch & send 
let sess = null;

router.get('/', async (req, res) => {
  const bannerRecord = await Banner.findOne()
  if (sess !== null) {
    res.render('index.ejs', { bannerRecord: bannerRecord, name: sess.name })
  }
  else {
    res.render('index.ejs', { bannerRecord: bannerRecord, name: "hello" })
  }
})

router.get('/test', async (req, res) => {
  const use = 'Office Time'
  const desc = 'Best Timing Office'
  const longdesc = 'hello World'
  const bannervalue = new Banner({ title: use, desc: desc, longdesc: longdesc })
  await bannervalue.save()
})

// more Details ko Show and Hide Krwane ke liye 


router.get('/moredetails', handlelogincheck, handlecheckrole, async (req, res) => {
  const homevalue = await Banner.findOne()

  res.render('moredetails', { homevalue: homevalue, name: sess.name, message: sess.message })
})
router.get('/login', (req, res) => {
  if (sess !== null) {
    res.render('login.ejs', { name: sess.name })
  } else {
    res.render('login.ejs', { name: "hello" })
  }

})
router.get('/registration', (req, res) => {
  res.render('registration.ejs')


})
router.post('/registration', async (req, res) => {
  const { name, password, password123, mobile, email } = req.body
  const salt = 12;
  const hashpass = await bcrypt.hash(password, salt)
  const hashrepass = await bcrypt.hash(password123, salt)
  // const status = 'suspended' this give in i mongo scema by default--both
  // const role = 'public'
  const loginRecord = new Reg({ name: name, password: hashpass, password123: hashrepass, mobile: mobile, email: email })
  //  We Are Using there hash method for secure Passowrd

  await loginRecord.save()
  console.log(loginRecord)
  res.redirect('/login')
})
router.post('/login', async (req, res) => {
  const { name, password } = req.body
  const regRecord = await Reg.findOne({ name: name })
  const hash = regRecord.password
  //!console.log(password)---------------
  //todo: console.log(regRecord.password)----------
  const hashed = await bcrypt.compare(password, hash)
  if (regRecord !== null) {
    if (hashed == true) {
      if (regRecord.status == 'active') {
        req.session.isAuth = true;
        sess = req.session
        sess.name = regRecord.name
        sess.message = 'Hello'
        res.redirect('/')

      }
      else {
        res.send("Your account Is Suspended")
      }
    }
    else {
      res.redirect('/login')

    }
  } else {
    res.redirect('/login')
  }
})
router.get('/logout', handlelogincheck, (req, res) => {
  req.session.destroy()
  sess = null,
    res.redirect('/login')
})

router.get('/contactadminadmin', handlelogincheck, (req, res) => {
  let name = sess.name
  res.render('adminmail.ejs', { name })
})

router.post('/emailsendadmin', handlelogincheck, async (req, res) => {
  const { usermail, content } = req.body
  const config = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "abhishekmishrajpr1234@gmail.com",
      pass: "yozl penv dwin jaqf",
    },
  })

  let info = {
    from: "abhishekmishrajpr1234@gmail.com",
    to: "abhishekjpr123@gmail.com",
    subject: usermail,
    text: content
  }
  const sended = await config.sendMail(info, (err, send) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(send)
    }

  })

  res.redirect('/')
})




module.exports = router