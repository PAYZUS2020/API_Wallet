const express = require('express')
const Kyc = require('../Model/kycModal')
const User = require('../Model/userModel')
const bodyParser = require('body-parser').json()
const cors = require('cors')
const upload = require('express-fileupload')

const router = express.Router()

const app = express()
app.use(express.json())
app.use(cors())
app.use(upload())

//Retriving all the Users frim the DB
router.get('/', async (req, res) => {
  try {
    const users = await Kyc.find()
    res.json({status:1, result: users })
    console.log(users.length)
  } catch (e) {
    res.json({status:0, message:e})
  }
})

//Retriving the images frim the DB
router.get('/image', async (req, res) => {
    try {
      const users = await User.findById(req.params.id)
      res.json({status:1, result: users })
      console.log(users.length)
    } catch (e) {
      res.json({status:0, message:e})
    }
  })
  


//Upload KYC CODE
router.post('/uploadKYC', async (req, res) => {
  try {
    var tot = await User.find()

    const result2 = tot.filter((user) => {
      return req.body.email === user.email
    })

    if (result2.length === 1) {
      console.log(req.body)
      var file1 = req.files.front
      var file2 = req.files.back
      var email = req.body.email
      var id = req.body._id
      var cnum = req.body.cnumber
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()

      var date1 = mm + '/' + dd + '/' + yyyy

      file1.mv('./uploads/front_' + email + '_' + file1.name, function (err) {
        if (err) {
          res.json({ status: 0, message: 'not uploaded' })
        } else {
          file2.mv('./uploads/back_' + email + '_' + file2.name, function (
            err,
          ) {
            if (err) {
              res.json({ status: 0, message: 'not uploaded' })
            } else {
              var kycuser = new Kyc({
                _id:id,
                front: 'front_' + email + '_' + file1.name,
                back: 'back_' + email + '_' + file2.name,
                verified: false,
                date: date1,
                cardNumber:cnum
              })
              kycuser.save().then((result) => {
                console.log(result)
              })

              res.json({ status: 1, message: 'Files uploaded successfully' })
            }
          })
        }
      })
    } else {
      res.json({ status: 0, message: 'User Not Registered' })
    }
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})


//Approve KYC code
router.post('/approve', bodyParser, async (req, res) => {
  try {
    var tot1 = await Kyc.find()
    var tot2 = await User.find()
    var id = req.body.id;
    const result1 = tot1.filter((user) => {
      return id === user._id
    })
    const result2 = tot2.filter((user) => {
      return id === user._id
    })

    result1[0].verified=true;
    result1[0].save().then((result) => {
      console.log(result);
    })

    result2[0].totalEarning=100000
    result2[0].kyc=true
    result2[0].save().then((result) => {
      console.log(result);
    })


    const result3 = tot2.filter((user) => {
      return result2[0].refferedByEmail === user.email
    })
    if(result3.length===1)
    {
      const userRef=result3[0];
      userRef.referralCount = userRef.referralCount + 1;
      userRef.refferedTo.push({"name":result2[0].name,"email":result2[0].email});
      userRef.totalEarning = userRef.totalEarning + 1000;
      userRef.save().then((result) => {
            console.log(result);
            res.json({ status: 1, message: "" })
          })
    }
    else{
      res.json({ status: 1, message: "" })
    }
    

    
    
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})


module.exports = router
