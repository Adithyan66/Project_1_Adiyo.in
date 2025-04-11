import React from "react";

const ProductDetailShimmer = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-[150px]">
            {/* Breadcrumbs Shimmer */}
            <div className="flex items-center space-x-2 mb-6">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT COLUMN: Main image + thumbnails */}
                <div className="flex flex-col items-center">
                    {/* Main Image Shimmer */}
                    <div className="relative w-full h-[500px] bg-gray-200 animate-pulse rounded-md"></div>

                    {/* Thumbnails Shimmer */}
                    <div className="flex space-x-4 mt-4 self-start">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded"></div>
                        ))}
                    </div>

                    {/* Action Buttons Shimmer */}
                    <div className="mt-12 flex space-x-4 w-full">
                        <div className="w-1/2 h-12 bg-gray-200 animate-pulse rounded-md"></div>
                        <div className="w-1/2 h-12 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Info */}
                <div>
                    {/* Title Shimmer */}
                    <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>

                    {/* Ratings Shimmer */}
                    <div className="flex items-center space-x-2 mt-2">
                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    {/* Price Shimmer */}
                    <div className="mt-4 flex items-center space-x-2">
                        <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-5 w-12 bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    {/* Description Shimmer */}
                    <div className="mt-4 space-y-2">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Color Selection Shimmer */}
                    <div className="my-4">
                        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
                        <div className="flex space-x-3 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Size Selection Shimmer */}
                    <div className="mt-6">
                        <div className="h-5 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="flex space-x-3 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-16 bg-gray-200 animate-pulse rounded-3xl"></div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Offers Section Shimmer */}
                    <div className="mt-6">
                        <div className="h-5 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="space-y-2 mt-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 animate-pulse rounded mr-3"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    {/* Delivery Info Shimmer */}
                    <div className="mt-6">
                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
                            <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mt-2"></div>
                        <div className="h-4 w-56 bg-gray-200 animate-pulse rounded mt-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailShimmer;