

import React from 'react';
import { useNavigate } from 'react-router';
import { PulseRingLoader } from '../../common/loading/Spinner';
import useOrders from '../../../hooks/admin/useOrders';
import AdminPagination from '../../common/pagination/adminPagination';
import DataTable from '../../common/adminTable/DataTable';
import ErrorModal from '../../common/error/ErrorModal';
import GenericHeaderSection from '../../common/adminTable/GenericHeaderSection';

// Orders Component
const Orders = () => {
    const navigate = useNavigate();
    const {
        orders,
        loading,
        error,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalOrders,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        statusFilter,
        setStatusFilter,
        statusModal,
        setStatusModal,
        returnModal,
        setReturnModal,
        orderStatuses,
        handleSearch,
        clearSearch,
        handleSort,
        handleStatusModalOpen,
        handleStatusModalClose,
        handleStatusChange,
        handleReturnModalOpen,
        handleReturnModalClose,
        handleReturnVerification,
        formatDate,
        getStatusBadgeClass,
    } = useOrders();

    // Map orderStatuses to filterOptions
    const filterOptions = [
        { value: 'all', label: 'All Statuses' },
        ...orderStatuses.map((status) => ({
            value: status,
            label: status.charAt(0).toUpperCase() + status.slice(1),
        })),
    ];

    const columns = [
        {
            header: 'Order ID',
            field: 'orderId',
            sortable: true,
            render: (order) => order.orderId || order._id.slice(-6).toUpperCase(),
        },
        {
            header: 'Customer',
            field: 'user',
            render: (order) => (
                <div>
                    <div className="text-sm text-gray-900">{order.user?.username || 'User'}</div>
                    <div className="text-xs text-gray-500">{order.user?.email || 'No email available'}</div>
                </div>
            ),
        },
        {
            header: 'Date',
            field: 'createdAt',
            sortable: true,
            render: (order) => formatDate(order.createdAt),
        },
        {
            header: 'Amount',
            field: 'totalAmount',
            sortable: true,
            render: (order) => `₹${order.totalAmount?.toLocaleString('en-IN') || '0.00'}`,
        },
        {
            header: 'Status',
            field: 'status',
            sortable: true,
            render: (order) => (
                <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        order.status
                    )}`}
                >
                    {order.orderStatus || order.status || 'Pending'}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: 'Update Status',
            className: 'text-blue-600 hover:text-blue-900',
            handler: (order) => handleStatusModalOpen(order._id, order.status),
        },
        {
            label: 'Verify Return',
            className: 'text-green-600 hover:text-green-900',
            handler: (order) =>
                handleReturnModalOpen(order._id, order.products[0]?._id, order.user?._id, order.totalAmount),
            condition: (order) => order.status === 'return requested',
        },
    ];

    // Error state: show only ErrorModal
    if (error && orders.length === 0) {
        return <ErrorModal isOpen={true} message={error} onClose={() => navigate(-1)} />;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* GenericHeaderSection */}
            <GenericHeaderSection
                title="Order Management"
                searchPlaceholder="Search by Order ID"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                filterValue={statusFilter}
                setFilterValue={setStatusFilter}
                setCurrentPage={setCurrentPage}
                filterOptions={filterOptions}
            />

            {/* Loading state: show only PulseRingLoader */}
            {loading && orders.length === 0 ? (
                <PulseRingLoader />
            ) : (
                <>
                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={orders}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        onRowClick={(order) => navigate(`/admin/order-details/${order._id}`)}
                        actions={actions}
                    />

                    {/* Pagination */}
                    <AdminPagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalItems={totalOrders}
                        pageSizeOptions={[10, 20, 50]}
                    />
                </>
            )}

            {/* Status Update Modal */}
            {statusModal.open && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded p-6 w-96 shadow-2xl">
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
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
                    <div className="bg-white rounded p-6 w-96 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Verify Return Request</h2>
                        <p className="mb-4">
                            Approve this return request? The customer will be refunded ₹
                            {returnModal.amount?.toLocaleString('en-IN') || '0.00'} to their wallet.
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