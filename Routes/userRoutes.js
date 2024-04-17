const express = require('express');

const userController = require('../Controller/userController');
const router = express.Router();

router.route('/')
.get(userController.getUser)
.post(userController.createUser);

router.route('/:id')
.patch(userController.updateUser)
.delete(userController.deleteUser)
.get(userController.getSingleUser);

module.exports = router;