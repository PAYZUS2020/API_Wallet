const mongoose = require('mongoose');


const kycSchema = new mongoose.Schema({

    _id:{
        type:Number,
        required:true

    },
    front:{
        type:String,
        required:true
    },
    back:{
        type:String,
        required:true
    },
    message: {
        type:String
    },
    cardNumber:{
        type:String,
        required:true
    },
    
    date: {
        type:String
    },
    verified:{
        type:Boolean,
        required:true,
        default:false
    },
})


module.exports = mongoose.model('Kyc',kycSchema);