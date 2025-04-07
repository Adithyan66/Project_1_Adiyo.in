
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import HttpStatusCode from "../utils/httpStatusCodes.js";

import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';
import { generateTransactionId } from "../services/generateTransactionId.js";


import { verifyPayPalOrder, capturePayPalPayment } from "../services/paypal.js";


import { OAuth2Client } from 'google-auth-library';
import { generateUniqueUserId } from "../services/generateUniqueUserId.js";
const ObjectId = mongoose.Types.ObjectId;

import cloudinary from "../config/cloudinary.js";

import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Review from "../models/reviewModel.js";
import Otp from "../models/otpModel.js";
import Address from "../models/addressModel.js";
import Cart from "../models/cartSchema.js";
import Order from "../models/orderModel.js";
import Wishlist from "../models/wishListModel.js";
import Coupon from "../models/couponModel.js";
import { Wallet, Transaction, ReturnRefund } from "../models/walletModel.js";
import ProductOffer from "../models/productOfferModel.js";
import CategoryOffer from "../models/categoryOfferModel.js";
import { UserReferral, Referral } from "../models/referralModel.js";
import ReferralOffer from "../models/referalOfferModel.js";


const salt = await bcrypt.genSalt(10);






export const signUp = async (req, res) => {


    try {
        const { username, email, password, role, referralCode } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const userId = await generateUniqueUserId(role);
        const hashedPassword = await bcrypt.hash(password, 10);

        let referrerUserReferral = null;
        let referralOffer = null;

        if (referralCode) {
            referralOffer = await ReferralOffer.findOne({ isActive: true, deletedAt: null });

            if (!referralOffer) {
                return res.status(400).json({
                    success: false,
                    message: "No active referral program is available at the moment"
                });
            }


            referrerUserReferral = await UserReferral.findOne({ referralCode })

            if (!referrerUserReferral) {
                return res.status(400).json({
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
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




const generateUniqueReferralCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralCode;
    let isUnique = false;

    while (!isUnique) {
        referralCode = '';
        for (let i = 0; i < 10; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if this code already exists
        const existingCode = await UserReferral.findOne({ referralCode });
        if (!existingCode) {
            isUnique = true;
        }
    }

    return referralCode;
};



























export const login = async (req, res) => {

    console.log("Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(400).json({ success: false, message: "User is blocked" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        console.log("hiiii");
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
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
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({
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
        res.status(500).json({
            status: false,
            message: 'Server error'
        });
    }
};

export const signupOTP = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (user) return res.status(404).json({
            status: false,
            message: 'email already exixt'
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
        res.status(500).json({
            status: false,
            message: 'Server error'
        });

    }
}

export const validateOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(404).json({ message: 'Email not found or OTP expired' });
        }


        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }


        const expirationTime = 10 * 60 * 1000;
        if (Date.now() - otpRecord.createdAt.getTime() > expirationTime) {
            return res.status(400).json({ message: 'OTP expired' });
        }


        const user = await User.findOne({ email });
        if (user) {
            const resetToken = generateResetToken();
            user.resetPasswordToken = resetToken;
            await user.save();


            await otpRecord.deleteOne();

            return res.json({
                success: true,
                message: 'OTP validated successfully',
                resetToken,
            });
        }

        await otpRecord.deleteOne();


        res.json({
            success: true,
            message: 'OTP validated successfully',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {


    const { email, password, resetToken } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        // Validate the reset token
        if (user.resetPasswordToken !== resetToken) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Update the password (ensure hashing happens in a pre-save hook or here)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        // Clear the temporary fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        res.json({
            status: true,
            message: 'Password has been reset successfully.'
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {

    const idToken = req.body.token;

    if (!idToken) {
        return res.status(400).json({
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

            return res.status(400).json({
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

        res.status(200).json({
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
        res.status(400).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export const getNewArrivals = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const products = await Product.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .lean();

        const transformedProducts = products.map(product => {
            const firstColor = product.colors[0];
            return {
                id: product._id,
                title: product.name,
                image: firstColor?.images[0] || '',
                price: firstColor?.discountPrice || 0,
                oldPrice: firstColor?.basePrice || 0,
                rating: 4,
                brand: product.brand,
                category: product.category?.name || 'Uncategorized'
            };
        });

        res.status(200).json({
            success: true,
            products: transformedProducts,
            total: await Product.countDocuments({ deletedAt: null })
        });
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch new arrivals',
            error: error.message
        });
    }
};


export const getTopSellingProducts = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;


        const products = await Product.find({ deletedAt: null })
            .sort({ totalQuantity: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .lean();

        const transformedProducts = products.map(product => {
            const firstColor = product.colors[0];
            return {
                id: product._id,
                title: product.name,
                image: firstColor?.images[0] || '',
                price: firstColor?.discountPrice || 0,
                oldPrice: firstColor?.basePrice || 0,
                rating: 4,
                brand: product.brand,
                category: product.category?.name || 'Uncategorized'
            };
        });

        res.status(200).json({
            success: true,
            products: transformedProducts,
            total: await Product.countDocuments({ deletedAt: null })
        });

    } catch (error) {

        console.error('Error fetching top selling products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top selling products',
            error: error.message
        });
    }
};


export const productList = async (req, res) => {

    try {
        const match = {};
        match.deletedAt = null;

        if (req.query.search) {
            match.name = { $regex: req.query.search, $options: "i" };
        }

        if (req.query.category) {
            try {
                match.category = new ObjectId(req.query.category);
            } catch (error) {
                console.log(error.message);
                return res.status(400).json({
                    status: false,
                    message: "Invalid category ID format."
                });
            }
        }

        if (req.query.subCategory) {
            try {
                match.subCategory = new ObjectId(req.query.subCategory);
            } catch (error) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid subCategory ID format."
                });
            }
        }

        if (req.query.minPrice || req.query.maxPrice) {
            const priceFilter = {};
            if (req.query.minPrice) {
                priceFilter.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                priceFilter.$lte = Number(req.query.maxPrice);
            }
            match.colors = { $elemMatch: { discountPrice: priceFilter } };
        }

        if (req.query.color) {
            const colorsArray = req.query.color.split(",");
            if (match.colors) {
                match.colors.$elemMatch = {
                    ...match.colors.$elemMatch,
                    color: { $in: colorsArray },
                };
            } else {
                match.colors = { $elemMatch: { color: { $in: colorsArray } } };
            }
        }


        if (req.query.size) {
            const sizesArray = req.query.size.split(",");
            const sizeConditions = [];

            sizesArray.forEach(size => {

                sizeConditions.push({
                    colors: {
                        $elemMatch: {
                            [`variants.${size}.stock`]: { $gt: 0 }
                        }
                    }
                });
            });

            if (sizeConditions.length > 0) {
                if (!match.$or) {
                    match.$or = [];
                }
                match.$or = [...match.$or, ...sizeConditions];
            }
        }

        const pipeline = [
            { $match: match },
            {
                $addFields: {
                    minDiscountPrice: { $min: "$colors.discountPrice" },
                },
            }
        ];

        if (req.query.color) {
            const colorsArray = req.query.color.split(",");
            pipeline.push({
                $project: {
                    name: 1,
                    shortDescription: 1,
                    description: 1,
                    brand: 1,
                    category: 1,
                    subCategory: 1,
                    sku: 1,
                    material: 1,
                    careInstructions: 1,
                    colors: {
                        $filter: {
                            input: "$colors",
                            as: "color",
                            cond: { $in: ["$$color.color", colorsArray] }
                        }
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            });

            pipeline.push({
                $addFields: {
                    minDiscountPrice: { $min: "$colors.discountPrice" },
                }
            });
        }

        let sortStage = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case "price_low_high":
                    sortStage = { minDiscountPrice: 1 };
                    break;
                case "price_high_low":
                    sortStage = { minDiscountPrice: -1 };
                    break;
                case "name_a_z":
                    sortStage = { name: 1 };
                    break;
                case "name_z_a":
                    sortStage = { name: -1 };
                    break;
                default:
                    break;
            }
        }
        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        pipeline.push({ $skip: skip }, { $limit: limit });


        // console.log("Pipeline:", JSON.stringify(pipeline, null, 2));

        const products = await Product.aggregate(pipeline);
        const countPipeline = [{ $match: match }, { $count: "total" }];
        const countResult = await Product.aggregate(countPipeline);
        const totalProducts = countResult[0] ? countResult[0].total : 0;

        res.status(200).json({
            status: true,
            message: "Fetched successfully",
            page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            status: false,
            message: "Server error",
        });
    }
};

export const logout = async (req, res) => {

    //  res.cookie("session", "", { expires: new Date(0), httpOnly: true, path: "/" })
    res.clearCookie("session", { path: "/" });
    res.status(200).json({
        status: true,
        message: "logout succesfully"
    })
}

export const profile = async (req, res) => {

    try {
        const user = await User.findById(req.user.userId)


        if (!user.isActive) {

            return res.status(401).json({
                status: false,
                message: "invalid user"
            })
        }

        return res.status(200).json({
            status: true,
            message: "token verified",
            role: user.role,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profileImg: user.profileImg
            }
        })

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "invalid token"
        })
    }
}

export const productDetail = async (req, res) => {


    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, deletedAt: null });

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "product detail fetched succesfully",
            product
        })

    } catch (error) {

        console.error("Error fetching product:", error);

        res.status(500).json({
            status: false,
            message: "server error on fetching"
        });
    }
}

export const addReview = async (req, res) => {

    try {

        const userId = req.user.userId

        const { rating, comment } = req.body;

        const productId = req.params.productId;

        const existingReview = await Review.findOne({ productId, userId });

        if (existingReview) {

            return res.status(400).json({
                status: false,
                message: "You have already reviewed this product."
            });
        }

        const review = new Review({ productId, userId, rating, comment });

        await review.save();

        res.status(201).json({
            status: true,
            message: "Review added successfully"
            , review
        });


    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: false,
            message: error.message
        });
    }


}

export const getReviews = async (req, res) => {

    try {

        const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "username");





        res.status(200).json({
            status: true,
            message: "review fetched succesfully",
            reviews
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "error on server"
        });
    }


}

export const profileDetails = async (req, res) => {

    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            status: true,
            message: "fetched succesfully",
            user
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


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

        // Check if profile image was provided in the request
        let imageUrl = undefined;

        if (req.file) {
            const profileImage = req.file.path;
            const cloudinaryResult = await cloudinary.uploader.upload(profileImage, {
                folder: "Adiyo/profilePic"
            });
            imageUrl = cloudinaryResult.secure_url;
        }

        // Create an object with the fields to update
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


        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            status: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

export const changeEmailOtp = async (req, res) => {

    const id = req.params.id;

    try {
        const { password, newEmail } = req.body;



        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("change email request body", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const otp = generateOTP();
        const otpRecord = new Otp({
            otp,
            email: newEmail
        });
        await otpRecord.save();

        await sendOTPEmail(newEmail, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("error change email", error);
        return res.status(500).json({
            success: false,
            message: "servor error"
        });
    }
};


export const changeEmail = async (req, res) => {

    const id = req.params.id;

    try {
        const { otp, newEmail } = req.body;

        const verify = await Otp.findOne({ email: newEmail });
        if (!verify || verify.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match"
            });
        }

        const user = await User.findByIdAndUpdate(id, { email: newEmail }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Email ID changed successfully",
            user
        });
    } catch (error) {
        console.error("error change email", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        });
    }
};


export const changePassword = async (req, res) => {

    const id = req.params.id

    try {
        const { currentPassword, newPassword } = req.body

        const user = await User.findById(id)

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

        res.status(200).json({
            success: true,
            message: "password changed succesfully",
            updatedUser
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error"
        })

    }
}


export const saveAddress = async (req, res) => {

    const userId = req.user.userId

    try {

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const addressCount = await Address.countDocuments({ userId })

        const isDefault = addressCount === 0 ? true : req.body.formData.isDefault || false

        if (isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            )
        }

        const newAddress = new Address({
            userId,
            fullName: req.body.formData.fullName,
            phoneNumber: req.body.formData.phoneNumber,
            alternatePhone: req.body.formData.alternatePhone || '',
            address: req.body.formData.address,
            locality: req.body.formData.locality,
            city: req.body.formData.city,
            state: req.body.formData.state,
            pincode: req.body.formData.pincode,
            landmark: req.body.formData.landmark || '',
            addressType: req.body.formData.addressType || 'Home',
            isDefault,
            isActive: true
        });

        const saveAddress = await newAddress.save()

        res.status(200).json({
            success: true,
            message: "Address saved succesfully",
            address: saveAddress
        })

    } catch (error) {

        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to save address'

        })
    }
}


export const getUserAddresses = async (req, res) => {

    const userId = req.user.userId

    try {

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const addresses = await Address.find({
            userId,
            isActive: true
        }).sort({ isDefault: - 1, createdAt: - 1 })


        res.status(200).json({
            success: true,
            message: "address fetched succesfully",
            addresses
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch addresses',
        })
    }
}



export const editAddress = async (req, res) => {

    const userId = req.user.userId;
    const { formData } = req.body;
    const { addressId } = req.body.formData;

    try {
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const existingAddress = await Address.findOne({ _id: addressId, userId });

        if (!existingAddress) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Handle setting new default address
        if (formData.isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                alternatePhone: formData.alternatePhone || '',
                address: formData.address,
                locality: formData.locality,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark || '',
                addressType: formData.addressType || 'Home',
                isDefault: formData.isDefault || false
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            address: updatedAddress
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update address'
        });
    }
};


export const deleteAddress = async (req, res) => {

    const userId = req.user.userId;
    const addressId = req.params.id;

    try {

        const address = await Address.findOne({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }


        await Address.findByIdAndDelete(addressId);

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete address'
        });
    }
};



export const makeDefaultAddress = async (req, res) => {

    const userId = req.user.userId;
    const { addressId } = req.params;

    try {
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Set all other addresses' `isDefault` to false
        await Address.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
        );

        // Set the selected address as default
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { isDefault: true },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address set as default successfully',
            address: updatedAddress
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


export const addCart = async (req, res) => {

    const userId = req.user.userId

    const {
        productId,
        selectedColor,
        selectedSize,
        quantity,
        removeFromWishlist
    } = req.body.data


    try {

        if (!productId || !selectedColor || !selectedSize || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }

        if (product.deletedAt) {
            return res.status(400).json({
                success: false,
                message: "product not available"
            })
        }

        const colorVarient = product.colors.find(
            (col) => col.color.toLowerCase() === selectedColor.toLowerCase()
        )
        if (!colorVarient) {
            return res.status(400).json({
                success: false,
                message: "selected color varient not found"
            })
        }

        const variant = colorVarient.variants[selectedSize];

        if (!variant) {

            return res.status(400).json({
                status: false,
                message: "selected size not available"
            })
        }

        if (variant.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock for the selected variant."
            });
        }

        if (removeFromWishlist) {
            const wishlist = await Wishlist.findOne({ user: req.user.userId });
            if (wishlist) {
                wishlist.items = wishlist.items.filter(
                    item => !(item.product.toString() === productId && item.selectedColor === selectedColor)
                );
                await wishlist.save();
            }
        }



        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = new Cart({ user: userId, items: [] })
        }

        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.selectedColor.toLowerCase() === selectedColor.toLowerCase() &&
                item.selectedSize === selectedSize.toLowerCase()
            // item.selectedSize === selectedSize
        )

        const maxAllowed = 5;

        if (existingItemIndex > -1) {
            const cartItem = cart.items[existingItemIndex]
            const newQuantity = cartItem.quantity + quantity

            if (newQuantity > maxAllowed) {
                return res.status(400).json({
                    success: false,
                    message: "Reached maximum allowed quantity for this product"
                })
            }
            if (newQuantity > variant.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock to add the requested quantity"
                })
            }

            cart.items[existingItemIndex].quantity = newQuantity

        } else {

            cart.items.push({
                product: new ObjectId(productId),
                selectedColor,
                selectedSize,
                quantity
            })

        }

        await cart.save()

        res.status(200).json({
            success: true,
            message: "product added to cart succesfully"
        })


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}


export const cartItems = async (req, res) => {

    const userId = req.user.userId

    try {
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User not authenticated"
            })
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product")


        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "cart is empty",
                items: []
            })
        }

        res.status(200).json({
            success: true,
            message: "cart items fetched succesfully",
            items: cart.items
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}


export const removeCartItem = async (req, res) => {

    const { userId } = req.user

    const itemId = req.params.itemId

    try {

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "not authorised or no cart Id"
            })
        }

        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "cart not found"
            })
        }

        const removedItem = cart.items.pull(itemId)

        if (!removedItem) {
            return res.status(404).json({
                status: false,
                message: "cart item not found",
            })
        }

        await cart.save()

        res.status(200).json({
            success: true,
            message: "cart item removed"
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error"
        })

    }
}

export const updateCartQuantity = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        const userId = req.user.userId;
        const { itemId } = req.params;
        const { newQuantity } = req.body;

        if (!newQuantity || newQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity. It must be at least 1"
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const cartItem = cart.items.id(itemId);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // Fetch the product with its full details
        const product = await Product.findById(cartItem.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find the selected color and size to check stock
        const selectedColor = product.colors.find(color => color.color === cartItem.selectedColor);

        if (!selectedColor) {
            return res.status(404).json({
                success: false,
                message: "Selected color not found for this product"
            });
        }

        // Get the variant for the selected size
        const selectedSizeKey = cartItem.selectedSize.toLowerCase();
        const selectedVariant = selectedColor.variants[selectedSizeKey];

        if (!selectedVariant) {
            return res.status(404).json({
                success: false,
                message: "Selected size not found for this product color"
            });
        }

        // Check if the requested quantity is available in stock
        if (newQuantity > selectedVariant.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${selectedVariant.stock} units available in stock`,
                availableStock: selectedVariant.stock
            });
        }

        // Update the quantity if stock is sufficient
        cartItem.quantity = newQuantity;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart item quantity updated successfully."
        });

    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating cart item quantity."
        });
    }
}

export const checkCart = async (req, res) => {

    try {



        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name size colors _id'
            });

        if (!cart) {
            return res.status(200).json({
                status: true,
                cart: []
            });
        }

        return res.status(200).json({
            status: true,
            cart: cart.items
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
};


const getSizeKey = (size) => {
    switch (size.toLowerCase()) {
        case 'small': return 'small';
        case 's': return 'small';
        case 'medium': return 'medium';
        case 'm': return 'medium';
        case 'large': return 'large';
        case 'l': return 'large';
        case 'extra large': return 'extralarge';
        case 'xl': return 'extralarge';
        default: return size.toLowerCase();
    }
};


function generateReadableOrderId() {
    // Generate a timestamp in the format YYYYMMDDHHMMSS
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    // Generate a 6-character random alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${datePart}-${randomPart}`;
}


export const createOrder = async (req, res) => {
    try {
        const {
            addressId,
            productDetails,
            paymentMethod,
            couponCode,
            paypalOrderID
        } = req.body;

        if (!addressId || !productDetails || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) return res.status(401).json({
            success: false,
            message: "Not authorized"
        });

        const selectedAddress = await Address.findOne({
            _id: addressId,
            userId: req.user.userId
        });

        if (!selectedAddress) return res.status(400).json({
            success: false,
            message: "Address not found"
        });

        const items = Array.isArray(productDetails) ? productDetails : [productDetails];

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products provided for order"
            });
        }

        const allProducts = [];
        let totalSubtotal = 0;
        const productCategories = new Set();

        for (const item of items) {

            const { productId, productColor, productSize, quantity } = item;

            const product = await Product.findOne({ _id: productId, deletedAt: null }).populate('category');

            if (!product) return res.status(404).json({
                success: false,
                message: `Product not found`
            });

            const colorVariant = product.colors.find(c => c.color === productColor);

            if (!colorVariant) return res.status(400).json({
                success: false,
                message: `Color ${productColor} not available for product ${product.name}`
            });

            const sizeKey = getSizeKey(productSize);
            const sizeVariant = colorVariant.variants[sizeKey];

            if (!sizeVariant) return res.status(400).json({
                success: false,
                message: `Size ${productSize} not available for product ${product.name}`
            });

            if (sizeVariant.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} in ${productColor} color, size ${productSize}`
                });
            }

            if (product.category && product.category.name) {
                productCategories.add(product.category._id);
            }

            const itemPrice = colorVariant.basePrice;
            const itemDiscountedPrice = colorVariant.discountPrice;
            const itemTotal = itemDiscountedPrice * quantity;

            totalSubtotal += itemTotal;

            allProducts.push({
                product,
                productId,
                productColor,
                productSize,
                quantity,
                itemPrice,
                itemDiscountedPrice,
                sizeKey
            });
        }

        let appliedCoupon = null;
        let totalDiscount = 0;

        if (couponCode) {
            appliedCoupon = await Coupon.findOne({
                code: couponCode,
                deletedAt: null,
                activeFrom: { $lte: new Date() },
                expiresAt: { $gt: new Date() },
                $expr: { $lt: ["$usedCount", "$maxUsage"] }
            }).populate('applicableCategories');

            if (!appliedCoupon) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired coupon code"
                });
            }

            if (appliedCoupon.minimumOrderValue && totalSubtotal < appliedCoupon.minimumOrderValue) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order value of ${appliedCoupon.minimumOrderValue} required for this coupon`
                });
            }

            let isCouponApplicable = false;

            if (
                !appliedCoupon.applicableCategories ||
                Object.keys(appliedCoupon.applicableCategories).length === 0
            ) {
                isCouponApplicable = true;
            } else {
                for (const category of productCategories) {
                    console.log("category", appliedCoupon.applicableCategories._id, "          ji", category);

                    if (appliedCoupon.applicableCategories._id.equals(category)) {
                        isCouponApplicable = true;
                        break;
                    }
                }
            }


            if (!isCouponApplicable) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon not applicable to any products in your cart"
                });
            }

            if (appliedCoupon.discountType === "percentage") {
                totalDiscount = Math.round((totalSubtotal * appliedCoupon.discountValue) / 100);
            } else {
                totalDiscount = appliedCoupon.discountValue;
            }

            totalDiscount = Math.min(totalDiscount, totalSubtotal);
        }

        const shippingFee = totalSubtotal >= 499 ? 0 : 49;

        const taxRate = 0;
        const totalTax = Math.round(totalSubtotal * taxRate);

        const finalTotalAmount = totalSubtotal + shippingFee + totalTax - totalDiscount;

        let paymentVerified = false;
        let paymentDetails = null;
        let walletTransaction = null;

        // Handle wallet payment
        if (paymentMethod === 'wallet') {
            // Find user's wallet
            const wallet = await Wallet.findOne({ userId: req.user.userId });

            if (!wallet) {
                return res.status(400).json({
                    success: false,
                    message: "Wallet not found for this user"
                });
            }

            // Check if wallet has sufficient balance
            if (wallet.balance < finalTotalAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance",
                    walletBalance: wallet.balance,
                    orderAmount: finalTotalAmount
                });
            }

            // Create wallet transaction
            walletTransaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId: req.user.userId,
                type: 'order_payment',
                amount: finalTotalAmount,
                balance: wallet.balance - finalTotalAmount,
                description: `Payment for order #ORD-${Date.now()}`,
                status: 'completed',
                source: 'order_payment',
                reference: {}
            });

            // Update wallet balance
            wallet.balance -= finalTotalAmount;
            await wallet.save();

            paymentVerified = true;
            paymentDetails = {
                paymentProvider: 'wallet',
                transactionId: walletTransaction._id.toString(),
                amount: finalTotalAmount,
                status: 'completed',
                createTime: new Date(),
                updateTime: new Date()
            };
        } else if (paymentMethod === 'paypal') {
            if (!paypalOrderID) {
                return res.status(400).json({
                    success: false,
                    message: "PayPal Order ID is required for PayPal payments"
                });
            }

            try {
                // Verify the PayPal order
                const paypalOrderDetails = await verifyPayPalOrder(paypalOrderID);

                // Verify that the payment amount matches our calculated total
                const paypalAmount = parseFloat(paypalOrderDetails.purchase_units[0].amount.value);

                if (Math.abs(paypalAmount - finalTotalAmount) > 0.01) {
                    return res.status(400).json({
                        success: false,
                        message: `Payment amount mismatch. Expected: ${finalTotalAmount}, Received: ${paypalAmount}`
                    });
                }

                // Capture the payment
                paymentDetails = await capturePayPalPayment(paypalOrderID);
                paymentVerified = true;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to verify PayPal payment"
                });
            }
        }

        const savedOrders = [];
        const allOrderItems = [];
        const commonOrderNumber = generateReadableOrderId();


        for (const productData of allProducts) {

            const {
                product, productId, productColor, productSize,
                quantity, itemPrice, itemDiscountedPrice, sizeKey
            } = productData;

            const orderItems = [];
            const subtotal = itemDiscountedPrice * quantity;

            const orderItem = {
                product: productId,
                color: productColor,
                size: productSize,
                quantity,
                price: itemPrice,
                discountedPrice: itemDiscountedPrice
            };

            orderItems.push(orderItem);

            const productImage = product.images && product.images.length > 0 ? product.images[0] : '';

            allOrderItems.push({
                ...orderItem,
                productName: product.name,
                productImage: productImage
            });

            // Individual order will use the proportional discount
            const itemProportion = subtotal / totalSubtotal;
            const itemDiscount = Math.round(totalDiscount * itemProportion);

            // Create the new order with shared shipping fee and appropriate discount
            const itemShippingFee = (shippingFee === 0) ? 0 : Math.round(shippingFee * itemProportion);
            const itemTax = Math.round(totalTax * itemProportion);
            const itemTotalAmount = subtotal - itemDiscount + itemShippingFee + itemTax;

            const newOrder = new Order({
                orderNumber: commonOrderNumber, // Use the generated readable order ID
                orderId: commonOrderNumber, // Save the orderId in the database
                user: req.user.userId,
                orderItems,
                shippingAddress: selectedAddress,
                paymentMethod,
                paymentStatus: paymentMethod === "cod" ? "pending" : (paymentVerified ? "paid" : "pending"),
                subtotal,
                shippingFee: itemShippingFee,
                tax: itemTax,
                discount: itemDiscount,
                couponCode: itemDiscount > 0 ? couponCode : null,
                totalAmount: itemTotalAmount,
                estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            });

            // Add payment details based on payment method
            if (paymentMethod === "paypal" && paymentVerified && paymentDetails) {
                newOrder.paymentDetails = {
                    paymentProvider: "paypal",
                    paymentDate: new Date(),
                    transactionId: paymentDetails.transactionId,
                    payerEmail: paymentDetails.payerEmail,
                    amount: paymentDetails.amount.value,
                    status: paymentDetails.status,
                    createTime: paymentDetails.createTime,
                    updateTime: paymentDetails.updateTime
                };
            } else if (paymentMethod === "wallet" && paymentVerified && paymentDetails) {
                newOrder.paymentDetails = {
                    paymentProvider: "wallet",
                    paymentDate: new Date(),
                    transactionId: paymentDetails.transactionId,
                    amount: paymentDetails.amount,
                    status: paymentDetails.status,
                    createTime: paymentDetails.createTime,
                    updateTime: paymentDetails.updateTime
                };
            } else if (paymentMethod !== "cod") {
                newOrder.paymentDetails = {
                    paymentProvider: paymentMethod,
                    paymentDate: new Date()
                };
            }

            const savedOrder = await newOrder.save();
            savedOrders.push(savedOrder);

            // Update product stock
            await Product.findOneAndUpdate(
                {
                    _id: productId,
                    "colors.color": productColor
                },
                {
                    $inc: {
                        [`colors.$.variants.${sizeKey}.stock`]: -quantity,
                        "colors.$.totalStock": -quantity,
                        totalQuantity: -quantity
                    }
                }
            );
        }

        // Update wallet transaction with the order reference if wallet payment was used
        if (walletTransaction) {
            walletTransaction.reference.orderId = savedOrders[0]._id;
            await walletTransaction.save();
        }

        // Update coupon usage count if a coupon was successfully applied
        if (appliedCoupon) {
            await Coupon.findByIdAndUpdate(appliedCoupon._id, {
                $inc: { usedCount: 1 }
            });
        }

        // Create consolidated response object
        const consolidatedOrderDetails = {
            orderNumber: commonOrderNumber,
            orderId: commonOrderNumber,
            totalAmount: finalTotalAmount,
            shippingAddress: selectedAddress,
            paymentMethod,
            orderItems: allOrderItems,
            createdAt: new Date(),
            estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            subtotal: totalSubtotal,
            shippingFee,
            tax: totalTax,
            discount: totalDiscount,
            couponCode: totalDiscount > 0 ? couponCode : null,
            paymentStatus: paymentMethod === "cod" ? "pending" : (paymentVerified ? "paid" : "pending"),
            orders: savedOrders.map(order => order._id)
        };

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: consolidatedOrderDetails
        });

    } catch (error) {
        console.log("Error in createOrder:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};


export const getOrderById = async (req, res) => {

    try {

        const { orderId } = req.params

        const order = await Order.findById(orderId)
            .populate({
                path: 'orderItems.product',
                select: 'name colors'
            });


        if (!order) return res.status(500).json({
            success: false,
            message: "order not found"
        });


        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error
        })
    }
};


export const getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({ user: req.user.userId })
            .populate({
                path: 'orderItems.product',
                select: 'name colors'  // Specify fields you need
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.log("errrrrrrrrrrorrrrrrrrr", error);
        res.status(500).json({
            success: false,
            message: error
        })
    }
};


export const cancelOrder = async (req, res) => {

    const { orderId } = req.params;
    const { reason } = req.body;

    console.log("cancel order reason", reason);
    console.log("cancel order id", orderId);



    // Use a transaction to ensure data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);

        // console.log("orderr", order)

        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (["delivered", "returned"].includes(order.orderStatus)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order in current status"
            });
        }


        order.orderStatus = "cancelled";
        order.cancelReason = reason;

        // Process refund if payment was already made
        let refundAmount = 0;
        let refundProcessed = false;

        if (order.paymentStatus === "paid" && order.paymentMethod !== "cod") {
            // Calculate refund amount (total minus shipping)
            refundAmount = order.totalAmount - order.shippingFee;

            // Update payment status
            order.paymentStatus = "refunded";

            // Find or create user wallet
            let wallet = await Wallet.findOne({ userId: order.user }).session(session);
            if (!wallet) {
                wallet = new Wallet({
                    userId: order.user,
                    balance: 0,
                    pendingBalance: 0
                });
            }

            // Update wallet balance
            wallet.balance += refundAmount;
            await wallet.save({ session });

            // Create transaction record
            const transaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId: order.user,
                type: 'cancellation_refund',
                amount: refundAmount,
                balance: wallet.balance,
                description: `Refund for cancelled order #${order.orderNumber || orderId}`,
                status: 'completed',
                source: 'cancellation_refund',
                reference: {
                    orderId: order._id
                },
                metadata: new Map([
                    ['cancelReason', reason || 'Not specified'],
                    ['cancelDate', new Date()],
                    ['originalAmount', order.totalAmount],
                    ['shippingFee', order.shippingFee]
                ])
            });

            await transaction.save({ session });
            refundProcessed = true;
        }

        // Save the updated order
        const updatedOrder = await order.save({ session });

        // Return inventory back to stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product).session(session);
            if (product) {
                const colorIndex = product.colors.findIndex(c => c.color === item.color);
                if (colorIndex !== -1) {
                    const sizeKey = getSizeKey(item.size);
                    product.colors[colorIndex].variants[sizeKey].stock += item.quantity;
                    product.colors[colorIndex].totalStock += item.quantity;
                    product.totalQuantity += item.quantity;
                    await product.save({ session });
                }
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: refundProcessed
                ? `Order cancelled successfully. ₹${refundAmount.toFixed(2)} has been credited to your wallet.`
                : "Order cancelled successfully",
            order: updatedOrder,
            refundAmount: refundProcessed ? refundAmount : 0,
            refundProcessed
        });

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();

        console.error("Error cancelling order:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while cancelling order",
            error: error.message
        });
    }
};







export const deleteCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while clearing cart'
        });
    }
}


export const returnRequest = async (req, res) => {


    const { orderId } = req.params;
    const { items, reason, quantity } = req.body;

    if (!reason || !reason.trim()) {
        return res.status(400).json({
            success: false,
            message: "Return reason is required."
        });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please select at least one item to return."
        });
    }

    try {

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        if (order.user.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        if (order.orderStatus !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "Return request can only be made for delivered orders."
            });
        }

        const deliveredDate = order.deliveredAt || order.createdAt;

        const now = new Date();

        const returnWindow = 7 * 24 * 60 * 60 * 1000;
        if (now - new Date(deliveredDate) > returnWindow) {
            return res.status(400).json({
                success: false,
                message: "Return window has expired."
            });
        }

        // const orderItemIds = order.orderItems.map(item => item._id.toString());
        const orderItemIds = order.orderItems.map(item => item.product.toString());




        for (const returnItem of items) {

            if (!orderItemIds.includes(returnItem.productId.toString())) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid item selected for return."
                });
            }


            const orderItem = order.orderItems.find(item => item.product.toString() === returnItem.productId);

            if (returnItem.quantity > orderItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Return quantity cannot exceed purchased quantity."
                });
            }
        }

        order.returnStatus = "requested";
        order.returnReason = reason;
        order.orderStatus = "return requested";

        // Optionally, you could also store detailed return information on each item,
        // for example in a new field like order.returnDetails = { items, reason, requestedAt: new Date() }

        await order.save();

        return res.json({
            success: true,
            message: "Return request submitted successfully."
        });


    } catch (error) {
        console.error("Error processing return request:", error);
        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
}


export const getWishlist = async (req, res) => {

    try {

        let wishlist = await Wishlist.findOne({ user: req.user.userId })
            .populate({
                path: 'items.product',
                select: 'name colors'
            });

        if (!wishlist) {
            wishlist = { items: [] };
        }

        res.status(200).json({
            success: true,
            wishlist: wishlist.items
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}



export const addWishlist = async (req, res) => {

    try {
        const { productId, selectedColor } = req.body.data;

        let wishlist = await Wishlist.findOne({ user: req.user.userId });
        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user.userId,
                items: []
            });
        }

        const existingItemIndex = wishlist.items.findIndex(
            item => item.product.toString() === productId && item.selectedColor === selectedColor
        );

        if (existingItemIndex >= 0) {
            return res.status(200).json({
                success: true,
                message: 'Item already in wishlist'
            });
        }

        wishlist.items.push({
            product: productId,
            selectedColor
        });

        await wishlist.save();

        res.status(201).json({
            success: true,
            message: 'Item added to wishlist',
            wishlist
        });

    } catch (error) {

        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


export const removeWishlistItem = async (req, res) => {

    try {
        const { productId, selectedColor } = req.body;

        const wishlist = await Wishlist.findOne({ user: req.user.userId });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = wishlist.items.filter(
            item => !(item.product.toString() === productId && item.selectedColor === selectedColor)
        );

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: 'Item removed from wishlist',
            wishlist
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


export const validateCoupon = async (req, res) => {

    try {

        const { code, orderTotal, productCategories } = req.body;

        const coupon = await Coupon.findOne({ code, deletedAt: null });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        const now = new Date();

        if (coupon.activeFrom > now) {
            return res.status(400).json({
                success: false,
                message: "Coupon is not active yet"
            });
        }

        if (coupon.expiresAt < now) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired"
            });
        }

        if (coupon.usedCount >= coupon.maxUsage) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached"
            });
        }

        if (coupon.minimumOrderValue && orderTotal < coupon.minimumOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order value for this coupon is ${coupon.minimumOrderValue}`
            });
        }

        if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
            if (!productCategories || !productCategories.some(cat => coupon.applicableCategories.includes(cat))) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon is not applicable for the selected product categories"
                });
            }
        }

        res.status(200).json({
            success: true,
            coupon
        });

    } catch (error) {

        console.error("Error validating coupon: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}



export const getWalletDetails = async (req, res) => {
    try {
        const { userId } = req.user;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find wallet by userId, or create a new one if not found
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = await Wallet.create({
                userId,
                balance: 0,
                pendingBalance: 0,
                currency: 'INR',
                isActive: true,
            });
        }

        // Get transactions for this wallet with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId };



        // Apply status filter if provided
        if (req.query.status && ['pending', 'completed', 'failed', 'cancelled'].includes(req.query.status)) {
            filter.status = req.query.status;
        }

        // Apply type filter if provided
        if (req.query.type && ['credit', 'debit'].includes(req.query.type)) {
            filter.type = req.query.type;
        }

        // Search functionality
        if (req.query.search) {
            filter.$or = [
                { description: { $regex: req.query.search, $options: 'i' } },
                { 'reference.orderId': req.query.search }
            ];
        }

        // Get transactions
        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reference.orderId', 'orderNumber')
            .lean();

        // Get total count for pagination
        const totalTransactions = await Transaction.countDocuments(filter);

        // Get summary statistics
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [walletSummary, monthlyStats] = await Promise.all([
            Transaction.getWalletSummary(wallet._id),
            Transaction.getMonthlyStats(userId, currentYear, currentMonth)
        ]);

        // Process summary data
        const summary = {
            totalSpent: 0,
            totalRefunded: 0,
            thisMonth: 0,
            pendingAmount: wallet.pendingBalance
        };

        // Process wallet summary
        walletSummary.forEach(item => {
            if (item._id === 'debit') {
                summary.totalSpent = item.total;
            } else if (item._id === 'credit') {
                summary.totalRefunded = item.total;
            }
        });

        // Process monthly stats
        monthlyStats.forEach(item => {
            summary.thisMonth += item.total;
        });

        // Format transactions for frontend
        const formattedTransactions = transactions.map(tx => {
            const orderIdValue = tx.reference && tx.reference.orderId ?
                (tx.reference.orderId.orderNumber || tx.reference.orderId.toString()) :
                '';

            return {
                id: tx._id,
                type: tx.type,
                amount: tx.amount,
                date: tx.createdAt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: tx.status,
                description: tx.description,
                orderId: orderIdValue,
                source: tx.source
            };
        });

        return res.status(200).json({
            wallet: {
                balance: wallet.balance,
                pendingBalance: wallet.pendingBalance,
                currency: wallet.currency,
                isActive: wallet.isActive
            },
            summary,
            transactions: formattedTransactions,
            pagination: {
                page,
                limit,
                totalTransactions,
                totalPages: Math.ceil(totalTransactions / limit)
            }
        });

    } catch (error) {
        console.error('Error getting wallet details:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getWalletBalance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(400).json({
                success: false,
                message: "Wallet not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Wallet balance fetched successfully",
            balance: wallet.balance,
        });
    } catch (error) {
        console.error("Error getting wallet balance:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const walletRecharge = async (req, res) => {


    const { userId } = req.user;
    const { paymentMethod, paypalOrderID } = req.body;
    let { amount } = req.body;

    amount = Number(amount)

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Valid amount is required for wallet recharge"
        });
    }



    let paymentVerified = false;
    let paymentDetails = null;

    try {
        // Find user's wallet
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found for this user"
            });
        }

        if (!wallet.isActive) {
            return res.status(400).json({
                success: false,
                message: "Wallet is inactive"
            });
        }

        if (paymentMethod === 'paypal') {
            if (!paypalOrderID) {
                return res.status(400).json({
                    success: false,
                    message: "PayPal Order ID is required for PayPal payments"
                });
            }

            try {
                // Verify the PayPal order
                const paypalOrderDetails = await verifyPayPalOrder(paypalOrderID);

                // Verify that the payment amount matches our calculated total
                const paypalAmount = parseFloat(paypalOrderDetails.purchase_units[0].amount.value);


                if (paypalAmount !== amount) {
                    return res.status(400).json({
                        success: false,
                        message: "Payment amount does not match the recharge amount"
                    });
                }

                // Capture the payment
                paymentDetails = await capturePayPalPayment(paypalOrderID);
                paymentVerified = true;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to verify PayPal payment"
                });
            }
        } else if (paymentMethod === 'razopay') {

            return res.status(501).json({
                success: false,
                message: "razopay payment method not implemented yet"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        if (paymentVerified) {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Create a new transaction record
                const transaction = new Transaction({
                    transactionId: generateTransactionId(),
                    walletId: wallet._id,
                    userId: userId,
                    type: 'credit',
                    amount: amount,
                    balance: wallet.balance + amount,
                    description: `Wallet recharge via ${paymentMethod}`,
                    status: 'completed',
                    source: 'manual_credit',
                    reference: {
                        paymentId: paymentMethod === 'paypal' ? paypalOrderID : null
                    },
                    metadata: paymentDetails ? new Map(Object.entries(paymentDetails)) : new Map()
                });

                await transaction.save({ session });


                wallet.balance += amount;
                wallet.updatedAt = new Date();
                await wallet.save({ session });


                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({
                    success: true,
                    message: "Wallet recharged successfully",
                    data: {
                        transaction: {
                            id: transaction._id,
                            amount: transaction.amount,
                            type: transaction.type,
                            status: transaction.status,
                            createdAt: transaction.createdAt
                        },
                        wallet: {
                            id: wallet._id,
                            balance: wallet.balance,
                            currency: wallet.currency
                        }
                    }
                });
            } catch (error) {

                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error("Wallet recharge error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during wallet recharge",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const checkOffer = async (req, res) => {
    try {

        const productId = req.params.productId;


        const product = await Product.findById(productId);
        if (!product) {
            return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Product not found" });
        }

        const currentDate = new Date();

        const productOffers = await ProductOffer.find({
            products: productId,
            status: 'active',
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        const categoryOffers = await CategoryOffer.find({
            category: product.category,
            status: 'active',
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        const offers = [
            ...productOffers.map(offer => ({
                name: offer.name,
                discount: offer.discount,
                endDate: offer.endDate,
                type: 'product'
            })),
            ...categoryOffers.map(offer => ({
                name: offer.name,
                discount: offer.discount,
                endDate: offer.endDate,
                type: 'category'
            }))
        ];

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "offer vailable",
            offers
        });

    } catch (error) {

        console.error("Error fetching offers:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
}




export const referalDetails = async (req, res) => {

    try {
        const userId = req.user.userId
        const { page, limit, search } = req.query



        const referralData = await UserReferral.findOne({ user: userId }).populate({
            path: "referrals",
            match: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            } : {},
            options: {
                sort: { createdAt: -1 },
                skip: (page - 1) * limit,
                limit: limit
            }
        }
        )

        if (!referralData) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Referral data not found"
            })
        }
        console.log(referralData);

        const formattedRefferals = referralData.referrals.map(ref =>
        ({
            id: ref._id,
            name: ref.name,
            email: ref.email,
            joinedDate: ref.joinedDate,
            status: ref.status,
            amount: ref.amount,
        })
        )

        const totalReferrals = search
            ? referralData.referrals.length
            : referralData.stats.totalReferrals;

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Referral data fetched successfully",
            referralDetails: {
                referralCode: referralData.referralCode,
                referralLink: referralData.referralLink,
                totalEarned: referralData.stats.totalEarned,
                pendingAmount: referralData.stats.pendingAmount,
                totalReferrals: referralData.stats.totalReferrals,
                activeReferrals: referralData.stats.activeReferrals,
            },
            referrals: formattedRefferals,
            pagination: {
                page: page || 1,
                limit,
                totalReferrals,
                totalPages: Math.ceil(totalReferrals / limit)
            }
        })

    } catch (error) {
        console.error("Error fetching referral details:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
}