const express= require('express');
const reviewController = require('../Controller/reviewController');
const authController = require('../Controller/authController');
const router = express.Router()


router.route('/')
.get(reviewController.getReview)
.post(authController.protectRoute, reviewController.createReview);



module.exports = router;