import { Link } from "react-router";
import { getTransactionStatusBadge, getTransactionTypeLabel } from "../../../common/badges/TransactionBadge"
import { formatAmount, formatDate } from "../../../common/details/Format";


const TransactionDetailsModal = ({ currentTransaction, setIsDetailModalOpen }) => {

    console.log("currrrrrrrrrrrrrrrrrrrrrrrrr", currentTransaction);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Semi-transparent backdrop */}
                <div className="absolute inset-0 bg-black opacity-50">
                </div>
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                                            {getTransactionTypeLabel(currentTransaction?.type)}
                                        </h4>
                                        <div>
                                            {formatAmount(currentTransaction?.amount, currentTransaction?.type)}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                        {formatDate(currentTransaction?.createdAt)}
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Transaction ID</h5>
                                        <p className="text-sm text-gray-900">{currentTransaction?.transactionId}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Status</h5>
                                        <p className="text-sm">{getTransactionStatusBadge(currentTransaction?.status)}</p>
                                    </div>
                                </div>

                                {/* User Details */}
                                {currentTransaction?.userId && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">User Details</h5>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs text-gray-500">Username</p>
                                                    <p className="text-sm font-medium">{currentTransaction?.userId.username || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm">{currentTransaction?.userId?.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">User ID</p>
                                                    <p className="text-sm">{currentTransaction?.userId?.userId || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Current Wallet Balance</p>
                                                    <p className="text-sm font-medium">₹{currentTransaction?.walletId?.balance?.toFixed(2) || '0.00'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reference Details */}
                                {currentTransaction?.reference && Object.keys(currentTransaction?.reference).length > 0 && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Reference Details</h5>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {Object.entries(currentTransaction?.reference).map(([key, value]) => (
                                                <div key={key} className="mb-1">
                                                    <span className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}: </span>
                                                    <span className="text-sm">
                                                        {key === 'orderId' ?
                                                            <Link to={`/admin/order-details/${value}`} className="text-blue-600 hover:underline">{value}</Link> :
                                                            value
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Details */}
                                {currentTransaction?.description && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Description</h5>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                            {currentTransaction?.description}
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
            </div>
        </>
    )
}

export default TransactionDetailsModal