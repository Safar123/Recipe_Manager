const express = require('express');

const recipeController= require('../Controller/recipeController');
const router = express.Router();

router.route('/')
.get(recipeController.getAllRecipe)
.post(recipeController.generateRecipe);

router.route('/:id')
.patch(recipeController.updateRecipe)
.delete(recipeController.delRecipe)
.get(recipeController.getSingleRecipe);