const Recipe = require('../Model/recipeModel');
const sharp = require('sharp');
const path = require('path');
const APIFeatures= require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/globalError');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const multerStorage = multer.memoryStorage();
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
    {name:'featuredImage', maxCount:1},
    {name:'images', maxCount:3}
])

exports.resizeRecipeImage = catchAsync(async (req, res, next) => {
    try {
        if (req.files.featuredImage) {
          const featuredImageFilename = `${uuidv4()}-cover.jpeg`;
    
          await sharp(req.files.featuredImage[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/recipes/${featuredImageFilename}`);
    
        //   req.body.featuredImage = featuredImageFilename;
          req.body.featuredImgURL = featuredImageFilename;
        }
    
        if (req.files.images) {
          req.body.imagesURL = [];
          await Promise.all(
            req.files.images.map(async (file, i) => {
              const filename = `${uuidv4()}-${i + 1}.jpeg`;
              await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/recipes/${filename}`);
    
              req.body.imagesURL.push(filename);
            })
          );
        }
    
        next();
      } catch (error) {
        console.error(error);
        return next(error);
      }
});

exports.getRecipeImage = catchAsync(async (req, res) => {
    // console.log(req.params.filename, "getImage");
    try {
        const filename = req.params.filename;
        const imagePath = path.join(__dirname, '../public/images/recipes', filename);

        res.sendFile(imagePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error("File not found:", imagePath);
                    res.status(404).json({
                        status: 'fail',
                        message: 'File not found'
                    });
                } else {
                    console.error("Error sending file:", err);
                    res.status(500).json({
                        status: 'fail',
                        message: 'An internal server error occurred'
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            status: 'fail',
            message: 'An internal server error occurred'
        });
    }
    
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

exports.getUserFavorites = async (req, res, next) => {
    // console.log('getUserFavorites');
    try {
        const { userId } = req.params;

        // Find recipes where the userId exists in the 'favoritedBy' array
        const favoriteRecipes = await Recipe.find({ favoritedBy: userId });

        res.status(200).json({
            status: 'success',
            results: favoriteRecipes.length,
            recipes: favoriteRecipes
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getSingleRecipe = catchAsync(async (req, res,next)=>{
        const oneRecipe= await Recipe.findById(req.params.id);
        if(!oneRecipe){
          return next (new AppError(`Provided id ${req.params.id} is not found (or doesnt exist)`, 404));
        }

        res.status(200).json({
            status:'Success',
            recipe:oneRecipe
        })
    
   
})

exports.generateRecipe = catchAsync(async (req, res, next) => {
    console.log('Generating recipe', req.body);

    // Check if the request body is empty or missing required fields
    if (!req.body || !req.body.title || !req.body.ingredients) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide all the required information (* Required Field)'
        });
    }

    try {
        // Attempt to create the recipe
        const genRecipe = await Recipe.create(req.body);

        // Return a success response
        res.status(201).json({
            status: 'success',
            created_Recipe: genRecipe
        });
    } catch (error) {
        // Handle database or other errors
        console.error('Error generating recipe:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while generating the recipe.'
        });
    }
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
    console.log('hit update recipie', req.body, req.params);
    // Find the recipe by ID. If not found, immediately return a 404 error to the client.
    const updateRecipe = await Recipe.findById(req.params.id);
    if (!updateRecipe) {
        return res.status(404).json({
            status: 'fail',
            message: `No recipe found with ID ${req.params.id}`
        });
    }

    // Update the recipe with the new data provided in the request body.
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the modified document rather than the original.
        runValidators: true // Ensure validators defined in the Schema are run.
    });

    // If no document is updated, handle it as a server error (unlikely to occur if the above check passes).
    if (!updatedRecipe) {
        return res.status(500).json({
            status: 'error',
            message: 'The recipe could not be updated.'
        });
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
        return res.status(404).json({
            status: 'fail',
            message: `No such recipe by ID ${req.params.id}`
        });
    }

    // If a recipe is found, proceed to delete it
    await Recipe.findByIdAndDelete(req.params.id);

    // Send a success response after deleting the recipe
    res.status(204).json({
        status: 'success',
        data: null // No need to send back any data
    });
});
