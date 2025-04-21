

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PencilIcon, ShoppingBag, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import {
    setCartCurrentStep,
    updateQuantity as cartUpdateQuantity
} from '../../../store/slices/cartCheckoutSlice';
import {
    setCurrentStep as checkoutSetCurrentStep,
    updateQuantity as checkoutUpdateQuantity
} from '../../../store/slices/checkoutSlice';

const Summary = ({ orderDetails, isCartCheckout = false }) => {
    const dispatch = useDispatch();

    const setCurrentStep = isCartCheckout ? setCartCurrentStep : checkoutSetCurrentStep;
    const updateQuantity = isCartCheckout ? cartUpdateQuantity : checkoutUpdateQuantity;

    const reduxOrder = useSelector(state => isCartCheckout ? state.cartCheckout.order : state.checkout.order);
    const address = useSelector(state => isCartCheckout ? state.cartCheckout.address : state.checkout.address);

    // Construct items array from orderDetails or Redux state
    const items = orderDetails?.items || (
        reduxOrder
            ? (
                isCartCheckout
                    ? reduxOrder.map(item => ({
                        productDetails: item.productDetails,
                        productColor: item.productColor,
                        productSize: item.productSize,
                        quantity: item.quantity
                    }))
                    : [{
                        productDetails: reduxOrder.productDetails,
                        productColor: reduxOrder.productColor,
                        productSize: reduxOrder.productSize,
                        quantity: reduxOrder.quantity
                    }]
            )
            : []
    );

    const getSizeKey = (size) => {
        switch (size?.toLowerCase()) {
            case 'small': case 's': return 'small';
            case 'medium': case 'm': return 'medium';
            case 'large': case 'l': return 'large';
            case 'extra large': case 'xl': return 'extralarge';
            default: return size?.toLowerCase();
        }
    };

    const handleQuantityChange = (index, amount) => {
        const item = items[index];
        const colorVariant = item.productDetails?.colors?.find(c => c.color === item.productColor);
        const sizeKey = getSizeKey(item.productSize);
        const variant = colorVariant?.variants ? colorVariant.variants[sizeKey] : null;
        const maxStock = variant?.stock ? parseInt(variant.stock, 10) : 0;
        const newQuantity = item.quantity + amount;

        console.log("🧭 handleQuantityChange:", { index, amount, item, colorVariant, sizeKey, variant, maxStock, newQuantity });

        if (newQuantity > 0 && newQuantity <= maxStock) {
            if (isCartCheckout) {
                console.log("🧭 Dispatching updateQuantity for cart:", { index, amount });
                dispatch(updateQuantity({ index, amount }));
            } else {
                console.log("🧭 Dispatching updateQuantity for single:", amount);
                dispatch(updateQuantity(amount));
            }
        } else if (newQuantity <= 0) {
            toast.error("Quantity cannot be less than 1");
        } else if (newQuantity > maxStock) {
            toast.error(`Only ${maxStock} items available in stock`);
        }
    };

    const addressData = address && address.length > 0 ? address[0] : {};
    const { fullName, landmark, locality, city, state, pincode, phoneNumber } = addressData;

    if (!items.length) {
        return <div className="text-center py-8">No products selected</div>;
    }

    console.log("🧭 Summary: reduxOrder", reduxOrder);

    return (
        <div className="bg-white rounded-lg md:p-6">
            <div className="flex items-center mb-4 md:mb-6">
                <ShoppingBag className="text-black mr-2" size={24} />
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {isCartCheckout ? 'Cart Order Summary' : 'Order Summary'}
                </h2>
            </div>
            <div className="mb-4 md:mb-6">
                {address && address.length > 0 ? (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                        <div className="text-xs md:text-sm text-gray-700">
                            <div className="font-medium">{fullName}</div>
                            <div>{landmark}</div>
                            <div>{locality}, {city}, {state} - {pincode}</div>
                            <div>{phoneNumber}</div>
                        </div>
                        <button
                            className="text-xs md:text-sm text-black font-medium flex items-center mt-2"
                            onClick={() => dispatch(setCurrentStep('address'))}
                            aria-label="Change address"
                        >
                            <PencilIcon size={14} className="mr-1" />
                            Change
                        </button>
                    </div>
                ) : (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                        <p className="text-xs md:text-sm text-gray-700">No address selected</p>
                        <button
                            className="text-xs md:text-sm text-black font-medium flex items-center mt-2"
                            onClick={() => dispatch(setCurrentStep('address'))}
                            aria-label="Add address"
                        >
                            Add Address
                        </button>
                    </div>
                )}
                <div className="max-h-96 overflow-y-auto">
                    {items.map((item, index) => {
                        const product = item.productDetails;
                        const selectedColor = item.productColor;
                        const selectedSize = item.productSize;
                        const quantity = item.quantity;
                        const colorVariant = product?.colors?.find(c => c.color === selectedColor);
                        const sizeKey = getSizeKey(selectedSize);
                        const variant = colorVariant?.variants ? colorVariant.variants[sizeKey] : null;
                        const maxStock = variant?.stock ? parseInt(variant.stock, 10) : 0;

                        return (
                            <div key={index} className="shadow-md md:shadow-2xl rounded-lg p-3 md:p-4 mb-4">
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-shrink-0 flex justify-center mb-3 md:mb-0">
                                        <img
                                            src={colorVariant?.images?.[0] || ''}
                                            alt={product.name}
                                            className="w-20 h-20 md:w-24 md:h-24 object-contain"
                                        />
                                    </div>
                                    <div className="md:ml-4 flex-grow">
                                        <h3 className="font-medium text-gray-900 text-center md:text-left">{product.name}</h3>
                                        <div className="mt-1 text-xs md:text-sm text-gray-600 text-center md:text-left">
                                            <span
                                                className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full mr-1"
                                                style={{ backgroundColor: selectedColor }}
                                            ></span>
                                            Color: {selectedColor}, Size: {selectedSize}
                                        </div>
                                        <div className="mt-2 flex items-center justify-center md:justify-start">
                                            <span className="text-xs md:text-sm text-gray-600 mr-2">Quantity:</span>
                                            <button
                                                className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center"
                                                onClick={() => handleQuantityChange(index, -1)}
                                                disabled={quantity <= 1}
                                                aria-label={`Decrease quantity for ${product.name}`}
                                            >-</button>
                                            <span className="mx-2 text-sm md:text-base">{quantity}</span>
                                            <button
                                                className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center"
                                                onClick={() => handleQuantityChange(index, 1)}
                                                disabled={quantity >= maxStock}
                                                aria-label={`Increase quantity for ${product.name}`}
                                            >+</button>
                                            {maxStock > 0 && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({maxStock} available)
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center mt-2 justify-center md:justify-start">
                                            <div className="font-medium text-base md:text-lg mr-2 md:mr-3">
                                                ₹{((colorVariant?.discountPrice || 0) * quantity).toLocaleString()}
                                            </div>
                                            <div className="text-gray-500 line-through text-xs md:text-sm mr-2 md:mr-3">
                                                ₹{((colorVariant?.basePrice || 0) * quantity).toLocaleString()}
                                            </div>
                                            <div className="text-green-600 text-xs md:text-sm">
                                                {Math.ceil(colorVariant?.discountPercentage || 0)}% off
                                            </div>
                                        </div>
                                        <div className="text-xs md:text-sm text-gray-600 mt-1 text-center md:text-left">
                                            Estimated delivery: <span className="font-medium">{orderDetails?.estimatedDeliveryDays || '3-5'} business days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center md:justify-end mt-4 md:mt-6">
                <button
                    className="bg-black text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center w-full md:w-auto justify-center"
                    onClick={() => dispatch(setCurrentStep('payment'))}
                    aria-label="Continue to payment"
                >
                    Continue to Payment
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
};

export default Summary;