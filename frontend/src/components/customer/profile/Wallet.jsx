


// import React, { useState, useEffect } from 'react';
// import { Calendar, ArrowDownCircle, ArrowUpCircle, Filter, ChevronLeft, ChevronRight, Search, Info, Wallet as WalletIcon, X, CreditCard, ArrowRight } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../wallet/WalletCards';
// import axios from 'axios';
// import { PayPalButtons } from '@paypal/react-paypal-js';
// import { toast } from 'react-toastify';
// import { addMoneyRazorpay, getWalletDetails, verifyWalletRecharge, walletRecharge } from '../../../services/walletService';


// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const AMOUNT_OPTIONS = [500, 1000, 2000, 5000];



// const Wallet = () => {
//     const [activeTab, setActiveTab] = useState('all');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Add Money Modal State
//     const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
//     const [amount, setAmount] = useState('');
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//     const [addMoneyStep, setAddMoneyStep] = useState('amount'); // 'amount' or 'payment'
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [paypalError, setPaypalError] = useState(null);
//     const [paypalOrderID, setPaypalOrderID] = useState(null);

//     // Wallet data states
//     const [wallet, setWallet] = useState({
//         balance: 0,
//         pendingBalance: 0,
//         currency: 'INR'
//     });
//     const [summary, setSummary] = useState({
//         totalSpent: 0,
//         totalRefunded: 0,
//         thisMonth: 0,
//         pendingAmount: 0
//     });
//     const [transactions, setTransactions] = useState([]);
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 4,
//         totalTransactions: 0,
//         totalPages: 1
//     });

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         document.body.appendChild(script);
//     }, []);


//     const fetchWalletData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             let queryParams = new URLSearchParams({
//                 page: currentPage,
//                 limit: 4
//             });

//             // Add status filter if not 'all'
//             if (activeTab === 'pending') {
//                 queryParams.append('status', 'pending');
//             } else if (activeTab === 'credit' || activeTab === 'debit') {
//                 queryParams.append('type', activeTab);
//             }

//             if (searchQuery) {
//                 queryParams.append('search', searchQuery);
//             }

//             const response = await getWalletDetails(queryParams.toString());

//             const { wallet: walletData, summary: summaryData, transactions: txData, pagination: paginationData } = response.data;

//             setWallet(walletData);
//             setSummary(summaryData);
//             setTransactions(txData);
//             setPagination(paginationData);

//         } catch (err) {
//             console.error('Error fetching wallet data:', err);
//             setError('Failed to load wallet data. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch data on component mount and when filters change
//     useEffect(() => {
//         fetchWalletData();
//     }, [currentPage, activeTab, searchQuery]);

//     // Handle search input change with debounce
//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//         setCurrentPage(1); // Reset to first page when searching
//     };

//     // Handle tab change
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         setCurrentPage(1); // Reset to first page when changing tabs
//     };

//     // Open Add Money Modal
//     const openAddMoneyModal = () => {
//         setIsAddMoneyModalOpen(true);
//         setAddMoneyStep('amount');
//         setAmount('');
//         setSelectedPaymentMethod(null);
//     };

//     // Close Add Money Modal
//     const closeAddMoneyModal = () => {
//         setIsAddMoneyModalOpen(false);
//         // Reset modal state
//         setAddMoneyStep('amount');
//         setAmount('');
//         setSelectedPaymentMethod(null);
//     };


//     const handleAmountSelection = (selectedAmount) => {
//         setAmount(selectedAmount.toString());
//     };


//     const handleAmountChange = (e) => {
//         const value = e.target.value;
//         // Allow only numbers
//         if (/^\d*$/.test(value)) {
//             setAmount(value);
//         }
//     };

//     const proceedToPayment = () => {
//         if (amount && parseInt(amount) > 0) {
//             setAddMoneyStep('payment');
//         }
//     };


//     const handlePaymentMethodSelection = (methodId) => {
//         setSelectedPaymentMethod(methodId);
//     };


//     const processPayment = async (method) => {
//         console.log("startrd");

//         let paymentNow = method || selectedPaymentMethod

//         try {
//             setIsProcessing(true);
//             setPaypalError(null);
//             console.log(selectedPaymentMethod, amount);


//             if (!paymentNow || !amount || parseInt(amount) <= 0) {
//                 throw new Error("Please select a payment method and enter a valid amount");
//             }


//             if (paymentNow === 'razorpay') {

//                 // const response = await axios.post(
//                 //     `${API_BASE_URL}/user/add-money-razopay`,
//                 //     { amount: parseInt(amount), paymentMethod: 'razorpay' },
//                 //     { withCredentials: true }
//                 // );

//                 const response = await addMoneyRazorpay(amount)

//                 console.log("respoooooooooooooo.", response.data);

//                 if (response.data.success && response.data.order) {

//                     const { order } = response.data;

//                     const options = {
//                         key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_default_key_id',
//                         amount: order.amount,
//                         currency: order.currency,
//                         name: 'Adiyo.in',
//                         description: 'Wallet Recharge',
//                         order_id: order.id,
//                         handler: async function (paymentResponse) {
//                             // const verifyResponse = await axios.post(
//                             //     `${API_BASE_URL}/user/wallet-recharge`,
//                             //     {
//                             //         paymentMethod: paymentNow,
//                             //         razorpay_order_id: paymentResponse.razorpay_order_id,
//                             //         razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                             //         razorpay_signature: paymentResponse.razorpay_signature,
//                             //         amount: parseInt(amount)
//                             //     },
//                             //     { withCredentials: true }
//                             // );

//                             const verifyResponse = await verifyWalletRecharge(paymentNow, paymentResponse, amount)

//                             if (verifyResponse.data.success) {
//                                 closeAddMoneyModal();
//                                 fetchWalletData();
//                             } else {
//                                 alert('Payment verification failed, please try again.');
//                             }
//                         },
//                         prefill: {
//                             name: 'Adithyan Binu',
//                             email: 'youremail@example.com'
//                         },
//                         theme: {
//                             color: '#3399cc'
//                         }
//                     };

//                     const rzp = new window.Razorpay(options);
//                     rzp.open();
//                 } else {
//                     throw new Error("Failed to create Razorpay order.");
//                 }
//             }

//             closeAddMoneyModal();
//             fetchWalletData();

//         } catch (err) {
//             console.error('Payment processing error:', err);
//             setPaypalError(err.message || 'Payment failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };



//     const createPaypalOrder = (data, actions) => {
//         const rechargeAmount = (parseFloat(amount) || 0).toFixed(2);

//         if (rechargeAmount <= 0) {
//             console.error("Invalid amount for PayPal:", rechargeAmount);
//             setPaypalError("Invalid  amount");
//             return Promise.reject("Invalid  amount");
//         }

//         return actions.order.create({
//             purchase_units: [
//                 {
//                     amount: {
//                         value: rechargeAmount,
//                         currency_code: "USD"
//                     },
//                     description: "wallet recharge in Adiyo.in"
//                 }
//             ],
//             application_context: {
//                 shipping_preference: 'NO_SHIPPING'
//             }
//         });
//     };

//     // Handle PayPal approval (no capture on frontend)
//     const onApprovePaypal = (data, actions) => {
//         console.log("PayPal payment approved with orderID:", data.orderID);

//         setPaypalOrderID(data.orderID);
//         setIsProcessing(true);

//         // Call onPlaceOrder without capturing on frontend
//         return handlePlaceOrder('paypal', data.orderID)
//             .then(response => {
//                 console.log("Order placed successfully:", response);
//                 setIsAddMoneyModalOpen(false)
//                 toast.success("wallet recharged successfully!");
//                 fetchWalletData()
//                 return response;
//             })
//             .catch(error => {
//                 console.error("Error during PayPal order processing:", error);
//                 setPaypalError(`Payment processing failed: ${error.message}`);
//                 throw error;
//             })
//             .finally(() => setIsProcessing(false));
//     };

//     const handlePlaceOrder = async (paymentMethod, paypalOrderID) => {

//         console.log("handlePlaceOrder called with:", { paymentMethod, paypalOrderID });

//         if (paymentMethod === 'paypal' && !paypalOrderID) {
//             toast.error("PayPal payment not completed. Please try again.");
//             return Promise.reject(new Error("PayPal order ID missing"));
//         }

//         setLoading(true);

//         try {
//             const orderData = {

//                 paymentMethod: paymentMethod,
//                 ...(paymentMethod === 'paypal' && {
//                     paypalOrderID: paypalOrderID,
//                 }),
//                 amount

//             };

//             console.log("Sending order data to API:", orderData);

//             const response = await walletRecharge(orderData)

//             // axios.post(
//             //     `${API_BASE_URL}/user/wallet-recharge`,
//             //     orderData,
//             //     { withCredentials: true }
//             // );

//             console.log("API response:", response.data);

//             if (response.data.success) {
//                 return response.data;
//             }
//         } catch (error) {
//             console.error("Error placing order:", error);
//             toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     };
//     const onPaypalError = (err) => {
//         console.error("PayPal error:", err);
//         setPaypalError(`Payment failed: ${err.message}`);
//     };



//     return (
//         <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-screen">
//             {/* Header Section */}
//             <div className="bg-gray-50 p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                         <WalletIcon className="mr-3 text-gray-800" size={24} />
//                         <h2 className="text-2xl font-semibold text-gray-900">My Wallet</h2>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
//                             {pagination.totalTransactions} transactions
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Show error message if any */}
//             {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-6 rounded-md">
//                     {error}
//                 </div>
//             )}

//             {/* Balance & Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//                 <Card className="bg-white shadow-sm border border-gray-200">
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-gray-500 text-sm font-medium">Total Balance</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex items-end">
//                             <span className="text-3xl font-bold">₹{wallet.balance.toFixed(2)}</span>
//                             <span className="text-sm text-gray-500 ml-2 mb-1">Available</span>
//                         </div>

//                         {wallet.pendingBalance > 0 && (
//                             <div className="mt-4 flex items-center text-sm">
//                                 <Info size={16} className="text-gray-500 mr-2" />
//                                 <span className="text-gray-600">₹{wallet.pendingBalance.toFixed(2)} pending admin approval</span>
//                             </div>
//                         )}

//                         <div className="mt-6 flex">
//                             <button
//                                 className="bg-black text-white px-4 py-2 rounded-lg text-sm mr-3 hover:bg-gray-800 transition-colors duration-200"
//                                 onClick={openAddMoneyModal}
//                             >
//                                 Add Money
//                             </button>
//                             <button className="border border-black text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
//                                 Withdraw
//                             </button>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="bg-white shadow-sm border border-gray-200">
//                     <CardHeader className="pb-2">
//                         <CardTitle className="text-gray-500 text-sm font-medium">Wallet Summary</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <div className="flex items-center mb-1">
//                                     <ArrowUpCircle size={16} className="text-gray-600 mr-2" />
//                                     <span className="text-sm text-gray-600">Total Spent</span>
//                                 </div>
//                                 <p className="text-xl font-bold">₹{summary.totalSpent.toFixed(2)}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <div className="flex items-center mb-1">
//                                     <ArrowDownCircle size={16} className="text-gray-600 mr-2" />
//                                     <span className="text-sm text-gray-600">Total Refunded</span>
//                                 </div>
//                                 <p className="text-xl font-bold">₹{summary.totalRefunded.toFixed(2)}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <div className="flex items-center mb-1">
//                                     <Calendar size={16} className="text-gray-600 mr-2" />
//                                     <span className="text-sm text-gray-600">This Month</span>
//                                 </div>
//                                 <p className="text-xl font-bold">₹{summary.thisMonth.toFixed(2)}</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                                 <div className="flex items-center mb-1">
//                                     <Info size={16} className="text-gray-600 mr-2" />
//                                     <span className="text-sm text-gray-600">Pending</span>
//                                 </div>
//                                 <p className="text-xl font-bold">₹{summary.pendingAmount.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Search and Filters */}
//             <div className="p-6 border-b border-gray-200 bg-gray-50">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
//                     <div className="relative w-full md:w-72">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Search size={18} className="text-gray-500" />
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search transactions..."
//                             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
//                             value={searchQuery}
//                             onChange={handleSearchChange}
//                         />
//                     </div>
//                     <div className="flex space-x-2">
//                         <button
//                             className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
//                             onClick={() => handleTabChange('all')}
//                         >
//                             All
//                         </button>
//                         <button
//                             className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'credit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
//                             onClick={() => handleTabChange('credit')}
//                         >
//                             Credits
//                         </button>
//                         <button
//                             className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'debit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
//                             onClick={() => handleTabChange('debit')}
//                         >
//                             Debits
//                         </button>
//                         <button
//                             className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'pending' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
//                             onClick={() => handleTabChange('pending')}
//                         >
//                             Pending
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Loading State */}
//             {loading && (
//                 <div className="flex justify-center items-center p-16">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//                 </div>
//             )}

//             {/* Transactions List */}
//             {!loading && transactions.length > 0 ? (
//                 <div className="divide-y divide-gray-200">
//                     {transactions.map((transaction) => (
//                         <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
//                             <div className="flex flex-col md:flex-row md:items-center justify-between">
//                                 <div className="mb-4 md:mb-0">
//                                     <div className="flex items-center">
//                                         <div className={`p-2 rounded-full mr-4 ${transaction.type === 'credit' ? 'bg-gray-100' : 'bg-gray-100'}`}>
//                                             {transaction.type === 'credit' ? (
//                                                 <ArrowDownCircle size={20} className="text-green-600" />
//                                             ) : (
//                                                 <ArrowUpCircle size={20} className="text-gray-600" />
//                                             )}
//                                         </div>
//                                         <div>
//                                             <p className="font-medium">{transaction.description}</p>
//                                             <p className="text-sm text-gray-500">{transaction.date}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
//                                     <p className={`text-xs px-2 py-1 rounded-full inline-block ${transaction.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
//                                         {transaction.status === 'completed' ? 'Completed' : 'Awaiting Approval'}
//                                     </p>
//                                     <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-black'}`}>
//                                         {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     {/* Pagination */}
//                     {pagination.totalPages > 1 && (
//                         <div className="p-6 flex items-center justify-between border-t border-gray-200">
//                             <p className="text-sm text-gray-500">
//                                 Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalTransactions)} of {pagination.totalTransactions} transactions
//                             </p>
//                             <div className="flex items-center">
//                                 <button
//                                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                                     disabled={currentPage === 1}
//                                     className={`p-2 rounded-lg mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
//                                 >
//                                     <ChevronLeft size={20} />
//                                 </button>

//                                 {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
//                                     <button
//                                         key={pageNum}
//                                         onClick={() => setCurrentPage(pageNum)}
//                                         className={`w-8 h-8 flex items-center justify-center rounded-lg mx-1 ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
//                                     >
//                                         {pageNum}
//                                     </button>
//                                 ))}

//                                 <button
//                                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                                     disabled={currentPage === pagination.totalPages}
//                                     className={`p-2 rounded-lg ml-2 ${currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
//                                 >
//                                     <ChevronRight size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             ) : !loading && (
//                 <div className="text-center py-16">
//                     <WalletIcon size={64} className="mx-auto text-gray-300 mb-6" />
//                     <p className="text-xl text-gray-700 font-medium mb-2">No transactions found</p>
//                     <p className="text-gray-500 mb-6">
//                         {searchQuery || activeTab !== 'all'
//                             ? "Try adjusting your filters to see more results."
//                             : "Your transaction history will appear here."}
//                     </p>
//                     <button
//                         className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-gray-800 transition-colors duration-200"
//                         onClick={openAddMoneyModal}
//                     >
//                         Add Money
//                     </button>
//                 </div>
//             )}

//             {/* Add Money Modal */}
//             {isAddMoneyModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                     {/* Semi-transparent backdrop */}
//                     <div className="absolute inset-0 bg-black opacity-50"></div>
//                     <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
//                         <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
//                             {/* Modal Header */}
//                             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                                 <h3 className="text-xl font-semibold text-gray-900">
//                                     {addMoneyStep === 'amount' ? 'Add Money to Wallet' : 'Select Payment Method'}
//                                 </h3>
//                                 <button
//                                     onClick={closeAddMoneyModal}
//                                     className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>

//                             {/* Modal Body */}
//                             <div className="p-6">
//                                 {/* Step 1: Amount Selection */}
//                                 {addMoneyStep === 'amount' && (
//                                     <>
//                                         <div className="mb-6">
//                                             <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Enter Amount (₹)
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="amount"
//                                                 value={amount}
//                                                 onChange={handleAmountChange}
//                                                 placeholder="Enter amount"
//                                                 className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
//                                             />
//                                         </div>

//                                         <div className="mb-6">
//                                             <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 {AMOUNT_OPTIONS.map((option) => (
//                                                     <button
//                                                         key={option}
//                                                         onClick={() => handleAmountSelection(option)}
//                                                         className={`py-3 rounded-lg text-center border ${amount === option.toString()
//                                                             ? 'border-black bg-gray-100'
//                                                             : 'border-gray-300 hover:bg-gray-50'
//                                                             }`}
//                                                     >
//                                                         ₹{option}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}

//                                 {/* Step 2: Payment Method Selection */}
//                                 {addMoneyStep === 'payment' && (
//                                     <div>
//                                         <div className="mb-4">
//                                             <div className="flex items-center justify-between mb-4">
//                                                 <p className="text-gray-700">Amount to Add</p>
//                                                 <p className="text-xl font-bold">₹{amount}</p>
//                                             </div>
//                                             <div className="h-px bg-gray-200 w-full mb-4"></div>
//                                         </div>

//                                         <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>

//                                         <PayPalButtons
//                                             createOrder={createPaypalOrder}
//                                             onApprove={onApprovePaypal}
//                                             onError={onPaypalError}
//                                             onCancel={() => console.log("PayPal transaction cancelled")}
//                                             style={{
//                                                 layout: 'horizontal',
//                                                 color: 'blue',
//                                                 shape: 'rect',
//                                                 label: 'pay'
//                                             }}
//                                         />

//                                         <div className="flex flex-col items-center">
//                                             <button
//                                                 onClick={() => {
//                                                     handlePaymentMethodSelection('razorpay')
//                                                     processPayment("razorpay")
//                                                 }}
//                                                 className={`w-full mt-4 h-11 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group ${selectedPaymentMethod === 'razorpay'
//                                                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
//                                                     : 'bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border border-amber-300'
//                                                     } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98]`}
//                                             >
//                                                 <div className="flex items-center justify-center relative overflow-hidden">
//                                                     <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
//                                                     <span className="font-semibold">Pay with <span className="text-2xl italic text-blue-600 animate-pulse">Razorpay</span></span>
//                                                 </div>
//                                             </button>
//                                             <div className="text-gray-800  text-lg">Fast and secure payments</div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Modal Footer */}
//                             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
//                                 {addMoneyStep === 'amount' ? (
//                                     <button
//                                         onClick={proceedToPayment}
//                                         disabled={!amount || parseInt(amount) <= 0}
//                                         className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${!amount || parseInt(amount) <= 0
//                                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                             : 'bg-black text-white hover:bg-gray-800'
//                                             }`}
//                                     >
//                                         Continue
//                                         <ArrowRight size={16} className="ml-2" />
//                                     </button>
//                                 ) : (
//                                     <div className="space-y-3">

//                                         <button
//                                             onClick={() => setAddMoneyStep('amount')}
//                                             disabled={isProcessing}
//                                             className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-medium"
//                                         >
//                                             <ChevronLeft size={16} className="mr-2" />
//                                             Back to Amount
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Wallet;










import React, { useState, useEffect } from 'react';
import { Calendar, ArrowDownCircle, ArrowUpCircle, Filter, ChevronLeft, ChevronRight, Search, Info, Wallet as WalletIcon, X, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../wallet/WalletCards';
import axios from 'axios';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { addMoneyRazorpay, getWalletDetails, verifyWalletRecharge, walletRecharge } from '../../../services/walletService';


const API_BASE_URL = import.meta.env.VITE_API_URL;

const AMOUNT_OPTIONS = [500, 1000, 2000, 5000];



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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);


    const fetchWalletData = async () => {
        try {
            setLoading(true);
            setError(null);

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

            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            const response = await getWalletDetails(queryParams.toString());

            const { wallet: walletData, summary: summaryData, transactions: txData, pagination: paginationData } = response.data;

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


    const handleAmountSelection = (selectedAmount) => {
        setAmount(selectedAmount.toString());
    };


    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const proceedToPayment = () => {
        if (amount && parseInt(amount) > 0) {
            setAddMoneyStep('payment');
        }
    };


    const handlePaymentMethodSelection = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };


    const processPayment = async (method) => {
        console.log("startrd");

        let paymentNow = method || selectedPaymentMethod

        try {
            setIsProcessing(true);
            setPaypalError(null);
            console.log(selectedPaymentMethod, amount);


            if (!paymentNow || !amount || parseInt(amount) <= 0) {
                throw new Error("Please select a payment method and enter a valid amount");
            }


            if (paymentNow === 'razorpay') {

                // const response = await axios.post(
                //     `${API_BASE_URL}/user/add-money-razopay`,
                //     { amount: parseInt(amount), paymentMethod: 'razorpay' },
                //     { withCredentials: true }
                // );

                const response = await addMoneyRazorpay(amount)

                console.log("respoooooooooooooo.", response.data);

                if (response.data.success && response.data.order) {

                    const { order } = response.data;

                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_default_key_id',
                        amount: order.amount,
                        currency: order.currency,
                        name: 'Adiyo.in',
                        description: 'Wallet Recharge',
                        order_id: order.id,
                        handler: async function (paymentResponse) {
                            // const verifyResponse = await axios.post(
                            //     `${API_BASE_URL}/user/wallet-recharge`,
                            //     {
                            //         paymentMethod: paymentNow,
                            //         razorpay_order_id: paymentResponse.razorpay_order_id,
                            //         razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            //         razorpay_signature: paymentResponse.razorpay_signature,
                            //         amount: parseInt(amount)
                            //     },
                            //     { withCredentials: true }
                            // );

                            const verifyResponse = await verifyWalletRecharge(paymentNow, paymentResponse, amount)

                            if (verifyResponse.data.success) {
                                closeAddMoneyModal();
                                fetchWalletData();
                            } else {
                                alert('Payment verification failed, please try again.');
                            }
                        },
                        prefill: {
                            name: 'Adithyan Binu',
                            email: 'youremail@example.com'
                        },
                        theme: {
                            color: '#3399cc'
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    throw new Error("Failed to create Razorpay order.");
                }
            }

            closeAddMoneyModal();
            fetchWalletData();

        } catch (err) {
            console.error('Payment processing error:', err);
            setPaypalError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };



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

            const response = await walletRecharge(orderData)

            // axios.post(
            //     `${API_BASE_URL}/user/wallet-recharge`,
            //     orderData,
            //     { withCredentials: true }
            // );

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
        <div className="flex-1 p-3 sm:p-6 bg-white m-2 sm:m-6 rounded-md shadow-sm min-h-screen">
            {/* Header Section - Mobile Responsive */}
            <div className="bg-gray-50 p-3 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center mb-3 sm:mb-0">
                        <WalletIcon className="mr-2 sm:mr-3 text-gray-800" size={20} />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Wallet</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            {pagination.totalTransactions} transactions
                        </span>
                    </div>
                </div>
            </div>

            {/* Show error message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 m-2 sm:m-6 rounded-md text-sm sm:text-base">
                    {error}
                </div>
            )}

            {/* Balance & Summary Cards - Mobile Responsive */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 p-3 sm:p-6">
                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-xs sm:text-sm font-medium">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end">
                            <span className="text-2xl sm:text-3xl font-bold">₹{wallet.balance.toFixed(2)}</span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-2 mb-1">Available</span>
                        </div>

                        {wallet.pendingBalance > 0 && (
                            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                                <Info size={14} className="text-gray-500 mr-1 sm:mr-2" />
                                <span className="text-gray-600">₹{wallet.pendingBalance.toFixed(2)} pending admin approval</span>
                            </div>
                        )}

                        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                            <button
                                className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm mr-2 hover:bg-gray-800 transition-colors duration-200"
                                onClick={openAddMoneyModal}
                            >
                                Add Money
                            </button>
                            <button className="border border-black text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-200">
                                Withdraw
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-500 text-xs sm:text-sm font-medium">Wallet Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <ArrowUpCircle size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Total Spent</span>
                                </div>
                                <p className="text-base sm:text-xl font-bold">₹{summary.totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <ArrowDownCircle size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Total Refunded</span>
                                </div>
                                <p className="text-base sm:text-xl font-bold">₹{summary.totalRefunded.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Calendar size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">This Month</span>
                                </div>
                                <p className="text-base sm:text-xl font-bold">₹{summary.thisMonth.toFixed(2)}</p>
                            </div>
                            <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <Info size={14} className="text-gray-600 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm text-gray-600">Pending</span>
                                </div>
                                <p className="text-base sm:text-xl font-bold">₹{summary.pendingAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters - Mobile Responsive */}
            <div className="p-3 sm:p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col space-y-3 sm:space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg ${activeTab === 'credit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('credit')}
                        >
                            Credits
                        </button>
                        <button
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg ${activeTab === 'debit' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('debit')}
                        >
                            Debits
                        </button>
                        <button
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg ${activeTab === 'pending' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => handleTabChange('pending')}
                        >
                            Pending
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-8 sm:p-16">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}

            {/* Transactions List - Mobile Responsive */}
            {!loading && transactions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="p-3 sm:p-6 hover:bg-gray-50 transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <div className="flex items-center">
                                        <div className={`p-1 sm:p-2 rounded-full mr-2 sm:mr-4 ${transaction.type === 'credit' ? 'bg-gray-100' : 'bg-gray-100'}`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowDownCircle size={16} className="text-green-600" />
                                            ) : (
                                                <ArrowUpCircle size={16} className="text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">{transaction.description}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{transaction.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between sm:justify-end sm:items-center mt-2 sm:mt-0 sm:space-x-6">
                                    <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${transaction.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {transaction.status === 'completed' ? 'Completed' : 'Awaiting Approval'}
                                    </p>
                                    <p className={`font-semibold text-sm sm:text-base ${transaction.type === 'credit' ? 'text-green-600' : 'text-black'}`}>
                                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination - Mobile Responsive */}
                    {pagination.totalPages > 1 && (
                        <div className="p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
                                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalTransactions)} of {pagination.totalTransactions} transactions
                            </p>
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-1 sm:p-2 rounded-lg mr-1 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg mx-0.5 sm:mx-1 text-xs sm:text-sm ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                    className={`p-1 sm:p-2 rounded-lg ml-1 ${currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : !loading && (
                <div className="text-center py-8 sm:py-16">
                    <WalletIcon size={48} className="mx-auto text-gray-300 mb-4 sm:mb-6" />
                    <p className="text-lg sm:text-xl text-gray-700 font-medium mb-2">No transactions found</p>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
                        {searchQuery || activeTab !== 'all'
                            ? "Try adjusting your filters to see more results."
                            : "Your transaction history will appear here."}
                    </p>
                    <button
                        className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-md font-medium hover:bg-gray-800 transition-colors duration-200"
                        onClick={openAddMoneyModal}
                    >
                        Add Money
                    </button>
                </div>
            )}

            {/* Add Money Modal - Mobile Responsive */}
            {isAddMoneyModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Semi-transparent backdrop */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {addMoneyStep === 'amount' ? 'Add Money to Wallet' : 'Select Payment Method'}
                                </h3>
                                <button
                                    onClick={closeAddMoneyModal}
                                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4 sm:p-6">
                                {/* Step 1: Amount Selection */}
                                {addMoneyStep === 'amount' && (
                                    <>
                                        <div className="mb-4 sm:mb-6">
                                            <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                Enter Amount (₹)
                                            </label>
                                            <input
                                                type="text"
                                                id="amount"
                                                value={amount}
                                                onChange={handleAmountChange}
                                                placeholder="Enter amount"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="mb-4 sm:mb-6">
                                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick Select</p>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                                {AMOUNT_OPTIONS.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleAmountSelection(option)}
                                                        className={`py-2 sm:py-3 rounded-lg text-center border text-sm ${amount === option.toString()
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
                                        <div className="mb-3 sm:mb-4">
                                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                <p className="text-sm sm:text-base text-gray-700">Amount to Add</p>
                                                <p className="text-lg sm:text-xl font-bold">₹{amount}</p>
                                            </div>
                                            <div className="h-px bg-gray-200 w-full mb-3 sm:mb-4"></div>
                                        </div>
                                        <div className="mb-4 sm:mb-6">
                                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                                Select Payment Method
                                            </p>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => handlePaymentMethodSelection('razorpay')}
                                                    className={`w-full py-3 px-4 border rounded-lg flex items-center justify-between ${selectedPaymentMethod === 'razorpay'
                                                            ? 'border-black bg-gray-50'
                                                            : 'border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        <CreditCard className="mr-3 text-gray-600" size={18} />
                                                        <span className="text-sm font-medium">Razorpay</span>
                                                    </div>
                                                    {selectedPaymentMethod === 'razorpay' && (
                                                        <ArrowRight size={16} className="text-gray-600" />
                                                    )}
                                                </button>

                                                <div className={`w-full py-3 px-4 border rounded-lg ${selectedPaymentMethod === 'paypal'
                                                        ? 'border-black bg-gray-50'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    <div
                                                        className="flex items-center justify-between cursor-pointer mb-2"
                                                        onClick={() => handlePaymentMethodSelection('paypal')}
                                                    >
                                                        <div className="flex items-center">
                                                            <CreditCard className="mr-3 text-gray-600" size={18} />
                                                            <span className="text-sm font-medium">PayPal</span>
                                                        </div>
                                                        {selectedPaymentMethod === 'paypal' && (
                                                            <ArrowRight size={16} className="text-gray-600" />
                                                        )}
                                                    </div>

                                                    {selectedPaymentMethod === 'paypal' && (
                                                        <div className="mt-3">
                                                            {paypalError && (
                                                                <div className="text-red-500 text-xs mb-2">{paypalError}</div>
                                                            )}
                                                            <PayPalButtons
                                                                createOrder={createPaypalOrder}
                                                                onApprove={onApprovePaypal}
                                                                onError={onPaypalError}
                                                                style={{ layout: 'horizontal', color: 'blue', shape: 'rect', label: 'pay' }}
                                                                disabled={isProcessing || !amount || parseInt(amount) <= 0}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {paypalError && (
                                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs mb-4">
                                                {paypalError}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-between">
                                {addMoneyStep === 'payment' ? (
                                    <>
                                        <button
                                            onClick={() => setAddMoneyStep('amount')}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => processPayment()}
                                            disabled={!selectedPaymentMethod || isProcessing || selectedPaymentMethod === 'paypal'}
                                            className={`px-6 py-2 text-sm font-medium text-white rounded-lg ${!selectedPaymentMethod || isProcessing || selectedPaymentMethod === 'paypal'
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-black hover:bg-gray-800'
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                'Pay Now'
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={closeAddMoneyModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={proceedToPayment}
                                            disabled={!amount || parseInt(amount) <= 0}
                                            className={`px-6 py-2 text-sm font-medium text-white rounded-lg ${!amount || parseInt(amount) <= 0
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-black hover:bg-gray-800'
                                                }`}
                                        >
                                            Continue
                                        </button>
                                    </>
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