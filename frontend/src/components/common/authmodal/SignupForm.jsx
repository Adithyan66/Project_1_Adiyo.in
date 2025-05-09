


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Eye, ShowEye } from "../../../icons/icons";
// import facebook from "../../../assets/images/Facebook (Button).png";
// import apple from "../../../assets/images/Apple (Button).png";
// import { setActiveForm } from '../../../store/slices/authModalSlice.js';
// import { loginSuccess } from '../../../store/slices/userSlice';
// import { setLoginPopup } from '../../../store/slices/authModalSlice.js';
// import { useDispatch } from 'react-redux';
// import GoogleSignIn from './GoogleSignin.jsx';

// // Import the OTPVerification component
// import OtpVerification from './OtpVerification';
// import { sentOtp, signup } from '../../../services/authService.js';

// function SignupForm() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     // Common Fields
//     const [email, setEmail] = useState("");

//     // OTP Flow States
//     const [emailSent, setEmailSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [counter, setCounter] = useState(0);

//     // Registration Fields (enabled after OTP verification)
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [referralCode, setReferralCode] = useState(""); // New referral code state
//     const [showPassword, setShowPassword] = useState(false);

//     // Loading states
//     const [sendingOtp, setSendingOtp] = useState(false);
//     const [registering, setRegistering] = useState(false);

//     // Countdown effect for resend button
//     useEffect(() => {
//         let timer;
//         if (counter > 0) {
//             timer = setInterval(() => {
//                 setCounter(prev => prev - 1);
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [counter]);

//     // Function to send OTP for signup
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setSendingOtp(true);

//         // Validate email format
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             toast.error("Please enter a valid email address");
//             setSendingOtp(false);
//             return;
//         }
//         try {
//             const response = await sentOtp(email);
//             toast.success(response.data.message);
//             setEmailSent(true);
//             setCounter(60);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to send OTP");
//         } finally {
//             setSendingOtp(false);
//         }
//     };

//     const handleOtpVerified = (resetToken) => {
//         setOtpVerified(true);
//     };

//     const validateRegistration = () => {
//         if (!username || !password || !confirmPassword) {
//             toast.error("All fields are required");
//             return false;
//         }
//         if (password.length < 6) {
//             toast.error("Password should be at least 6 characters long");
//             return false;
//         }
//         if (password !== confirmPassword) {
//             toast.error("Passwords do not match");
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateRegistration()) return;

//         setRegistering(true);
//         try {
//             const role = "customer";
//             const signupData = { username, email, password, role };
//             if (referralCode) {
//                 signupData.referralCode = referralCode;
//             }

//             const response = await signup(signupData);

//             if (response.data && response.data.token) {
//                 localStorage.setItem('accessToken', response.data.token);
//                 console.log("Logged in successfully!");
//             }

//             if (response.data.success) {
//                 dispatch(setLoginPopup(false));
//                 dispatch(loginSuccess({
//                     user: response.data.user,
//                     token: response.data.token,
//                     role: response.data.role,
//                 }));
//                 if (response.data.role === "admin") {
//                     navigate("/admin/dashboard");
//                 } else if (response.data.role === "seller") {
//                     navigate("/seller/dashboard");
//                 } else {
//                     navigate("/");
//                 }
//                 toast.success("Signup Successful!");
//             }
//         } catch (err) {
//             const errorMsg = err.response?.data?.message || err.message;
//             toast.error(`Error: ${errorMsg}`);
//         } finally {
//             setRegistering(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
//             {/* Heading */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-1">Hello! Register to get</h2>
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">started!</h2>

//             <form onSubmit={otpVerified ? handleSubmit : (e) => e.preventDefault()}>
//                 {/* Email Section – always visible */}
//                 <div className="mb-4">
//                     <label htmlFor="email" className="block text-gray-600 mb-1">Enter your email</label>
//                     <input
//                         type="email"
//                         id="email"
//                         placeholder="Enter your email"
//                         className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         disabled={emailSent || sendingOtp} // Disable when OTP is sent or sending
//                         required
//                     />
//                 </div>

//                 {/* Send OTP button – visible when OTP has not been sent */}
//                 {!emailSent && (
//                     <div className="text-right mb-4">
//                         <button
//                             onClick={handleSendOtp}
//                             className="text-gray-800 hover:text-gray-700 text-sm"
//                             disabled={sendingOtp}
//                         >
//                             {sendingOtp ? (
//                                 <span className="flex items-center justify-end">
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Sending OTP...
//                                 </span>
//                             ) : (
//                                 "Send OTP"
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* OTP Verification Component – rendered once OTP is sent and before verification */}
//                 {emailSent && !otpVerified && (
//                     <div className="mb-4">
//                         <OtpVerification
//                             email={email}
//                             onVerified={handleOtpVerified}
//                             counter={counter}
//                             onResend={handleSendOtp}
//                         />
//                     </div>
//                 )}

//                 {/* Registration Section – visible only after OTP is verified */}
//                 {otpVerified && (
//                     <>
//                         <div className="mb-4">
//                             <label htmlFor="username" className="block text-gray-600 mb-1">Enter your username</label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 placeholder="username"
//                                 className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 disabled={registering}
//                                 required
//                             />
//                         </div>

//                         {/* Password Field */}
//                         <div className="mb-4 relative">
//                             <label htmlFor="password" className="block text-gray-600 mb-1">Enter your password</label>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="password"
//                                 placeholder="password"
//                                 className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 disabled={registering}
//                                 required
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute right-3 top-9 text-gray-500"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 disabled={registering}
//                             >
//                                 {showPassword ? <Eye /> : <ShowEye />}
//                             </button>
//                         </div>

//                         {/* Confirm Password Field */}
//                         <div className="mb-4 relative">
//                             <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">Confirm your password</label>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="confirmPassword"
//                                 placeholder="Confirm password"
//                                 className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 disabled={registering}
//                                 required
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute right-3 top-9 text-gray-500"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 disabled={registering}
//                             >
//                                 {showPassword ? <Eye /> : <ShowEye />}
//                             </button>
//                         </div>

//                         {/* Referral Code Field - New addition */}
//                         <div className="mb-4">
//                             <label htmlFor="referralCode" className="block text-gray-600 mb-1">Referral code (optional)</label>
//                             <input
//                                 type="text"
//                                 id="referralCode"
//                                 placeholder="Enter referral code if you have one"
//                                 className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
//                                 value={referralCode}
//                                 onChange={(e) => setReferralCode(e.target.value)}
//                                 disabled={registering}
//                             />
//                         </div>

//                         {/* Final Register Button */}
//                         <button
//                             type="submit"
//                             className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center"
//                             disabled={registering}
//                         >
//                             {registering ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Registering...
//                                 </>
//                             ) : (
//                                 "Register"
//                             )}
//                         </button>
//                     </>
//                 )}
//             </form>

//             {/* Or Register with */}
//             <div className="flex items-center my-6">
//                 <div className="flex-grow h-px bg-gray-300"></div>
//                 <span className="text-sm text-gray-400 mx-3">Or Register with</span>
//                 <div className="flex-grow h-px bg-gray-300"></div>
//             </div>

//             {/* Social Icons */}
//             <div className="flex justify-center space-x-4">
//                 <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
//                     <img src={facebook} alt="Facebook" />
//                 </button>
//                 <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
//                     <GoogleSignIn />
//                 </button>
//                 <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
//                     <img src={apple} alt="Apple" />
//                 </button>
//             </div>

//             {/* Bottom text */}
//             <div className="text-center mt-6 text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <button
//                     className="text-blue-600 hover:underline font-medium"
//                     onClick={() => dispatch(setActiveForm("login"))}
//                     disabled={sendingOtp || registering}
//                 >
//                     Login Now
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default SignupForm;













import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, ShowEye } from "../../../icons/icons";
import facebook from "../../../assets/images/Facebook (Button).png";
import apple from "../../../assets/images/Apple (Button).png";
import { setActiveForm } from '../../../store/slices/authModalSlice.js';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup } from '../../../store/slices/authModalSlice.js';
import { useDispatch } from 'react-redux';
import GoogleSignIn from './GoogleSignin.jsx';

// Import the OTPVerification component
import OtpVerification from './OtpVerification';
import { sentOtp, signup } from '../../../services/authService.js';

function SignupForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Common Fields
    const [email, setEmail] = useState("");

    // OTP Flow States
    const [emailSent, setEmailSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [counter, setCounter] = useState(0);

    // Registration Fields (enabled after OTP verification)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referralCode, setReferralCode] = useState(""); // New referral code state
    const [showPassword, setShowPassword] = useState(false);

    // Loading states
    const [sendingOtp, setSendingOtp] = useState(false);
    const [registering, setRegistering] = useState(false);

    // Countdown effect for resend button
    useEffect(() => {
        let timer;
        if (counter > 0) {
            timer = setInterval(() => {
                setCounter(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [counter]);

    // Function to send OTP for signup
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setSendingOtp(true);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            setSendingOtp(false);
            return;
        }
        try {
            const response = await sentOtp(email);
            toast.success(response.data.message);
            setEmailSent(true);
            setCounter(60);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleOtpVerified = (resetToken) => {
        setOtpVerified(true);
    };

    const validateRegistration = () => {
        if (!username || !password || !confirmPassword) {
            toast.error("All fields are required");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password should be at least 6 characters long");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegistration()) return;

        setRegistering(true);
        try {
            const role = "customer";
            const signupData = { username, email, password, role };
            if (referralCode) {
                signupData.referralCode = referralCode;
            }

            const response = await signup(signupData);

            if (response.data && response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
                console.log("Logged in successfully!");
            }

            if (response.data.success) {
                dispatch(setLoginPopup(false));
                dispatch(loginSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    role: response.data.role,
                }));
                if (response.data.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (response.data.role === "seller") {
                    navigate("/seller/dashboard");
                } else {
                    navigate("/");
                }
                toast.success("Signup Successful!");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error: ${errorMsg}`);
        } finally {
            setRegistering(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Hello! Register to get</h2>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">started!</h2>

            <form onSubmit={otpVerified ? handleSubmit : (e) => e.preventDefault()}>
                {/* Email Section – always visible */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600 mb-1">Enter your email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailSent || sendingOtp} // Disable when OTP is sent or sending
                        required
                    />
                </div>

                {/* Send/Resend OTP button */}
                <div className="text-right mb-4">
                    <button
                        onClick={handleSendOtp}
                        className="text-gray-800 hover:text-gray-700 text-sm"
                        disabled={sendingOtp || (emailSent && counter > 0)}
                    >
                        {sendingOtp ? (
                            <span className="flex items-center justify-end">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending OTP...
                            </span>
                        ) : emailSent && counter > 0 ? (
                            `Resend OTP in ${counter}s`
                        ) : emailSent ? (
                            "Resend OTP"
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </div>

                {/* OTP Verification Component – rendered once OTP is sent and before verification */}
                {emailSent && !otpVerified && (
                    <div className="mb-4">
                        <OtpVerification
                            email={email}
                            onVerified={handleOtpVerified}
                            counter={counter}
                            onResend={handleSendOtp}
                        />
                    </div>
                )}

                {/* Registration Section – visible only after OTP is verified */}
                {otpVerified && (
                    <>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-600 mb-1">Enter your username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="username"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={registering}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-600 mb-1">Enter your password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="password"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={registering}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={registering}
                            >
                                {showPassword ? <Eye /> : <ShowEye />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-4 relative">
                            <label htmlFor="confirmPassword" className="block text-gray-600 mb-1">Confirm your password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm password"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400 pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={registering}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={registering}
                            >
                                {showPassword ? <Eye /> : <ShowEye />}
                            </button>
                        </div>

                        {/* Referral Code Field - New addition */}
                        <div className="mb-4">
                            <label htmlFor="referralCode" className="block text-gray-600 mb-1">Referral code (optional)</label>
                            <input
                                type="text"
                                id="referralCode"
                                placeholder="Enter referral code if you have one"
                                className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none focus:border-gray-400"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                disabled={registering}
                            />
                        </div>

                        {/* Final Register Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center"
                            disabled={registering}
                        >
                            {registering ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </>
                )}
            </form>

            {/* Or Register with */}
            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="text-sm text-gray-400 mx-3">Or Register with</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4">
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
                    <img src={facebook} alt="Facebook" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
                    <GoogleSignIn />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 transition-colors" disabled={sendingOtp || registering}>
                    <img src={apple} alt="Apple" />
                </button>
            </div>

            {/* Bottom text */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{" "}
                <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => dispatch(setActiveForm("login"))}
                    disabled={sendingOtp || registering}
                >
                    Login Now
                </button>
            </div>
        </div>
    );
}

export default SignupForm;