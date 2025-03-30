

import React, { useEffect, useState } from 'react';
import { PencilIcon, PlusCircle, Trash2, MapPin, Home, Briefcase, CheckCircle, ChevronRight } from 'lucide-react';
// import AddEditAddressModal from './AddEditAddressModal';
import axios from 'axios';
import AddEditAddressModal from './AddEditAddressModal';
import { useDispatch } from 'react-redux';
import { setCurrentStep, setSelectedAddress } from '../../../store/slices/checkoutSlice';
import { setCartSelectedAddress, setCartCurrentStep } from '../../../store/slices/cartCheckoutSlice';
import { deleteAddress, getAddress, setDefaultAddress } from '../../../services/profileService';

const API_BASE_URL = import.meta.env.VITE_API_URL;



const ManageAddresses = ({ checkOut, renderStepContent }) => {

    const dispatch = useDispatch()


    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeAddress, setActiveAddress] = useState(null);




    const handleSelect = (id) => {
        setAddresses(addresses.map(address => ({
            ...address,
            isSelected: address._id === id
        })));
    };

    const selectAddress = () => {
        const address = addresses.filter((address) => address.isSelected)
        dispatch(setSelectedAddress(address))
        dispatch(setCartSelectedAddress(address))
    }

    const handleSetDefault = async (id) => {
        try {
            // const response = await axios.put(`${API_BASE_URL}/user/set-default-address/${id}`, {}, {
            //     withCredentials: true,
            // });
            const response = await setDefaultAddress(id);

            if (response.data.success) {
                setAddresses(addresses.map(address => ({
                    ...address,
                    isDefault: address._id === id,
                    isSelected: address._id === id // Also select it when setting as default
                })));
            }
        } catch (error) {
            console.error("Error setting default address:", error);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            // const response = await axios.delete(`${API_BASE_URL}/user/delete-address/${id}`, {
            //     withCredentials: true,
            // });
            const response = await deleteAddress(id);

            if (response.data.success) {
                setAddresses(addresses.filter(address => address._id !== id));
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Home':
                return <Home size={14} className="mr-1" />;
            case 'Work':
                return <Briefcase size={14} className="mr-1" />;
            default:
                return <MapPin size={14} className="mr-1" />;
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            // const response = await axios.get(`${API_BASE_URL}/user/address`, {
            //     withCredentials: true,
            // });

            const response = await getAddress();


            if (response.data.success) {
                // Mark the default address as selected when fetching addresses
                const addressesWithSelection = response.data.addresses.map(address => ({
                    ...address,
                    isSelected: address.isDefault
                }));

                // If no default address exists, select the first one
                if (!addressesWithSelection.some(addr => addr.isSelected) && addressesWithSelection.length > 0) {
                    addressesWithSelection[0].isSelected = true;
                }

                setAddresses(addressesWithSelection);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    // Close modal and refresh addresses
    const handleModalClose = () => {
        setShowModal(false);
        setActiveAddress(null);
        fetchAddresses();
    };

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <MapPin className="text-black mr-2" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Manage Addresses</h2>
                </div>
                <button
                    className="flex items-center bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => {
                        setActiveAddress(null);
                        setShowModal(true);
                    }}
                >
                    <PlusCircle size={18} className="mr-2" />
                    Add New Address
                </button>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-500">Select an address for delivery or update your saved addresses</p>
            </div>

            <div className="space-y-4">
                {addresses.map((address) => (
                    <div
                        key={address._id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${address.isSelected ? 'border-gray-500 bg-gray-100' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <div className="flex items-start">
                            <div className="pt-1">
                                <input
                                    type="radio"
                                    className="black-radio"
                                    checked={address.isSelected}
                                    onChange={() => handleSelect(address._id)}
                                />
                            </div>

                            <div className="ml-3 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-900">{address.fullName}</div>
                                        <div className="ml-3 text-sm text-gray-600">{address.phoneNumber}</div>

                                        <div className={`ml-3 flex items-center px-2 py-1 rounded-full text-xs font-medium ${address.addressType === 'Home' ? 'bg-gray-100 text-black' : 'bg-gray-100 text-gray-800'}`}>
                                            {getTypeIcon(address.addressType)}
                                            {address.addressType}
                                        </div>

                                        {address.isDefault && (
                                            <div className="ml-2 flex items-center text-black text-xs">
                                                <CheckCircle size={12} className="mr-1" />
                                                Default
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-150"
                                            onClick={() => {
                                                setActiveAddress(address);
                                                setShowModal(true);
                                            }}
                                        >
                                            <PencilIcon size={16} />
                                        </button>

                                        {!address.isDefault && (
                                            <button
                                                className="p-1 rounded-full hover:bg-red-50 text-black transition-colors duration-150"
                                                onClick={() => handleDeleteAddress(address._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">{address.address}</div>
                                {address.landmark && <div className="text-sm text-gray-700">{address.landmark}</div>}
                                <div className="text-sm text-gray-700">{address.locality}, {address.city}, {address.state} - {address.pincode}</div>

                                {!address.isDefault && (
                                    <button
                                        className="mt-3 text-gray-400 hover:text-black text-sm font-medium flex items-center"
                                        onClick={() => handleSetDefault(address._id)}
                                    >
                                        <CheckCircle size={14} className="mr-1" />
                                        Set as default
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for empty state */}
            {addresses.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No addresses saved yet</p>
                    <button
                        className="mt-4 text-black font-medium"
                        onClick={() => {
                            setActiveAddress(null);
                            setShowModal(true);
                        }}
                    >
                        Add your first address
                    </button>
                </div>
            )}

            {checkOut && (<div className="flex justify-end mt-6">
                <button
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center"
                    onClick={() => {
                        dispatch(setCurrentStep('summary'))
                        dispatch(setCartCurrentStep('summary'))
                        selectAddress()
                        renderStepContent()
                    }
                    }
                    disabled={!addresses.some(a => a.isSelected)}
                >
                    Deliver to this Address
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>)}

            {showModal && (
                <AddEditAddressModal
                    setShowModal={handleModalClose}
                    addressToEdit={activeAddress}
                />
            )}
        </div>
    );
};

export default ManageAddresses;