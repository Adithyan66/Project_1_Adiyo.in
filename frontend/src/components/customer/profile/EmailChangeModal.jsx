import axios from 'axios';
import React, { useState } from 'react';

import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL;




const EmailChangeModal = ({ user, setEmailModal, fetchProfileData }) => {


    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const handleRequestOtp = async (e) => {

        e.preventDefault();

        if (!password || !newEmail) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/user/${user._id}/change-email/otp-request`,
                {
                    password,
                    newEmail
                })

            if (response.data.success) {
                toast.success(response.data.message)
                setError('');
                setStep(2);
            }

        } catch (error) {
            toast.error(error.response.data.message)
            console.log("ithaanu error", error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/user/${user._id}/change-emailid`, { otp, newEmail })
            if (response.data.success) {
                toast.success(response.data.message)
                setError('');
                setStep(3);
            }

        } catch (error) {
            toast.error(error.response.data.message)
            console.log("ithaanu error", error)

        }



    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center  shadow-sm p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black">
                <h2 className="text-xl font-bold mb-4">Change Email Address</h2>

                {step === 1 && (
                    <form onSubmit={handleRequestOtp}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Current Email
                            </label>
                            <input
                                type="text"
                                value={user.email}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                New Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Enter new email address"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:cursor-pointer"
                                onClick={() => setEmailModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 hover:cursor-pointer"
                            >
                                Request OTP
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-gray-600">
                            We've sent a verification code to <strong>{newEmail}</strong>.
                            Please enter the code below to verify your new email address.
                        </p>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Verification Code (OTP) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Enter OTP"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div>
                        <div className="mb-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mt-2">Email Changed Successfully</h3>
                            <p className="text-gray-600 mt-1">
                                Your email has been updated to <strong>{newEmail}</strong>
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 hover:cursor-pointer"
                                onClick={() => {
                                    fetchProfileData()
                                    setEmailModal(false)
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* This is a hidden button that would be triggered by your modal implementation */}
                <button id="closeModal" className="hidden">Close</button>
            </div>
        </div>
    );
};

export default EmailChangeModal;