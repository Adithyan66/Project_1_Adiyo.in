
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';

import { OAuth2Client } from 'google-auth-library';
import { generateUniqueUserId } from "../services/generateUniqueUserId.js"
const ObjectId = mongoose.Types.ObjectId;


import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Review from "../models/reviewModel.js";
import Otp from "../models/otpModel.js";
import cloudinary from "../config/cloudinary.js";



export const signUp = async (req, res) => {

    try {
        const { username, email, password, role } = req.body;


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

        const userId = await generateUniqueUserId(role)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            userId,
            password: hashedPassword,
            role: role || "customer",
        });

        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });

        res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });


        res.status(201).json({
            success: true,
            message: "User created successfull",
            token: token,
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

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(400).json({ success: false, message: "User is blocked" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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
        res.status(500).json({ success: false, message: "Internal server error" });
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

        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        // user.resetPasswordToken = resetToken;
        //await user.save();



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

    console.log("reached reset password");

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
        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        // Check if user exists; if not, create a new one
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username: name,
                email,
                googleId,
            });
            await user.save();
        }

        // Optional: You could re-fetch the user if needed
        // user = await User.findOne({ email });

        // If the user is blocked, stop further processing
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: 'User is Blocked'
            });
        }

        // Sign a JWT token with the user's ID. Use an environment variable for the secret.
        const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

        // Set the token in an HTTP-only cookie
        res.cookie("session", sessionToken, {
            httpOnly: true,
            secure: false,      // Set to true in production (with HTTPS)
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        });

        // Send response (Note: consider not sending the token in JSON if you're relying on cookies)
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
            console.log(sizesArray);

            const sizeCondition = {
                $or: [
                    { "variants.small.size": { $in: sizesArray } },
                    { "variants.medium.size": { $in: sizesArray } },
                    { "variants.large.size": { $in: sizesArray } },
                    { "variants.extraLarge.size": { $in: sizesArray } }
                ]
            };

            if (match.colors) {
                match.colors.$elemMatch = {
                    ...match.colors.$elemMatch,
                    ...sizeCondition,
                };
            } else {
                match.colors = { $elemMatch: sizeCondition };
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

        // Print the entire pipeline object in a formatted way:


        // Print the last pipeline stage:
        //console.log("Last pipeline stage:", JSON.stringify(pipeline[pipeline.length - 1], null, 2));



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

        const product = await Product.findById(id);

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
        const { userId, rating, comment } = req.body;

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
        console.log(updateData, "ith updated data ");


        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};