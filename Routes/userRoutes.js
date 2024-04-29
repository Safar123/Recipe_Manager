const express = require("express");
const {
    signUpUser,
    logInUser,
    resizeUserImage,
    uploadUserImage,
    protectRoute,
    authorizationRoutes,
    forgetPassword,
    resetPassword,
    updatePassword,
    updateMe,
} = require("../Controller/authController");
const {
    getAllUser,
    getSingleUser,
    updateUserSelf,
    deleteUser,
} = require("../Controller/userController");

const router = express.Router();

router.route("/signup").post(signUpUser);

router.route("/")
    .get(protectRoute, authorizationRoutes("admin", "superadmin"), getAllUser);

router .route("/:id")
    .get(protectRoute, getSingleUser)
    .patch(protectRoute, updateUserSelf)
    .delete(protectRoute, deleteUser);

router.route("/login").post(logInUser);

router.patch("/resetPassword/:token", resetPassword);

router.post("/forgetPassword", forgetPassword);

router.patch("/login/updatePassword", protectRoute, updatePassword);

router.patch("/updateMe", protectRoute, updateMe);

module.exports = router;