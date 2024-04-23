const User = require('../Model/userModel');
const APIFeatures= require('../utils/apiFeatures');

exports.getUser= async (req, res)=>{
try{
    const features = new APIFeatures(User.find(), req.query).filter().paginate().limitFields().sort();
    const allUser = await features.query;
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
    res.status(400).json({
        status:'fail',
        message:err.message
    })     
}

}

exports.getSingleUser= async (req,res)=>{
    try{
        const singleUser = await User.findById(req.params.id);
        if(!singleUser){
            res.status(404).json({
                status:'fail',
                message:`No user with ${req.params.id}`
            })
        }
        res.status(200).json({
            status:'Success',
            user:singleUser
        })
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
    
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

exports.updateUser = async (req,res)=>{
    try{
        let changeUser= await User.findById(req.params.id)
        if(!changeUser){
            res.status(404).json({
                status:'fail',
                message:`No user exist for ${req.params.id}`
            })
        }
        changeUser = await User.findByIdAndUpdate(changeUser.id, req.body ,{
            new:true,
            runValidators:true
        })
        res.status(201).json({
            success:true,
            data:{
                updatedUser :changeUser
            }
        })
    }
    catch(err){
        req.status(500).json({
            status:'fail',
            message:err
        })
    }

}

exports.deleteUser = (req,res)=>{

}
