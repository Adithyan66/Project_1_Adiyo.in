

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    ArrowLeft,
    Truck,
    Package,
    CheckCircle,
    AlertCircle,
    Clock,
    MapPin,
    Calendar,
    CreditCard,
    Download,
    User,
    Phone,
    Mail,
    RefreshCcw,
    XCircle,
    HelpCircle,
    MessageSquare,
    Copy,
    ChevronDown,
    ChevronUp,
    Share2,
    Hourglass,
    RotateCcw,
    PiggyBank
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductReviewModal from './orderDrtails/ProductReviewModal';
import { cancelOrder, orderDetailsById, returnRequest } from '../../services/orderService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnItems, setReturnItems] = useState([]);
    const [returnReason, setReturnReason] = useState('');
    const [showItemActions, setShowItemActions] = useState({});
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState(null);



    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await orderDetailsById(orderId);
            // const response = await axios.get(`${API_BASE_URL}/user/orders/${orderId}`, {
            //     withCredentials: true
            //});
            const orderData = response.data.order;
            setOrder(orderData);

            if (orderData.orderItems) {
                const items = orderData.orderItems.map(item => ({
                    ...item,
                    selected: false,
                    returnQuantity: 0
                }));
                setReturnItems(items);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError("Failed to load order details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.warning("Please provide a reason for cancellation");
            return;
        }

        setIsSubmitting(true);
        try {
            // const response = await axios.put(`${API_BASE_URL}/user/orders/${orderId}/cancel`,
            //     { reason: cancelReason },
            //     { withCredentials: true }
            // );

            const response = await cancelOrder(orderId, cancelReason);

            if (response.data.success) {
                fetchOrderDetails();
                setShowCancelModal(false);
                toast.success("Order cancelled successfully");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order. Please try again.");
        } finally {
            setIsSubmitting(false);
            fetchOrderDetails();
        }
    };

    const handleReturnRequest = async () => {
        const itemsToReturn = returnItems.filter(item => item.selected && item.returnQuantity > 0);

        if (itemsToReturn.length === 0) {
            toast.error("Please select at least one item to return");
            return;
        }

        if (!returnReason.trim()) {
            toast.error("Please provide a reason for return");
            return;
        }

        setIsSubmitting(true);
        try {

            const items = itemsToReturn.map(item => ({
                productId: item.product._id,
                quantity: item.returnQuantity,
                reason: returnReason
            }))

            await returnRequest(orderId, items, returnReason);

            setShowReturnModal(false);
            toast.success('Return request submitted successfully');
            setReturnReason('');
            setReturnItems(prev => prev.map(item => ({ ...item, selected: false, returnQuantity: 0 })));
        } catch (error) {
            console.error("Error requesting return:", error);
            toast.error("Failed to request return. Please try again.");
        } finally {
            setIsSubmitting(false);
            fetchOrderDetails();
        }
    };

    const toggleItemSelection = (itemId) => {
        setReturnItems(prev =>
            prev.map(item =>
                item._id === itemId
                    ? { ...item, selected: !item.selected, returnQuantity: !item.selected ? 1 : 0 }
                    : item
            )
        );
    };

    const updateReturnQuantity = (itemId, quantity) => {
        setReturnItems(prev =>
            prev.map(item =>
                item._id === itemId && item.selected
                    ? { ...item, returnQuantity: Math.min(Math.max(1, quantity), item.quantity) }
                    : item
            )
        );
    };

    const toggleItemActions = (itemId) => {
        setShowItemActions(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(order.orderId);
        toast.success('Order Id copied to clipboard');
    };

    const downloadInvoice = () => {
        // Placeholder for invoice download
    };

    const canCancelOrder = () => {
        return order.orderStatus === 'placed' ||
            (order.orderStatus === 'processing' &&
                new Date() - new Date(order.createdAt) < 24 * 60 * 60 * 1000);
    };

    const canReturnOrder = () => {
        return order.orderStatus === 'delivered' &&
            new Date() - new Date(order.deliveredAt || order.createdAt) < 7 * 24 * 60 * 60 * 1000;
    };

    // Status component with timeline
    const OrderStatus = ({ status, createdAt, estimatedDeliveryDate }) => {
        const mappedStatus = status === 'placed' ? 'processing' :
            status === 'shipped' ? 'shipped' :
                status === 'delivered' ? 'delivered' :
                    status === 'cancelled' ? 'cancelled' :
                        status === 'returned' ? 'returned' : 'processing';

        const steps = [
            { label: 'Order Placed', date: createdAt, status: 'completed' },
            { label: 'Processing', date: createdAt, status: mappedStatus === 'processing' ? 'current' : (mappedStatus === 'cancelled' || mappedStatus === 'returned' ? 'cancelled' : 'completed') },
            { label: 'Shipped', date: null, status: mappedStatus === 'shipped' ? 'current' : (mappedStatus === 'processing' || mappedStatus === 'cancelled' || mappedStatus === 'returned' ? 'pending' : 'completed') },
            { label: 'Delivered', date: null, status: mappedStatus === 'delivered' ? 'completed' : 'pending' }
        ];

        if (mappedStatus === 'cancelled') {
            steps.push({ label: 'Cancelled', date: order.updatedAt || new Date(), status: 'cancelled' });
        }

        if (mappedStatus === 'returned' || order.returnStatus) {
            steps.push({ label: 'Return Requested', date: order.updatedAt || new Date(), status: 'returned' });
        }

        const getStatusIcon = (stepStatus) => {
            switch (stepStatus) {
                case 'completed':
                    return <CheckCircle size={24} className="text-black" />;
                case 'current':
                    return <Clock size={24} className="text-gray-700" />;
                case 'cancelled':
                    return <AlertCircle size={24} className="text-gray-900" />;
                case 'returned':
                    return <RefreshCcw size={24} className="text-gray-800" />;
                default:
                    return <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>;
            }
        };

        console.log(order);

        return (
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Status</h3>
                <div className="relative">
                    <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-200"></div>
                    {steps.map((step, index) => (
                        <div key={index} className="flex mb-8 relative z-10">
                            <div className="mr-4">
                                {getStatusIcon(step.status)}
                            </div>
                            <div>
                                <div className="font-medium">{step.label}</div>
                                {step.date && (
                                    <div className="text-sm text-gray-500">
                                        {new Date(step.date).toLocaleDateString()} {step.status === 'current' && '- In Progress'}
                                    </div>
                                )}
                                {step.status === 'cancelled' && (
                                    <div className="text-sm text-gray-700">
                                        Your order has been cancelled
                                    </div>
                                )}
                                {step.status === 'returned' && (
                                    <div className="text-sm text-gray-700">
                                        Return in process
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Cancel Order Modal
    const CancelOrderModal = () => (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-xl">
                    <h3 className="text-xl font-medium mb-4">Cancel Order</h3>
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Reason for cancellation
                        </label>
                        <select
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <option value="">Select a reason</option>
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Delivery time too long">Delivery time too long</option>
                            <option value="Other">Other</option>
                        </select>
                        {cancelReason === 'Other' && (
                            <textarea
                                placeholder="Please specify your reason"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                rows="3"
                                onChange={(e) => setCancelReason(e.target.value)}
                            ></textarea>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 focus:outline-none"
                            disabled={isSubmitting}
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                <>Cancel Order</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Return Order Modal
    const ReturnOrderModal = () => (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto border-3 border-gray-200 shadow-2xl">
                <h3 className="text-xl font-medium mb-4">Return Items</h3>
                <p className="text-gray-600 mb-4">
                    Select the items you want to return and provide a reason.
                </p>

                <div className="mb-6">
                    <h4 className="font-medium mb-2">Select Items</h4>
                    <div className="space-y-4">
                        {returnItems.map(item => (
                            <div key={item._id} className="border border-gray-200 rounded-md p-4 hover:border-gray-300">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleItemSelection(item._id)}
                                        className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-500"
                                    />
                                    <div className="flex flex-1 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex items-center justify-center overflow-hidden">
                                            {item.product.colors && item.product.colors.length > 0 ? (
                                                <img
                                                    src={
                                                        item.product.colors.find(c => c.color.toLowerCase() === item.color.toLowerCase())?.images[0] ||
                                                        (item.product.colors[0]?.images[0])
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{item.product.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {item.size && `Size: ${item.size} • `}
                                                {item.color && `Color: ${item.color}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {item.selected && (
                                    <div className="mt-3 pl-7">
                                        <label className="block text-sm mb-1">Quantity to return:</label>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => updateReturnQuantity(item._id, item.returnQuantity - 1)}
                                                className="border border-gray-300 px-3 py-1 rounded-l-md bg-gray-50 hover:bg-gray-100"
                                                disabled={item.returnQuantity <= 1}
                                            >-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.quantity}
                                                value={item.returnQuantity}
                                                onChange={(e) => updateReturnQuantity(item._id, parseInt(e.target.value))}
                                                className="border-t border-b border-gray-300 text-center w-12 py-1 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => updateReturnQuantity(item._id, item.returnQuantity + 1)}
                                                className="border border-gray-300 px-3 py-1 rounded-r-md bg-gray-50 hover:bg-gray-100"
                                                disabled={item.returnQuantity >= item.quantity}
                                            >+</button>
                                            <span className="ml-2 text-sm text-gray-500">of {item.quantity}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Reason for return
                    </label>
                    <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="">Select a reason</option>
                        <option value="Damaged/Defective Product">Damaged/Defective Product</option>
                        <option value="Wrong Item Received">Wrong Item Received</option>
                        <option value="Item Doesn't Match Description">Item Doesn't Match Description</option>
                        <option value="Size/Fit Issue">Size/Fit Issue</option>
                        <option value="Changed Mind">Changed Mind</option>
                        <option value="Other">Other</option>
                    </select>
                    {returnReason === 'Other' && (
                        <textarea
                            placeholder="Please specify your reason"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            rows="3"
                            onChange={(e) => setReturnReason(e.target.value)}
                        ></textarea>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowReturnModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 focus:outline-none"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReturnRequest}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>Submit Return Request</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex-1 p-8 bg-white rounded-lg shadow-sm min-h-[800px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex-1 p-8 bg-white rounded-lg shadow-sm min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-800 mb-4">{error || "Order not found"}</p>
                    <button
                        onClick={() => navigate('/user/orders')}
                        className="bg-black text-white px-4 py-2 rounded-md flex items-center mx-auto hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const StatusBadge = ({ status }) => {
        const mappedStatus =
            status === 'placed' ? 'processing' :
                status === 'pending' ? 'pending' :
                    status === 'shipped' ? 'shipped' :
                        status === 'out for delivery' ? 'out for delivery' :
                            status === 'delivered' ? 'delivered' :
                                status === 'cancelled' ? 'cancelled' :
                                    status === 'return requested' ? 'return requested' :
                                        status === 'returned' ? 'returned' :
                                            status === 'failed' ? 'failed' :
                                                'processing';

        const statusConfig = {
            'pending': {
                color: 'bg-gray-200 text-gray-800',
                icon: <Hourglass size={14} className="mr-1" />
            },
            'processing': {
                color: 'bg-gray-200 text-gray-800',
                icon: <Clock size={14} className="mr-1" />
            },
            'shipped': {
                color: 'bg-gray-300 text-gray-800',
                icon: <Package size={14} className="mr-1" />
            },
            'out for delivery': {
                color: 'bg-gray-300 text-gray-800',
                icon: <Truck size={14} className="mr-1" />
            },
            'delivered': {
                color: 'bg-black text-white',
                icon: <CheckCircle size={14} className="mr-1" />
            },
            'cancelled': {
                color: 'bg-gray-700 text-white',
                icon: <AlertCircle size={14} className="mr-1" />
            },
            'return requested': {
                color: 'bg-gray-500 text-white',
                icon: <RotateCcw size={14} className="mr-1" />
            },
            'returned': {
                color: 'bg-gray-600 text-white',
                icon: <RefreshCcw size={14} className="mr-1" />
            },
        };

        const config = statusConfig[mappedStatus.toLowerCase()] || statusConfig['processing'];

        return (
            <span className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center`}>
                {config.icon}
                {mappedStatus.charAt(0).toUpperCase() + mappedStatus.slice(1)}
            </span>
        );
    };

    return (
        <div className="flex-1 p-8 bg-white rounded-lg shadow-sm min-h-[800px]">
            {showCancelModal && <CancelOrderModal />}
            {showReturnModal && <ReturnOrderModal />}

            {/* Header */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">

                        <div>
                            <div className="flex items-center">
                                <h2 className="text-2xl font-medium">Order #{order.orderId}</h2>
                                <button
                                    onClick={copyOrderId}
                                    className="ml-2 text-gray-500 hover:text-black focus:outline-none"
                                    title="Copy order number"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <StatusBadge status={order.orderStatus} />
                        <div className="flex space-x-2">
                            <button
                                onClick={downloadInvoice}
                                className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-50 focus:outline-none"
                            >
                                <Download size={16} className="mr-2" />
                                Invoice
                            </button>
                            <button
                                className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-50 focus:outline-none"
                                onClick={() => {
                                    navigator.share({
                                        title: `Order #${order.orderNumber}`,
                                        text: `Check out my order #${order.orderNumber}`,
                                        url: window.location.href
                                    }).catch(err => console.log('Share not supported', err));
                                }}
                            >
                                <Share2 size={16} className="mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Action Buttons */}
                {order.orderStatus !== 'cancelled' && (
                    <div className="mt-6 flex flex-wrap gap-3">
                        {canCancelOrder() && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="bg-black text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <XCircle size={16} className="mr-2" />
                                Cancel Order
                            </button>
                        )}

                        {canReturnOrder() && (
                            <button
                                onClick={() => setShowReturnModal(true)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                <RefreshCcw size={16} className="mr-2" />
                                Return Items
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/contact', { state: { subject: `Help with Order #${order.orderNumber}` } })}
                            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-50 focus:outline-none"
                        >
                            <HelpCircle size={16} className="mr-2" />
                            Help with Order
                        </button>

                        {order.orderStatus === 'delivered' && (
                            <button
                                onClick={() => navigate('/product-detail/${order.product._id}', { state: { orderId: order._id } })}
                                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-50 focus:outline-none"
                            >
                                <ShoppingBag size={16} className="mr-2" />
                                Buy Again
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Order Status and Items */}
                <div className="md:col-span-2">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
                        <OrderStatus
                            status={order.orderStatus}
                            createdAt={order.createdAt}
                            estimatedDeliveryDate={order.estimatedDeliveryDate}
                        />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium mb-6">Order Items</h3>
                        <div className="divide-y divide-gray-200">
                            {order.orderItems.map(item => (
                                <div key={item._id} className="py-6 first:pt-0 last:pb-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-24 h-24 md:mr-6 mb-4 md:mb-0 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                                            {item.product && item.product.colors && item.product.colors.length > 0 ? (
                                                <img
                                                    src={
                                                        item.product.colors.find(c => c.color.toLowerCase() === item.color.toLowerCase())?.images[0] ||
                                                        (item.product.colors[0]?.images[0])
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:justify-between">
                                                <div>
                                                    <h4 className="font-medium">
                                                        <a href={`/product/${item.product._id}`} className="hover:underline text-gray-900">{item.product.name}</a>
                                                    </h4>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {item.size && `Size: ${item.size}`}
                                                        {item.color && item.size && ` • `}
                                                        {item.color && `Color: ${item.color}`}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="mt-3 md:mt-0 text-lg font-medium">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="mt-4 relative">
                                                {item.itemStatus && item.itemStatus !== order.orderStatus && (
                                                    <div className="mb-2">
                                                        <StatusBadge status={item.itemStatus} />
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => toggleItemActions(item._id)}
                                                    className="text-sm flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                                                >
                                                    Item Actions
                                                    {showItemActions[item._id] ? (
                                                        <ChevronUp size={16} className="ml-1" />
                                                    ) : (
                                                        <ChevronDown size={16} className="ml-1" />
                                                    )}
                                                </button>

                                                {showItemActions[item._id] && (
                                                    <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => navigate(`/product-detail/${item.product._id}`)}
                                                                className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
                                                            >
                                                                View Product
                                                            </button>
                                                            {order.orderStatus === 'delivered' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedProductForReview(item.product._id);
                                                                            setShowReviewModal(true);
                                                                        }}
                                                                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
                                                                    >
                                                                        Write Review
                                                                    </button>
                                                                    {canReturnOrder() && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setReturnItems(prev => prev.map(i => ({
                                                                                    ...i,
                                                                                    selected: i._id === item._id ? true : false,
                                                                                    returnQuantity: i._id === item._id ? 1 : 0
                                                                                })));
                                                                                setShowReturnModal(true);
                                                                            }}
                                                                            className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
                                                                        >
                                                                            Return Item
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Info, Shipping, Payment */}
                <div className="md:col-span-1">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.subtotal?.toFixed(2) || (order.totalAmount - order.shippingCost - (order.taxAmount || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{order.shippingCost?.toFixed(2) || "0.00"}</span>
                            </div>
                            {order.taxAmount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span>₹{order.taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Shipping</h3>
                            {order.tracking && order.tracking.carrier && (
                                <a
                                    href={order.tracking.url || `https://www.google.com/search?q=${order.tracking.carrier}+${order.tracking.number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Track Package
                                </a>
                            )}
                        </div>

                        <div className="space-y-3">
                            {order.shippingAddress && (
                                <div className="flex">
                                    <MapPin size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <div className="font-medium">{order.shippingAddress?.fullName}</div>
                                        <div className="text-gray-600">
                                            {order.shippingAddress?.address}
                                            {order.shippingAddress?.address.unit && `, ${order.shipping.address.unit}`}<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br />
                                            {order.shippingAddress?.country}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.shippingAddress?.phoneNumber && (
                                <div className="flex">
                                    <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">{order?.shippingAddress?.phoneNumber}</div>
                                </div>
                            )}

                            {order.shippingAddress?.email && (
                                <div className="flex">
                                    <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">{order.shipping.email}</div>
                                </div>
                            )}

                            {order.shippingMethod && (
                                <div className="flex">
                                    <Truck size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <span className="font-medium">{order.shippingMethod}</span>
                                        {order.estimatedDeliveryDate && (
                                            <>
                                                <br />
                                                <span className="text-gray-600">
                                                    Estimated delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {order.tracking && order.tracking.number && (
                                <div className="flex">
                                    <Package size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <div className="font-medium">Tracking Number:</div>
                                        <div className="flex items-center">
                                            <span className="text-gray-600">{order.tracking.number}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(order.tracking.number);
                                                    toast.success('Tracking number copied to clipboard');
                                                }}
                                                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                        {order.tracking.carrier && (
                                            <div className="text-gray-600">Carrier: {order.tracking.carrier}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Payment</h3>
                        <div className="space-y-3">
                            {order.payment && (
                                <>
                                    <div className="flex">
                                        <CreditCard size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <div className="font-medium">{order.payment.method || "Credit Card"}</div>
                                            {order.payment.cardLast4 && (
                                                <div className="text-gray-600">
                                                    {order.payment.cardBrand || ""} •••• {order.payment.cardLast4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {order.payment.billingAddress && (
                                        <div className="flex">
                                            <MapPin size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <div className="font-medium">Billing Address</div>
                                                <div className="text-gray-600">
                                                    {order.payment.billingAddress.street}
                                                    {order.payment.billingAddress.unit && `, ${order.payment.billingAddress.unit}`}<br />
                                                    {order.payment.billingAddress.city}, {order.payment.billingAddress.state} {order.payment.billingAddress.zip}<br />
                                                    {order.payment.billingAddress.country}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex">
                                <Calendar size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium">Order Date</div>
                                    <div className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</div>

                                </div>
                            </div>
                            <div className="flex">
                                <PiggyBank size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="text-gray-600">Payment Method</div>
                                    <div className="text-black">{(order.paymentMethod)}</div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="text-center">
                            <MessageSquare size={24} className="mx-auto mb-2 text-gray-600" />
                            <h3 className="font-medium mb-2">Need help with your order?</h3>
                            <p className="text-sm text-gray-600 mb-4">Our support team is here for you 24/7</p>
                            <button
                                onClick={() => navigate('/contact', { state: { subject: `Help with Order #${order.orderNumber}` } })}
                                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewModal && selectedProductForReview && (
                <ProductReviewModal
                    productId={selectedProductForReview}
                    onClose={() => setShowReviewModal(false)}
                    onReviewSubmit={() => {
                        // Optional: Refresh order details or update UI
                        fetchOrderDetails();
                    }}
                />
            )}
        </div>

    );
};

export default OrderDetails;