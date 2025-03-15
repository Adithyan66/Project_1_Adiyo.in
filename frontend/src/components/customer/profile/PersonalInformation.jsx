


import React, { useEffect, useState } from 'react';
import { MapPin, Pencil, SmilePlus } from 'lucide-react';
import axios from 'axios';
import EmailChangeModal from './EmailChangeModal';
import PasswordChangeModal from './PasswordChangeModal';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PersonalInformation = () => {


    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState();
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);


    const [emailModal, setEmailModal] = useState(false)
    const [passwordModal, setPasswordModal] = useState(false)
    const [saveAlert, setSaveAlert] = useState(false)

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/user-details`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            setProfileData(response.data.user);

            if (response.data.user?.profileImg) {
                setImageUrl(response.data.user.profileImg);
            }

            console.log("user is", response.data.user);

        } catch (error) {
            console.error("Error fetching profile data:", error);

            setError("Failed to load profile data. Please try again later.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleGenderChange = (gender) => {
        setProfileData({
            ...profileData,
            gender
        });
    };

    const toggleEditMode = () => {
        if (isEditing) {

            fetchProfileData();

            // Clear selected file
            setSelectedFile(null);
        }

        setIsEditing(!isEditing);
        setError(null);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size exceeds 5MB limit. Please choose a smaller file.");
            return;
        }


        if (!file.type.match('image.*')) {
            setError("Please select an image file (JPEG, PNG, etc.)");
            return;
        }

        setSelectedFile(file);


        const tempUrl = URL.createObjectURL(file);
        setImageUrl(tempUrl);

        setError(null);
    };

    const handleSave = async () => {


        try {
            setIsSubmitting(true);
            setError(null);

            // Create form data to handle both file and JSON data
            const formData = new FormData();

            if (profileData.username) {
                formData.append('username', profileData.username);
            }
            if (profileData.firstName) {
                formData.append('firstName', profileData.firstName);
            }
            if (profileData.lastName) {
                formData.append('lastName', profileData.lastName);
            }
            if (profileData.gender) {
                formData.append('gender', profileData.gender);
            }
            if (profileData.dateOfBirth) {
                formData.append('dateOfBirth', profileData.dateOfBirth);
            }
            if (profileData.mobile) {
                formData.append('mobile', profileData.mobile);
            }


            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }


            try {
                const response = await axios.post(`${API_BASE_URL}/user/update-profile`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log("Profile updated:", response.data);
                console.log("Profile image:", response.data.profileImg);
                setImageUrl(response.data.user.profileImg)
                setImageUrl(response.data.user.profileImg);

            } catch (error) {
                console.log(error.data);

            }
            setSaveAlert(false)
            fetchProfileData();
            setSelectedFile(null);
            setIsEditing(false);

        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // View-only form field that matches the visual style of input fields
    const ReadOnlyField = ({ label, value }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="w-full px-3 py-2 min-h-10 border border-gray-300 rounded-md bg-gray-50">
                {value}
            </div>
        </div>
    );

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">
            <div className="flex items-center ">
                <SmilePlus className="text-black mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            </div>
            <hr className='mb-6 text-gray-200 mt-6' />
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <span>{error}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row">
                {/* Form Fields Section */}
                <div className="flex-1">
                    <div className="space-y-4">
                        <ReadOnlyField label="User Id" value={profileData?.userId} />

                        {isEditing ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData?.username}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="User Name" value={profileData?.username} />
                        )}

                        {/* First Name and Last Name in one line */}
                        <div className="flex space-x-4">
                            {isEditing ? (
                                <>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData?.firstName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData?.lastName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="w-full px-3 py-2 min-h-10 border border-gray-300 rounded-md bg-gray-50">
                                            {profileData?.firstName}
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <div className="w-full px-3 py-2 min-h-10 border border-gray-300 rounded-md bg-gray-50">
                                            {profileData?.lastName}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Gender and Date of Birth in one line */}
                        <div className="flex space-x-4">
                            {/* Gender */}
                            <div className="w-1/2">
                                {isEditing ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <div className="flex space-x-4">
                                            <div
                                                onClick={() => handleGenderChange('Male')}
                                                className={`cursor-pointer px-6 py-1 border rounded-md ${profileData?.gender === 'Male'
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                Male
                                            </div>
                                            <div
                                                onClick={() => handleGenderChange('Female')}
                                                className={`cursor-pointer px-6 py-1 border rounded-md ${profileData?.gender === 'Female'
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                Female
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <div className="w-full px-3 py-2 min-h-10 border border-gray-300 rounded-md bg-gray-50">
                                            {profileData?.gender}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="w-1/2">
                                {isEditing ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profileData?.dateOfBirth}
                                            onChange={handleChange}
                                            placeholder="DD-MM-YYYY"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <div className="w-full px-3 py-2 min-h-10 border border-gray-300 rounded-md bg-gray-50">
                                            {profileData?.dateOfBirth}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <ReadOnlyField label="Email address" value={profileData?.email} />

                        {/* Mobile */}
                        {isEditing ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={profileData?.mobile}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="Mobile Number" value={profileData?.mobile} />
                        )}

                        {/* Buttons in Edit Mode */}
                        {isEditing && (
                            <div className="flex space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSaveAlert(true)}
                                    disabled={isSubmitting}
                                    className={`px-6 py-2 bg-black text-white rounded-md text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleEditMode}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Image Card Section - Updated with more details */}
                <div className="md:w-1/3 flex justify-center pt-8 ml-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                        <div className="relative">
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className={`rounded-full w-48 h-48 object-cover mx-auto ${isEditing ? 'border-4 border-black' : ''
                                    }`}
                            />
                            {isEditing && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-48 h-48 mx-auto rounded-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Pencil className="w-8 h-8 text-white bg-black rounded-full p-1" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="text-2xl font-bold">
                                {profileData?.firstName} {profileData?.lastName}
                            </h3>
                            <p className="text-gray-600 mt-1">@{profileData?.username}</p>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium">Email:</span> {profileData?.email}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Mobile:</span> {profileData?.mobile}
                            </p>
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-gray-600">
                                    <span className="font-medium">Gender:</span> {profileData?.gender}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">DOB:</span> {profileData?.dateOfBirth}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <span className="font-medium">User ID:</span> {profileData?.userId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Mode Buttons */}
            {!isEditing && (
                <div className="flex space-x-2 mt-5">
                    <button
                        type="button"
                        onClick={toggleEditMode}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm hover:cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPasswordModal(true)}
                        className="px-4 py-2 bg-gray-200 text-black rounded-md text-sm hover:cursor-pointer"
                    >
                        Change Password
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-black rounded-md text-sm hover:cursor-pointer"
                        onClick={() => setEmailModal(true)}
                    >
                        Change Email ID
                    </button>
                </div>
            )}

            {emailModal && <EmailChangeModal user={profileData} setEmailModal={setEmailModal} fetchProfileData={fetchProfileData} />}
            {passwordModal && <PasswordChangeModal user={profileData} setPasswordModal={setPasswordModal} fetchProfileData={fetchProfileData} />}


            {saveAlert && <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded p-6 w-100 shadow-2xl border-4 border-black">
                    <h2 className="text-xl font-bold mb-4 text-center">Confirm Changes</h2>
                    <p className="mb-6 text-center">
                        Are you sure want to Save the Changes?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:cursor-pointer"
                            onClick={() => setSaveAlert(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-black text-white px-4 py-2 rounded hover:cursor-pointer"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default PersonalInformation;