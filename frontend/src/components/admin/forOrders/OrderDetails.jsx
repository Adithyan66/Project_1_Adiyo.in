

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useOrderDetails from '../../../hooks/admin/useOrderDetails';
import DataTable from '../../common/adminTable/DataTable';
import DetailsCard from '../../common/details/DetailsCard';
import ErrorModal from '../../common/error/ErrorModal';
import { PulseRingLoader } from '../../common/loading/Spinner';


const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const {
        order,
        loading,
        error,
        statusModal,
        setStatusModal,
        returnModal,
        setReturnModal,
        orderStatuses,
        handleStatusModalOpen,
        handleStatusModalClose,
        handleStatusChange,
        handleReturnModalOpen,
        handleReturnModalClose,
        handleReturnVerification,
        formatDate,
        getStatusBadgeClass,
    } = useOrderDetails(orderId);

    const columns = [
        {
            header: 'Product',
            field: 'name',
            render: (product) => (
                <div className="flex items-center">
                    {product.image && (
                        <div className="flex-shrink-0 h-12 w-12 mr-4">
                            <img
                                className="h-12 w-12 rounded-md object-cover border border-gray-200"
                                src={product.image}
                                alt={product.name}
                            />
                        </div>
                    )}
                    <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.variant && <div className="text-sm text-gray-500">{product.variant}</div>}
                        {product.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                    </div>
                </div>
            ),
        },
        {
            header: 'Price',
            field: 'price',
            render: (product) => `₹${product.price?.toLocaleString('en-IN')}`,
        },
        {
            header: 'Quantity',
            field: 'quantity',
        },
        {
            header: 'Total',
            field: 'total',
            render: (product) => `₹${(product.price * product.quantity).toLocaleString('en-IN')}`,
        },
    ];

    if (loading) {
        return <PulseRingLoader />;
    }

    if (error) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    if (!order) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
                Order not found
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="mr-4 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            {/* Order summary card */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            Order #{order.orderId || order._id.slice(-6).toUpperCase()}
                        </h2>
                        <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center">
                        <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(
                                order.status
                            )}`}
                        >
                            {order.status || 'pending'}
                        </span>
                        {order.status !== 'return requested' ? (
                            <button
                                className="mt-2 md:mt-0 md:ml-4 text-gray-700 hover:text-black border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 transition"
                                onClick={handleStatusModalOpen}
                            >
                                Update Status
                            </button>
                        ) : (
                            <div className="mt-3 md:mt-0 md:ml-4 p-3 border border-orange-200 bg-orange-50 rounded-md">
                                <div className="mb-2">
                                    <span className="block text-xs font-medium text-gray-700 mb-1">Return Reason:</span>
                                    <p className="text-sm px-2 py-1 bg-white border border-gray-200 rounded">
                                        {order.returnReason || 'No reason provided'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="px-3 py-1 bg-white border border-red-500 text-red-600 rounded hover:bg-red-50 text-sm transition"
                                        onClick={() => handleReturnVerification(false)}
                                    >
                                        Reject Return
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm transition"
                                        onClick={() => handleReturnVerification(true)}
                                    >
                                        Approve Return
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer details */}
                    <DetailsCard title="Customer Information">
                        <p className="font-medium">{order.user?.username || 'Customer'}</p>
                        <p className="text-gray-700">{order.user?.email || 'No email available'}</p>
                        <p className="text-gray-700">{order.user?.mobile || 'No phone available'}</p>
                    </DetailsCard>

                    {/* Shipping details */}
                    <DetailsCard title="Shipping Address">
                        {order.shippingAddress ? (
                            <>
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p className="text-gray-700">{order.shippingAddress.address}</p>
                                {order.shippingAddress.addressLine2 && (
                                    <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                                )}
                                <p className="text-gray-700">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.pincode}
                                </p>
                                <p className="text-gray-700">{order.shippingAddress.country}</p>
                                <p className="text-gray-700">{order.shippingAddress.phoneNumber}</p>
                            </>
                        ) : (
                            <p className="text-gray-500">No shipping address available</p>
                        )}
                    </DetailsCard>

                    {/* Payment details */}
                    <DetailsCard title="Payment Information">
                        <p className="mb-1">
                            <span className="font-medium">Payment Method:</span>{' '}
                            {order.paymentMethod || 'Not specified'}
                        </p>
                        <p className="mb-1">
                            <span className="font-medium">Payment ID:</span>{' '}
                            {order.paymentDetails?.transactionId || 'Not available'}
                        </p>
                        <p>
                            <span className="font-medium">Payment Status:</span>{' '}
                            {order.paymentStatus || 'Not available'}
                        </p>
                    </DetailsCard>

                    {/* Order summary */}
                    <DetailsCard title="Order Summary">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{(order.totalAmount - (order.shippingFee || 0)).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping</span>
                            <span>₹{(order.shippingFee || 0).toLocaleString('en-IN')}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                                <span>Discount</span>
                                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </DetailsCard>
                </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <h3 className="text-lg font-medium p-4 border-b">Order Items</h3>
                <DataTable columns={columns} data={order.products || []} />
            </div>

            {/* Order history/timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                        {order.statusHistory.map((event, index) => (
                            <div key={index} className="flex items-start">
                                <div className="h-4 w-4 rounded-full bg-black mt-1 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium">{event.status}</p>
                                    <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                                    {event.note && <p className="text-sm mt-1 text-gray-700">{event.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {statusModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Current Status</label>
                            <div className="mt-1">
                                <span
                                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                        statusModal.currentStatus
                                    )}`}
                                >
                                    {statusModal.currentStatus || 'pending'}
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">New Status</label>
                            <select
                                value={statusModal.newStatus}
                                onChange={(e) => setStatusModal({ ...statusModal, newStatus: e.target.value })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            >
                                {orderStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Add Note (Optional)</label>
                            <textarea
                                value={statusModal.note}
                                onChange={(e) => setStatusModal({ ...statusModal, note: e.target.value })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                rows="3"
                                placeholder="Add a note about this status change"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                onClick={handleStatusModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                onClick={handleStatusChange}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Verification Modal */}
            {returnModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Verify Return Request</h2>
                        <p className="mb-4">
                            Approve this return request? The customer will be refunded ₹
                            {returnModal.amount?.toLocaleString('en-IN') || '0.00'} to their wallet.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Return Reason</label>
                            <p className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                {order.returnReason || 'No reason provided'}
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                                onClick={handleReturnModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition"
                                onClick={() => handleReturnVerification(false)}
                            >
                                Reject
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                onClick={() => handleReturnVerification(true)}
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;