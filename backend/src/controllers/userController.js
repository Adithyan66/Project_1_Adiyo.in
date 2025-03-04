

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';

import { OAuth2Client } from 'google-auth-library';


import User from "../models/userModel.js";
import Product from "../models/productModel.js"



const signUp = async (req, res) => {
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "customer",
        });

        console.log("Created:", user);

        res.status(201).json({
            success: true,
            message: "User created successfully, please sign in",
            user: {
                _id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }


        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });



        res.cookie("jwt", token, {
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



const forgotPassword = async (req, res) => {


    const { email } = req.body;




    try {
        const user = await User.findOne({ email });


        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOTP();



        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();


        console.log("user data is ", user);

        await sendOTPEmail(email, otp);

        res.json({
            otp,
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




const validateOTP = async (req, res) => {

    console.log("validate otp reached");


    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        // Validate OTP and its expiration
        if (
            user.resetPasswordOTP !== otp ||
            user.resetPasswordExpires < Date.now()
        ) {
            return res
                .status(400)
                .json({ message: 'Invalid or expired OTP' });
        }


        const resetToken = generateResetToken();
        user.resetPasswordToken = resetToken;
        await user.save();

        res.json({
            success: true,
            message: 'OTP validated successfully. Use the reset token to update your password.',
            resetToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




const resetPassword = async (req, res) => {

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





const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {

    const token = req.body.token;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {

            user = new User({
                username: name,
                email,
                googleId,
            });
            await user.save();
        }

        user = await User.findOne({ email });



        const jwtToken = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });

        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Google login successful',
            token: jwtToken,
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




const productList = async (req, res) => {


    try {
        // Build the query object to exclude blocked/unlisted products
        const query = { isBlocked: false, isListed: true };

        // ======= Search =======
        if (req.query.search) {
            // Search in the product name (adjust as necessary)
            query.name = { $regex: req.query.search, $options: "i" };
        }

        // ======= Filters =======
        // Category filter (if provided)
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Price Range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.discountPrice = {};
            if (req.query.minPrice) {
                query.discountPrice.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                query.discountPrice.$lte = Number(req.query.maxPrice);
            }
        }

        // Color filter (allowing multiple values if comma separated)
        if (req.query.color) {
            // Split the comma separated string into an array
            const colors = req.query.color.split(",");
            query.color = { $in: colors };
        }

        // Size filter (allowing multiple values)
        if (req.query.size) {
            const sizes = req.query.size.split(",");
            query.size = { $in: sizes };
        }

        // Dress Style filter
        if (req.query.dressStyle) {
            query.dressStyle = req.query.dressStyle;
        }

        // ======= Sorting =======
        let sortCriteria = {};
        switch (req.query.sort) {
            case "price_low_high":
                sortCriteria.price = 1;
                break;
            case "price_high_low":
                sortCriteria.price = -1;
                break;
            case "name_a_z":
                sortCriteria.name = 1;
                break;
            case "name_z_a":
                sortCriteria.name = -1;
                break;
            default:
                // Default sort logic can be added here if needed
                break;
        }

        // ======= Pagination =======
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Execute the query with sorting, skipping, and limiting
        const products = await Product.find(query)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        // Get the total count for pagination information
        const totalProducts = await Product.countDocuments(query);

        // Return the paginated data along with pagination info
        res.json({
            page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }

}


const logout = async (req, res) => {

    res.cookie("token", "", { expires: new Date(0), httpOnly: true, path: "/" })
    res.status(200).json({
        status: true,
        message: "logout succesfully"
    })
}


const profile = async (req, res) => {

    const token = req.cookies.token;

    console.log("token from front end :", token)

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "not authenticated"
        })
    }
    try {
        const decoded = jwt.verify(token, "secret")

        console.log("decoded token =", decoded);
        const _id = decoded.userId
        console.log("decoded userId =", _id);

        const user = await User.findOne({ _id })

        console.log("final user", user);

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


const productDetail = async (req, res) => {


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

export {
    signUp,
    login,
    forgotPassword,
    validateOTP,
    resetPassword,
    googleLogin,
    productList,
    logout,
    profile,
    productDetail
};
