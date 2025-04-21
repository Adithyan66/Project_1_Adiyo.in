import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, RefreshCw } from 'lucide-react';

const CashOnDeliverySection = ({
    captchaText,
    captchaInput,
    setCaptchaInput,
    generateNewCaptcha
}) => {
    return (
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-8">
            <div className="shadow-lg sm:shadow-xl rounded-lg p-3 sm:p-5 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                    <LockIcon size={14} className="mr-1 sm:mr-2 text-gray-800" />
                    Security Verification
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="bg-gradient-to-r from-black to-gray-800 text-white text-base sm:text-lg font-bold tracking-widest px-4 py-2 sm:px-5 sm:py-3 rounded-md select-none relative overflow-hidden mb-3 sm:mb-0">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
                        </div>
                        <div className="relative">{captchaText}</div>
                    </div>
                    <button
                        className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mb-3 sm:mb-0"
                        onClick={generateNewCaptcha}
                        title="Generate new captcha"
                        aria-label="Generate new captcha"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <div className="w-full">
                        <label className="text-xs sm:text-sm text-gray-700 block mb-1">Enter the code here</label>
                        <input
                            type="text"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            placeholder="Enter captcha"
                            aria-label="Enter captcha code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};



CashOnDeliverySection.propTypes = {
    captchaText: PropTypes.string.isRequired,
    captchaInput: PropTypes.string.isRequired,
    setCaptchaInput: PropTypes.func.isRequired,
    generateNewCaptcha: PropTypes.func.isRequired
};

export default CashOnDeliverySection;
