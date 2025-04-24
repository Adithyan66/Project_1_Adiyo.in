
import React, { useEffect, useState } from 'react';
import { CheckCircle, Gift, Sparkles, Star } from 'lucide-react';
import PropTypes from 'prop-types';

export const Header = ({ orderNumber }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);

    useEffect(() => {
        // Trigger entrance animation on mount
        setIsVisible(true);

        // Add sparkle effect after confirmation appears
        const sparkleTimer = setTimeout(() => {
            setShowSparkles(true);
        }, 1000);

        return () => clearTimeout(sparkleTimer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-gray-800 via-black to-gray-800 text-white py-12 px-6 text-center relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-20"></div>

            {/* Success icon with animations */}
            <div className={`transform transition-all duration-700 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping"></div>
                    <CheckCircle
                        className="mx-auto text-white relative z-10 animate-pulse"
                        size={48}
                    />

                    {/* Animated ring around check icon */}
                    <div className="absolute inset-0 rounded-full border-4 border-white opacity-30 animate-[spin_3s_linear_infinite]"></div>
                </div>
            </div>

            {/* Heading with entrance animation */}
            <h2 className={`text-3xl font-bold mb-2 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Order Confirmed
            </h2>

            {/* Thank you message with entrance animation */}
            <p className={`text-gray-300 text-lg transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Thank you for your purchase!
            </p>

            {/* Order number with entrance animation */}
            <p className={`mt-2 text-gray-300 font-medium transform transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Order #{orderNumber}
            </p>

            {/* Decorative elements */}
            {showSparkles && (
                <>
                    <Sparkles className="absolute top-6 left-12 text-white opacity-60 animate-pulse" size={18} />
                    <Star className="absolute bottom-8 right-16 text-white opacity-60 animate-pulse" size={18} />
                    <Gift className="absolute top-16 right-12 text-white opacity-60 animate-bounce" size={18} />
                </>
            )}

            {/* Success notification banner */}
            <div className={`mt-6 bg-green-500 bg-opacity-20 mx-auto max-w-xs rounded-full py-1 px-4 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm text-white flex items-center justify-center">
                    <CheckCircle className="mr-1" size={14} />
                    We've sent your receipt via email
                </p>
            </div>
        </div>
    );
};

Header.propTypes = {
    orderNumber: PropTypes.string.isRequired
};