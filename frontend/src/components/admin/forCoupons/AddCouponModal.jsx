

import React, { useState, useEffect } from "react";
import { Coupen } from "../../../icons/icons";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AddCouponModal = ({ isOpen, onClose, fetchCoupons }) => {
    // Local state for form fields
    const [couponName, setCouponName] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [limit, setLimit] = useState("");
    const [activeDate, setActiveDate] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [error, setError] = useState("");
    const [mimimumOrder, setMimimumOrder] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories from backend when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Function to fetch categories from backend
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/categories`);
            if (response.data.success && response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleCreate = () => {
        // Validate date range
        if (activeDate && expireDate) {
            const start = new Date(activeDate).getTime();
            const end = new Date(expireDate).getTime();

            if (end < start) {
                setError("Expire date must be after Active date.");
                return;
            }
        }

        // Clear any existing error
        setError("");

        const handleSubmit = async () => {
            const newCoupon = {
                name: couponName,
                code: couponCode,
                discountValue,
                maxUsage: limit,
                activeFrom: activeDate,
                expiresAt: expireDate,
                applicableCategories: selectedCategory,
                minimumOrderValue: mimimumOrder
            };

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/admin/add-coupon`,
                    newCoupon
                );
                console.log(response.data);
                fetchCoupons();
            } catch (error) {
                console.log(error.response?.data || error);
                setError("Failed to create coupon. Please try again.");
                return;
            }
        };

        handleSubmit();

        // Optionally reset form fields
        setCouponName("");
        setCouponCode("");
        setDiscountValue("");
        setLimit("");
        setActiveDate("");
        setExpireDate("");
        setMimimumOrder("");
        setSelectedCategory("");

        // Close the modal
        onClose();
    };

    // If modal is not open, do not render
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
            {/* Modal container */}
            <div className="bg-white min-w-[800px] max-w-lg max-h-[600px] mx-4 rounded border-black border-4 shadow-lg p-3">
                <div className="flex justify-center items-center bg-black rounded mb-10">
                    <h2 className="flex items-center justify-center text-xl font-bold text-white p-5 whitespace-nowrap">
                        <span className="inline-flex mr-2">
                            <Coupen />
                        </span>
                        Add New Coupon
                    </h2>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-3 text-red-600 text-center font-semibold">
                        {error}
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Coupon Name */}
                    <div className="flex">
                        <div className="w-1/2 px-7">
                            <label className="block font-medium mb-1">Coupon Name</label>
                            <input
                                type="text"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Free delivery"
                                value={couponName}
                                onChange={(e) => setCouponName(e.target.value)}
                            />
                        </div>

                        {/* Coupon Code */}
                        <div className="w-1/2">
                            <label className="block font-medium mb-1">Coupon Code</label>
                            <input
                                type="text"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="BX67HJ87KH"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Discount Price */}
                    <div className="flex">
                        <div className="w-1/2 px-7">
                            <label className="block font-medium mb-1">Discount Price</label>
                            <input
                                type="text"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="₹ 399"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                            />
                        </div>

                        {/* Limit */}
                        <div className="w-1/2">
                            <label className="block font-medium mb-1">Limit</label>
                            <input
                                type="number"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="40"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex">
                        <div className="w-1/2 px-7">
                            <label className="block font-medium mb-1">Minimum Order value</label>
                            <input
                                type="text"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="₹ 399"
                                value={mimimumOrder}
                                onChange={(e) => setMimimumOrder(e.target.value)}
                            />
                        </div>

                        {/* Dynamic Categories */}
                        <div className="w-1/2">
                            <label className="block font-medium mb-1">Applicable Categories</label>
                            <select
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Select Category</option>
                                {loading ? (
                                    <option disabled>Loading categories...</option>
                                ) : (
                                    categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Active Date */}
                    <div className="flex">
                        <div className="w-1/2 px-7">
                            <label className="block font-medium mb-1">Active Date</label>
                            <input
                                type="date"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                value={activeDate}
                                onChange={(e) => setActiveDate(e.target.value)}
                            />
                        </div>

                        {/* Expire Date */}
                        <div className="w-1/2">
                            <label className="block font-medium mb-1">Expire Date</label>
                            <input
                                type="date"
                                className="w-full border-gray-200 border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                value={expireDate}
                                onChange={(e) => setExpireDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-10">
                    <button
                        onClick={onClose}
                        className="border border-gray-300 px-8 py-2 rounded hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCouponModal;