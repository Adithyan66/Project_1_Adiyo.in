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

// import bcrypt from "bcryptjs";
// import { generateOTP, sendOTPEmail } from "../services/otpService.js";
// import { generateResetToken } from '../services/tokenService.js';
// import User from "../models/userModel.js";
// import Otp from "../models/otpModel.js";


// export const signupOTP = async (req, res) => {

//     const { email } = req.body;

//     try {

//         const user = await User.findOne({ email });

//         if (user) return res.status(NOT_FOUND).json({
//             status: false,
//             message: 'email already exixt'
//         });

//         const otp = generateOTP();

//         const otpRecord = new Otp({
//             email,
//             otp,
//         });

//         await otpRecord.save();

//         await sendOTPEmail(email, otp);

//         res.json({
//             status: true,
//             message: 'OTP sent to your email.'
//         });


//     } catch (error) {

//         console.error(error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: 'Server error'
//         });

//     }
// }



// export const validateOTP = async (req, res) => {

//     const { email, otp } = req.body;

//     try {

//         const otpRecord = await Otp.findOne({ email });
//         if (!otpRecord) {
//             return res.status(NOT_FOUND).json({ message: 'Email not found or OTP expired' });
//         }


//         if (otpRecord.otp !== otp) {
//             return res.status(BAD_REQUEST).json({ message: 'Invalid OTP' });
//         }


//         const expirationTime = 10 * 60 * 1000;
//         if (Date.now() - otpRecord.createdAt.getTime() > expirationTime) {
//             return res.status(BAD_REQUEST).json({ message: 'OTP expired' });
//         }


//         const user = await User.findOne({ email });

//         if (user) {

//             const resetToken = generateResetToken();
//             user.resetPasswordToken = resetToken;

//             await user.save();

//             await otpRecord.deleteOne();

//             return res.json({
//                 success: true,
//                 message: 'OTP validated successfully',
//                 resetToken,
//             });
//         }

//         await otpRecord.deleteOne();


//         res.json({
//             success: true,
//             message: 'OTP validated successfully',
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
//     }
// };



// export const changeEmailOtp = async (req, res) => {

//     const id = req.params.id;

//     try {
//         const { password, newEmail } = req.body;

//         const user = await User.findById(id);
//         if (!user) {

//             return res.status(NOT_FOUND).json({ success: false, message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {

//             return res.status(BAD_REQUEST).json({ success: false, message: "Invalid password" });
//         }

//         const existingUser = await User.findOne({ email: newEmail });

//         if (existingUser) {

//             return res.status(BAD_REQUEST).json({ success: false, message: "Email already exists" });
//         }

//         const otp = generateOTP();
//         const otpRecord = new Otp({
//             otp,
//             email: newEmail
//         });
//         await otpRecord.save();

//         await sendOTPEmail(newEmail, otp);

//         return res.status(OK).json({
//             success: true,
//             message: "OTP sent successfully"
//         });
//     } catch (error) {

//         console.error("error change email", error);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "servor error"
//         });
//     }
// };










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

import bcrypt from "bcryptjs";
import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";

export const signupOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(CONFLICT).json({
                success: false,
                message: messages.AUTH.USER_ALREADY_EXISTS
            });
        }

        const otp = generateOTP();
        const otpRecord = new Otp({
            email,
            otp,
        });

        await otpRecord.save();
        await sendOTPEmail(email, otp);

        res.status(OK).json({
            success: true,
            message: messages.AUTH.SIGNUP_OTP_SENT
        });
    } catch (error) {
        console.error("Error sending signup OTP:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.AUTH.SIGNUP_OTP_FAILED
        });
    }
};

export const validateOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.AUTH.OTP_NOT_FOUND
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.OTP_INVALID
            });
        }

        const expirationTime = 10 * 60 * 1000;
        if (Date.now() - otpRecord.createdAt.getTime() > expirationTime) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.OTP_EXPIRED
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            const resetToken = generateResetToken();
            user.resetPasswordToken = resetToken;

            await user.save();
            await otpRecord.deleteOne();

            return res.status(OK).json({
                success: true,
                message: messages.AUTH.OTP_VALIDATED_SUCCESSFULLY,
                resetToken,
            });
        }

        await otpRecord.deleteOne();

        res.status(OK).json({
            success: true,
            message: messages.AUTH.OTP_VALIDATED_SUCCESSFULLY
        });
    } catch (error) {
        console.error("Error validating OTP:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.AUTH.OTP_VALIDATION_FAILED
        });
    }
};

export const changeEmailOtp = async (req, res) => {
    const id = req.params.id;

    try {
        const { password, newEmail } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.INVALID_PASSWORD
            });
        }

        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(CONFLICT).json({
                success: false,
                message: messages.AUTH.EMAIL_ALREADY_EXISTS
            });
        }

        const otp = generateOTP();
        const otpRecord = new Otp({
            otp,
            email: newEmail
        });
        await otpRecord.save();

        await sendOTPEmail(newEmail, otp);

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.CHANGE_EMAIL_OTP_SENT
        });
    } catch (error) {
        console.error("Error sending email change OTP:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.AUTH.CHANGE_EMAIL_OTP_FAILED
        });
    }
};