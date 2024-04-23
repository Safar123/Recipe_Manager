const express = require('express');

const recipeController= require('../Controller/recipeController');
const router = express.Router();

router.route('/top-5-recipe').get(recipeController.top5recipe, recipeController.getAllRecipe);

router.route('/')
.get(recipeController.getAllRecipe)
.post(recipeController.generateRecipe);

router.route('/:id')
.patch(recipeController.updateRecipe)
.delete(recipeController.removeRecipe)
.get(recipeController.getSingleRecipe);

module.exports = router;