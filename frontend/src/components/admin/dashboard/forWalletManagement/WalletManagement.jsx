import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const WalletManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Fetch transactions on component mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/admin/wallet-transactions`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setTransactions(response.data.transactions);
            } else {
                toast.error('Failed to load transactions');
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error('An error occurred while fetching transactions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (transaction) => {
        setCurrentTransaction(transaction);
        setIsDetailModalOpen(true);
    };

    const navigateToOrder = (orderId) => {
        // Implementation to navigate to order details page
        console.log(`Navigating to order ${orderId}`);
        // window.location.href = `/admin/orders/${orderId}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount, type) => {
        return (
            <span className={`font-medium ${type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {type === 'credit' ? '+' : '-'}₹{Math.abs(amount).toFixed(2)}
            </span>
        );
    };

    const getTransactionTypeLabel = (type) => {
        const labels = {
            'credit': 'Credit',
            'debit': 'Debit',
            'refund': 'Refund',
            'purchase': 'Purchase',
            'admin': 'Admin Adjustment',
            'referral': 'Referral Bonus'
        };
        return labels[type] || type;
    };

    const getTransactionStatusBadge = (status) => {
        const statusClasses = {
            'completed': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'failed': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
                <p className="text-gray-500 mt-1">
                    View and manage all wallet transactions
                </p>
            </div>

            {/* Filter options */}
            <div className="mb-6 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('credit')}
                        className={`px-3 py-1 text-sm rounded-md ${filter === 'credit' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        Credits
                    </button>
                    <button
                        onClick={() => setFilter('debit')}
                        className={`px-3 py-1 text-sm rounded-md ${filter === 'debit' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        Debits
                    </button>
                    <button
                        onClick={() => setFilter('refund')}
                        className={`px-3 py-1 text-sm rounded-md ${filter === 'refund' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        Refunds
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            {isLoading ? (
                <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction._id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {transaction.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getTransactionTypeLabel(transaction.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getTransactionStatusBadge(transaction.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            {formatAmount(transaction.amount, transaction.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(transaction)}
                                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 mr-2"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Transaction Details Modal */}
            {isDetailModalOpen && currentTransaction && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Transaction Details
                                </h3>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Transaction Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium text-gray-900">
                                            {getTransactionTypeLabel(currentTransaction.type)}
                                        </h4>
                                        <div>
                                            {formatAmount(currentTransaction.amount, currentTransaction.type)}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        {formatDate(currentTransaction.date)}
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Transaction ID</h5>
                                        <p className="text-sm text-gray-900">{currentTransaction._id}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Status</h5>
                                        <p className="text-sm">{getTransactionStatusBadge(currentTransaction.status)}</p>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div>
                                    <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">User Details</h5>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-sm font-medium">{currentTransaction.user.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm">{currentTransaction.user.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">User ID</p>
                                                <p className="text-sm">{currentTransaction.user._id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Current Wallet Balance</p>
                                                <p className="text-sm font-medium">₹{currentTransaction.user.walletBalance?.toFixed(2) || '0.00'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Source of Transaction */}
                                {currentTransaction.order && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Source of Transaction</h5>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500">Order ID</p>
                                                    <p className="text-sm font-medium">{currentTransaction.order._id}</p>
                                                </div>
                                                <button
                                                    onClick={() => navigateToOrder(currentTransaction.order._id)}
                                                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                                                >
                                                    View Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Details */}
                                {currentTransaction.description && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Description</h5>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                            {currentTransaction.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Close Button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && transactions.length === 0 && (
                <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="mt-2 text-base font-medium text-gray-900">No transactions found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There are no wallet transactions to display at this time.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WalletManagement;