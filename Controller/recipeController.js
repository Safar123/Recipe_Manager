const Recipe = require('../Model/recipeModel');
const sharp = require('sharp');
const APIFeatures= require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/globalError');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

//image upload similar to user
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(
            new GlobalError("Invalid file type. Please upload image only", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

//multiple file for image array in recipes minimum of 1 file to maximum of 3
exports.uploadRecipeImage = upload.fields([
    {name:'featuredImgURL', maxCount:1},
    {name:'images', maxCount:3}
])

exports.resizeRecipeImage =catchAsync( async (req, res, next) => {
    if (!req.files.featuredImgURL || !req.files.images) return next();
    const featuredImageUrlFilename = `recipe-${Math.floor(10)}-${Date.now()}-cover.jpeg` // for featured image

   await sharp(req.files.featuredImgURL[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/recipes/${featuredImageUrlFilename}`);
        req.body.featuredImgURL= featuredImageUrlFilename;
      
        req.body.images=[]; // images array
        await Promise.all(
            req.files.images.map(async (file, i)=>{
                const filename = `recipe-${req.params.id}-${Date.now()}- ${i+1}.jpeg`;
                await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/recipes/${filename}`);
                req.body.images.push(filename)
            })
        )
    next();
});



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

exports.markAsFavorite = catchAsync(async (req, res) => {
    // console.log('markAsFavorite', req.body);
    const { recipeId } = req.params;
    const userId = req.body.userId;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!recipe.favoritedBy.includes(userId)) {
        recipe.favoritedBy.push(userId);
        await recipe.save();
        res.status(200).json({ message: 'Recipe marked as favorite' });
    } else {
        recipe.favoritedBy.pop(userId);
        await recipe.save();
        res.status(200).json({ message: 'Recipe unmarked as favorite' });
    }

});

exports.getUserFavorites =catchAsync( async (req, res, next) => {
    console.log('getUserFavorites');
    
        const { userId } = req.params;

        // Find recipes where the userId exists in the 'favoritedBy' array
        const favoriteRecipes = await Recipe.find({ favoritedBy: userId });

        res.status(200).json({
            status: 'success',
            results: favoriteRecipes.length,
            recipes: favoriteRecipes
        });
   
    
});

exports.getSingleRecipe = catchAsync(async (req, res,next)=>{
        const oneRecipe= await Recipe.findById(req.params.id).populate('reviews');
        if(!oneRecipe){
          return next (new AppError(`Provided id ${req.params.id} is not found (or doesnt exist)`, 404));
        }

        res.status(200).json({
            status:'Success',
            recipe:oneRecipe
        })
    
   
})

exports.generateRecipe = catchAsync( async (req, res, next)=>{
   
        const genRecipe = await Recipe.create(req.body);
        if(!req.body){
          return next(new AppError (`Please provide all the required field to create recipe`, 400))
        }

        res.status(201).json({
            status:'success',
            created_Recipe: genRecipe
        })
    })

exports.updateRecipe = catchAsync(async (req, res, next) => {
    console.log('hit update recipie', req.body, req.params);
    // Find the recipe by ID. If not found, immediately return a 404 error to the client.
    const updateRecipe = await Recipe.findById(req.params.id);
    if (!updateRecipe) {
       return next (new AppError(` Recipe for provided ID: ${req.params.id} doesn't exist. Please check id before updating`, 404))
    }

    // Update the recipe with the new data provided in the request body.
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the modified document rather than the original.
        runValidators: true // Ensure validators defined in the Schema are run.
    });

    // If no document is updated, handle it as a server error (unlikely to occur if the above check passes).
    if (!updatedRecipe) {
     return next (new AppError(`Recipe with given ID: ${req.params.id} doesn't exist. Please check recipe ID` , 404))
    }

    // Return the updated recipe to the client.
    res.status(200).json({
        status: 'success',
        data: {
            recipe: updatedRecipe
        }
    });
});

// delete recipe from the server
exports.removeRecipe = catchAsync(async (req, res, next) => {
    // Try to find the recipe first
    const delRecipe = await Recipe.findById(req.params.id);

    // If no recipe is found, return a 404 error immediately and stop further execution
    if (!delRecipe) {
       return next (new AppError(`Recipe with given ID: ${req.params.id} doesn't exist. Please check recipe ID` , 404))
    }

    // If a recipe is found, proceed to delete it
    await Recipe.findByIdAndDelete(req.params.id);

    // Send a success response after deleting the recipe
    res.status(204).json({
        status: 'success',
        data: null // No need to send back any data
    });
});
