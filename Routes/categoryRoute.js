const express= require('express');
const reviewController = require('../Controller/categoryController');
const authController = require('../Controller/authController');

const router = express.Router({mergeParams:true})


router.route('/')
.get(authController.protectRoute, reviewController.getCategories)
.post(authController.protectRoute, reviewController.createCategory);


module.exports = router; 