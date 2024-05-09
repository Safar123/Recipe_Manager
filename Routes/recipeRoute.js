const express = require('express');

const recipeController= require('../Controller/recipeController');
const reviewRouter = require('../Routes/reviewRoutes');
const authController = require('../Controller/authController');
const router = express.Router();

router.route('/top-5-recipe').get(recipeController.top5recipe, recipeController.getAllRecipe);

router.use('/:recipeId/reviews', reviewRouter);

router.route('/')
.get(authController.protectRoute, recipeController.getAllRecipe)
.post(authController.protectRoute, 
    recipeController.uploadRecipeImage, 
    recipeController.resizeRecipeImage, 
    recipeController.generateRecipe);

router.route('/:id')
.patch(recipeController.uploadRecipeImage, 
    recipeController.resizeRecipeImage, 
    recipeController.updateRecipe)
.delete(recipeController.removeRecipe)
.get(recipeController.getSingleRecipe);

router.route('/:recipeId/favorite').patch(recipeController.markAsFavorite);
router.route('/favorites/:userId').get(recipeController.getUserFavorites);



module.exports = router;