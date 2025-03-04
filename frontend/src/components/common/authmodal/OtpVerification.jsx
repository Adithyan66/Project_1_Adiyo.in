

import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function OtpVerification({ email, onVerified, setResetToken }) {


    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);




    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };





    const handleVerify = async () => {

        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 4) {

            setError("Please enter a complete 4-digit OTP.");
            toast.error("Please enter a complete 4-digit OTP.")
            return;
        }
        setError("");
        setLoading(true);

        try {
            console.log("emai -", email, "otp -", enteredOtp)
            const response = await axios.post("http://localhost:3333/user/validate-otp", {
                email,
                otp: enteredOtp,
            });

            console.log("reached here 2")


            if (response.data.success) {

                setResetToken(response.data.resetToken);
                toast.success("OTP verified ")
                onVerified();

            } else {

                setError(response.data.message || "OTP verification failed.");
                toast.error("OTP verification failed.")

            }
        } catch (err) {

            setError(err.response?.data?.message || "OTP verification failed.");
            toast.error("OTP verification failed.")


        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            {/* OTP Inputs */}
            <div className="flex space-x-4">
                {otp.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-12 h-12 text-center text-xl border-2 border-gray-300 
                       focus:outline-none focus:border-cyan-500 rounded"
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Verify Button */}
            <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-gray-900 text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </div>
    );
}

export default OtpVerification;
