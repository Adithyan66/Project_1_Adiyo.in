import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const PasswordChangeModal = ({ user, setPasswordModal }) => {


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');


        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        try {

            const response = await axios.put(`${API_BASE_URL}/user/${user._id}/change-password`, {
                currentPassword,
                newPassword
            })

            if (response.data.success) {
                setSuccess(true);
                toast.success("password changed")
            }

        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error is ", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border-4 border-black">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Enter new password"
                            />

                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:cursor-pointer"
                                onClick={() => setPasswordModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 hover:cursor-pointer"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="mb-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mt-2">Password Changed Successfully</h3>
                            <p className="text-gray-600 mt-1">
                                Your password has been updated. Please use your new password for future logins.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 hover:cursor-pointer"
                                onClick={() => setPasswordModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* This is a hidden button that would be triggered by your modal implementation */}
                <button id="closePasswordModal" className="hidden">Close</button>
            </div>
        </div>
    );
};

export default PasswordChangeModal;