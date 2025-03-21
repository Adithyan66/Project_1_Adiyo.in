


import React from 'react';
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CartOrderConfirmation = () => {

    const navigate = useNavigate()
    const orderDetails = useSelector((state) => state.cartCheckout.confirmationData);
    console.log("orderdetails", orderDetails);


    if (!orderDetails) return null;

    const {
        orderNumber,
        totalAmount,
        shippingAddress,
        paymentMethod,
        orderItems,
        createdAt,
        estimatedDeliveryDate,
        subtotal,
        shippingFee,
        tax,
        discount,
        couponCode,
        paymentStatus
    } = orderDetails;

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const orderDate = formatDate(createdAt);
    const deliveryDate = formatDate(estimatedDeliveryDate);

    const generateInvoicePDF = () => {
        const doc = new jsPDF();

        // Add logo/header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 105, 20, { align: 'center' });

        // Add invoice details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(`Order Number: ${orderNumber}`, 14, 30);
        doc.text(`Date: ${orderDate}`, 14, 35);
        doc.text(`Payment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}`, 14, 40);
        doc.text(`Payment Status: ${paymentStatus}`, 14, 45);

        // Add customer details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Details', 14, 55);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text([
            `${shippingAddress.fullName}`,
            `${shippingAddress.address}`,
            `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}`,
            `${shippingAddress.country}`,
            `Phone: ${shippingAddress.phoneNumber}`
        ], 14, 60);

        // Add item details in table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Order Items', 14, 90);

        const tableColumn = ["Item", "Color", "Size", "Qty", "Price", "Total"];
        const tableRows = [];

        orderItems.forEach(item => {
            const itemData = [
                `Product ID: ${item.product.substring(0, 8)}...`,
                item.color || '-',
                item.size || '-',
                item.quantity,
                `₹${item.discountedPrice.toFixed(2)}`,
                `₹${(item.discountedPrice * item.quantity).toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        // Start Y position for the table
        let startY = 95;

        // Use autoTable properly
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startY,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 0, 0] },
            didDrawPage: function (data) {
                // This function is called after the table is drawn
                startY = data.cursor.y + 10;
            }
        });

        // Use the updated startY position after table rendering
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(`Subtotal:`, 140, startY);
        doc.text(`₹${subtotal.toFixed(2)}`, 170, startY, { align: 'right' });

        doc.text(`Shipping:`, 140, startY + 5);
        doc.text(shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`, 170, startY + 5, { align: 'right' });

        if (tax > 0) {
            doc.text(`Tax:`, 140, startY + 10);
            doc.text(`₹${tax.toFixed(2)}`, 170, startY + 10, { align: 'right' });
        }

        if (discount > 0) {
            doc.text(`Discount:`, 140, startY + 15);
            doc.text(`-₹${discount.toFixed(2)}`, 170, startY + 15, { align: 'right' });
        }

        if (couponCode) {
            doc.text(`Coupon Applied:`, 140, startY + 20);
            doc.text(`${couponCode}`, 170, startY + 20, { align: 'right' });
        }

        // Add total
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount:`, 120, startY + 25);
        doc.text(`₹${totalAmount.toFixed(2)}`, 170, startY + 25, { align: 'right' });

        // Add footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your order!', 105, 280, { align: 'center' });

        // Save PDF
        doc.save(`Invoice-${orderNumber}.pdf`);
    };

    // Function to print receipt
    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            {/* Header Banner */}
            <div className="bg-black text-white py-8 px-6 text-center">
                <CheckCircle className="mx-auto mb-4 text-white" size={48} />
                <h2 className="text-2xl font-bold mb-2">Order Confirmed</h2>
                <p className="text-gray-300">Thank you for your purchase!</p>
                <p className="mt-2 text-gray-300">Order #{orderNumber}</p>
            </div>

            {/* Order Details */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between mb-8">
                    {/* Order Summary */}
                    <div className="mb-6 md:mb-0 md:w-1/2 md:pr-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Date Placed:</span>
                                <span className="font-medium text-gray-900">{orderDate}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Payment Status:</span>
                                <span className="font-medium text-gray-900 capitalize">{paymentStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="md:w-1/2 md:pl-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {shippingAddress && (
                                <>
                                    <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                                    <p className="text-gray-600">{shippingAddress.address}</p>
                                    <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                                    <p className="text-gray-600">{shippingAddress.country}</p>
                                    <p className="text-gray-600 mt-2">Phone: {shippingAddress.phoneNumber}</p>
                                    {shippingAddress.alternatePhone && (
                                        <p className="text-gray-600">Alt. Phone: {shippingAddress.alternatePhone}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Status */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                    <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-black rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <div className="text-center">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="text-white" size={16} />
                                </div>
                                <p className="text-xs mt-2 text-gray-600">Confirmed</p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="text-gray-600" size={16} />
                                </div>
                                <p className="text-xs mt-2 text-gray-600">Processing</p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                                    <Truck className="text-gray-600" size={16} />
                                </div>
                                <p className="text-xs mt-2 text-gray-600">Shipped</p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                                    <Calendar className="text-gray-600" size={16} />
                                </div>
                                <p className="text-xs mt-2 text-gray-600">Delivered</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-4">
                        Estimated delivery: <span className="font-medium text-gray-900">{deliveryDate}</span>
                    </p>
                </div>

                {/* Product Details */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                    <div className="border rounded-lg overflow-hidden">
                        {orderItems && orderItems.map((item, index) => (
                            <div key={item._id} className={`flex items-center p-4 ${index < orderItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <Package size={24} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h4 className="font-medium text-gray-900">Product ID: {item.product}</h4>
                                    <div className="flex flex-wrap text-sm text-gray-600 mt-1">
                                        {item.color && (
                                            <span className="mr-3">Color: {item.color}</span>
                                        )}
                                        {item.size && (
                                            <span className="mr-3">Size: {item.size}</span>
                                        )}
                                        <span>Qty: {item.quantity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">₹{item.discountedPrice.toFixed(2)}</p>
                                    {item.price !== item.discountedPrice && (
                                        <p className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Price Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Shipping Fee:</span>
                            <span className="text-gray-900">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span>
                        </div>
                        {tax > 0 && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Tax:</span>
                                <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Discount:</span>
                                <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                            </div>
                        )}
                        {couponCode && (<div className="flex justify-between mb-2">
                            <span className="text-gray-600">Coupon Applied:</span>
                            <span className="text-green-600">{couponCode}</span>
                        </div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                            <span className="font-medium text-gray-900">Total Amount:</span>
                            <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={generateInvoicePDF}
                        className="flex items-center justify-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        <Download className="mr-2" size={18} />
                        Download Invoice
                    </button>
                    <button
                        onClick={printReceipt}
                        className="flex items-center justify-center bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                    >
                        <Printer className="mr-2" size={18} />
                        Print Receipt
                    </button>
                    <button
                        // onClick={}
                        className="flex items-center justify-center bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                    >
                        <ListOrdered className="mr-2" size={18} />
                        Order Details
                    </button>
                    <button
                        onClick={() => navigate("/products-list")}
                        className="flex items-center justify-center bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
                    >
                        <ShoppingBag className="mr-2" size={18} />
                        Continue Shopping
                    </button>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <ArrowRight className="mr-2 text-gray-400 flex-shrink-0 mt-1" size={18} />
                        <p className="text-gray-600">
                            You will receive an order confirmation email with details of your purchase.
                        </p>
                    </li>
                    <li className="flex items-start">
                        <ArrowRight className="mr-2 text-gray-400 flex-shrink-0 mt-1" size={18} />
                        <p className="text-gray-600">
                            We will notify you when your order has been shipped.
                        </p>
                    </li>
                    <li className="flex items-start">
                        <ArrowRight className="mr-2 text-gray-400 flex-shrink-0 mt-1" size={18} />
                        <p className="text-gray-600">
                            You can track your order status in your account dashboard.
                        </p>
                    </li>
                </ul>
            </div>

            {/* Support */}
            <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                    If you have any questions about your order, please contact our customer support team.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    Contact Support
                    <ArrowRight className="ml-1" size={16} />
                </a>
            </div>
        </div>
    );
};

export default CartOrderConfirmation;