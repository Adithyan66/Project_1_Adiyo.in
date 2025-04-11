


import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Briefcase, ShoppingBag, Navigation } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createAddress, updateAddress } from '../../../services/profileService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AddEditAddressModal = ({ setShowModal, addressToEdit = null }) => {
    const initialState = {
        fullName: '',
        phoneNumber: '',
        alternatePhone: '',
        pincode: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        landmark: '',
        addressType: 'Home',
        isDefault: false
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('contact');
    const isEditMode = Boolean(addressToEdit);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    useEffect(() => {
        if (addressToEdit) {
            setFormData({
                fullName: addressToEdit.fullName || '',
                phoneNumber: addressToEdit.phoneNumber || '',
                alternatePhone: addressToEdit.alternatePhone || '',
                pincode: addressToEdit.pincode || '',
                address: addressToEdit.address || '',
                locality: addressToEdit.locality || '',
                city: addressToEdit.city || '',
                state: addressToEdit.state || '',
                landmark: addressToEdit.landmark || '',
                addressType: addressToEdit.addressType || 'Home',
                isDefault: addressToEdit.isDefault || false,
                addressId: addressToEdit._id
            });
        }
    }, [addressToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleAddressTypeSelect = (type) => {
        setFormData({
            ...formData,
            addressType: type
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\d{10}$/;
        const pincodeRegex = /^\d{6}$/;

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
        if (formData.alternatePhone && !phoneRegex.test(formData.alternatePhone))
            newErrors.alternatePhone = 'Enter a valid alternate phone number';
        if (!pincodeRegex.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.locality.trim()) newErrors.locality = 'Locality/Area is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                let response;

                if (isEditMode) {
                    response = await updateAddress({ formData });
                } else {
                    response = await createAddress({ formData });
                }

                if (response.data.success) {
                    toast.success(response.data.message);
                    setShowModal(false);
                }
            } catch (error) {
                console.log("Error:", error);
                toast.error("Failed to save address. Please try again.");
            }
        }
    };

    const getCurrentLocation = () => {
        setIsLoadingLocation(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;

                        const response = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );

                        const addressData = response.data;

                        const address = addressData.address;
                        console.log(address);

                        setFormData(prev => ({
                            ...prev,
                            address: [
                                address.road,
                                address.house_number,
                                address.suburb
                            ].filter(Boolean).join(', '),
                            locality: address.suburb || address.neighbourhood || address.residential || '',
                            city: address.city || address.town || address.county || '',
                            state: address.state || '',
                            pincode: address.postcode || prev.pincode
                        }));

                        setActiveTab('address');
                        toast.success('Location detected successfully');
                    } catch (error) {
                        console.error('Error fetching address:', error);
                        toast.error('Failed to detect location. Please enter manually.');
                    } finally {
                        setIsLoadingLocation(false);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setIsLoadingLocation(false);

                    let errorMessage = 'Failed to detect location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location access.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                    }
                    toast.error(errorMessage);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setIsLoadingLocation(false);
            toast.error('Geolocation is not supported by this browser');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl border-1 border-gray-200">
                    <div className="flex items-center justify-between p-4 border-b-2 border-gray-100 sticky top-0 bg-white z-10">
                        <div className="flex items-center">
                            <MapPin className="text-gray-700 mr-2" size={20} />
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isEditMode ? 'Edit Address' : 'Add New Address'}
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex">
                        {/* Left sidebar navigation */}
                        <div className="w-64 border-r-2 border-gray-200">
                            <div className="p-4">
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    className={`w-full text-left p-3 mb-2 rounded-md flex items-center ${activeTab === 'contact'
                                        ? 'bg-gray-100 font-medium text-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 ${activeTab === 'contact' ? 'bg-black text-white' : 'bg-gray-200'
                                        }`}>1</span>
                                    Contact Details
                                </button>

                                <button
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full text-left p-3 rounded-md flex items-center ${activeTab === 'address'
                                        ? 'bg-gray-100 font-medium text-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 ${activeTab === 'address' ? 'bg-black text-white' : 'bg-gray-200'
                                        }`}>2</span>
                                    Address Details
                                </button>

                                {/* Location detection button */}
                                <div className="mt-6 p-3 bg-gray-50 rounded-md">
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={isLoadingLocation}
                                        className="w-full flex items-center justify-center p-2 bg-gray-50 text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <Navigation className="mr-2" size={16} />
                                        {isLoadingLocation ? 'Detecting location...' : 'Use my current location'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Allow location access to automatically fill address details
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right form section */}
                        <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
                            <form onSubmit={handleSubmit}>
                                {/* Contact Details Tab */}
                                {activeTab === 'contact' && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Details</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Full Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Enter your full name"
                                                />
                                                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Phone Number*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="10-digit mobile number"
                                                />
                                                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Alternate Phone (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="alternatePhone"
                                                    value={formData.alternatePhone}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Alternate phone number"
                                                />
                                                {errors.alternatePhone && <p className="text-red-500 text-xs">{errors.alternatePhone}</p>}
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={getCurrentLocation}
                                                disabled={isLoadingLocation}
                                                className="px-6 py-2 flex items-center justify-center border border-black text-black rounded-md hover:bg-gray-50"
                                            >
                                                <Navigation className="mr-2" size={16} />
                                                {isLoadingLocation ? 'Detecting...' : 'Use current location'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('address')}
                                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Address Details Tab */}
                                {activeTab === 'address' && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Address Details</h3>
                                        {isLoadingLocation && (
                                            <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm flex items-center">
                                                <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                                                Detecting your location and filling address details...
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Pincode*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="6-digit pincode"
                                                />
                                                {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    State*
                                                </label>
                                                <select
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select State</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    {/* Add more state options here */}
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Delhi">Delhi</option>
                                                    <option value="Gujarat">Gujarat</option>
                                                    <option value="Rajasthan">Rajasthan</option>
                                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                    <option value="West Bengal">West Bengal</option>
                                                </select>
                                                {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                                            </div>

                                            <div className="col-span-2 space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Address (House No, Building, Street, Area)*
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    rows="2"
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="House No, Building, Street, Area"
                                                ></textarea>
                                                {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Locality / Town*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="locality"
                                                    value={formData.locality}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.locality ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="Locality or Area"
                                                />
                                                {errors.locality && <p className="text-red-500 text-xs">{errors.locality}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    City / District*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="City or District"
                                                />
                                                {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Landmark (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    name="landmark"
                                                    value={formData.landmark}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Nearby landmark"
                                                />
                                            </div>

                                            {/* Address Type */}
                                            <div className="space-y-2 ">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address Type
                                                </label>
                                                <div className="flex space-x-4">
                                                    <button
                                                        type="button"
                                                        className={`flex items-center px-4 py-2 rounded-md ${formData.addressType === 'Home'
                                                            ? 'bg-black text-white'
                                                            : 'border border-gray-300 text-gray-700'
                                                            }`}
                                                        onClick={() => handleAddressTypeSelect('Home')}
                                                    >
                                                        <Home size={16} className="mr-2" />
                                                        Home
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`flex items-center px-4 py-2 rounded-md ${formData.addressType === 'Work'
                                                            ? 'bg-black text-white'
                                                            : 'border border-gray-300 text-gray-700'
                                                            }`}
                                                        onClick={() => handleAddressTypeSelect('Work')}
                                                    >
                                                        <Briefcase size={16} className="mr-2" />
                                                        Work
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`flex items-center px-4 py-2 rounded-md ${formData.addressType === 'Other'
                                                            ? 'bg-black text-white'
                                                            : 'border border-gray-300 text-gray-700'
                                                            }`}
                                                        onClick={() => handleAddressTypeSelect('Other')}
                                                    >
                                                        <ShoppingBag size={16} className="mr-2" />
                                                        Other
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Set as default */}
                                            <div className="col-span-2 mt-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="isDefault"
                                                        checked={formData.isDefault}
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-black border-gray-300 rounded focus:ring-0"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">Make this my default address</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('contact')}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Back
                                            </button>

                                            <div className="space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                                                >
                                                    {isEditMode ? 'Save Changes' : 'Add Address'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditAddressModal;