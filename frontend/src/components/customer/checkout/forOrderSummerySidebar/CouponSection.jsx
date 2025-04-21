import PropTypes from 'prop-types';

import React from 'react';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';







export const CouponSection = ({ couponCode, setCouponCode, couponMessage, couponData, couponStatus, isValidating, handleValidateCoupon, handleCouponRemove }) => {
    return (
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-start">
                <CreditCard size={16} className="text-gray-500 mr-3 mt-0.5" />
                <div className="w-full">
                    <p className="font-medium text-gray-900 text-sm mb-2.5">Apply Coupon</p>
                    {!couponData && (
                        <>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="flex-grow border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={isValidating}
                                />
                                <button
                                    className={`bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-r-lg text-sm transition ${isValidating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={handleValidateCoupon}
                                    disabled={isValidating}
                                >
                                    {isValidating ? 'Checking...' : 'Apply'}
                                </button>
                            </div>
                            {couponMessage && (
                                <div className={`mt-2 text-sm flex items-center ${couponStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {couponStatus === 'success' ? (
                                        <CheckCircle size={14} className="mr-1" />
                                    ) : (
                                        <XCircle size={14} className="mr-1" />
                                    )}
                                    {couponMessage}
                                </div>
                            )}
                        </>
                    )}
                    {couponData && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                            <div className="flex items-center">
                                <CheckCircle size={14} className="text-green-600 mr-2" />
                                <div className="flex-grow">
                                    <p className="text-green-700 text-sm font-medium">{couponData.name}</p>
                                    <p className="text-green-600 text-xs">
                                        {couponData.discountType === 'percentage'
                                            ? `${couponData.discountValue}% off`
                                            : `₹${couponData.discountValue} off`}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCouponRemove}
                                    className="text-green-700 hover:text-green-900 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

CouponSection.propTypes = {
    couponCode: PropTypes.string.isRequired,
    setCouponCode: PropTypes.func.isRequired,
    couponMessage: PropTypes.string.isRequired,
    couponData: PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        discountType: PropTypes.string.isRequired,
        discountValue: PropTypes.number.isRequired
    }),
    couponStatus: PropTypes.oneOf(['success', 'error', null]),
    isValidating: PropTypes.bool.isRequired,
    handleValidateCoupon: PropTypes.func.isRequired,
    handleCouponRemove: PropTypes.func.isRequired
};