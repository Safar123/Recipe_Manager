const User = require("../Model/userModel");
const AppError = require("../utils/globalError");
const catchAsync = require("../utils/catchAsyncError");
const path = require('path');


    exports.getAllUser = catchAsync(async (req, res, next) => {
      
            const allUser = await User.find();
            if (!allUser || allUser.length === 0) {
                return next(new AppError("No user listed yet", 404));
            }
            res.status(200).json({
                success: true,
                numberOfUser: allUser.length,
                data: {
                    users: allUser,
                },
            });
        
    });


exports.getSingleUser = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;

        const findUser = await User.findById(id);
        if (!findUser) {
            return next(
                new AppError(`User doesn't exist for ${id} ID`, 404)
            );
        }

        console.log('getSingleUser', findUser);

        res.status(200).json({
            success: true,
            data: {
                user: findUser,
            },
        });
    } catch (e) {
        console.error(e);
    }
});


exports.getUserImage = catchAsync(async (req, res) => {
    // console.log(req.params.filename, "getImage");
    try {
        const filename = req.params.filename;
        const imagePath = path.join(__dirname, '../public/images/users', filename);

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

exports.updateUserSelf = catchAsync(async (req, res, next) => {
    let userDetail = await User.findById(req.params.id);

    if (req.user.id !== userDetail.id) {
        return next(new AppError('You can not update someone else information', 403))
    }

    if (!userDetail)
        return next(
            new AppError(`User doesn't exist for ${userDetail.id} ID`, 404)
        );

    userDetail = await User.findByIdAndUpdate(userDetail.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: {
            user: userDetail,
        },
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = req.user;
    if (user.id !== req.params.id && !user.role.includes('admin', 'superadmin')) {

        return next(new AppError('You cannot delete someone else information'), 403)
    }

    let removeUser = await User.findById(req.params.id);
    if (!removeUser)
        return next(
            new AppError(`User doesn't exist for ${removeUser.id} ID`, 404)
        );

    removeUser = await User.findByIdAndUpdate(req.params.id, { active: false });

    res.status(203).json({
        success: true,
        message: "User has been removed",
    });
});