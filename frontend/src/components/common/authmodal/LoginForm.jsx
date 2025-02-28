import React from 'react'
import { useState } from 'react';
import axios from 'axios';

import { Eye, ShowEye } from "../../../icons/icons";

import facebook from "../../../assets/images/Facebook (Button).png"
import google from "../../../assets/images/Google (Button).png"
import apple from "../../../assets/images/Apple (Button).png"

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup, setActiveForm } from '../../../store/slices/authModalSlice.js';


function LoginForm() {

    const dispatch = useDispatch();


    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission


        if (!email || !password) {
            console.error("Fields cannot be empty!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3333/user/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("check token available in this:", response.data.token);


            localStorage.setItem('token', response.data.token);

            console.log("saved to local");

            dispatch(loginSuccess({ user: response.data.user, token: response.data.token, role: response.data.role }));



        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
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
                        placeholder="email"
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
                    {/* Eye Icon for toggling password */}
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
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
                    <button className="text-gray-500 hover:text-gray-700 text-sm"
                        onClick={() => dispatch(setActiveForm("forgot"))}>
                        Forgot Password?
                    </button>
                </div>

                {/* Login Button */}
                <button
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors"
                    type='submit'
                >
                    Login
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
                {/* Replace with your own images if needed */}
                <button className="bg-gray-100  hover:bg-gray-200 transition-colors">
                    <img src={facebook} alt="" />
                </button>
                <button className="bg-gray-100  hover:bg-gray-200 transition-colors">
                    <img src={google} alt="" />
                </button>
                <button className="bg-gray-100  hover:bg-gray-200 transition-colors">
                    <img src={apple} alt="" />
                </button>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Don’t have an account?{" "}
                <button className="text-blue-600 hover:underline font-medium"
                    onClick={() => dispatch(setActiveForm("signup"))}>
                    Register Now
                </button>
            </div>
        </div>
    );
}


export default LoginForm
