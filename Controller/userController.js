const User = require('../Model/userModel');

exports.getUser= async (req, res)=>{
try{
    const allUser = await User.find();
    if (!allUser){
        res.status(200).json({
            status:'success',
            message:'No user yet'
        })
    } 

    res.status(200).json({
        status:'success',
        users: allUser
    })
 
}
catch(err){
        
}

}

exports.getSingleUser= (req,res)=>{
    
}

exports.createUser= async (req,res)=>{
    try{
        const newUser= await User.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                user:newUser
            }
        })
    }
   catch(err){
    res.status(400).json({
        status:'fail',
        message:err
    })

   }

}

exports.updateUser = (req,res)=>{

}

exports.deleteUser = (req,res)=>{

}
