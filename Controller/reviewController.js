const Review = require('../Model/reviewModel');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/globalError');


exports.createReview = catchAsync(async (req,res,next)=>{

    const newReview = await Review.create(req.body);
    res.status(201).json({
        status:'success',
        review:newReview
    })
});


exports.getReview = catchAsync(async(req,res, next)=>{

    const reviews = await Review.find();

    res.status(200).json({
        status:'success',
        number:reviews.length,
        review:reviews
    })
})
