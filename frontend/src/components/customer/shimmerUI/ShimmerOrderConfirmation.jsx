


import React from 'react';

const ShimmerOrderConfirmation = () => {
    return (
        <div className="max-w-5xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Shimmer */}
            <div className="bg-gradient-to-r from-gray-800 via-black to-gray-800 text-white py-12 px-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>
                <div className="h-8 w-64 mx-auto mb-2 bg-gray-700 rounded relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>
                <div className="h-5 w-48 mx-auto mb-2 bg-gray-700 rounded relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>
                <div className="h-5 w-36 mx-auto bg-gray-700 rounded relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>
            </div>

            <div className="p-8">
                {/* Order Summary and Shipping Address Shimmer */}
                <div className="flex flex-col md:flex-row justify-between mb-8">
                    {/* Order Summary Shimmer */}
                    <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
                        <div className="h-6 w-36 bg-gray-200 rounded mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex justify-between mb-3">
                                    <div className="h-5 w-24 bg-gray-200 rounded relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                    <div className="h-5 w-20 bg-gray-200 rounded relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address Shimmer */}
                    <div className="md:w-1/2 md:pl-4">
                        <div className="h-6 w-36 bg-gray-200 rounded mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`h-5 bg-gray-200 rounded mb-2 relative overflow-hidden ${i === 0 ? 'w-32' : 'w-full'}`}>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Status Shimmer */}
                <div className="mb-8">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                    <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden"></div>
                        <div className="flex justify-between mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                    <div className="h-4 w-16 bg-gray-200 rounded mt-2 mx-auto relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-4 w-48 bg-gray-200 rounded mt-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                </div>

                {/* Product Details Shimmer */}
                <div className="mb-8">
                    <div className="h-6 w-36 bg-gray-200 rounded mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`flex items-center p-5 ${i < 2 ? 'border-b border-gray-200' : ''}`}>
                                <div className="w-16 h-16 bg-gray-200 rounded relative overflow-hidden">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <div className="h-5 w-32 bg-gray-200 rounded mb-1 relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-1 relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                    <div className="flex flex-wrap mt-1">
                                        <div className="h-4 w-16 bg-gray-200 rounded mr-3 relative overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                        </div>
                                        <div className="h-4 w-16 bg-gray-200 rounded relative overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="h-5 w-16 bg-gray-200 rounded mb-1 relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                    <div className="h-4 w-12 bg-gray-200 rounded relative overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Details Shimmer */}
                <div className="mb-8">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`flex justify-between ${i === 4 ? 'border-t border-gray-200 pt-3 mt-3' : 'mb-3'}`}>
                                <div className={`h-5 bg-gray-200 rounded relative overflow-hidden ${i === 4 ? 'w-28' : 'w-24'}`}>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                </div>
                                <div className="h-5 w-20 bg-gray-200 rounded relative overflow-hidden">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons Shimmer */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="h-10 w-40 bg-gray-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                    <div className="h-10 w-40 bg-gray-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                </div>

                {/* What's Next & Need Help Shimmer */}
                <div className="mb-8">
                    <div className="h-6 w-28 bg-gray-200 rounded mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                    <div className="h-20 bg-gray-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShimmerOrderConfirmation;