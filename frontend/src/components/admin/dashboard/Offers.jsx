

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManageOffers = () => {
    const [activeTab, setActiveTab] = useState('productOffers');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentEditOffer, setCurrentEditOffer] = useState(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [productOffers, setProductOffers] = useState([]);
    const [categoryOffers, setCategoryOffers] = useState([]);
    const [referralOffers, setReferralOffers] = useState([]);

    const [selectedProducts, setSelectedProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        discount: '',
        products: [],
        category: '',
        startDate: '',
        endDate: '',
        rewardAmount: '',
        rewardType: 'percentage',
        method: 'token',
        minPurchase: '',
        validity: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddOffer = () => {
        setCurrentEditOffer(null);
        setFormData({
            name: '',
            discount: '',
            products: [],
            category: '',
            startDate: '',
            endDate: '',
            rewardAmount: '',
            rewardType: 'percentage',
            method: 'token',
            minPurchase: '',
            validity: ''
        });
        setSelectedProducts([]);
        setIsAddModalOpen(true);
    };

    const handleEditOffer = (offer) => {
        setCurrentEditOffer(offer);

        if (activeTab === 'productOffers') {
            setFormData({
                name: offer.name,
                discount: offer.discount,
                startDate: offer.startDate,
                endDate: offer.endDate
            });
            setSelectedProducts(offer.products.map(p => typeof p === 'object' ? p._id : p));
        } else if (activeTab === 'categoryOffers') {
            setFormData({
                name: offer.name,
                discount: offer.discount,
                category: offer.category,
                startDate: offer.startDate,
                endDate: offer.endDate
            });
        } else if (activeTab === 'referralOffers') {
            setFormData({
                name: offer.name,
                rewardAmount: offer.rewardAmount,
                rewardType: offer.rewardType,
                method: offer.method,
                minPurchase: offer.minPurchase,
                validity: offer.validity
            });
        }

        setIsAddModalOpen(true);
    };

    // Fetch all offers and products on component mount
    useEffect(() => {
        fetchProductNames();
        fetchCategories();
        fetchProductOffers();
        fetchCategoryOffers();
        fetchReferralOffers();
    }, []);

    // Product-related functions
    const fetchProductNames = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/product-names`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/categories`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch Product Offers
    const fetchProductOffers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/product-offers`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setProductOffers(response.data.offers);
            }
        } catch (error) {
            console.error("Error fetching product offers:", error);
        }
    };

    // Fetch Category Offers
    const fetchCategoryOffers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/category-offers`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setCategoryOffers(response.data.offers);
            }
        } catch (error) {
            console.error("Error fetching category offers:", error);
        }
    };

    // Fetch Referral Offers
    const fetchReferralOffers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/referral-offers`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setReferralOffers(response.data.offers);
            }
        } catch (error) {
            console.error("Error fetching referral offers:", error);
        }
    };

    const handleProductChange = (productId) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    // Handle form submission based on active tab
    const handleSubmitOffer = async (e) => {
        e.preventDefault();

        if (activeTab === 'productOffers') {
            handleSubmitProductOffer(e);
        } else if (activeTab === 'categoryOffers') {
            handleSubmitCategoryOffer(e);
        } else if (activeTab === 'referralOffers') {
            handleSubmitReferralOffer(e);
        }
    };

    // Create or update product offer
    const handleSubmitProductOffer = async (e) => {
        try {
            const payload = {
                name: formData.name,
                discount: Number(formData.discount),
                products: selectedProducts,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            let response;
            console.log("payloadddddddddddddd", payload);


            if (currentEditOffer) {
                response = await axios.put(
                    `${API_BASE_URL}/admin/product-offer/${currentEditOffer._id}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                response = await axios.post(
                    `${API_BASE_URL}/admin/create-product-offer`,
                    payload,
                    { withCredentials: true }
                );
            }

            if (response.data.success) {
                // Refresh the offer list
                fetchProductOffers();

                // Reset form and close modal
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    discount: '',
                    products: [],
                    category: '',
                    startDate: '',
                    endDate: '',
                    rewardAmount: '',
                    rewardType: 'percentage',
                    method: 'token',
                    minPurchase: '',
                    validity: ''
                });
                setSelectedProducts([]);
            } else {
                console.error("Error with product offer:", response.data.message);
            }
        } catch (error) {
            console.error("Error in handleSubmitProductOffer:", error);
        }
    };

    // Create or update category offer
    const handleSubmitCategoryOffer = async (e) => {
        try {
            const payload = {
                name: formData.name,
                discount: Number(formData.discount),
                category: formData.category,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            let response;

            if (currentEditOffer) {
                response = await axios.put(
                    `${API_BASE_URL}/admin/category-offer/${currentEditOffer._id}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                response = await axios.post(
                    `${API_BASE_URL}/admin/create-category-offer`,
                    payload,
                    { withCredentials: true }
                );
            }

            if (response.data.success) {
                // Refresh the offer list
                fetchCategoryOffers();

                // Reset form and close modal
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    discount: '',
                    products: [],
                    category: '',
                    startDate: '',
                    endDate: '',
                    rewardAmount: '',
                    rewardType: 'percentage',
                    method: 'token',
                    minPurchase: '',
                    validity: ''
                });
            } else {
                console.error("Error with category offer:", response.data.message);
            }
        } catch (error) {
            console.error("Error in handleSubmitCategoryOffer:", error);
        }
    };

    // Create or update referral offer
    const handleSubmitReferralOffer = async (e) => {
        try {
            const payload = {
                name: formData.name,
                rewardAmount: Number(formData.rewardAmount),
                rewardType: formData.rewardType,
                method: formData.method,
                minPurchase: Number(formData.minPurchase),
                validity: Number(formData.validity)
            };

            let response;

            if (currentEditOffer) {
                response = await axios.put(
                    `${API_BASE_URL}/admin/referral-offer/${currentEditOffer._id}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                response = await axios.post(
                    `${API_BASE_URL}/admin/create-referral-offer`,
                    payload,
                    { withCredentials: true }
                );
            }

            if (response.data.success) {
                // Refresh the offer list
                fetchReferralOffers();

                // Reset form and close modal
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    discount: '',
                    products: [],
                    category: '',
                    startDate: '',
                    endDate: '',
                    rewardAmount: '',
                    rewardType: 'percentage',
                    method: 'token',
                    minPurchase: '',
                    validity: ''
                });
            } else {
                console.error("Error with referral offer:", response.data.message);
            }
        } catch (error) {
            console.error("Error in handleSubmitReferralOffer:", error);
        }
    };

    // Delete offer based on active tab
    const handleDeleteOffer = async (id) => {
        try {
            let endpoint;

            if (activeTab === 'productOffers') {
                endpoint = `${API_BASE_URL}/admin/product-offer/${id}`;
            } else if (activeTab === 'categoryOffers') {
                endpoint = `${API_BASE_URL}/admin/category-offer/${id}`;
            } else if (activeTab === 'referralOffers') {
                endpoint = `${API_BASE_URL}/admin/referral-offer/${id}`;
            }

            const response = await axios.delete(
                endpoint,
                { withCredentials: true }
            );

            if (response.data.success) {
                // Refresh the offer list based on the active tab
                if (activeTab === 'productOffers') {
                    fetchProductOffers();
                } else if (activeTab === 'categoryOffers') {
                    fetchCategoryOffers();
                } else if (activeTab === 'referralOffers') {
                    fetchReferralOffers();
                }
            } else {
                console.error("Error deleting offer:", response.data.message);
            }
        } catch (error) {
            console.error("Error in handleDeleteOffer:", error);
        }
    };

    // Toggle offer status
    const toggleOfferStatus = async (id) => {
        try {
            let endpoint;
            let currentStatus;

            if (activeTab === 'productOffers') {
                const offer = productOffers.find(offer => offer._id === id);
                currentStatus = offer.status;
                endpoint = `${API_BASE_URL}/admin/product-offer/toggle-status/${id}`;
            } else if (activeTab === 'categoryOffers') {
                const offer = categoryOffers.find(offer => offer._id === id);
                currentStatus = offer.status;
                endpoint = `${API_BASE_URL}/admin/category-offer/toggle-status/${id}`;
            } else if (activeTab === 'referralOffers') {
                const offer = referralOffers.find(offer => offer._id === id);
                currentStatus = offer.status;
                endpoint = `${API_BASE_URL}/admin/referral-offer/toggle-status/${id}`;
            }

            const response = await axios.patch(
                endpoint,
                { status: currentStatus === 'active' ? 'inactive' : 'active' },
                { withCredentials: true }
            );

            if (response.data.success) {
                // Refresh the offer list based on the active tab
                if (activeTab === 'productOffers') {
                    fetchProductOffers();
                } else if (activeTab === 'categoryOffers') {
                    fetchCategoryOffers();
                } else if (activeTab === 'referralOffers') {
                    fetchReferralOffers();
                }
            } else {
                console.error("Error toggling offer status:", response.data.message);
            }
        } catch (error) {
            console.error("Error in toggleOfferStatus:", error);
        }
    };

    // Function to render product names in the table
    const renderProductNames = (products) => {
        if (!products || products.length === 0) return "None";

        if (products.length === 1) {
            const product = products[0];
            return typeof product === 'object' ? product.name :
                products.find(p => p._id === product)?.name || "Unknown Product";
        }

        const firstProduct = products[0];
        const name = typeof firstProduct === 'object' ? firstProduct.name :
            products.find(p => p._id === firstProduct)?.name || "Unknown Product";

        return `${name} + ${products.length - 1} more`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Offers</h1>
                <p className="text-gray-500 mt-1">
                    Create and manage special offers, discounts, and referral programs
                </p>
            </div>

            {/* Info card about offer priority */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6 border-l-4 border-gray-800">
                <h3 className="font-medium text-gray-800">Offer Priority Rules</h3>
                <p className="text-sm text-gray-600 mt-1">
                    When multiple offers apply to a product (e.g., 20% product offer and 30% category offer),
                    only the greater discount will be applied.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex -mb-px">
                    <button
                        className={`py-3 px-4 font-medium text-sm ${activeTab === 'productOffers' ? 'border-b-2 border-gray-800 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('productOffers')}
                    >
                        Product Offers
                    </button>
                    <button
                        className={`py-3 px-4 font-medium text-sm ${activeTab === 'categoryOffers' ? 'border-b-2 border-gray-800 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('categoryOffers')}
                    >
                        Category Offers
                    </button>
                    <button
                        className={`py-3 px-4 font-medium text-sm ${activeTab === 'referralOffers' ? 'border-b-2 border-gray-800 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('referralOffers')}
                    >
                        Referral Offers
                    </button>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab === 'productOffers' && 'Product Offers'}
                    {activeTab === 'categoryOffers' && 'Category Offers'}
                    {activeTab === 'referralOffers' && 'Referral Offers'}
                </h2>
                <button
                    onClick={handleAddOffer}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Offer
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {activeTab === 'productOffers' && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productOffers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.discount}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {renderProductNames(offer.products)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {offer.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => toggleOfferStatus(offer._id)}
                                                className={`px-2 py-1 rounded ${offer.status === 'active' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'} hover:bg-opacity-80`}
                                            >
                                                {offer.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleEditOffer(offer)}
                                                className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'categoryOffers' && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categoryOffers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.discount}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {offer.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => toggleOfferStatus(offer._id)}
                                                className={`px-2 py-1 rounded ${offer.status === 'active' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'} hover:bg-opacity-80`}
                                            >
                                                {offer.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleEditOffer(offer)}
                                                className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'referralOffers' && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity (days)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {referralOffers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {offer.rewardAmount}{offer.rewardType === 'percentage' ? '%' : ' points'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {offer.method === 'token' ? 'Referral Code' : 'Email Invite'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${offer.minPurchase.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {offer.validity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {offer.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => toggleOfferStatus(offer._id)}
                                                className={`px-2 py-1 rounded ${offer.status === 'active' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'} hover:bg-opacity-80`}
                                            >
                                                {offer.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleEditOffer(offer)}
                                                className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for Add/Edit */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 ">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {currentEditOffer ? 'Edit Offer' : 'Add New Offer'}
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmitOffer}>
                                {/* Common field across all offers */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Offer Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Fields specific to Product Offers */}
                                {activeTab === 'productOffers' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                min="1"
                                                max="100"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select Products
                                            </label>
                                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                                {products.map((product) => (
                                                    <div key={product._id} className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`product-${product._id}`}
                                                            checked={selectedProducts.includes(product._id)}
                                                            onChange={() => handleProductChange(product._id)}
                                                            className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                                                        />
                                                        <label htmlFor={`product-${product._id}`} className="ml-2 text-sm text-gray-700">
                                                            {product.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedProducts.length === 0 && (
                                                <p className="text-xs text-red-500 mt-1">Please select at least one product</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Fields specific to Category Offers */}
                                {activeTab === 'categoryOffers' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                min="1"
                                                max="100"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Fields specific to Referral Offers */}
                                {activeTab === 'referralOffers' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Reward Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    name="rewardAmount"
                                                    min="1"
                                                    value={formData.rewardAmount}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Reward Type
                                                </label>
                                                <select
                                                    name="rewardType"
                                                    value={formData.rewardType}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="percentage">Percentage (%)</option>
                                                    <option value="points">Points</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Referral Method
                                            </label>
                                            <select
                                                name="method"
                                                value={formData.method}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="token">Referral Code</option>
                                                <option value="email">Email Invite</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Minimum Purchase ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="minPurchase"
                                                    min="0"
                                                    step="0.01"
                                                    value={formData.minPurchase}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Validity (days)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="validity"
                                                    min="1"
                                                    value={formData.validity}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                        disabled={activeTab === 'productOffers' && selectedProducts.length === 0}
                                    >
                                        {currentEditOffer ? 'Update Offer' : 'Create Offer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Show empty state when no offers exist */}
            {((activeTab === 'productOffers' && productOffers.length === 0) ||
                (activeTab === 'categoryOffers' && categoryOffers.length === 0) ||
                (activeTab === 'referralOffers' && referralOffers.length === 0)) && (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4M12 4v16" />
                        </svg>
                        <h3 className="mt-2 text-base font-medium text-gray-900">No offers found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new {activeTab === 'productOffers' ? 'product' : activeTab === 'categoryOffers' ? 'category' : 'referral'} offer.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleAddOffer}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 inline-flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Offer
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default ManageOffers;