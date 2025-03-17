// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     ShoppingBag,
//     ArrowLeft,
//     Truck,
//     Package,
//     CheckCircle,
//     AlertCircle,
//     Clock,
//     MapPin,
//     Calendar,
//     CreditCard,
//     Download,
//     User,
//     Phone,
//     Mail
// } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const OrderDetails = () => {


//     const { orderId } = useParams();
//     const [order, setOrder] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const fetchOrderDetails = async () => {
//         setIsLoading(true);

//         try {
//             console.log(orderId);

//             const response = await axios.get(`${API_BASE_URL}/user/orders/${orderId}`, {
//                 withCredentials: true
//             });
//             setOrder(response.data.order);
//             console.log(response.data.order);

//         } catch (error) {
//             console.error("Error fetching order details:", error);
//             setError("Failed to load order details");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrderDetails();
//     }, [orderId]);

//     // Status component with timeline
//     const OrderStatus = ({ status, orderDate, shippedDate, deliveredDate }) => {
//         const steps = [
//             { label: 'Order Placed', date: orderDate, status: 'completed' },
//             { label: 'Processing', date: orderDate, status: status === 'processing' ? 'current' : (status === 'cancelled' ? 'cancelled' : 'completed') },
//             { label: 'Shipped', date: shippedDate, status: status === 'shipped' ? 'current' : (status === 'processing' || status === 'cancelled' ? 'pending' : 'completed') },
//             { label: 'Delivered', date: deliveredDate, status: status === 'delivered' ? 'completed' : 'pending' }
//         ];

//         if (status === 'cancelled') {
//             steps.push({ label: 'Cancelled', date: order.cancelledDate || new Date(), status: 'cancelled' });
//         }

//         const getStatusIcon = (stepStatus) => {
//             switch (stepStatus) {
//                 case 'completed':
//                     return <CheckCircle size={24} className="text-green-500" />;
//                 case 'current':
//                     return <Clock size={24} className="text-blue-500" />;
//                 case 'cancelled':
//                     return <AlertCircle size={24} className="text-red-500" />;
//                 default:
//                     return <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>;
//             }
//         };

//         return (
//             <div className="mb-8">
//                 <h3 className="text-lg font-medium mb-4">Order Status</h3>
//                 <div className="relative">
//                     {/* Timeline line */}
//                     <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-200"></div>

//                     {/* Timeline steps */}
//                     {steps.map((step, index) => (
//                         <div key={index} className="flex mb-8 relative z-10">
//                             <div className="mr-4">
//                                 {getStatusIcon(step.status)}
//                             </div>
//                             <div>
//                                 <div className="font-medium">{step.label}</div>
//                                 {step.date && (
//                                     <div className="text-sm text-gray-500">
//                                         {new Date(step.date).toLocaleDateString()} {step.status === 'current' && '- In Progress'}
//                                     </div>
//                                 )}
//                                 {step.status === 'cancelled' && (
//                                     <div className="text-sm text-red-500">
//                                         Your order has been cancelled
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     if (isLoading) {
//         return (
//             <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading order details...</p>
//                 </div>
//             </div>
//         );
//     }

//     // if (error || !order) {
//     //     return (
//     //         <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[400px] flex items-center justify-center">
//     //             <div className="text-center">
//     //                 <p className="text-red-500 mb-4">{error || "Order not found"}</p>
//     //                 <button
//     //                     onClick={() => navigate('/user/orders')}
//     //                     className="bg-black text-white px-4 py-2 rounded-lg flex items-center"
//     //                 >
//     //                     <ArrowLeft size={16} className="mr-2" />
//     //                     Back to Orders
//     //                 </button>
//     //             </div>
//     //         </div>
//     //     );
//     // }

//     // Status badge component
//     const StatusBadge = ({ status }) => {
//         const statusConfig = {
//             'processing': { color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} className="mr-1" /> },
//             'shipped': { color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14} className="mr-1" /> },
//             'delivered': { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} className="mr-1" /> },
//             'cancelled': { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} className="mr-1" /> },
//         };

//         const config = statusConfig[status.toLowerCase()] || statusConfig['processing'];

//         return (
//             <span className={`${config.color} px-3 py-1 rounded-full text-xs flex items-center justify-center`}>
//                 {config.icon}
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//             </span>
//         );
//     };

//     return (
//         <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px]">
//             {/* Header */}
//             <div className="bg-gray-50 p-6 rounded-t-md mb-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="flex items-center mb-4 md:mb-0">
//                         <button
//                             onClick={() => navigate('/user/orders')}
//                             className="mr-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100"
//                         >
//                             <ArrowLeft size={18} />
//                         </button>
//                         <div>
//                             {/* <h2 className="text-2xl font-medium">Order #{order.orderNumber}</h2> */}
//                             <div className="text-sm text-gray-500">
//                                 Placed on {new Date(order.orderDate).toLocaleDateString()}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
//                         <StatusBadge status={order.status} />
//                         <button className="border border-black text-black px-4 py-2 rounded-lg flex items-center text-sm">
//                             <Download size={16} className="mr-2" />
//                             Invoice
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Left Column: Order Status and Items */}
//                 <div className="md:col-span-2">
//                     {/* Order Status */}
//                     <div className="bg-white rounded-lg p-6 mb-6 border">
//                         <OrderStatus
//                             status={order.status}
//                             orderDate={order.orderDate}
//                             shippedDate={order.shippedDate}
//                             deliveredDate={order.deliveredDate}
//                         />
//                     </div>

//                     {/* Order Items */}
//                     <div className="bg-white rounded-lg p-6 border">
//                         <h3 className="text-lg font-medium mb-4">Order Items</h3>
//                         <div className="divide-y">
//                             {order.items.map(item => (
//                                 <div key={item.id} className="py-4 first:pt-0 last:pb-0">
//                                     <div className="flex flex-col md:flex-row">
//                                         <div className="w-full md:w-24 h-24 md:mr-6 mb-4 md:mb-0">
//                                             {item.image ? (
//                                                 <img
//                                                     src={item.image}
//                                                     alt={item.productName}
//                                                     className="w-full h-full object-cover rounded-md"
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
//                                                     <Package size={24} className="text-gray-400" />
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="flex-grow">
//                                             <div className="flex flex-col md:flex-row md:justify-between">
//                                                 <div>
//                                                     <h4 className="font-medium">{item.productName}</h4>
//                                                     <div className="text-sm text-gray-500 mt-1">
//                                                         {item.size && `Size: ${item.size} • `}
//                                                         {item.color && `Color: ${item.color}`}
//                                                     </div>
//                                                 </div>
//                                                 <div className="mt-2 md:mt-0 text-right">
//                                                     <div className="font-medium">₹{item.price.toFixed(2)}</div>
//                                                     <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
//                                                 </div>
//                                             </div>
//                                             {order.status === 'delivered' && (
//                                                 <div className="mt-4 flex justify-end">
//                                                     <button className="bg-white border border-gray-300 text-gray-800 px-4 py-1 rounded text-sm hover:bg-gray-50">
//                                                         Write a Review
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column: Order Summary and Customer Info */}
//                 <div className="md:col-span-1">
//                     {/* Order Summary */}
//                     <div className="bg-white rounded-lg p-6 mb-6 border">
//                         <h3 className="text-lg font-medium mb-4">Order Summary</h3>
//                         <div className="space-y-3 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Subtotal</span>
//                                 <span>₹{order.subtotal.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Shipping</span>
//                                 <span>₹{order.shipping.toFixed(2)}</span>
//                             </div>
//                             {order.discount > 0 && (
//                                 <div className="flex justify-between text-green-600">
//                                     <span>Discount</span>
//                                     <span>-₹{order.discount.toFixed(2)}</span>
//                                 </div>
//                             )}
//                             {order.tax > 0 && (
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Tax</span>
//                                     <span>₹{order.tax.toFixed(2)}</span>
//                                 </div>
//                             )}
//                             <div className="pt-3 border-t border-gray-200 mt-3">
//                                 <div className="flex justify-between font-medium text-lg">
//                                     <span>Total</span>
//                                     <span>₹{order.totalAmount.toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Payment Information */}
//                     <div className="bg-white rounded-lg p-6 mb-6 border">
//                         <h3 className="text-lg font-medium mb-3">Payment Information</h3>
//                         <div className="flex items-center mb-3">
//                             <CreditCard size={18} className="mr-2 text-gray-500" />
//                             <span className="font-medium">{order.paymentMethod}</span>
//                         </div>
//                         <div className="text-sm text-gray-500">
//                             {order.paymentMethod === 'Credit Card' ? (
//                                 <>ending in {order.cardLastFour || '****'}</>
//                             ) : (
//                                 <>Status: <span className="text-green-600">Paid</span></>
//                             )}
//                         </div>
//                     </div>

//                     {/* Shipping Information */}
//                     <div className="bg-white rounded-lg p-6 mb-6 border">
//                         <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
//                         <div className="mb-3">
//                             <div className="flex items-center mb-2">
//                                 <User size={16} className="mr-2 text-gray-500" />
//                                 <span className="font-medium">{order.shippingAddress.name}</span>
//                             </div>
//                             <div className="flex items-start">
//                                 <MapPin size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
//                                 <div className="text-sm text-gray-600">
//                                     {order.shippingAddress.street}<br />
//                                     {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
//                                     {order.shippingAddress.country}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex items-center mb-2">
//                             <Phone size={16} className="mr-2 text-gray-500" />
//                             <span className="text-sm text-gray-600">{order.shippingAddress.phone}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <Mail size={16} className="mr-2 text-gray-500" />
//                             <span className="text-sm text-gray-600">{order.shippingAddress.email}</span>

//                             <Mail size={16} className="mr-2 text-gray-500" />
//                             <span className="text-sm text-gray-600">{order.shippingAddress.email}</span>
//                         </div>
//                     </div>

//                     {/* Customer Support */}
//                     <div className="bg-white rounded-lg p-6 border">
//                         <h3 className="text-lg font-medium mb-3">Need Help?</h3>
//                         <p className="text-sm text-gray-600 mb-4">
//                             If you have any questions or concerns about your order, our customer support team is here to help.
//                         </p>
//                         <button
//                             className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
//                             onClick={() => navigate('/contact')}
//                         >
//                             Contact Support
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderDetails;








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
    Mail
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/orders/${orderId}`, {
                withCredentials: true
            });
            setOrder(response.data.order);
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

    // Status component with timeline
    const OrderStatus = ({ status, createdAt, estimatedDeliveryDate }) => {
        // Map the API status values to our component status values
        const mappedStatus = status === 'placed' ? 'processing' :
            status === 'shipped' ? 'shipped' :
                status === 'delivered' ? 'delivered' :
                    status === 'cancelled' ? 'cancelled' : 'processing';

        const steps = [
            { label: 'Order Placed', date: createdAt, status: 'completed' },
            { label: 'Processing', date: createdAt, status: mappedStatus === 'processing' ? 'current' : (mappedStatus === 'cancelled' ? 'cancelled' : 'completed') },
            { label: 'Shipped', date: null, status: mappedStatus === 'shipped' ? 'current' : (mappedStatus === 'processing' || mappedStatus === 'cancelled' ? 'pending' : 'completed') },
            { label: 'Delivered', date: null, status: mappedStatus === 'delivered' ? 'completed' : 'pending' }
        ];

        if (mappedStatus === 'cancelled') {
            steps.push({ label: 'Cancelled', date: order.updatedAt || new Date(), status: 'cancelled' });
        }

        const getStatusIcon = (stepStatus) => {
            switch (stepStatus) {
                case 'completed':
                    return <CheckCircle size={24} className="text-green-500" />;
                case 'current':
                    return <Clock size={24} className="text-blue-500" />;
                case 'cancelled':
                    return <AlertCircle size={24} className="text-red-500" />;
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

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

    // Status badge component
    const StatusBadge = ({ status }) => {
        // Map the API status to our component status
        const mappedStatus = status === 'placed' ? 'processing' :
            status === 'shipped' ? 'shipped' :
                status === 'delivered' ? 'delivered' :
                    status === 'cancelled' ? 'cancelled' : 'processing';

        const statusConfig = {
            'processing': { color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} className="mr-1" /> },
            'shipped': { color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14} className="mr-1" /> },
            'delivered': { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} className="mr-1" /> },
            'cancelled': { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} className="mr-1" /> },
        };

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
                            <h2 className="text-2xl font-medium">Order #{order.orderNumber}</h2>
                            <div className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <StatusBadge status={order.orderStatus} />
                        <button className="border border-black text-black px-4 py-2 rounded-lg flex items-center text-sm">
                            <Download size={16} className="mr-2" />
                            Invoice
                        </button>
                    </div>
                </div>
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
                                            {item.product?.image ? (
                                                <img
                                                    src={item.product.image}
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
                                                    <h4 className="font-medium">{item.product.name}</h4>
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
                                            {order.orderStatus === 'delivered' && (
                                                <div className="mt-4 flex justify-end">
                                                    <button className="bg-white border border-gray-300 text-gray-800 px-4 py-1 rounded text-sm hover:bg-gray-50">
                                                        Write a Review
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary and Customer Info */}
                <div className="md:col-span-1">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{order.shippingFee.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            {order.tax > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span>₹{order.tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-200 mt-3">
                                <div className="flex justify-between font-medium text-lg">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-3">Payment Information</h3>
                        <div className="flex items-center mb-3">
                            <CreditCard size={18} className="mr-2 text-gray-500" />
                            <span className="font-medium">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Status: <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg p-6 mb-6 border">
                        <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
                        <div className="mb-3">
                            <div className="flex items-center mb-2">
                                <User size={16} className="mr-2 text-gray-500" />
                                <span className="font-medium">{order.shippingAddress.fullName}</span>
                            </div>
                            <div className="flex items-start">
                                <MapPin size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                                <div className="text-gray-600">
                                    {order.shippingAddress.address},
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode},
                                    {order.shippingAddress.country}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mb-2">
                            <Phone size={16} className="mr-2 text-gray-500" />
                            <div className="text-gray-600">{order.shippingAddress.phone}</div>
                        </div>
                        <div className="flex items-center">
                            <Mail size={16} className="mr-2 text-gray-500" />
                            <div className="text-gray-600">{order.shippingAddress.email}</div>
                        </div>
                    </div>

                    {/* Estimated Delivery */}
                    {order.orderStatus !== 'cancelled' && (
                        <div className="bg-white rounded-lg p-6 border">
                            <h3 className="text-lg font-medium mb-3">Estimated Delivery</h3>
                            <div className="flex items-center">
                                <Calendar size={18} className="mr-2 text-gray-500" />
                                <span>
                                    {order.estimatedDeliveryDate
                                        ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                                        : 'To be determined'}
                                </span>
                            </div>
                            {order.orderStatus === 'shipped' && order.trackingNumber && (
                                <div className="mt-3">
                                    <div className="text-sm text-gray-600 mb-1">Tracking Number:</div>
                                    <div className="flex items-center">
                                        <Truck size={16} className="mr-2 text-gray-500" />
                                        <span className="font-medium">{order.trackingNumber}</span>
                                    </div>
                                    <button className="mt-3 w-full bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                                        Track Order
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Need Help */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 mb-2">Need help with your order?</p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="text-black underline text-sm font-medium hover:text-gray-700"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;