

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
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";
import logger from "../utils/logger.js";

const cookieMaxAge = parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        const { username, email, password, role, referralCode } = req.body;

        if (!username || !email || !password) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.ALL_FIELDS_REQUIRED,
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.USER_ALREADY_EXISTS
            });
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
                    message: messages.AUTH.NO_ACTIVE_REFERRAL
                });
            }

            referrerUserReferral = await UserReferral.findOne({ referralCode });

            if (!referrerUserReferral) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: messages.AUTH.INVALID_REFERRAL_CODE
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

        const wallet = await Wallet.create({
            userId: user._id,
            balance: 0,
            pendingBalance: 0,
            currency: 'INR',
            isActive: true,
        });

        if (referralCode && referrerUserReferral && referralOffer) {
            const referalAmount = referralOffer.rewardAmount;
            const wallet = await Wallet.findOne({ userId: referrerUserReferral.user });

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const transactionId = generateTransactionId();

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
                });

                await transaction.save({ session });
                wallet.balance += referalAmount;
                wallet.updatedAt = new Date();
                await wallet.save({ session });

                await session.commitTransaction();
                session.endSession();
            } catch (error) {
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
                referralLink: `https://adiyo.shop/join/${referralCode}`,
                referrals: []
            });
        } else if (!referralCode) {
            const referralCode = await generateUniqueReferralCode();
            await UserReferral.create({
                user: user._id,
                referralCode,
                referralLink: `https://adiyo.shop/join/${referralCode}`,
                referrals: []
            });
        }

        const payload = { userId: user._id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: cookieMaxAge
        });

        res.status(CREATED).json({
            success: true,
            message: messages.AUTH.SIGNUP_SUCCESSFUL,
            token: accessToken,
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
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.SERVER.ERROR
        });
    }
};

export const login = async (req, res) => {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.AUTH.ALL_FIELDS_REQUIRED
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
            });
        }

        if (!user.isActive) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.USER_BLOCKED
            });
        }

        if (user.googleId) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.GOOGLE_REGISTERED
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.INVALID_CREDENTIALS
            });
        }

        const payload = { userId: user._id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: cookieMaxAge
        });

        logger.info(`${user.username} logged`);

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.LOGIN_SUCCESSFUL,
            token: accessToken,
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
            message: messages.SERVER.ERROR
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
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
            message: messages.AUTH.OTP_SENT
        });
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.SERVER.ERROR
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, password, resetToken } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
            });
        }

        if (user.resetPasswordToken !== resetToken) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.INVALID_RESET_TOKEN
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(OK).json({
            success: true,
            message: messages.AUTH.PASSWORD_RESET_SUCCESSFUL
        });
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.SERVER.ERROR
        });
    }
};

export const googleLogin = async (req, res) => {
    console.log("Google login request body:", process.env.GOOGLE_CLIENT_ID);

    const { token: idToken, referralCode } = req.body;

    if (!idToken) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.AUTH.NO_TOKEN_PROVIDED
        });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error("GOOGLE_CLIENT_ID is not set in environment variables");
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Google OAuth is not configured"
        });
    }

    try {
        console.log("Token length:", idToken?.length);
        console.log("Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 30) + "...");

        let decodedToken;
        try {
            decodedToken = jwt.decode(idToken, { complete: true });
            if (!decodedToken || !decodedToken.payload) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid token format"
                });
            }
            console.log("Token decoded locally. Audience:", decodedToken.payload.aud);
            console.log("Token issuer:", decodedToken.payload.iss);
            console.log("Token expiration:", new Date(decodedToken.payload.exp * 1000));

            if (decodedToken.payload.aud !== process.env.GOOGLE_CLIENT_ID) {
                console.error("Token audience mismatch!");
                console.error("Expected:", process.env.GOOGLE_CLIENT_ID);
                console.error("Got:", decodedToken.payload.aud);
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Token audience does not match Google Client ID"
                });
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.payload.exp && decodedToken.payload.exp < currentTime) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Google token has expired. Please sign in again."
                });
            }

            if (decodedToken.payload.iss !== 'https://accounts.google.com' && decodedToken.payload.iss !== 'accounts.google.com') {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Invalid token issuer"
                });
            }

        } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Invalid token format"
            });
        }

        const googleId = decodedToken.payload.sub;
        const email = decodedToken.payload.email;
        const username = decodedToken.payload.name;

        console.log("Token validated locally. Google user info:", { googleId, email, username });

        let user = await User.findOne({ googleId }) || await User.findOne({ email });
        const isNewUser = !user;
        console.log("User found:", !isNewUser, "Is new user:", isNewUser);

        if (isNewUser) {
            const userId = await generateUniqueUserId('customer');
            user = await User.create({ googleId, email, username, userId, role: 'customer' });

            const newCode = await generateUniqueReferralCode();
            await UserReferral.create({
                user: user._id,
                referralCode: newCode,
                referralLink: `https://adiyo.shop/join/${newCode}`,
                referrals: []
            });

            const wallet = await Wallet.create({
                userId: user._id,
                balance: 0,
                pendingBalance: 0,
                currency: 'INR',
                isActive: true,
            });
        }

        if (isNewUser && referralCode) {
            const referralOffer = await ReferralOffer.findOne({ isActive: true, deletedAt: null });
            if (!referralOffer) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: messages.AUTH.NO_ACTIVE_REFERRAL
                });
            }

            const referrerProfile = await UserReferral.findOne({ referralCode });
            if (!referrerProfile) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: messages.AUTH.INVALID_REFERRAL_CODE
                });
            }

            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const wallet = await Wallet.findOne({ userId: referrerProfile.user });
                const amount = referralOffer.rewardAmount;
                const txId = generateTransactionId();

                await Transaction.create([{
                    transactionId: txId,
                    walletId: wallet._id,
                    userId: referrerProfile.user,
                    type: 'referral',
                    amount,
                    balance: wallet.balance + amount,
                    description: `Referral bonus from ${username}`,
                    status: 'completed',
                    source: 'referral'
                }], { session });

                wallet.balance += amount;
                wallet.updatedAt = new Date();
                await wallet.save({ session });

                const newReferral = await mongoose.model('Referral').create([{
                    user: referrerProfile.user,
                    name: username,
                    email,
                    status: 'inactive',
                    amount,
                    isPaid: true
                }], { session });

                referrerProfile.referrals.push(newReferral[0]._id);
                await referrerProfile.updateStats();
                await referrerProfile.save({ session });

                await session.commitTransaction();
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally {
                session.endSession();
            }
        }

        if (!user.isActive) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.AUTH.USER_BLOCKED
            });
        }

        const payload = { userId: user._id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        console.log("Tokens generated successfully");

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: cookieMaxAge
        });
        console.log("Cookie set, sending response...");

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.GOOGLE_LOGIN_SUCCESSFUL,
            token: accessToken,
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.AUTH.GOOGLE_TOKEN_INVALID,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.LOGOUT_SUCCESSFUL,
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.SERVER.ERROR,
        });
    }
};

export const profile = async (req, res) => {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.NO_TOKEN_PROVIDED
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
            });
        }

        if (!user.isActive) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: messages.AUTH.USER_INACTIVE
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.TOKEN_VERIFIED,
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
            success: false,
            message: messages.AUTH.INVALID_TOKEN
        });
    }
};

export const tokenRefresh = async (req, res) => {
    const token = req.cookies.refreshToken || req.headers.authorization;

    if (!token || typeof token !== 'string') {
        console.log("Token type:", typeof token, "Token value:", token);
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.AUTH.NO_REFRESH_TOKEN
        });
    }

    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }


    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: payload.userId, role: payload.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const user = await User.findById(payload.userId).select('-password');
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.AUTH.USER_NOT_FOUND
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.AUTH.TOKEN_VERIFIED,
            role: user.role,
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profileImg: user.profileImg
            },
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(UNAUTHORIZED).json({
            success: false,
            message: messages.AUTH.INVALID_REFRESH_TOKEN
        });
    }
};