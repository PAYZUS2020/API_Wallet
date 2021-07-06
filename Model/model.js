const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    mnemonic:{
        type:String,
        required:true
    },
    privateKey: {
        type:String,
        required:true
    }
})


module.exports = mongoose.model('Pro',userSchema);


