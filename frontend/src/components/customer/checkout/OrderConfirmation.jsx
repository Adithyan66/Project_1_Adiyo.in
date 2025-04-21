



import React from 'react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Header } from './forOrderConfirmation/Header';
import { OrderSummary } from './forOrderConfirmation/OrderSummary';
import { ShippingAddress } from './forOrderConfirmation/ShippingAddress';
import { OrderStatus } from './forOrderConfirmation/OrderStatus';
import { ProductDetails } from './forOrderConfirmation/ProductDetails';
import { PriceDetails } from './forOrderConfirmation/PriceDetails';
import { ActionButtons } from './forOrderConfirmation/ActionButtons';
import { NeedHelp, WhatsNext } from './forOrderConfirmation/WhatsNextAndNeedHelp';
import PropTypes from 'prop-types';
import { formatDate } from "../../../utils/formatDate"


const OrderConfirmation = ({ isCartCheckout }) => {

    const confirmationData = useSelector(state =>
        isCartCheckout ? state.cartCheckout?.confirmationData : state.checkout?.confirmationData
    );

    if (!confirmationData) {
        return <div className="text-center py-8 text-gray-600">No order confirmation data available</div>;
    }

    const {
        orderNumber, totalAmount, shippingAddress, paymentMethod, orderItems,
        createdAt, estimatedDeliveryDate, subtotal, shippingFee, tax, discount,
        couponCode, paymentStatus
    } = confirmationData;

    const items = Array.isArray(orderItems) ? orderItems : [orderItems].filter(Boolean);
    const orderDate = formatDate(createdAt);
    const deliveryDate = formatDate(estimatedDeliveryDate);

    const generateInvoicePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order Number: ${orderNumber}`, 14, 30);
        doc.text(`Date: ${orderDate}`, 14, 35);
        doc.text(`Payment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}`, 14, 40);
        doc.text(`Payment Status: ${paymentStatus}`, 14, 45);

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

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Order Items', 14, 90);
        const tableColumn = ["Item", "Color", "Size", "Qty", "Price", "Total"];
        const tableRows = items.map(item => [
            `Product ID: ${item.product.substring(0, 8)}...`,
            item.color || '-',
            item.size || '-',
            item.quantity,
            `₹${item.discountedPrice.toFixed(2)}`,
            `₹${(item.discountedPrice * item.quantity).toFixed(2)}`
        ]);

        let startY = 95;
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startY,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 0, 0] },
            didDrawPage: function (data) {
                startY = data.cursor.y + 10;
            }
        });

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

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount:`, 120, startY + 25);
        doc.text(`₹${totalAmount.toFixed(2)}`, 170, startY + 25, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your order!', 105, 280, { align: 'center' });

        doc.save(`Invoice-${orderNumber}.pdf`);
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <Header orderNumber={orderNumber} />
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between mb-8">
                    <OrderSummary
                        orderDate={orderDate}
                        paymentMethod={paymentMethod}
                        paymentStatus={paymentStatus}
                        totalAmount={totalAmount}
                    />
                    <ShippingAddress shippingAddress={shippingAddress} />
                </div>
                <OrderStatus deliveryDate={deliveryDate} />
                <ProductDetails items={items} />
                <PriceDetails
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    tax={tax}
                    discount={discount}
                    couponCode={couponCode}
                    totalAmount={totalAmount}
                />
                <ActionButtons generateInvoicePDF={generateInvoicePDF} printReceipt={printReceipt} />
            </div>
            <WhatsNext />
            <NeedHelp />
        </div>
    );
};

OrderConfirmation.propTypes = {
    isCartCheckout: PropTypes.bool
};

OrderConfirmation.defaultProps = {
    isCartCheckout: false
};


export default OrderConfirmation