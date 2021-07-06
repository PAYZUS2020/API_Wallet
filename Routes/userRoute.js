const express = require('express')
const User = require('../Model/userModel')
const Key = require('../index')
const bodyParser = require('body-parser').json()
var crypto = require('crypto')
const cors = require('cors')
var generator = require('generate-password')
let { bech32, bech32m } = require('bech32')

const router = express.Router()

const app = express()
app.use(express.json())
app.use(cors())

var getHash = (pass, email) => {
  var hmac = crypto.createHmac('sha512', email)

  //passing the data to be hashed
  data = hmac.update(pass)
  //Creating the hmac in the required format
  gen_hmac = data.digest('hex')
  //Printing the output on the console
  console.log('hmac : ' + gen_hmac)
  return gen_hmac
}

//Retriving all the Users frim the DB
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json({ status: 1, result: users })
    console.log(users.length)
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})


// GET USER BY ID
router.get('/:id', async (req, res) => {
  try {
    const users = await User.findById(req.params.id)
    res.json({ status: 1, result: users })
    console.log(users.length)
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})

// CONVERT PUBLIC ADDRESS TO BECH
router.post('/getBech', async (req, res) => {
  try {
    const address=req.body.address
    const pub=address.substring(address.length - 40, address.length) 
    console.log(pub)
    let words = bech32.toWords(Buffer.from(pub, 'hex'))
    const b=bech32.encode('bnb', words)
    res.json({ status: 1, bech: b })
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})





//SIGN UP CODE
router.post('/signup', bodyParser, async (req, res) => {
  try {
    var tot = await User.find()

    const result2 = tot.filter((user) => {
      return req.body.email === user.email
    })

    if (result2.length === 0) {
      if (req.body.refferal !== undefined) {
        const result1 = tot.filter((user) => {
          return req.body.refferal === user.email
        })

        if (result1.length === 1) {
          const userRef = result1[0]

          var a = Key.generateMnemonic()
          var b = Key.generatePrivKey(a)
          var c = Key.derivePubKey(b)
          var d = Key.deriveEthAddress(c)

          var id = tot.length + 1
          var name = req.body.name
          var email = req.body.email
          var password = req.body.password
          var phone = req.body.phone


          // MESSAGE DIGEST the Password with Email

          const hashDigest = getHash(password, email)

          var user = new User({
            _id: id,
            name: name,
            email: email,
            phone: phone,
            password: hashDigest,
            mnemonic: a,
            privateKey: b.toString('hex'),
            address: d,
            refferedBy: userRef.name,
            refferedByEmail: userRef.email,
          })

          user.save().then((result) => {
            res.json({ status: 1, message: 'user registered', result: result })
          })
        } else {
          res.json({ status: 0, message: 'Invalid Refferal' })
        }
      } else {
        var a = Key.generateMnemonic()
        var b = Key.generatePrivKey(a)
        var c = Key.derivePubKey(b)
        var d = Key.deriveEthAddress(c)

        var id = tot.length + 1
        var name = req.body.name
        var email = req.body.email
        var password = req.body.password
        var phone = req.body.phone

        // MESSAGE DIGEST the Password with Email
        const hashDigest = getHash(password, email)

        var user = new User({
          _id: id,
          name: name,
          email: email,
          phone: phone,
          password: hashDigest,
          mnemonic: a,
          privateKey: b.toString('hex'),
          address: d,
        })

        user.save().then((result) => {
          res.json({ status: 1, message: 'user registered', result: result })
        })
      }
    } else {
      res.json({ status: 0, message: 'Email Already Registered' })
    }
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})

router.post('/login', bodyParser, async (req, res) => {
  try {
    var tot = await User.find()

    const result2 = tot.filter((user) => {
      return req.body.email === user.email
    })

    if (result2.length === 1) {
      var email = req.body.email
      var password = req.body.password
      
      // MESSAGE DIGEST the Password with Email     
      const hashDigest = getHash(password, email)
      console.log(result2[0].password)

      if (hashDigest.localeCompare(result2[0].password) === 0) {
        res.json({ status: 1, message: 'User Logged In', result: result2 })
      } else {
        res.json({ status: 0, message: 'Username/Password is Invalid' })
      }
    } else {
      res.json({ status: 0, message: 'User Not Registered' })
    }
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})

router.post('/resetPassword', bodyParser, async (req, res) => {
  try {
    var tot = await User.find()

    const result2 = tot.filter((user) => {
      return req.body.email === user.email
    })

    if (result2.length === 1) {
      var nodemailer = require('nodemailer')

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'anshumanchatterjee.shree@gmail.com',
          pass: 'anshumanchatterjee',
        },
      })
      

      var password1 = generator.generate({
        length: 10,
        numbers: true,
      })

      var mailOptions = {
        from: 'anshumanchatterjee.shree@gmail.com',
        to: req.body.email,
        subject: 'Reset Password',
        text: `Hi , Your new password is `+password1,
        // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })

      var email = req.body.email
      var password = password1

      const hashDigest = getHash(password, email)
      const userRef = result2[0]
      userRef.password = hashDigest
      userRef.save().then((result) => {
        console.log(result)
      })
      res.json({ status: 1, message: 'Password Successfully Changed' })
    } else {
      res.json({ status: 0, message: 'User Not Registered' })
    }
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})

module.exports = router
