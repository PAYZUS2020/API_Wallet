const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    _id:{
        type:Number,
        required:true

    },
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    referralCount:{
        type:Number,
        default:0
    },
    referralCountEarned:{
        type:Number,
        default:0
    },
    totalEarning:{
        type:Number,
        default:0
    },
    mnemonic:{
        type:String,
        required:true
    },
    privateKey: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    refferedBy: {
        type:String,
        default:"None"
    },
    refferedByEmail: {
        type:String,
        default:"None"
    },
    refferedTo: {
        type:Array,
    },
    kyc:{
        type:Boolean,
        default:false
    }
})


module.exports = mongoose.model('user',userSchema);

