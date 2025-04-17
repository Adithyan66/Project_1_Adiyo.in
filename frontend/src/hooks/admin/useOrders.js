import { useState, useEffect } from 'react';
import { getFilteredOrders, updateOrderStatusById, verifyOrderReturn } from '../../services/orderService';

// Custom hook for Orders component logic
const useOrders = () => {
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
        newStatus: '',
    });

    const [returnModal, setReturnModal] = useState({
        open: false,
        orderId: null,
        productId: null,
        userId: null,
        amount: 0,
    });

    const orderStatuses = [
        'placed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'pending',
        'out for delivery',
        'return requested',
    ];

    useEffect(() => {
        fetchOrders();
    }, [currentPage, pageSize, searchTerm, sortBy, sortOrder, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const filterObj = {
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                search: searchTerm,
                status: statusFilter,
            };

            const response = await getFilteredOrders(filterObj);
            setOrders(response.data.orders);
            setTotalOrders(response.data.totalOrders);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders. Please try again later.');
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
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const handleStatusModalOpen = (orderId, currentStatus) => {
        setStatusModal({
            open: true,
            orderId,
            currentStatus,
            newStatus: currentStatus,
        });
    };

    const handleStatusModalClose = () => {
        setStatusModal({
            open: false,
            orderId: null,
            currentStatus: '',
            newStatus: '',
        });
    };

    const handleStatusChange = async () => {
        if (!statusModal.orderId || statusModal.currentStatus === statusModal.newStatus) {
            handleStatusModalClose();
            return;
        }

        try {
            await updateOrderStatusById(statusModal);
            fetchOrders();
            handleStatusModalClose();
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status. Please try again.');
        }
    };

    const handleReturnModalOpen = (orderId, productId, userId, amount) => {
        setReturnModal({
            open: true,
            orderId,
            productId,
            userId,
            amount,
        });
    };

    const handleReturnModalClose = () => {
        setReturnModal({
            open: false,
            orderId: null,
            productId: null,
            userId: null,
            amount: 0,
        });
    };

    const handleReturnVerification = async (approved) => {
        try {
            await verifyOrderReturn(returnModal, approved);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === returnModal.orderId
                        ? { ...order, status: approved ? 'returned' : 'delivered' }
                        : order
                )
            );
            handleReturnModalClose();
        } catch (err) {
            console.error('Error processing return verification:', err);
            setError('Failed to process return verification. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    return {
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
    };
};

export default useOrders;