
import React from 'react';

import PropTypes from 'prop-types';
import { formatCurrency } from "../../../../utils/formatDate"




export const PriceBreakdown = ({ subtotal, productDiscount, finalDeliveryCharge, couponData, couponDiscount, total }) => {
    return (
        <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between mb-2 text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{formatCurrency(subtotal)}</span>
            </div>
            {productDiscount > 0 && (
                <div className="flex justify-between mb-2 text-base">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="font-medium text-green-600">-₹{formatCurrency(productDiscount)}</span>
                </div>
            )}
            <div className="flex justify-between mb-2 text-base">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">₹{formatCurrency(finalDeliveryCharge)}</span>
            </div>
            {couponData && (
                <div className="flex justify-between mb-2 text-base">
                    <span className="text-gray-600 flex items-center">
                        <span>Coupon ({couponData.code})</span>
                    </span>
                    <span className="font-medium text-green-600">-₹{formatCurrency(couponDiscount)}</span>
                </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-3 text-base">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-gray-900">₹{formatCurrency(total)}</span>
            </div>
        </div>
    );
};

PriceBreakdown.propTypes = {
    subtotal: PropTypes.number.isRequired,
    productDiscount: PropTypes.number.isRequired,
    finalDeliveryCharge: PropTypes.number.isRequired,
    couponData: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        discountType: PropTypes.string.isRequired,
        discountValue: PropTypes.number.isRequired
    }),
    couponDiscount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};
