const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    review:{
        type:String,
        required:[true, 'Review is required']
    },

    ratings:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    recipe:{
        type:mongoose.Schema.ObjectId,
        ref:'Recipe',
        required:[true, 'Review must belong to the recipe']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'Only logged in user can add reviews']
    }
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;