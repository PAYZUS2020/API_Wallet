const express = require('express');
const User = require('../Model/model');
const Key= require('../index')
const bodyParser=require('body-parser').json();

const router = express.Router();

const app=express();



app.use(express.json());


router.get('/',async (req,res)=>{

    try{
        const users=await User.find()
        res.json({status:1, result: users})
        console.log(users.length)
    }
    catch(e)
    {
        res.json({status:0 , message: e})
    }
    
})

router.get('/createUser',async (req,res)=>{
    
    var a=Key.generateMnemonic();
    var b=Key.generatePrivKey(a);
    var c=Key.derivePubKey(b);
    var d=Key.deriveEthAddress(c);

    const user= new User({
        mnemonic:a,
        privateKey:b.toString('hex')
    })

    try{
        await user.save()
        res.json({status:1 , address:d})
        
    }
    catch(e)
    {
        res.json({status:0 , message: e})
    }
    
})


    



module.exports = router;