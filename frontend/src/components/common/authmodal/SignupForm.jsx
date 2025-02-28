

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Eye, ShowEye } from "../../../icons/icons";
import facebook from "../../../assets/images/Facebook (Button).png";
import google from "../../../assets/images/Google (Button).png";
import apple from "../../../assets/images/Apple (Button).png";

import { setActiveForm, setLoginPopup } from '../../../store/slices/authModalSlice.js';
import { useDispatch } from 'react-redux';

function SignupForm() {


    const dispatch = useDispatch();


    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3333/user/signup",
                { username, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            console.log("Signup Successful:", response.data);
            // Navigate to another page after successful signup
            navigate("/welcome"); // Change this route as needed
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Hello! Register to get
            </h2>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                started!
            </h2>

            {/* Form starts here */}
            <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-600 mb-1">
                        Enter your username
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="username"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600 mb-1">
                        Enter your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="password"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye /> : <ShowEye />}
                    </button>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4 relative">
                    <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">
                        Confirm your password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye /> : <ShowEye />}
                    </button>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors"
                >
                    Register
                </button>
            </form>
            {/* End of Form */}

            {/* Or Register with */}
            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="text-sm text-gray-400 mx-3">Or Register with</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4">
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors">
                    <img src={facebook} alt="Facebook" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors">
                    <img src={google} alt="Google" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors">
                    <img src={apple} alt="Apple" />
                </button>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{" "}
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

export default SignupForm;
