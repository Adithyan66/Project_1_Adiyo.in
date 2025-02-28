


import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { Eye, ShowEye } from "../../../icons/icons";
import OtpVerification from "./OtpVerification";
import { useDispatch } from "react-redux";
import { setActiveForm, setLoginPopup } from "../../../store/slices/authModalSlice.js";



function Forgot() {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleSendOtp = async (e) => {

        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {

            const response = await axios.post(`http://localhost:3333/user/forgot-password`, { email });

            setMessage(response.data.message);

            setOtpSent(response.data.status);

            console.log(response.data.otp);


        } catch (err) {

            console.log(err);
            setError(err.response?.data?.message || "Failed to send OTP");

        } finally {

            setLoading(false);

        }
    };


    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`http://localhost:3333/user/reset-password`, {
                email,
                password,
                resetToken
            });

            console.log("response", response);

            if (response.data.status) {
                setMessage(response.data.message || "Password reset successfully. Please log in.");

                dispatch(setLoginPopup(false));
                console.log("loginpopup",);


            } else {
                setError(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };



    const handleOtpVerified = () => {

        setOtpVerified(true);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Forgot Password?
            </h2>
            <h2 className="text-sm text-gray-500 mb-6">
                Don't worry! It happens. Please enter the email address linked with your account.
            </h2>

            {/* Email Field */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 mb-1">
                    Enter your email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                    disabled={otpSent}
                />
            </div>
            <div className="text-right">
                <button
                    onClick={handleSendOtp}
                    className="text-gray-800 hover:text-gray-700 text-sm"
                    disabled={otpSent}
                >
                    {otpSent ? "Code Sent" : "Send Code"}
                </button>
            </div>

            {/* OTP Verification Section */}
            {otpSent && (
                <div className="mb-4">
                    <OtpVerification email={email} onVerified={handleOtpVerified} setResetToken={setResetToken} />
                </div>
            )}

            {/* Password Field */}
            <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-600 mb-1">
                    Enter New Password
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!otpVerified}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500"
                >
                    {showPassword ? <Eye /> : <ShowEye />}
                </button>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">
                    Confirm New Password
                </label>
                <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!otpVerified}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500"
                >
                    {showPassword ? <Eye /> : <ShowEye />}
                </button>
            </div>

            {/* Reset Password Button */}
            <button
                className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors"
                disabled={!otpVerified}
                onClick={handleResetPassword}
            >
                Reset Password
            </button>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Remember password?{" "}
                <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => dispatch(setActiveForm("login"))}>
                    Login Now
                </button>
            </div>
        </div>
    );
}

export default Forgot;
