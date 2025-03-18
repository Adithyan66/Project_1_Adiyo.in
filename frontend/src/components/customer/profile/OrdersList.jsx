





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Search, FileText, Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/orders`, {
                withCredentials: true
            });
            console.log(response.data);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            processing: { color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} className="mr-1" /> },
            shipped: { color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14} className="mr-1" /> },
            delivered: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} className="mr-1" /> },
            cancelled: { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} className="mr-1" /> },
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig['processing'];
        return (
            <span className={`${config.color} px-3 py-1 rounded-full text-xs flex items-center justify-center w-fit`}>
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Filter orders by orderNumber and product name in orderItems, and by orderStatus.
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderItems.some(item =>
                item.product && item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesFilter = statusFilter === 'all' || order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return (
            <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">
            {/* Header */}
            <div className="bg-gray-50 p-6 rounded-t-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingBag className="mr-3" size={24} />
                        <h2 className="text-2xl font-medium">My Orders</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-3 py-1 rounded-full">
                            {orders.length} orders
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select
                            className="border rounded-lg px-3 py-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Orders</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
                <div className="divide-y">
                    {filteredOrders.map(order => (
                        <div
                            key={order.orderNumber}
                            className="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                            onClick={() => navigate(`/user/orders/${order._id}`)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center mb-2">
                                        <FileText size={16} className="mr-2 text-gray-500" />
                                        <span className="font-medium">Order #{order.orderNumber}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                                    <StatusBadge status={order.orderStatus} />
                                    <div className="text-gray-900 font-medium">₹{order.totalAmount.toFixed(2)}</div>
                                    <ChevronRight size={20} className="text-gray-400 hidden md:block" />
                                </div>
                            </div>

                            {/* Preview of items - show first three orderItems */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {order.orderItems.slice(0, 3).map(item => (
                                    <div key={item._id} className="flex items-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                                            {/* {item.product && item.product.image ? (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <Package size={24} className="text-gray-400" />
                                                </div>
                                            )} */}

                                            {item.product && item.product.colors && item.product.colors.length > 0 ? (
                                                <img
                                                    src={
                                                        // Find the color that matches the order item color, then use the first image
                                                        item.product.colors.find(c => c.color.toLowerCase() === item.color.toLowerCase())?.images[0] ||
                                                        // Fallback to first color's first image if color not found
                                                        (item.product.colors[0]?.images[0])
                                                    }
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <Package size={24} className="text-gray-400" />
                                                </div>
                                            )}


                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">
                                                {item.product ? item.product.name : 'Unknown Product'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Qty: {item.quantity} • ₹{item.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {order.orderItems.length > 3 && (
                                    <div className="flex items-center text-blue-600">
                                        <span>+{order.orderItems.length - 3} more items</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                    <p className="text-xl text-gray-500 mb-2">No orders found</p>
                    <p className="text-gray-400 mb-6">
                        {searchTerm || statusFilter !== 'all'
                            ? "Try adjusting your filters to see more results."
                            : "Looks like you haven't placed any orders yet."}
                    </p>
                    <button
                        onClick={() => window.location.href = '/collections'}
                        className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium"
                    >
                        Browse Collections
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
