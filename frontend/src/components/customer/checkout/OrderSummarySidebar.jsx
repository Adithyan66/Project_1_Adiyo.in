




import React from 'react';
import { Clock, Truck, Shield, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setTotalPrice, setCoupon } from "../../../store/slices/checkoutSlice";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { validateCoupon } from '../../../services/couponService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const OrderSummarySidebar = ({ orderDetails }) => {
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState("");
    const [couponData, setCouponData] = useState(null);
    const [couponStatus, setCouponStatus] = useState(null); // 'success', 'error', or null
    const [isValidating, setIsValidating] = useState(false);

    const dispatch = useDispatch();

    if (!orderDetails?.productDetails) return null;

    let {
        productCategory,
        productDetails,
        productColor,
        productSize,
        quantity = 1,
        deliveryCharge = 0,
        estimatedDeliveryDays = "3-5",
    } = orderDetails || {};

    // Find the selected color object from the product
    const selectedColorObj = productDetails.colors?.find(c => c.color === productColor) || {};
    const { basePrice = 0, discountPrice = 0 } = selectedColorObj;

    // Find variant based on productSize
    const variantKey = productSize === "Small" ? "small" :
        productSize === "Medium" ? "medium" :
            productSize === "Large" ? "large" : "extraLarge";

    const selectedVariant = selectedColorObj.variants?.[variantKey] || {};

    // Calculate totals
    const subtotal = discountPrice * quantity;
    const productDiscount = (basePrice - discountPrice) * quantity;
    deliveryCharge = (subtotal < 499) ? 49 : 0;

    // Calculate coupon discount
    const calculateCouponDiscount = () => {
        if (!couponData) return 0;

        if (couponData.discountType === "fixed") {
            return couponData.discountValue;
        } else if (couponData.discountType === "percentage") {
            return (subtotal * couponData.discountValue) / 100;
        }
        return 0;
    };

    const couponDiscount = calculateCouponDiscount();
    const total = subtotal + deliveryCharge - couponDiscount;

    useEffect(() => {
        dispatch(setTotalPrice(total));
        dispatch(setCoupon(couponCode))
    }, [total, dispatch, couponCode]);

    // Format currency
    const formatCurrency = (amount) => {
        return Number(amount).toFixed(2);
    };

    // Get estimated delivery date
    const getEstimatedDelivery = () => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + parseInt(estimatedDeliveryDays.split('-')[1]));

        return deliveryDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleCouponRemove = () => {
        setCouponCode("");
        setCouponData(null);
        setCouponMessage("");
        setCouponStatus(null);
    };

    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponMessage("Please enter a coupon code");
            setCouponStatus("error");
            return;
        }

        setIsValidating(true);

        try {
            // const response = await axios.post(`${API_BASE_URL}/user/coupons/validate`, {
            //     code: couponCode,
            //     orderTotal: subtotal,
            //     productCategories: [productCategory],
            // });

            const response = await validateCoupon(couponCode, subtotal, productCategory);

            if (response.data.success) {
                setCouponMessage("Coupon applied successfully!");
                setCouponData(response.data.coupon);
                setCouponStatus("success");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error validating coupon";
            setCouponMessage(errorMessage);
            setCouponStatus("error");
            setCouponData(null);
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-1 sticky top-45">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
                {/* Header */}
                <div className="bg-black text-white p-4 rounded-t-lg ">
                    <h3 className="font-medium text-lg">Order Summary</h3>
                </div>

                {/* Product Summary */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center mb-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                            {selectedColorObj.images && selectedColorObj.images[0] ? (
                                <img
                                    src={selectedColorObj.images[0]}
                                    alt={productDetails.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400 text-xs">No image</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-3 flex-grow">
                            <h4 className="font-medium text-gray-900 text-sm">{productDetails.name}</h4>
                            <div className="flex flex-wrap text-xs text-gray-600 mt-1">
                                <span className="mr-3">Color: {productColor}</span>
                                <span className="mr-3">Size: {productSize}</span>
                                <span>Qty: {quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Product Price</span>
                        <span className="font-medium">₹{formatCurrency(basePrice)}</span>
                    </div>

                    {productDiscount > 0 && (
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Product Discount</span>
                            <span className="font-medium text-green-600">-₹{formatCurrency(productDiscount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal ({quantity} item)</span>
                        <span className="font-medium">₹{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">₹{formatCurrency(deliveryCharge)}</span>
                    </div>

                    {couponData && (
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600 flex items-center">
                                <span>Coupon ({couponData.code})</span>
                                <button
                                    onClick={handleCouponRemove}
                                    className="ml-2 text-red-500 text-xs hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </span>
                            <span className="font-medium text-green-600">-₹{formatCurrency(couponDiscount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">₹{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start mb-3">
                        <Truck size={18} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900 text-sm">Shipping</p>
                            <p className="text-gray-600 text-xs mt-1">Standard Delivery</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Clock size={18} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900 text-sm">Estimated Delivery</p>
                            <p className="text-gray-600 text-xs mt-1">
                                {estimatedDeliveryDays} business days ({getEstimatedDelivery()})
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stock Information */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Stock Available</span>
                        <span className="font-medium">{selectedVariant.stock || 0} units</span>
                    </div>
                </div>

                {/* Coupon Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start">
                        <CreditCard size={18} className="text-gray-500 mr-3 mt-0.5" />
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
                                            className={`bg-black hover:bg-black text-white px-4 py-2 rounded-r-lg text-sm transition ${isValidating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            onClick={handleValidateCoupon}
                                            disabled={isValidating}
                                        >
                                            {isValidating ? 'Checking...' : 'Apply'}
                                        </button>
                                    </div>

                                    {couponMessage && (
                                        <div className={`mt-2 text-sm flex items-center ${couponStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {couponStatus === 'success' ? (
                                                <CheckCircle size={16} className="mr-1" />
                                            ) : (
                                                <XCircle size={16} className="mr-1" />
                                            )}
                                            {couponMessage}
                                        </div>
                                    )}
                                </>
                            )}

                            {couponData && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                                    <div className="flex items-center">
                                        <CheckCircle size={16} className="text-green-600 mr-2" />
                                        <div className="flex-grow">
                                            <p className="text-green-700 text-sm font-medium">
                                                {couponData.name}
                                            </p>
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

                {/* Order Guarantee */}
                <div className="p-4 bg-gray-50 rounded-b-lg">
                    <div className="flex items-start">
                        <Shield size={18} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-900 text-sm">Order Protection</p>
                            <p className="text-gray-600 text-xs mt-1">
                                Full refund if you don't receive your order or it doesn't match the description.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummarySidebar;