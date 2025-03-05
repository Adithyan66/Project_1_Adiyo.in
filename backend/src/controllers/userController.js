

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';

import { OAuth2Client } from 'google-auth-library';


import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import Review from "../models/reviewModel.js";



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




// const productList = async (req, res) => {


//     try {
//         const query = { isBlocked: false, isListed: true };

//         if (req.query.search) {
//             query.name = { $regex: req.query.search, $options: "i" };
//         }

//         if (req.query.category) {
//             query.category = req.query.category;
//         }

//         if (req.query.minPrice || req.query.maxPrice) {
//             query.discountPrice = {};
//             if (req.query.minPrice) {
//                 query.discountPrice.$gte = Number(req.query.minPrice);
//             }
//             if (req.query.maxPrice) {
//                 query.discountPrice.$lte = Number(req.query.maxPrice);
//             }
//         }

//         if (req.query.color) {
//             const colors = req.query.color.split(",");
//             query.color = { $in: colors };
//         }

//         if (req.query.size) {
//             const sizes = req.query.size.split(",");
//             query.size = { $in: sizes };
//         }

//         if (req.query.dressStyle) {
//             query.dressStyle = req.query.dressStyle;
//         }

//         let sortCriteria = {};
//         switch (req.query.sort) {
//             case "price_low_high":
//                 sortCriteria.price = 1;
//                 break;
//             case "price_high_low":
//                 sortCriteria.price = -1;
//                 break;
//             case "name_a_z":
//                 sortCriteria.name = 1;
//                 break;
//             case "name_z_a":
//                 sortCriteria.name = -1;
//                 break;
//             default:
//                 break;
//         }

//         const page = parseInt(req.query.page, 10) || 1;
//         const limit = parseInt(req.query.limit, 10) || 10;
//         const skip = (page - 1) * limit;

//         const products = await Product.find(query)
//             .sort(sortCriteria)
//             .skip(skip)
//             .limit(limit);

//         const totalProducts = await Product.countDocuments(query);

//         res.status(200).json({
//             status: true,
//             message: "fetched succesfully",
//             page,
//             totalPages: Math.ceil(totalProducts / limit),
//             totalProducts,
//             products,
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Server error"
//         });
//     }

//}


const productList = async (req, res) => {
    try {
        // Build a base match object for top-level fields.
        const match = {};  // Use an empty object if you don't want to filter by isBlocked/isListed

        // Search by name
        if (req.query.search) {
            match.name = { $regex: req.query.search, $options: "i" };
        }

        // Filter by category and subCategory
        if (req.query.category) {
            match.category = req.query.category;
        }
        if (req.query.subCategory) {
            match.subCategory = req.query.subCategory;
        }

        // --- Nested filtering on colors array ---

        // Price filter on discountPrice (nested in colors)
        if (req.query.minPrice || req.query.maxPrice) {
            const priceFilter = {};
            if (req.query.minPrice) {
                priceFilter.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                priceFilter.$lte = Number(req.query.maxPrice);
            }
            // Match if at least one color has a discountPrice in range.
            match.colors = { $elemMatch: { discountPrice: priceFilter } };
        }

        // Color filter: if provided, match if any color variant has a matching color.
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

        // Size filter: check if any color variant has one of the sizes.
        if (req.query.size) {
            const sizesArray = req.query.size.split(",");
            const sizeCondition = {
                $or: [
                    { "variants.small.size": { $in: sizesArray } },
                    { "variants.medium.size": { $in: sizesArray } },
                    { "variants.large.size": { $in: sizesArray } },
                    { "variants.extraLarge.size": { $in: sizesArray } }
                ],
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

        // --- Build Aggregation Pipeline ---
        const pipeline = [
            { $match: match },
            {
                $addFields: {
                    minDiscountPrice: { $min: "$colors.discountPrice" },
                },
            },
        ];

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


const addReview = async (req, res) => {

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


const getReviews = async (req, res) => {

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
    productDetail,
    addReview,
    getReviews
};
