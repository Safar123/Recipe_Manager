const Category = require('../Model/categoryModel');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/globalError');


exports.createCategory = catchAsync(async (req,res,next)=>{
    console.log('cate');

    const newCat = await Category.create(req.body);
    res.status(201).json({
        status:'success',
        review:newCat
    })
    if(!newCat){
        return next (new AppError(' Something went wrong while posting your review', 400))
    }
});


exports.getCategories = catchAsync(async(req,res, next)=>{
    const categories = await Category.find();

    res.status(200).json({
        status:'success',
        number:categories.length,
        data:categories
    })
})
