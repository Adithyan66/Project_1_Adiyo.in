import React from 'react';
import { ShoppingBag, ChevronRight, Search, FileText, Package } from 'lucide-react';

const OrdersListShimmer = () => {

    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii");

    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md shadow-sm min-h-[800px]">
            {/* Header - Keeping same as original */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingBag className="mr-3 text-gray-800" size={24} />
                        <h2 className="text-2xl font-semibold text-gray-900">My Orders</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                            Loading...
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filters - Keeping same as original */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                            defaultValue="all"
                        >
                            <option value="all">All Orders</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Shimmer UI for Order Cards */}
            <div className="divide-y divide-gray-200">
                {Array(4).fill().map((_, index) => (
                    <div key={index} className="p-6 relative overflow-hidden">
                        {/* Shimmer animation overlay */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center mb-2">
                                    <FileText size={16} className="mr-2 text-gray-300" />
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <ChevronRight size={20} className="text-gray-300 hidden md:block" />
                            </div>
                        </div>

                        {/* Preview of items - show first three orderItems */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array(1).fill().map((_, itemIndex) => (
                                <div key={itemIndex} className="flex items-center">
                                    <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden mr-3 border border-gray-200 animate-pulse">
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Package size={24} className="text-gray-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersListShimmer;