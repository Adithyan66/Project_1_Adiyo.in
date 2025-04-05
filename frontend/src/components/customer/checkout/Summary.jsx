




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PencilIcon, ShoppingBag, ChevronRight } from 'lucide-react';
import { setCurrentStep, updateQuantity } from "../../../store/slices/checkoutSlice";
import { toast } from "react-toastify";

function Summary() {
    const dispatch = useDispatch();

    const address = useSelector((state) => state.checkout.address);
    const product = useSelector((state) => state.checkout.order.productDetails);
    const selectedColor = useSelector((state) => state.checkout.order.productColor);
    const selectedSize = useSelector((state) => state.checkout.order.productSize);
    const quantity = useSelector((state) => state.checkout.order.quantity);

    // Find the correct color variant
    const colorVariant = product?.colors?.find(item => item.color === selectedColor);

    // Convert size to appropriate key for the variants object
    const getSizeKey = (size) => {
        switch (size.toLowerCase()) {
            case 'small': return 'small';
            case 's': return 'small';
            case 'medium': return 'medium';
            case 'm': return 'medium';
            case 'large': return 'large';
            case 'l': return 'large';
            case 'extra large': return 'extralarge';
            case 'xl': return 'extralarge';
            default: return size.toLowerCase();
        }
    };

    // Get the correct variant based on size

    const sizeKey = getSizeKey(selectedSize);
    const variant = colorVariant?.variants ? colorVariant.variants[sizeKey] : null;

    // Get the stock for the selected variant
    const maxStock = variant?.stock ? parseInt(variant.stock, 10) : 0;

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;

        // Check stock before updating
        if (newQuantity > 0 && newQuantity <= maxStock) {
            dispatch(updateQuantity(change));
        } else if (newQuantity <= 0) {
            toast.error("Quantity cannot be less than 1");
        } else if (newQuantity > maxStock) {
            toast.error(`Only ${maxStock} items available in stock`);
        }
    };

    // Handle empty address array
    const addressData = address && address.length > 0 ? address[0] : {};
    const { fullName, landmark, locality, city, state, pincode, phoneNumber } = addressData;

    if (!product) {
        return <div className="text-center py-8">No product selected</div>;
    }

    return (
        <div className="bg-white rounded-lg  p-6">
            <div className="flex items-center mb-6">
                <ShoppingBag className="text-black mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>

            {/* Delivery Address Section */}
            <div className="mb-6">
                {address && address.length > 0 ? (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>

                        <div className="text-sm text-gray-700">
                            <div className="font-medium">{fullName}</div>
                            <div>{landmark}</div>
                            <div>{locality}, {city}, {state} - {pincode}</div>
                            <div>{phoneNumber}</div>
                        </div>

                        <button
                            className="text-sm text-black font-medium flex items-center mt-2"
                            onClick={() => dispatch(setCurrentStep('address'))}
                        >
                            <PencilIcon size={14} className="mr-1" />
                            Change
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                        <p className="text-sm text-gray-700">No address selected</p>
                        <button
                            className="text-sm text-black font-medium flex items-center mt-2"
                            onClick={() => dispatch(setCurrentStep('address'))}
                        >
                            Add Address
                        </button>
                    </div>
                )}

                {/* Order Product Section */}
                <div className="shadow-2xl rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <img
                                src={colorVariant?.images?.[0] || ''}
                                alt={product.name}
                                className="w-24 h-24 object-contain"
                            />
                        </div>
                        <div className="ml-4 flex-grow">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <div className="mt-1 text-sm text-gray-600">
                                <span
                                    className="inline-block w-4 h-4 rounded-full mr-1"
                                    style={{ backgroundColor: selectedColor }}
                                ></span>
                                Color: {selectedColor}, Size: {selectedSize}
                            </div>
                            <div className="mt-1 flex items-center">
                                <span className="text-gray-600 mr-2">Quantity:</span>
                                <button
                                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >-</button>
                                <span className="mx-2">{quantity}</span>
                                <button
                                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= maxStock}
                                >+</button>
                                {maxStock > 0 && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({maxStock} available)
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center mt-2">
                                <div className="font-medium text-lg mr-3">
                                    ₹{((colorVariant?.discountPrice || 0) * quantity).toLocaleString()}
                                </div>
                                <div className="text-gray-500 line-through text-sm mr-3">
                                    ₹{((colorVariant?.basePrice || 0) * quantity).toLocaleString()}
                                </div>
                                <div className="text-green-600 text-sm">
                                    {Math.ceil(colorVariant?.discountPercentage || 0)}% off
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Estimated delivery: <span className="font-medium">3-5 business days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue to Payment Button */}
            <div className="flex justify-end mt-6">
                <button
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center"
                    onClick={() => dispatch(setCurrentStep('payment'))}
                >
                    Continue to Payment
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
}

export default Summary;