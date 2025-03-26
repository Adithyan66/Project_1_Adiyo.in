import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SalesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State for sales details
    const [saleDetails, setSaleDetails] = useState({
        loading: true,
        error: null,
        data: null
    });

    // Generate dummy sale details based on the ID
    const generateSaleDetails = (saleId) => {
        return {
            _id: saleId,
            orderId: `ORD-${saleId.replace('SR', '')}`,
            customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
            customerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`,
            date: new Date().toISOString(),
            totalAmount: Math.floor(Math.random() * 10000) + 1000,
            discounts: Math.floor(Math.random() * 500),
            status: ['completed', 'pending', 'processing'][Math.floor(Math.random() * 3)],
            items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
                name: `Product ${index + 1}`,
                quantity: Math.floor(Math.random() * 5) + 1,
                price: Math.floor(Math.random() * 1000) + 100
            })),
            paymentMethod: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 4)],
            shippingAddress: {
                street: `${Math.floor(Math.random() * 1000)} Main St`,
                city: 'Example City',
                state: 'Example State',
                zipCode: Math.floor(Math.random() * 90000) + 10000,
                country: 'Example Country'
            }
        };
    };

    // Simulate data fetching
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            try {
                const details = generateSaleDetails(id);
                setSaleDetails({
                    loading: false,
                    error: null,
                    data: details
                });
            } catch (error) {
                setSaleDetails({
                    loading: false,
                    error: 'Failed to fetch sale details',
                    data: null
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [id]);

    // Formatting utility functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Loading state
    if (saleDetails.loading) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    // Error state
    if (saleDetails.error) {
        return (
            <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center text-red-500">
                {saleDetails.error}
            </div>
        );
    }

    const { data } = saleDetails;

    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                    <p className="text-gray-600">Order ID: {data.orderId}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                    Back to Sales Report
                </button>
            </div>

            {/* Order Status */}
            <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(data.status)}`}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
            </div>

            {/* Order Summary Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {data.customerName}</p>
                        <p><strong>Email:</strong> {data.customerEmail}</p>
                        <p><strong>Order Date:</strong> {formatDate(data.date)}</p>
                        <p><strong>Payment Method:</strong> {data.paymentMethod}</p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="space-y-2">
                        <p>{data.shippingAddress.street}</p>
                        <p>{data.shippingAddress.city}, {data.shippingAddress.state}</p>
                        <p>{data.shippingAddress.zipCode}</p>
                        <p>{data.shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Product</th>
                            <th className="text-right py-2">Quantity</th>
                            <th className="text-right py-2">Price</th>
                            <th className="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2">{item.name}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">₹{item.price.toLocaleString('en-IN')}</td>
                                <td className="text-right py-2">₹{(item.quantity * item.price).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="text-right py-2 font-semibold">Subtotal:</td>
                            <td className="text-right py-2">₹{data.totalAmount.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="text-right py-2 font-semibold text-green-600">Discounts:</td>
                            <td className="text-right py-2 text-green-600">-₹{data.discounts.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="text-right py-2 text-xl font-bold">Total:</td>
                            <td className="text-right py-2 text-xl font-bold">₹{(data.totalAmount - data.discounts).toLocaleString('en-IN')}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default SalesDetails;