const express= require('express');
const reviewController = require('../Controller/reviewController');
const authController = require('../Controller/authController');

//nested routes for posting reviews that use "/api/v1/recipe/:recipeId/reviwes"
const router = express.Router({mergeParams:true})


router.route('/')
.get(reviewController.getReview)
.post(authController.protectRoute, reviewController.createReview);



module.exports = router; 