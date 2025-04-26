

import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, ShowEye } from "../../../icons/icons";
import facebook from "../../../assets/images/Facebook (Button).png"
import apple from "../../../assets/images/Apple (Button).png"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup, setActiveForm } from '../../../store/slices/authModalSlice.js';
import GoogleSignIn from './GoogleSignin.jsx';
import { Navigate, useNavigate } from 'react-router';
import { login } from '../../../services/authService.js';

function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!email || !password) {
            toast.error("Fields cannot be empty!");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await login({ email, password });

            if (response.data && response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
            }

            if (response.data.success) {
                dispatch(setLoginPopup(false));
                dispatch(loginSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    role: response.data.role
                }));

                toast.success("Logged in successfully!");

                if (response.data.role === "admin") {
                    navigate("/admin");
                } else if (response.data.role === "seller") {
                    navigate("/seller");
                }
            }
        } catch (err) {
            toast.error(err.response?.data.message || "Login failed. Please try again.");
            console.error("Error:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Welcome back! Glad to see you,
            </h2>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Again!
            </h2>
            <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600 mb-1">
                        Enter your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email address"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                {/* Password Field */}
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-gray-600 mb-1">
                        Enter your password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 pr-10"
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    {/* Eye Icon for toggling password */}
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <Eye />
                        ) : (
                            <ShowEye />
                        )}
                    </button>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right mb-6">
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                        onClick={() => dispatch(setActiveForm("forgot"))}
                        disabled={isLoading}
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Login Button */}
                <button
                    className={`w-full bg-black text-white py-2 rounded-md font-semibold transition-colors flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-900'}`}
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                        </>
                    ) : "Login"}
                </button>
            </form>

            {/* Or Login with */}
            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="text-sm text-gray-400 mx-3">Or Login with</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4">
                <button
                    className="bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <img src={facebook} alt="Facebook login" />
                </button>

                <button
                    className="bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <GoogleSignIn />
                </button>

                <button
                    className="bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                >
                    <img src={apple} alt="Apple login" />
                </button>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                    className="text-blue-600 hover:underline font-medium transition-colors"
                    onClick={() => dispatch(setActiveForm("signup"))}
                    disabled={isLoading}
                >
                    Register Now
                </button>
            </div>
        </div>
    );
}

export default LoginForm