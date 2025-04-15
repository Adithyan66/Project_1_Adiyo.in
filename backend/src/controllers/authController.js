import HttpStatusCode from "../utils/httpStatusCodes.js";


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
} = HttpStatusCode

import User from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateTransactionId } from "../services/generateTransactionId.js";
import { generateUniqueReferralCode } from "../services/generateUnique.js";
import { OAuth2Client } from 'google-auth-library';
import { generateUniqueUserId } from "../services/generateUnique.js";
import Otp from "../models/otpModel.js";
import { Wallet, Transaction } from "../models/walletModel.js";
import { UserReferral, Referral } from "../models/referralModel.js";
import ReferralOffer from "../models/referalOfferModel.js";


export const signUp = async (req, res) => {

    try {
        const { username, email, password, role, referralCode } = req.body;

        if (!username || !email || !password) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(BAD_REQUEST).json({ success: false, message: "User already exists" });
        }

        const userId = await generateUniqueUserId(role);
        const hashedPassword = await bcrypt.hash(password, 10);

        let referrerUserReferral = null;
        let referralOffer = null;

        if (referralCode) {
            referralOffer = await ReferralOffer.findOne({ isActive: true, deletedAt: null });

            if (!referralOffer) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "No active referral program is available at the moment"
                });
            }


            referrerUserReferral = await UserReferral.findOne({ referralCode })

            if (!referrerUserReferral) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid referral code"
                });
            }
        }

        const user = await User.create({
            username,
            email,
            userId,
            password: hashedPassword,
            role: role || "customer",
        });

        if (referralCode && referrerUserReferral && referralOffer) {

            const referalAmount = referralOffer.rewardAmount;

            const wallet = await Wallet.findOne({ userId: referrerUserReferral.user })

            const session = await mongoose.startSession();

            session.startTransaction();

            try {

                const transactionId = generateTransactionId()

                const transaction = new Transaction({
                    transactionId,
                    walletId: wallet._id,
                    userId: referrerUserReferral.user,
                    type: "referral",
                    amount: referalAmount,
                    balance: wallet.balance + referalAmount,
                    description: `Referral bonus from ${username}`,
                    status: "completed",
                    source: "referral",
                })

                await transaction.save({ session });
                wallet.balance += referalAmount;
                wallet.updatedAt = new Date();
                await wallet.save({ session });

                await session.commitTransaction();
                session.endSession();

            } catch (error) {

                console.log("Transaction error:", error);


                await session.abortTransaction();
                session.endSession();
                throw error;

            }

            const newReferral = await Referral.create({
                user: referrerUserReferral.user,
                name: username,
                email,
                status: 'inactive',
                amount: referalAmount,
                isPaid: true,
            });

            referrerUserReferral.referrals.push(newReferral._id);

            await referrerUserReferral.updateStats();

            await UserReferral.create({
                user: user._id,
                referralCode: await generateUniqueReferralCode(),
                referralLink: `https://adiyo.in/join/${referralCode}`,
                referrals: []
            });

        } else if (!referralCode) {

            const referralCode = await generateUniqueReferralCode()

            await UserReferral.create({
                user: user._id,
                referralCode,
                referralLink: `https://adiyo.in/join/${referralCode}`,
                referrals: []
            });
        }

        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            role: user.role,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
};




// export const login = async (req, res) => {

//     console.log("Login request body:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(BAD_REQUEST).json({ message: "Please enter all fields" });
//     }

//     try {

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(BAD_REQUEST).json({ success: false, message: "User not found" });
//         }

//         if (!user.isActive) {
//             return res.status(BAD_REQUEST).json({ success: false, message: "User is blocked" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("hiiii");
//         if (!isMatch) {
//             return res.status(BAD_REQUEST).json({ success: false, message: "Invalid credentials" });
//         }

//         const token = jwt.sign({
//             userId: user._id,
//             role: user.role
//         }, "secret", { expiresIn: "30d" });

//         res.cookie("session", token, {
//             httpOnly: true,
//             secure: false,
//             sameSite: "Lax",
//             maxAge: 30 * 24 * 60 * 60 * 1000,
//         });

//         return res.status(OK).json({
//             success: true,
//             message: "User logged in successfully",
//             token: token,
//             role: user.role,
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 username: user.username,
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };


export const login = async (req, res) => {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(BAD_REQUEST).json({ message: "Please enter all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(BAD_REQUEST).json({ success: false, message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(BAD_REQUEST).json({ success: false, message: "User is blocked" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(BAD_REQUEST).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            secure: false, // Set to false for local development
            sameSite: "lax", // Use lowercase "lax" instead of "Lax"
            path: "/", // Make sure cookie is available for all paths
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(OK).json({
            success: true,
            message: "User logged in successfully",
            token: token,
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
};




export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(NOT_FOUND).json({
            status: false,
            message: 'User not found'
        });

        const otp = generateOTP();

        const otpRecord = new Otp({
            email,
            otp,
        });

        await otpRecord.save();

        await sendOTPEmail(email, otp);

        res.json({
            status: true,
            message: 'OTP sent to your email.'
        });

    } catch (error) {

        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Server error'
        });
    }
};


export const resetPassword = async (req, res) => {

    const { email, password, resetToken } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user)
            return res.status(NOT_FOUND).json({ message: 'User not found' });

        if (user.resetPasswordToken !== resetToken) {
            return res.status(NOT_FOUND).json({ message: 'Invalid reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(OK).json({
            status: true,
            message: 'Password has been reset successfully.'
        });

    } catch (error) {

        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};






export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {

    const idToken = req.body.token;

    if (!idToken) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Token not provided"
        });
    }

    try {

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ email });
        let role = "customer";

        if (!user) {

            const userId = await generateUniqueUserId(role);

            user = new User({
                username: name,
                email,
                googleId,
                userId,
            });
            await user.save();

            const referralCode = await generateUniqueReferralCode()

            await UserReferral.create({
                user: user._id,
                referralCode,
                referralLink: `https://adiyo.in/join/${referralCode}`,
                referrals: []
            });
        }

        user = await User.findOne({ email });

        if (!user.isActive) {

            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'User is Blocked'
            });
        }

        const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

        res.cookie("session", sessionToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(OK).json({
            success: true,
            message: 'Google login successful',
            token: sessionToken,
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            }
        });

    } catch (error) {

        console.error('Error verifying token:', error);
        res.status(BAD_REQUEST).json({
            success: false,
            message: 'Invalid token'
        });
    }
};


export const logout = async (req, res) => {

    res.clearCookie("session", { path: "/" });
    res.status(OK).json({
        status: true,
        message: "logout succesfully"
    })

}


// export const profile = async (req, res) => {

//     try {

//         console.log("dongt workkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");


//         const user = await User.findById(req.user.userId)

//         if (!user.isActive) {

//             return res.status(UNAUTHORIZED).json({
//                 status: false,
//                 message: "invalid user"
//             })
//         }

//         return res.status(OK).json({
//             status: true,
//             message: "token verified",
//             role: user.role,
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 username: user.username,
//                 profileImg: user.profileImg
//             }
//         })

//     } catch (error) {

//         return res.status(UNAUTHORIZED).json({
//             status: false,
//             message: "invalid token"
//         })
//     }
// }



export const profile = async (req, res) => {
    try {
        // Get token directly (since we're not sure if middleware set req.user)
        const token = req.cookies.session;

        if (!token) {
            return res.status(UNAUTHORIZED).json({
                status: false,
                message: "No token provided"
            });
        }

        // Verify token and extract userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user with the decoded userId
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(UNAUTHORIZED).json({
                status: false,
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(UNAUTHORIZED).json({
                status: false,
                message: "User account is inactive"
            });
        }

        return res.status(OK).json({
            status: true,
            message: "Token verified",
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profileImg: user.profileImg
            }
        });

    } catch (error) {
        console.error("Profile verification error:", error);
        return res.status(UNAUTHORIZED).json({
            status: false,
            message: "Invalid token"
        });
    }
}