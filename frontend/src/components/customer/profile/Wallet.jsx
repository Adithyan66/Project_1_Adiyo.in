


import React, { useState, useEffect } from 'react';
import { Calendar, ArrowDownCircle, ArrowUpCircle, Filter, ChevronLeft, ChevronRight, Search, Info, Wallet as WalletIcon, X, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../wallet/WalletCards';
import axios from 'axios';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { getWalletDetails } from '../../../services/walletService';


const API_BASE_URL = import.meta.env.VITE_API_URL;

// Predefined amount options
const AMOUNT_OPTIONS = [500, 1000, 2000, 5000];

// Payment method options
const PAYMENT_METHODS = [
    { id: 'razorpay', name: 'Razorpay', logo: '💸' },
    { id: 'paypal', name: 'PayPal', logo: '🅿️' }
];

const Wallet = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Add Money Modal State
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [addMoneyStep, setAddMoneyStep] = useState('amount'); // 'amount' or 'payment'
    const [isProcessing, setIsProcessing] = useState(false);
    const [paypalError, setPaypalError] = useState(null);
    const [paypalOrderID, setPaypalOrderID] = useState(null);

    // Wallet data states
    const [wallet, setWallet] = useState({
        balance: 0,
        pendingBalance: 0,
        currency: 'INR'
    });
    const [summary, setSummary] = useState({
        totalSpent: 0,
        totalRefunded: 0,
        thisMonth: 0,
        pendingAmount: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 4,
        totalTransactions: 0,
        totalPages: 1
    });


    // Function to fetch wallet data
    const fetchWalletData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Prepare query parameters
            let queryParams = new URLSearchParams({
                page: currentPage,
                limit: 4
            });

            // Add status filter if not 'all'
            if (activeTab === 'pending') {
                queryParams.append('status', 'pending');
            } else if (activeTab === 'credit' || activeTab === 'debit') {
                queryParams.append('type', activeTab);
            }

            // Add search query if exists
            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            // Make API request
            // const response = await axios.get(
            //     `${API_BASE_URL}/user/wallet?${queryParams.toString()}`,
            //     { withCredentials: true }
            // );
            const response = await getWalletDetails(queryParams.toString());

            const { wallet: walletData, summary: summaryData, transactions: txData, pagination: paginationData } = response.data;

            // Update state with fetched data
            setWallet(walletData);
            setSummary(summaryData);
            setTransactions(txData);
            setPagination(paginationData);

        } catch (err) {
            console.error('Error fetching wallet data:', err);
            setError('Failed to load wallet data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchWalletData();
    }, [currentPage, activeTab, searchQuery]);

    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when changing tabs
    };

    // Open Add Money Modal
    const openAddMoneyModal = () => {
        setIsAddMoneyModalOpen(true);
        setAddMoneyStep('amount');
        setAmount('');
        setSelectedPaymentMethod(null);
    };

    // Close Add Money Modal
    const closeAddMoneyModal = () => {
        setIsAddMoneyModalOpen(false);
        // Reset modal state
        setAddMoneyStep('amount');
        setAmount('');
        setSelectedPaymentMethod(null);
    };

    // Handle amount selection
    const handleAmountSelection = (selectedAmount) => {
        setAmount(selectedAmount.toString());
    };

    // Handle custom amount input
    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setAmount(value);
        }
    };

    // Proceed to payment method selection
    const proceedToPayment = () => {
        if (amount && parseInt(amount) > 0) {
            setAddMoneyStep('payment');
        }
    };

    // Handle payment method selection
    const handlePaymentMethodSelection = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };

    // Process payment
    const processPayment = async () => {
        try {
            setIsProcessing(true);
            setPaypalError(null);

            if (!selectedPaymentMethod || !amount || parseInt(amount) <= 0) {
                throw new Error("Please select a payment method and enter a valid amount");
            }

            // For Razorpay
            if (selectedPaymentMethod === 'razorpay') {
                // Make API call to create Razorpay order
                const response = await axios.post(
                    `${API_BASE_URL}/user/wallet/add-money`,
                    { amount: parseInt(amount), paymentMethod: 'razorpay' },
                    { withCredentials: true }
                );

                // Here we would normally handle Razorpay checkout
                // For this example, we'll just simulate a successful payment
                await new Promise(resolve => setTimeout(resolve, 2000));

            }
            // For PayPal
            else if (selectedPaymentMethod === 'paypal') {
                // Make API call to create PayPal order
                console.log("called");

                const response = await axios.post(
                    `${API_BASE_URL}/user/wallet/create-paypal-order`,
                    { amount: parseInt(amount) },
                    { withCredentials: true }
                );

                setPaypalOrderID(response.data.orderID);

                // Here we would normally redirect to PayPal or handle the PayPal SDK
                // For this example, we'll just simulate a successful payment
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Simulate order completion
                await axios.post(
                    `${API_BASE_URL}/user/wallet/capture-paypal-order`,
                    { orderID: response.data.orderID },
                    { withCredentials: true }
                );
            }

            // After successful payment, close modal and refresh wallet data
            closeAddMoneyModal();
            fetchWalletData();

            // Show success notification
            alert(`Successfully added ₹${amount} to your wallet!`);

        } catch (err) {
            console.error('Payment processing error:', err);
            setPaypalError(err.message || 'Payment failed. Please try again.');
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };



    // Create PayPal order
    const createPaypalOrder = (data, actions) => {
        const rechargeAmount = (parseFloat(amount) || 0).toFixed(2);

        if (rechargeAmount <= 0) {
            console.error("Invalid amount for PayPal:", rechargeAmount);
            setPaypalError("Invalid  amount");
            return Promise.reject("Invalid  amount");
        }

        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: rechargeAmount,
                        currency_code: "USD"
                    },
                    description: "wallet recharge in Adiyo.in"
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    // Handle PayPal approval (no capture on frontend)
    const onApprovePaypal = (data, actions) => {
        console.log("PayPal payment approved with orderID:", data.orderID);

        setPaypalOrderID(data.orderID);
        setIsProcessing(true);

        // Call onPlaceOrder without capturing on frontend
        return handlePlaceOrder('paypal', data.orderID)
            .then(response => {
                console.log("Order placed successfully:", response);
                setIsAddMoneyModalOpen(false)
                toast.success("wallet recharged successfully!");
                fetchWalletData()
                return response;
            })
            .catch(error => {
                console.error("Error during PayPal order processing:", error);
                setPaypalError(`Payment processing failed: ${error.message}`);
                throw error;
            })
            .finally(() => setIsProcessing(false));
    };

    const handlePlaceOrder = async (paymentMethod, paypalOrderID) => {

        console.log("handlePlaceOrder called with:", { paymentMethod, paypalOrderID });


        // Additional validation for PayPal
        if (paymentMethod === 'paypal' && !paypalOrderID) {
            toast.error("PayPal payment not completed. Please try again.");
            return Promise.reject(new Error("PayPal order ID missing"));
        }

        setLoading(true);

        try {
            const orderData = {

                paymentMethod: paymentMethod,
                ...(paymentMethod === 'paypal' && {
                    paypalOrderID: paypalOrderID,
                }),
                amount

            };

            console.log("Sending order data to API:", orderData);

            const response = await axios.post(
                `${API_BASE_URL}/user/wallet-recharge`,
                orderData,
                { withCredentials: true }
            );

            console.log("API response:", response.data);

            if (response.data.success) {
                return response.data;
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const onPaypalError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError(`Payment failed: ${err.message}`);
    };



    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-screen">
            {/* Header Section */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <WalletIcon className="mr-3 text-gray-800" size={24} />
                        <h2 className="text-2xl font-semibold text-gray-900">My Wallet</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                            {pagination.totalTransactions} transactions
                        </span>
                    </div>
                </div>
            </div>

            {/* Show error message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-6 rounded-md">
                    {error}
                </div>
            )}

            {/* Balance & Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-sm font-medium">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end">
                            <span className="text-3xl font-bold">₹{wallet.balance.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 ml-2 mb-1">Available</span>
                        </div>

                        {wallet.pendingBalance > 0 && (
                            <div className="mt-4 flex items-center text-sm">
                                <Info size={16} className="text-gray-500 mr-2" />
                                <span className="text-gray-600">₹{wallet.pendingBalance.toFixed(2)} pending admin approval</span>
                            </div>
                        )}

                        <div className="mt-6 flex">
                            <button
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm mr-3 hover:bg-gray-800 transition-colors duration-200"
                                onClick={openAddMoneyModal}
                            >
                                Add Money
                            </button>
                            <button className="border border-black text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
                                Withdraw
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-sm font-medium">Wallet Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <ArrowUpCircle size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Total Spent</span>
                                </div>
                                <p className="text-xl font-bold">₹{summary.totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <ArrowDownCircle size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Total Refunded</span>
                                </div>
                                <p className="text-xl font-bold">₹{summary.totalRefunded.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Calendar size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">This Month</span>
                                </div>
                                <p className="text-xl font-bold">₹{summary.thisMonth.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Info size={16} className="text-gray-600 mr-2" />
                                    <span className="text-sm text-gray-600">Pending</span>
                                </div>
                                <p className="text-xl font-bold">₹{summary.pendingAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'credit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('credit')}
                        >
                            Credits
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'debit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('debit')}
                        >
                            Debits
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'pending' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('pending')}
                        >
                            Pending
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}

            {/* Transactions List */}
            {!loading && transactions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-4 ${transaction.type === 'credit' ? 'bg-gray-100' : 'bg-gray-100'}`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowDownCircle size={20} className="text-green-600" />
                                            ) : (
                                                <ArrowUpCircle size={20} className="text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{transaction.description}</p>
                                            <p className="text-sm text-gray-500">{transaction.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                                    <p className={`text-xs px-2 py-1 rounded-full inline-block ${transaction.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {transaction.status === 'completed' ? 'Completed' : 'Awaiting Approval'}
                                    </p>
                                    <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-black'}`}>
                                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="p-6 flex items-center justify-between border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalTransactions)} of {pagination.totalTransactions} transactions
                            </p>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg mx-1 ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                    className={`p-2 rounded-lg ml-2 ${currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : !loading && (
                <div className="text-center py-16">
                    <WalletIcon size={64} className="mx-auto text-gray-300 mb-6" />
                    <p className="text-xl text-gray-700 font-medium mb-2">No transactions found</p>
                    <p className="text-gray-500 mb-6">
                        {searchQuery || activeTab !== 'all'
                            ? "Try adjusting your filters to see more results."
                            : "Your transaction history will appear here."}
                    </p>
                    <button
                        className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-gray-800 transition-colors duration-200"
                        onClick={openAddMoneyModal}
                    >
                        Add Money
                    </button>
                </div>
            )}

            {/* Add Money Modal */}
            {isAddMoneyModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {addMoneyStep === 'amount' ? 'Add Money to Wallet' : 'Select Payment Method'}
                                </h3>
                                <button
                                    onClick={closeAddMoneyModal}
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {/* Step 1: Amount Selection */}
                                {addMoneyStep === 'amount' && (
                                    <>
                                        <div className="mb-6">
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                                Enter Amount (₹)
                                            </label>
                                            <input
                                                type="text"
                                                id="amount"
                                                value={amount}
                                                onChange={handleAmountChange}
                                                placeholder="Enter amount"
                                                className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {AMOUNT_OPTIONS.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleAmountSelection(option)}
                                                        className={`py-3 rounded-lg text-center border ${amount === option.toString()
                                                            ? 'border-black bg-gray-100'
                                                            : 'border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        ₹{option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 2: Payment Method Selection */}
                                {addMoneyStep === 'payment' && (
                                    <div>
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-gray-700">Amount to Add</p>
                                                <p className="text-xl font-bold">₹{amount}</p>
                                            </div>
                                            <div className="h-px bg-gray-200 w-full mb-4"></div>
                                        </div>

                                        <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>

                                        <PayPalButtons
                                            createOrder={createPaypalOrder}
                                            onApprove={onApprovePaypal}
                                            onError={onPaypalError}
                                            onCancel={() => console.log("PayPal transaction cancelled")}
                                            style={{
                                                layout: 'horizontal',
                                                color: 'blue',
                                                shape: 'rect',
                                                label: 'pay'
                                            }}
                                        />

                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                                {addMoneyStep === 'amount' ? (
                                    <button
                                        onClick={proceedToPayment}
                                        disabled={!amount || parseInt(amount) <= 0}
                                        className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${!amount || parseInt(amount) <= 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        Continue
                                        <ArrowRight size={16} className="ml-2" />
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <button
                                            onClick={processPayment}
                                            disabled={!selectedPaymentMethod || isProcessing}
                                            className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${!selectedPaymentMethod || isProcessing
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={16} className="mr-2" />
                                                    Pay ₹{amount}
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setAddMoneyStep('amount')}
                                            disabled={isProcessing}
                                            className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-medium"
                                        >
                                            <ChevronLeft size={16} className="mr-2" />
                                            Back to Amount
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;