const mongoose = require('mongoose');
const mongoDB = require('mongodb');
const express = require('express');
const cors = require('cors')
const upload = require('express-fileupload')
const path =require('path')

const userRoute= require('./Routes/userRoute');
const kycRoutes= require('./Routes/kycRoutes');

const app=express();
app.use(express.json())
app.use(cors())
app.use(upload())

app.use('/uploads',express.static(__dirname+'/uploads'));
  

app.use('/users',userRoute);
app.use('/kyc',kycRoutes);




const DB="mongodb+srv://Anshuman:Anshuman@cluster0.wchsk.mongodb.net/PAYZUS?retryWrites=true&w=majority";


mongoose.connect(DB,{useNewUrlParser: true}).then(()=>{
    console.log("established")
}).catch((e)=>{
    console.log(e)
})


app.listen(process.env.port || 9000,()=>{
    console.log('hello');
});