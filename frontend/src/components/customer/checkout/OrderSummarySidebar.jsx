




import React from 'react';
import { Clock, Truck, Shield, CreditCard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setTotalPrice } from "../../../store/slices/checkoutSlice"

const OrderSummarySidebar = ({ orderDetails }) => {


    const dispatch = useDispatch()

    if (!orderDetails?.productDetails) return null;

    let {
        productDetails,
        productColor,
        productSize,
        quantity = 1,
        deliveryCharge = 0,
        estimatedDeliveryDays = "3-5",
        paymentMethod = "Credit Card"
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
    const discount = (basePrice - discountPrice) * quantity;
    deliveryCharge = (subtotal < 499) ? 49 : 0
    const total = subtotal + deliveryCharge;

    dispatch(setTotalPrice(total))


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

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-lg">
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

                {discount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">₹{formatCurrency(discount)}</span>
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

            {/* Payment Method */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-start">
                    <CreditCard size={18} className="text-gray-500 mr-3 mt-0.5" />
                    <div>
                        <p className="font-medium text-gray-900 text-sm">Payment Method</p>
                        <p className="text-gray-600 text-xs mt-1">{paymentMethod}</p>
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
    );
};

export default OrderSummarySidebar;