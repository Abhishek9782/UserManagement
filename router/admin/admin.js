const router = require('express').Router()

const Alogin = require('../../models/admin/adminlogin')
const Banner = require('../../models/pageScema')
const Query = require('../../models/admin/queryform');
const Reg = require('../../models/regScema')
//multer image ke liye late hai
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploadimg')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
});


//ye upload middle ware function ka kaam krega 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 4 }  //4mb
})

// page pr security lagane ke liye Takui koi hamara Page Open Na kr Paye Url Se
function check(req, res, next) {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/admin/')
    }

}


//pages


router.get('/', (req, res) => {
    res.render('admin/adminlogin.ejs')
})
router.get('/AdminPassword', async (req, res) => {
    const use = process.env.USERNAME;
    const passs = process.env.PASSWORD
    const admin2 = new Alogin({ name: use, password: passs })
    await admin2.save()
    console.log(admin2)
})
router.post('/test', async (req, res) => {
    const { name, password } = req.body
    const login = await Alogin.findOne({ name: name })
    console.log(login)

    if (login !== null) {
        req.session.isAuth = true;
        if (login.password == password) {
            res.redirect('/admin/dashboard')
        } else {
            res.redirect('/admin/')

        }

    } else { res.redirect('/admin/') }
    // console.log('You Don\'t Have Password')
})
router.get('/dashboard', check, (req, res) => {
    res.render('admin/dashboard.ejs')
})
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/')
})
router.get('/banner', async (req, res) => {
    const bannerRecord = await Banner.findOne()
    res.render('admin/banner.ejs', { bannerRecord: bannerRecord })
})
router.get('/data', async (req, res) => {
    const bannerRecord = await Banner.findOne()
    res.render('admin/data.ejs', { bannerRecord: bannerRecord })
})
router.post('/update/:id', upload.single('img'), async (req, res) => {
    const id = req.params.id
    const { title, desc, longdesc } = req.body
    if (req.file) { await Banner.findByIdAndUpdate(id, { title: title, desc: desc, longdesc: longdesc, images: req.file.filename }) }


    else { await Banner.findByIdAndUpdate(id, { title: title, desc: desc, longdesc: longdesc }) }

    res.redirect('/admin/banner')

})
router.post('/queryform', check, async (req, res) => {
    const { email, address } = req.body
    const read = 'unread'
    const queryRecord = new Query({ email: email, address: address, read: read })
    await queryRecord.save()
    res.redirect('/')
})
router.get('/query', async (req, res) => {

    const queryV = await Query.find()
    res.render('admin/query.ejs', { queryV: queryV })

})
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id
    const delsete = await Query.findByIdAndDelete(id)
    res.redirect('/admin/query')

})
router.get('/update/:id', async (req, res) => {
    const id = req.params.id
    const updateRead = await Query.findById(id)

    let a = null
    if (updateRead.read == 'unread') {
        a = 'read'
    } else {
        a = 'unread'
    }
    await Query.findByIdAndUpdate(id, { read: a })
    res.redirect('/admin/query')
})
router.post('/seaction', async (req, res) => {
    const { search } = req.body
    const queryV = await Query.find({ read: search })
    console.log(queryV)
    res.render('admin/query.ejs', { queryV: queryV })


})

router.get('/', async (req, res) => {
    const bannerRecord = await Banner.findOne()
    res.render('index.ejs', { bannerRecord: bannerRecord })
})


// image uplaoding 
router.get('/uploadimage', (req, res) => {
    res.render('admin/imgupload')
})
router.post('/uploadimage', upload.single('img'), (req, res) => {
    //upload middle ware finction ko yha pr call krwa liya hai
    console.log(req.file.filename)
})
router.get('/status', async (req, res) => {
    const regRecord = await Reg.find()
    res.render('admin/status.ejs', { regRecord: regRecord })
})
router.get('/userupdate/:id', async (req, res) => {
    const id = req.params.id
    const userrecord = await Reg.findById(id)

    let a = null;
    if (userrecord.status == 'suspended') {
        a = 'active'
    } else {
        a = 'suspended'
    }
    await Reg.findByIdAndUpdate(id, { status: a })
    res.redirect('/admin/status')


})
router.get('/role/:id', async (req, res) => {
    const id = req.params.id
    const userrecord = await Reg.findById(id)

    let a = null;
    if (userrecord.role == 'public') {
        a = 'pvt'
    } else {
        a = 'public'
    }
    await Reg.findByIdAndUpdate(id, { role: a })
    res.redirect('/admin/status')


})



module.exports = router