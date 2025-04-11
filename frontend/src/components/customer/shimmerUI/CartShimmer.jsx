import React from 'react';
import { ShoppingBag, ArrowLeft, X, Minus, Plus, Truck, CreditCard } from 'lucide-react';

const CartShimmer = () => {
    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] relative overflow-hidden">
            {/* Shimmer animation overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Cart Header */}
            <div className="bg-gray-50 p-6 rounded-t-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingBag className="mr-3" size={24} />
                        <h2 className="text-2xl font-medium">Your Shopping Cart</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        <button className="flex items-center text-gray-600 hover:text-black">
                            <ArrowLeft size={18} className="mr-1" />
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cart Content - Split into two columns on laptop */}
            <div className="flex flex-col md:flex-row">
                {/* Cart Items */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-gray-500 font-medium">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    {/* Shimmer Cart Items */}
                    {Array(3).fill().map((_, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-gray-200 items-center">
                            {/* Product Image & Info */}
                            <div className="col-span-1 md:col-span-6">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-30 h-40 mb-4 md:mb-0 md:mr-4 bg-gray-200 rounded-md animate-pulse"></div>
                                    <div className="flex flex-col justify-between py-2">
                                        <div>
                                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-1"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                                            <div className="mt-2">
                                                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <button className="flex items-center text-gray-500 hover:text-black text-sm mt-4">
                                            <X size={14} className="mr-1" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0">
                                <div className="md:hidden text-gray-500 mb-1">Price:</div>
                                <div className="flex flex-col">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="col-span-1 md:col-span-2 text-left md:text-center mt-4 md:mt-0">
                                <div className="md:hidden text-gray-500 mb-1">Quantity:</div>
                                <div className="flex items font-medium-center md:justify-center border rounded-md w-32">
                                    <button className="px-3 py-2 hover:bg-gray-100">
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 font-medium">1</span>
                                    <button className="px-3 py-2 hover:bg-gray-100">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="col-span-1 md:col-span-2 text-left md:text-right mt-4 md:mt-0">
                                <div className="md:hidden text-gray-500 mb-1">Total:</div>
                                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="md:w-80 bg-gray-50 p-6 mt-6 md:mt-10 ml-6 rounded-md">
                    <h3 className="text-xl font-medium mb-6">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between font-medium text-xl">
                                <span>Total</span>
                                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                Including GST
                            </div>
                        </div>
                    </div>

                    {/* Shipping Estimate */}
                    <div className="bg-white border rounded-lg p-4 mb-6">
                        <div className="flex items-center mb-2">
                            <Truck size={16} className="mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Estimated Delivery</span>
                        </div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center mb-3"
                        disabled
                    >
                        <CreditCard size={16} className="mr-2" />
                        <span>Proceed to Checkout</span>
                    </button>

                    {/* Secure payment notice */}
                    <div className="text-xs text-center text-gray-500 flex items-center justify-center mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure checkout powered by Stripe</span>
                    </div>

                    {/* Payment methods */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array(5).fill().map((_, i) => (
                            <div key={i} className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartShimmer;