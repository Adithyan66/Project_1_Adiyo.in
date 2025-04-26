

// import bcrypt from "bcryptjs";
// import cloudinary from "../config/cloudinary.js";
// import User from "../models/userModel.js";
// import Otp from "../models/otpModel.js";
// import HttpStatusCode from "../utils/httpStatusCodes.js";

// const {
//     OK,
//     CREATED,
//     ACCEPTED,
//     NO_CONTENT,
//     BAD_REQUEST,
//     UNAUTHORIZED,
//     FORBIDDEN,
//     NOT_FOUND,
//     METHOD_NOT_ALLOWED,
//     CONFLICT,
//     UNPROCESSABLE_ENTITY,
//     INTERNAL_SERVER_ERROR,
//     BAD_GATEWAY,
//     SERVICE_UNAVAILABLE,
//     GATEWAY_TIMEOUT
// } = HttpStatusCode

// const salt = await bcrypt.genSalt(10);



// export const profileDetails = async (req, res) => {

//     try {
//         const user = await User.findById(req.user.userId).select('-password');

//         if (!user) {
//             return res.status(NOT_FOUND).json({ success: false, message: "User not found" });
//         }

//         return res.status(OK).json({
//             status: true,
//             message: "fetched succesfully",
//             user
//         });

//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }


// export const updateProfile = async (req, res) => {

//     const {
//         username,
//         firstName,
//         lastName,
//         gender,
//         dateOfBirth,
//         mobile
//     } = req.body;

//     try {
//         const userId = req.user.userId;

//         let imageUrl = undefined;

//         if (req.file) {
//             const profileImage = req.file.path;
//             const cloudinaryResult = await cloudinary.uploader.upload(profileImage, {
//                 folder: "Adiyo/profilePic"
//             });
//             imageUrl = cloudinaryResult.secure_url;
//         }

//         const updateData = {
//             ...(username && { username }),
//             ...(firstName && { firstName }),
//             ...(lastName && { lastName }),
//             ...(gender && { gender }),
//             ...(dateOfBirth && { dateOfBirth }),
//             ...(mobile && { mobile }),
//             ...(imageUrl && { profileImg: imageUrl }),
//             updatedAt: new Date()
//         };


//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             updateData,
//             { new: true, runValidators: true }
//         ).select('-password');

//         if (!updatedUser) {
//             return res.status(NOT_FOUND).json({
//                 status: false,
//                 message: "User not found"
//             });
//         }

//         return res.status(OK).json({
//             status: true,
//             message: "Profile updated successfully",
//             data: updatedUser
//         });
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "Failed to update profile",
//             error: error.message
//         });
//     }
// };


// export const changeEmail = async (req, res) => {

//     const id = req.params.id;

//     try {
//         const { otp, newEmail } = req.body;

//         const verify = await Otp.findOne({ email: newEmail });
//         if (!verify || verify.otp !== otp) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "OTP does not match"
//             });
//         }

//         const user = await User.findByIdAndUpdate(id, { email: newEmail }, { new: true });

//         return res.status(OK).json({
//             success: true,
//             message: "Email ID changed successfully",
//             user
//         });
//     } catch (error) {
//         console.error("error change email", error);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: error.message || "Server Error"
//         });
//     }
// };


// export const changePassword = async (req, res) => {

//     const id = req.params.id

//     try {
//         const { currentPassword, newPassword } = req.body

//         const user = await User.findById(id)

//         const isMatch = await bcrypt.compare(currentPassword, user.password)

//         if (!isMatch) {

//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "invalid credentials"
//             })
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, salt)

//         const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

//         res.status(OK).json({
//             success: true,
//             message: "password changed succesfully",
//             updatedUser
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }




import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import HttpStatusCode from "../utils/httpStatusCodes.js";
import messages from "../utils/messages.js";

const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode;

const salt = await bcrypt.genSalt(10);

export const profileDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.USER.NOT_FOUND
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.USER.FETCHED_SUCCESSFULLY,
            user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.USER.FAILED_FETCH
        });
    }
};

export const updateProfile = async (req, res) => {
    const {
        username,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        mobile
    } = req.body;

    try {
        const userId = req.user.userId;
        let imageUrl = undefined;

        if (req.file) {
            const profileImage = req.file.path;
            const cloudinaryResult = await cloudinary.uploader.upload(profileImage, {
                folder: "Adiyo/profilePic"
            });
            imageUrl = cloudinaryResult.secure_url;
        }

        const updateData = {
            ...(username && { username }),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(gender && { gender }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(mobile && { mobile }),
            ...(imageUrl && { profileImg: imageUrl }),
            updatedAt: new Date()
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.USER.NOT_FOUND
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.USER.UPDATED_SUCCESSFULLY,
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.USER.FAILED_UPDATE
        });
    }
};

export const changeEmail = async (req, res) => {
    const id = req.params.id;

    try {
        const { otp, newEmail } = req.body;
        const verify = await Otp.findOne({ email: newEmail });
        if (!verify || verify.otp !== otp) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.USER.INVALID_OTP
            });
        }

        const user = await User.findByIdAndUpdate(id, { email: newEmail }, { new: true });
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.USER.NOT_FOUND
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.USER.EMAIL_UPDATED_SUCCESSFULLY,
            user
        });
    } catch (error) {
        console.error("Error changing email:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.USER.FAILED_EMAIL_UPDATE
        });
    }
};

export const changePassword = async (req, res) => {
    const id = req.params.id;

    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.USER.NOT_FOUND
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.USER.INVALID_PASSWORD
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        res.status(OK).json({
            success: true,
            message: messages.USER.PASSWORD_UPDATED_SUCCESSFULLY,
            updatedUser
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.USER.FAILED_PASSWORD_UPDATE
        });
    }
};