import { useState, useEffect } from 'react';
import { getOrderDetails, updateOrderStatus, verifyReturnRequest } from '../../services/orderService';

// Custom hook for OrderDetails component logic
const useOrderDetails = (orderId) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusModal, setStatusModal] = useState({
        open: false,
        currentStatus: '',
        newStatus: '',
        note: '',
    });

    const [returnModal, setReturnModal] = useState({
        open: false,
        productId: null,
        userId: null,
        amount: 0,
    });

    const orderStatuses = [
        'pending',
        'shipped',
        'out for delivery',
        'delivered',
        'cancelled',
        'return requested',
        'returned',
    ];

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await getOrderDetails(orderId);
            setOrder(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusModalOpen = () => {
        if (!order) return;
        setStatusModal({
            open: true,
            currentStatus: order.status,
            newStatus: order.status,
            note: '',
        });
    };

    const handleStatusModalClose = () => {
        setStatusModal({
            open: false,
            currentStatus: '',
            newStatus: '',
            note: '',
        });
    };

    const handleStatusChange = async () => {
        if (!order || statusModal.currentStatus === statusModal.newStatus) {
            handleStatusModalClose();
            return;
        }
        try {
            await updateOrderStatus(orderId, statusModal);
            handleStatusModalClose();
            fetchOrderDetails();
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status. Please try again.');
        }
    };

    const handleReturnModalOpen = (productId) => {
        if (!order) return;
        setReturnModal({
            open: true,
            productId,
            userId: order.user?._id,
            amount: order.totalAmount,
        });
    };

    const handleReturnModalClose = () => {
        setReturnModal({
            open: false,
            productId: null,
            userId: null,
            amount: 0,
        });
    };

    const handleReturnVerification = async (approved) => {
        try {
            await verifyReturnRequest(orderId, order, approved);
            setOrder({
                ...order,
                status: approved ? 'returned' : 'delivered',
            });
            handleReturnModalClose();
            fetchOrderDetails();
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
            hour: '2-digit',
            minute: '2-digit',
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
    };
};

export default useOrderDetails;