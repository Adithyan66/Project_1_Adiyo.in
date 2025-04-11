import React from 'react';
import { MapPin, PlusCircle } from 'lucide-react';

const ManageAddressesShimmer = () => {
    return (
        <div className="flex-1 p-6 bg-white m-6 rounded-md min-h-[800px] relative overflow-hidden">
            {/* Shimmer overlay animation */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <MapPin className="text-gray-200 mr-2" size={24} />
                    <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>

            {/* Subheader text */}
            <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Address cards */}
            <div className="space-y-4">
                {Array(3).fill().map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="pt-1">
                                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>

                            <div className="ml-3 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="ml-3 h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                                        <div className="ml-3 h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Address lines */}
                                <div className="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="mt-2 h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                <div className="mt-2 h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>

                                {/* Set as default button */}
                                <div className="mt-3 h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer button */}
            <div className="flex justify-end mt-6">
                <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>
        </div>
    );
};

export default ManageAddressesShimmer;