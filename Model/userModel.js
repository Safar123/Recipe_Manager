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
        unique:[true, "Email already exist provide new email or LogIn"],
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true, 'Please set strong password'],
        minlength:[8, "Password must be atleast 8 character long"]
    },

    confirmPassword:{
        type:String,
        required:[true, 'Confirm Password must match initial password']
    },
    bio:{
        type:String,
        required:false
    },
    role:{
        type:String,
        enum:["user", "admin", "superadmin" ],
        default:"user"
    },
    image:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
const User= mongoose.model('User', userSchema);
module.exports= User;