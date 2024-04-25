const Recipe = require('../Model/recipeModel');
const APIFeatures= require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/globalError');


exports.top5recipe = (req, res, next)=>{
    req.query.limit='5';
    req.query.sort='-cookingTime, avgRating';
    req.query.fields='title, description, steps, productionCost',
    next();
}

exports.getAllRecipe =catchAsync(async (req, res, next)=>{

        const features = new APIFeatures(Recipe.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const allRecipe = await features.query;
        res.status(200).json({
            status:'success',
            recipes: allRecipe
        })
})

exports.getSingleRecipe = catchAsync(async (req, res,next)=>{
        const oneRecipe= await Recipe.findById(req.params.id);
        if(!oneRecipe){
          return next (new AppError(`Provided id ${req.params.id} is not valid`, 404));
        }

        res.status(200).json({
            status:'Success',
            recipe:oneRecipe
        })
    
   
})

exports.generateRecipe = catchAsync( async (req, res, next)=>{
   
        const genRecipe = await Recipe.create(req.body);
        if(!req.body){
          res.status(400).json({
            status:'fail',
            message:'Please provide all the information required  (* Required Field)'
          })
        }

        res.status(201).json({
            status:'success',
            created_Recipe: genRecipe
        })
    })

exports.updateRecipe =catchAsync( async (req, res, next)=>{
    
        let updateRecipe = await Recipe.findById(req.params.id);
        if(!updateRecipe || updateRecipe.length === 0){
            res.status(404).json({
                status:'fail',
                message:`No recipe by such ${req.params.id} id`
            })
        }
        updateRecipe= await Recipe.findByIdAndUpdate(updateRecipe.id, req.body, {
            new:true,
            runValidators:true
        })

})

exports.removeRecipe = catchAsync(async (req,res, next)=>{
        let delRecipe = await Recipe.findById(req.params.id);
        if(!delRecipe || delRecipe.length === 0){
            res.status(404).json({
                status:'fail',
                message:`No such recipe by ${req.params.id} id`
            })
        }

        delRecipe = await Recipe.findByIdAndDelete(delRecipe.id);
    }
)