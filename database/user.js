const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/passportjsfromstarting').then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err);
})

const userSchema=mongoose.Schema({
    username:String,
    password:String
})

module.exports=mongoose.model('user',userSchema);