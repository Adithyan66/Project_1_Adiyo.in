

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
    RotateCcw
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const navigate = useNavigate();



    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/orders/${orderId}`, {
                withCredentials: true
            });

            const orderData = response.data.order;

            // const hasReturnedItems = orderData.orderItems &&
            //     orderData.orderItems.some(item => item.returnStatus && item.returnStatus !== 'none');

            // if (hasReturnedItems && !orderData.returnStatus) {
            //     orderData.returnStatus = 'processing';
            // }

            // if (orderData.returnStatus && orderData.returnStatus !== 'none') {
            //     orderData.orderStatus = 'returned';
            // }

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
            const response = await axios.put(`${API_BASE_URL}/user/orders/${orderId}/cancel`,
                { reason: cancelReason },
                { withCredentials: true }
            );

            if (response.data.success) {

                fetchOrderDetails()
                setShowCancelModal(false);
                toast.success("order cancelled succesfully")
            }



        } catch (error) {

            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order. Please try again.");

        } finally {

            setIsSubmitting(false);
            fetchOrderDetails()
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
            await axios.post(`${API_BASE_URL}/user/orders/${orderId}/return`,
                {
                    items: itemsToReturn.map(item => ({
                        productId: item.product._id,
                        quantity: item.returnQuantity,
                        reason: returnReason
                    })),
                    reason: returnReason
                },
                { withCredentials: true }
            );

            setShowReturnModal(false);
            toast.success('Return request submitted successfully');

            // Reset return form
            setReturnReason('');
            setReturnItems(prev => prev.map(item => ({ ...item, selected: false, returnQuantity: 0 })));



        } catch (error) {
            console.error("Error requesting return:", error);
            toast.error("Failed to request return. Please try again.");
        } finally {
            setIsSubmitting(false);
            fetchOrderDetails()
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
        navigator.clipboard.writeText(order.orderNumber);
        toast.success('Order number copied to clipboard');
    };

    const downloadInvoice = () => {

    };

    const canCancelOrder = () => {
        // Allow cancellation if order is in processing state and was placed within the last 24 hours
        return order.orderStatus === 'placed' ||
            (order.orderStatus === 'processing' &&
                new Date() - new Date(order.createdAt) < 24 * 60 * 60 * 1000);
    };

    const canReturnOrder = () => {
        // Allow returns if order is delivered and within return window (e.g., 7 days)
        return order.orderStatus === 'delivered' &&
            new Date() - new Date(order.deliveredAt || order.createdAt) < 7 * 24 * 60 * 60 * 1000;
    };




    // Status component with timeline
    const OrderStatus = ({ status, createdAt, estimatedDeliveryDate }) => {
        // Map the API status values to our component status values
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
                    return <CheckCircle size={24} className="text-green-500" />;
                case 'current':
                    return <Clock size={24} className="text-blue-500" />;
                case 'cancelled':
                    return <AlertCircle size={24} className="text-black" />;
                case 'returned':
                    return <RefreshCcw size={24} className="text-orange-500" />;
                default:
                    return <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>;
            }
        };

        return (
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Status</h3>
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-200"></div>

                    {/* Timeline steps */}
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
                                    <div className="text-sm text-red-500">
                                        Your order has been cancelled
                                    </div>
                                )}
                                {step.status === 'returned' && (
                                    <div className="text-sm text-orange-500">
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
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounde-4d-lg p-6 w-full max-w-md border-4 border-black ">
                <h3 className="text-lg font-medium mb-4">Cancel Order</h3>
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
                        className="w-full border border-gray-300 rounded px-3 py-2"
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
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                            rows="3"
                            onChange={(e) => setCancelReason(e.target.value)}
                        ></textarea>
                    )}
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowCancelModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={handleCancelOrder}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 flex items-center"
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
    );

    // Return Order Modal
    const ReturnOrderModal = () => (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto border-4 border-black">
                <h3 className="text-lg font-medium mb-4">Return Items</h3>
                <p className="text-gray-600 mb-4">
                    Select the items you want to return and provide a reason.
                </p>

                <div className="mb-6">
                    <h4 className="font-medium mb-2">Select Items</h4>
                    <div className="space-y-4">
                        {returnItems.map(item => (
                            <div key={item._id} className="border rounded p-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleItemSelection(item._id)}
                                        className="mr-3 h-4 w-4"
                                    />
                                    <div className="flex flex-1 items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded mr-3">
                                            {item.product.colors && item.product.colors.length > 0 ? (
                                                <img
                                                    src={
                                                        item.product.colors.find(c => c.color.toLowerCase() === item.color.toLowerCase())?.images[0] ||
                                                        (item.product.colors[0]?.images[0])
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={20} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{item.product.name}</div>
                                            <div className="text-xs text-gray-500">
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
                                                className="border border-gray-300 px-2 py-1 rounded-l"
                                                disabled={item.returnQuantity <= 1}
                                            >-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.quantity}
                                                value={item.returnQuantity}
                                                onChange={(e) => updateReturnQuantity(item._id, parseInt(e.target.value))}
                                                className="border-t border-b border-gray-300 text-center w-12 py-1"
                                            />
                                            <button
                                                onClick={() => updateReturnQuantity(item._id, item.returnQuantity + 1)}
                                                className="border border-gray-300 px-2 py-1 rounded-r"
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
                        className="w-full border border-gray-300 rounded px-3 py-2"
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
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                            rows="3"
                            onChange={(e) => setReturnReason(e.target.value)}
                        ></textarea>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowReturnModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReturnRequest}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center"
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

    // Success message component
    const SuccessMessage = ({ message }) => (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out">
            <div className="flex">
                <CheckCircle size={20} className="mr-2" />
                <p>{message}</p>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || "Order not found"}</p>
                    <button
                        onClick={() => navigate('/user/orders')}
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const StatusBadge = ({ status }) => {
        // Map the API status to our component status
        const mappedStatus =
            status === 'placed' ? 'processing' :
                status === 'pending' ? 'pending' :
                    status === 'shipped' ? 'shipped' :
                        status === 'out for delivery' ? 'out for delivery' :
                            status === 'delivered' ? 'delivered' :
                                status === 'cancelled' ? 'cancelled' :
                                    status === 'return requested' ? 'return requested' :
                                        status === 'returned' ? 'returned' :
                                            'processing';

        const statusConfig = {
            'pending': {
                color: 'bg-gray-100 text-gray-700',
                icon: <Hourglass size={14} className="mr-1" />
            },
            'processing': {
                color: 'bg-blue-100 text-blue-700',
                icon: <Clock size={14} className="mr-1" />
            },
            'shipped': {
                color: 'bg-yellow-100 text-yellow-700',
                icon: <Package size={14} className="mr-1" />
            },
            'out for delivery': {
                color: 'bg-indigo-100 text-indigo-700',
                icon: <Truck size={14} className="mr-1" />
            },
            'delivered': {
                color: 'bg-green-100 text-green-700',
                icon: <CheckCircle size={14} className="mr-1" />
            },
            'cancelled': {
                color: 'bg-red-100 text-red-700',
                icon: <AlertCircle size={14} className="mr-1" />
            },
            'return requested': {
                color: 'bg-purple-100 text-purple-700',
                icon: <RotateCcw size={14} className="mr-1" />
            },
            'returned': {
                color: 'bg-orange-100 text-orange-700',
                icon: <RefreshCcw size={14} className="mr-1" />
            },
        };

        // Fallback to "processing" if the mapped status is not found in the config
        const config = statusConfig[mappedStatus.toLowerCase()] || statusConfig['processing'];

        return (
            <span className={`${config.color} px-3 py-1 rounded-full text-xs flex items-center justify-center`}>
                {config.icon}
                {mappedStatus.charAt(0).toUpperCase() + mappedStatus.slice(1)}
            </span>
        );
    };

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">

            {/* Cancel Order Modal */}
            {showCancelModal && <CancelOrderModal />}

            {/* Return Order Modal */}
            {showReturnModal && <ReturnOrderModal />}

            {/* Header */}
            <div className="bg-gray-50 p-6 rounded-t-md mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <button
                            onClick={() => navigate('/user/orders')}
                            className="mr-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center">
                                <h2 className="text-2xl font-medium">Order #{order.orderNumber}</h2>
                                <button
                                    onClick={copyOrderId}
                                    className="ml-2 text-gray-500 hover:text-gray-700"
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
                                className="border border-black text-black px-4 py-2 rounded-lg flex items-center text-sm"
                            >
                                <Download size={16} className="mr-2" />
                                Invoice
                            </button>
                            <div className="relative inline-block">
                                <button
                                    className="border border-black text-black px-4 py-2 rounded-lg flex items-center text-sm"
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
                </div>

                {/* Order Action Buttons */}
                {order.orderStatus !== 'cancelled' && (
                    <div className="mt-6 flex flex-wrap gap-3">
                        {canCancelOrder() && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="bg-black text-white px-4 py-2 rounded-lg flex items-center text-sm hover:bg-gray-700"
                            >
                                <XCircle size={16} className="mr-2" />
                                Cancel Order
                            </button>
                        )}

                        {canReturnOrder() && (
                            <button
                                onClick={() => setShowReturnModal(true)}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center text-sm hover:bg-gray-900"
                            >
                                <RefreshCcw size={16} className="mr-2" />
                                Return Items
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/contact', { state: { subject: `Help with Order #${order.orderNumber}` } })}
                            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm hover:bg-gray-50"
                        >
                            <HelpCircle size={16} className="mr-2" />
                            Help with Order
                        </button>

                        {order.orderStatus === 'delivered' && (
                            <button
                                onClick={() => navigate('/user/order-again', { state: { orderId: order._id } })}
                                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center text-sm hover:bg-gray-50"
                            >
                                <ShoppingBag size={16} className="mr-2" />
                                Buy Again
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Order Status and Items */}
                <div className="md:col-span-2">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <OrderStatus
                            status={order.orderStatus}
                            createdAt={order.createdAt}
                            estimatedDeliveryDate={order.estimatedDeliveryDate}
                        />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-lg font-medium mb-4">Order Items</h3>
                        <div className="divide-y">
                            {order.orderItems.map(item => (
                                <div key={item._id} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-24 h-24 md:mr-6 mb-4 md:mb-0">
                                            {item.product && item.product.colors && item.product.colors.length > 0 ? (
                                                <img
                                                    src={
                                                        item.product.colors.find(c => c.color.toLowerCase() === item.color.toLowerCase())?.images[0] ||
                                                        (item.product.colors[0]?.images[0])
                                                    }
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                                                    <Package size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:justify-between">
                                                <div>
                                                    <h4 className="font-medium">
                                                        <a href={`/product/${item.product._id}`} className="hover:underline">{item.product.name}</a>
                                                    </h4>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {item.size && `Size: ${item.size} • `}
                                                        {item.color && `Color: ${item.color}`}
                                                    </div>
                                                </div>
                                                <div className="mt-2 md:mt-0 text-right">
                                                    <div className="font-medium">₹{item.discountedPrice.toFixed(2)}</div>
                                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <button
                                                    onClick={() => toggleItemActions(item._id)}
                                                    className="text-sm text-gray-600 flex items-center hover:text-gray-900"
                                                >
                                                    Item actions
                                                    {showItemActions[item._id] ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                    }
                                                </button>

                                                {showItemActions[item._id] && (
                                                    <div className="mt-2 space-y-2">
                                                        {order.orderStatus === 'delivered' && (
                                                            <button
                                                                onClick={() => navigate(`/product/${item.product._id}/review`)}
                                                                className="text-sm text-gray-600 hover:text-black block"
                                                            >
                                                                Write a review
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(`/product/${item.product._id}`)}
                                                            className="text-sm text-gray-600 hover:text-black block"
                                                        >
                                                            View product details
                                                        </button>
                                                        {order.orderStatus === 'delivered' && (
                                                            <button
                                                                onClick={() => {
                                                                    setReturnItems(prev =>
                                                                        prev.map(rItem =>
                                                                            rItem._id === item._id
                                                                                ? { ...rItem, selected: true, returnQuantity: 1 }
                                                                                : rItem
                                                                        )
                                                                    );
                                                                    setShowReturnModal(true);
                                                                }}
                                                                className="text-sm text-gray-600 hover:text-black block"
                                                            >
                                                                Return this item
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate('/contact', {
                                                                state: {
                                                                    subject: `Question about item in Order #${order.orderNumber}`,
                                                                    body: `Product: ${item.product.name}\nSKU: ${item.product.sku || 'N/A'}`
                                                                }
                                                            })}
                                                            className="text-sm text-gray-600 hover:text-black block"
                                                        >
                                                            Ask a question
                                                        </button>
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

                {/* Right Column: Order Summary and Details */}
                <div className="md:col-span-1">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                {/* <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost.toFixed(2)}`}</span> */}
                                <span>{order.shippingCost ? `₹${order.shippingCost.toFixed(2)}` : 'Free'}</span>

                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-green-600">-₹{order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span>₹{order.taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                        <div className="mb-4">
                            <div className="flex items-start">
                                <MapPin size={18} className="mr-2 text-gray-500 mt-0.5" />
                                <div>
                                    <div className="font-medium">{order.shippingAddress.fullName}</div>
                                    <div className="text-gray-600">
                                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center">
                                <Phone size={18} className="mr-2 text-gray-500" />
                                <div>{order.shippingAddress.phoneNumber}</div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex items-center">
                                <Mail size={18} className="mr-2 text-gray-500" />
                                <div>{order.user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                        <div className="flex items-center">
                            <CreditCard size={18} className="mr-2 text-gray-500" />
                            <div>
                                {order.paymentMethod === 'cod'
                                    ? 'Cash on Delivery'
                                    : order.paymentMethod === 'card'
                                        ? `Credit/Debit Card (ending in ${order.paymentDetails?.last4 || '****'})`
                                        : 'Online Payment'}
                            </div>
                        </div>
                    </div>

                    {/* Need Help? */}
                    <div className="bg-gray-100 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                        <p className="text-gray-600 mb-4">
                            If you need any assistance with your order, our customer service team is here to help.
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/contact', { state: { subject: `Help with Order #${order.orderNumber}` } })}
                                className="w-full bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-800"
                            >
                                <MessageSquare size={16} className="mr-2" />
                                Contact Support
                            </button>
                            <button
                                onClick={() => navigate('/faq')}
                                className="w-full border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-50"
                            >
                                <HelpCircle size={16} className="mr-2" />
                                View FAQs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;