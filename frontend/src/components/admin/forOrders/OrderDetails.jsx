import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;



const OrderDetails = () => {


    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state for status change
    const [statusModal, setStatusModal] = useState({
        open: false,
        currentStatus: '',
        newStatus: ''
    });

    // Modal state for return verification
    const [returnModal, setReturnModal] = useState({
        open: false,
        productId: null,
        userId: null,
        amount: 0
    });

    const orderStatuses = ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'return requested', 'returned'];

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/orders/${orderId}`);
            console.log(response.data);

            setOrder(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError("Failed to fetch order details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusModalOpen = () => {
        if (!order) return;

        setStatusModal({
            open: true,
            currentStatus: order.status,
            newStatus: order.status
        });
    };

    const handleStatusModalClose = () => {
        setStatusModal({
            open: false,
            currentStatus: '',
            newStatus: ''
        });
    };

    const handleStatusChange = async () => {
        if (!order || statusModal.currentStatus === statusModal.newStatus) {
            handleStatusModalClose();
            return;
        }

        try {
            await axios.patch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
                status: statusModal.newStatus
            });


            handleStatusModalClose();
            fetchOrderDetails()

        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update order status. Please try again.");
        }
    };

    const handleReturnModalOpen = (productId) => {
        if (!order) return;

        setReturnModal({
            open: true,
            productId,
            userId: order.user?._id,
            amount: order.totalAmount
        });
    };

    const handleReturnModalClose = () => {
        setReturnModal({
            open: false,
            productId: null,
            userId: null,
            amount: 0
        });
    };

    const handleReturnVerification = async (approved) => {

        try {
            await axios.post(`${API_BASE_URL}/admin/orders/${orderId}/return-verification`, {
                productId: returnModal.productId,
                userId: returnModal.userId,
                amount: returnModal.amount,
                approved
            });

            setOrder({
                ...order,
                status: approved ? 'returned' : 'delivered'
            });

            handleReturnModalClose();
        } catch (err) {
            console.error("Error processing return verification:", err);
            setError("Failed to process return verification. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'out for delivery':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'return requested':
                return 'bg-orange-100 text-orange-800';
            case 'returned':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>;
    }

    if (error) {
        return <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center text-red-500">
            {error}
        </div>;
    }

    if (!order) {
        return <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
            Order not found
        </div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="mr-4 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 flex items-center"
                >
                    &larr; Back
                </button>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            {/* Order summary card */}
            <div className="bg-white rounded shadow p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Order #{order.orderId || order._id.slice(-6).toUpperCase()}</h2>
                        <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-start">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                            {order.status || "pending"}
                        </span>
                        <button
                            className="ml-4 text-blue-600 hover:text-blue-900"
                            onClick={handleStatusModalOpen}
                        >
                            Update Status
                        </button>
                        {order.status === 'return requested' && (
                            <button
                                className="ml-4 text-green-600 hover:text-green-900"
                                onClick={() => handleReturnModalOpen(order.products[0]?._id)}
                            >
                                Verify Return
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer details */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="font-medium">{order.user?.username || "Customer"}</p>
                            <p>{order.user?.email || "No email available"}</p>
                            <p>{order.user?.phone || "No phone available"}</p>
                        </div>
                    </div>

                    {/* Shipping details */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            {order.shippingAddress ? (
                                <>
                                    <p>{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                    <p>{order.shippingAddress.phoneNumber}</p>
                                </>
                            ) : (
                                <p>No shipping address available</p>
                            )}
                        </div>
                    </div>

                    {/* Payment details */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                        <div className="bg-gray-50 p-4 rounded">
                            <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || "Not specified"}</p>
                            <p><span className="font-medium">Payment ID:</span> {order.paymentId || "Not available"}</p>
                            <p><span className="font-medium">Payment Status:</span> {order.paymentStatus || "Not available"}</p>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                        <div className="bg-gray-50 p-4 rounded">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded shadow overflow-hidden">
                <h3 className="text-lg font-medium p-4 border-b">Order Items</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {order.products && order.products.length > 0 ? (
                            order.products.map((product, index) => (
                                <tr key={product._id || index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {product.image && (
                                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                    <img className="h-10 w-10 rounded object-cover" src={product.image} alt={product.name} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                {product.variant && <div className="text-sm text-gray-500">{product.variant}</div>}
                                                {product.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{product.price?.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{(product.price * product.quantity).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No products found in this order
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order history/timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mt-6 bg-white rounded shadow p-4">
                    <h3 className="text-lg font-medium mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                        {order.statusHistory.map((event, index) => (
                            <div key={index} className="flex items-start">
                                <div className="h-4 w-4 rounded-full bg-blue-500 mt-1 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium">{event.status}</p>
                                    <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                                    {event.note && <p className="text-sm mt-1">{event.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {statusModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded p-6 w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Current Status
                            </label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(statusModal.currentStatus)}`}>
                                    {statusModal.currentStatus || "pending"}
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                New Status
                            </label>
                            <select
                                value={statusModal.newStatus}
                                onChange={(e) => setStatusModal({ ...statusModal, newStatus: e.target.value })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            >
                                {orderStatuses.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Add Note (Optional)
                            </label>
                            <textarea
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                rows="3"
                                placeholder="Add a note about this status change"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={handleStatusModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
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
                <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
                    <div className="bg-white rounded p-6 w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Verify Return Request</h2>
                        <p className="mb-4">
                            Approve this return request? The customer will be refunded ₹{returnModal.amount?.toLocaleString('en-IN') || "0.00"} to their wallet.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={() => handleReturnVerification(false)}
                            >
                                Reject
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
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