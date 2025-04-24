




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Eye, ShowEye } from "../../../icons/icons";
import OtpVerification from "./OtpVerification";
import { useDispatch } from "react-redux";
import { setActiveForm, setLoginPopup } from "../../../store/slices/authModalSlice.js";
import { toast } from "react-toastify";
import { forgotPassword, resetPassword } from "../../../services/authService.js";

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
    const [sendingOtp, setSendingOtp] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // State to manage the countdown timer (in seconds)
    const [counter, setCounter] = useState(0);

    // useEffect to handle the countdown
    useEffect(() => {
        let timer;
        if (counter > 0) {
            timer = setInterval(() => {
                setCounter((prevCounter) => prevCounter - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [counter]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setSendingOtp(true);
        setMessage("");
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            setSendingOtp(false);
            return;
        }

        try {
            const response = await forgotPassword(email);
            toast.success(response.data.message);
            setOtpSent(response.data.status);

            setCounter(60);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to send OTP");
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResettingPassword(true);
        setMessage("");
        setError("");

        if (password.length < 6) {
            toast.error("Password should be at least 6 characters long");
            setResettingPassword(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setResettingPassword(false);
            return;
        }

        try {
            const response = await resetPassword({
                email,
                password,
                resetToken,
            });

            if (response.data.status) {
                setMessage(response.data.message || "Password reset successfully. Please log in.");
                dispatch(setLoginPopup(false));
                toast.success("Password reset successfully. Please log in.");
            } else {
                toast.error("Failed to reset password.");
                setError(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setResettingPassword(false);
        }
    };

    const handleOtpVerified = () => {
        setOtpVerified(true);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Forgot Password?</h2>
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
                    disabled={otpSent || sendingOtp}
                />
            </div>
            <div className="text-right">
                <button
                    onClick={handleSendOtp}
                    className="text-gray-800 hover:text-gray-700 text-sm"
                    disabled={sendingOtp || (otpSent && counter > 0)}
                >
                    {sendingOtp ? (
                        <span className="flex items-center justify-end">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Code...
                        </span>
                    ) : otpSent && counter > 0 ? (
                        `Resend Code in ${counter}s`
                    ) : (
                        "Send Code"
                    )}
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
                    disabled={!otpVerified || resettingPassword}
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
                    disabled={!otpVerified || resettingPassword}
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
                className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center"
                disabled={!otpVerified || resettingPassword}
                onClick={handleResetPassword}
            >
                {resettingPassword ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting Password...
                    </>
                ) : (
                    "Reset Password"
                )}
            </button>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Remember password?{" "}
                <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => dispatch(setActiveForm("login"))}
                >
                    Login Now
                </button>
            </div>
        </div>
    );
}

export default Forgot;