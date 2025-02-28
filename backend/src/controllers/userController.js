

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import { generateOTP, sendOTPEmail } from "../services/otpService.js";
import { generateResetToken } from '../services/tokenService.js';






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
            role: role || "customer", // Default to "customer"
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

    console.log(req.body);


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

        // Generate token
        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "30d" });

        // Debugging - check token before sending
        console.log("Generated Token:", token);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,  // false for development on HTTP
            sameSite: "Lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
















export { signUp, login, forgotPassword, validateOTP, resetPassword };
