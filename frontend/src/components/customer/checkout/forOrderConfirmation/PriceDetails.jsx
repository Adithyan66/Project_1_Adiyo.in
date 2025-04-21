

import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';


export const PriceDetails = ({ subtotal, shippingFee, tax, discount, couponCode, totalAmount }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Details</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="text-gray-900">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span>
            </div>
            {tax > 0 && (
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
            )}
            {discount > 0 && (
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                </div>
            )}
            {couponCode && (
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Coupon Applied:</span>
                    <span className="text-green-600">{couponCode}</span>
                </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

PriceDetails.propTypes = {
    subtotal: PropTypes.number.isRequired,
    shippingFee: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    couponCode: PropTypes.string,
    totalAmount: PropTypes.number.isRequired
};
