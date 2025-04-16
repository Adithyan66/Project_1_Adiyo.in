import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { getFilteredOrders, updateOrderStatusById, verifyOrderReturn } from '../../../services/orderService';


const API_BASE_URL = import.meta.env.VITE_API_URL;





const Orders = () => {

    const navigate = useNavigate()

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');

    const [statusModal, setStatusModal] = useState({
        open: false,
        orderId: null,
        currentStatus: '',
        newStatus: ''
    });

    const [returnModal, setReturnModal] = useState({
        open: false,
        orderId: null,
        productId: null,
        userId: null,
        amount: 0
    });

    const orderStatuses = ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'return requested', 'returned'];

    useEffect(() => {
        fetchOrders();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {

            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { status: statusFilter })
            });


            // const response = await axios.get(`${API_BASE_URL}/admin/orders?${params}`);
            const response = await getFilteredOrders(params)
            setOrders(response.data.orders);
            setTotalOrders(response.data.totalOrders);
            setError(null);

            console.log("ordersssssssssss", response.data.orders);


        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to fetch orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order if same field is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc'); // Default to descending when changing fields
        }
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleStatusModalOpen = (orderId, currentStatus) => {
        setStatusModal({
            open: true,
            orderId,
            currentStatus,
            newStatus: currentStatus
        });
    };

    const handleStatusModalClose = () => {
        setStatusModal({
            open: false,
            orderId: null,
            currentStatus: '',
            newStatus: ''
        });
    };

    const handleStatusChange = async () => {
        if (!statusModal.orderId || statusModal.currentStatus === statusModal.newStatus) {
            handleStatusModalClose();
            return;
        }

        try {
            // await axios.patch(`${API_BASE_URL}/admin/orders/${statusModal.orderId}/status`, {
            //     status: statusModal.newStatus
            // });

            await updateOrderStatusById(statusModal)

            // Update local state to avoid refetching
            // setOrders(orders.map(order =>
            //     order._id === statusModal.orderId
            //         ? { ...order, status: statusModal.newStatus }
            //         : order
            // ));

            fetchOrders()

            handleStatusModalClose();
        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update order status. Please try again.");
        }
    };

    const handleReturnModalOpen = (orderId, productId, userId, amount) => {
        setReturnModal({
            open: true,
            orderId,
            productId,
            userId,
            amount
        });
    };

    const handleReturnModalClose = () => {
        setReturnModal({
            open: false,
            orderId: null,
            productId: null,
            userId: null,
            amount: 0
        });
    };

    const handleReturnVerification = async (approved) => {
        try {
            // await axios.post(`${API_BASE_URL}/admin/orders/${returnModal.orderId}/return-verification`, {
            //     productId: returnModal.productId,
            //     userId: returnModal.userId,
            //     amount: returnModal.amount,
            //     approved
            // });

            await verifyOrderReturn(returnModal, approved)

            // If approved, update status locally
            if (approved) {
                setOrders(orders.map(order =>
                    order._id === returnModal.orderId
                        ? { ...order, status: 'returned' }
                        : order
                ));
            } else {
                // If rejected, revert to delivered status
                setOrders(orders.map(order =>
                    order._id === returnModal.orderId
                        ? { ...order, status: 'delivered' }
                        : order
                ));
            }

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
            day: 'numeric'
        });
    };

    const totalPages = Math.ceil(totalOrders / pageSize);

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

    if (loading && orders.length === 0) {
        return <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>;
    }

    if (error && orders.length === 0) {
        return <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center text-red-500">
            {error}
        </div>;
    }

    console.log("orders", orders);

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Order Management</h1>

                {/* Search and filters */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2"
                        >
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="all">All Statuses</option>
                        {orderStatuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('orderId')}
                            >
                                Order ID
                                {sortBy === 'orderId' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Customer
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('date')}
                            >
                                Date
                                {sortBy === 'date' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('totalAmount')}
                            >
                                Amount
                                {sortBy === 'totalAmount' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                Status
                                {sortBy === 'status' && (
                                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50"
                                    onClick={() => navigate(`/admin/order-details/${order._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.orderId || order._id.slice(-6).toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {order.user?.username || "User"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.user?.email || "No email available"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ₹{order.totalAmount?.toLocaleString('en-IN') || "0.00"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                            {order?.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => window.location.href = `/admin/orders/${order._id}`}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => handleStatusModalOpen(order._id, order.status)}
                                        >
                                            Update Status
                                        </button>
                                        {order.status === 'return requested' && (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={() => handleReturnModalOpen(
                                                    order._id,
                                                    order.products[0]?._id,
                                                    order.user?._id,
                                                    order.totalAmount
                                                )}
                                            >
                                                Verify Return
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                    <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalOrders)}
                    </span>{" "}
                    of <span className="font-medium">{totalOrders}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded p-1 text-sm"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        // Logic for displaying page numbers around current page
                        let pageNumber;
                        if (totalPages <= 5) {
                            pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                            pageNumber = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + idx;
                        } else {
                            pageNumber = currentPage - 2 + idx;
                        }

                        if (pageNumber <= totalPages) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 rounded ${currentPage === pageNumber ? "bg-black text-white" : "bg-gray-100"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Status Update Modal */}
            {statusModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
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
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2  border border-gray-300 rounded hover:bg-gray-50"
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

export default Orders;