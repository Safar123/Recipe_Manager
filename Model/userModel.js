const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Username is required'],
        unique:true
    },
    email:{
        type: String,
        required:[true, 'valid email address is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Please set strong password']
    },

    confirmPassword:{
        type:String
    },
    bio:{
        type:String,
        required:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})
const User= mongoose.model('User', userSchema);
module.exports= User;