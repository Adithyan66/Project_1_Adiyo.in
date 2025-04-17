import React from 'react';


export const LoadingSpinner = () => (
    <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
    </div>
);



export const LoadingDots = () => {
    return (
        <div className='justify-center items-center'>
            <div className="flex items-center justify-center h-64">
                <div className="flex space-x-2">
                    <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export const PulseRingLoader = () => {
    return (
        <div className="p-4 md:p-6 bg-gray-50 w-full min-h-[800px] flex items-center justify-center">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-75 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-black  text-sm font-semibold animate-pulse">Loading</span>
                </div>
            </div>
        </div>
    );
};

export const GearLoader = () => {
    return (
        <div className="p-4 md:p-6 w-full min-h-[800px] flex items-center justify-center bg-gray-50">
            <div className="relative w-24 h-24">
                {/* Gear 1 */}
                <div className="absolute w-12 h-12 border-4 border-blue-500 rounded-full animate-spin-slow" />
                {/* Gear 2 - smaller and counter rotation */}
                <div className="absolute left-10 top-10 w-8 h-8 border-4 border-yellow-500 rounded-full animate-spin-reverse" />
                {/* Gear 3 - below and clockwise */}
                <div className="absolute left-4 top-14 w-10 h-10 border-4 border-green-500 rounded-full animate-spin-slow" />
            </div>
        </div>
    );
};
