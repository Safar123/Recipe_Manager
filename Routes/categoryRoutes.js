const express= require('express');
const categoryControllerController = require('../Controller/categoryController');
const authController = require('../Controller/authController');


router.route('/')
.get(categoryController.getCategory)
.post(authController.protectRoute,authController.authorizationRoutes('admin'),categoryController.createCategory);



module.exports = router; 