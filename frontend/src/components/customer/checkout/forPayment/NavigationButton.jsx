


import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, LockIcon } from 'lucide-react';

const NavigationButtons = ({
    dispatch,
    setCurrentStep,
    paymentMethod,
    captchaInput,
    captchaText,
    isProcessing,
    handlePlaceOrder,
    total
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3 sm:gap-0">
            <button
                className="text-gray-600 hover:text-black flex items-center justify-center transition-colors px-4 py-2 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => dispatch(setCurrentStep('summary'))}
                disabled={isProcessing}
                aria-label="Back to order summary"
            >
                <ArrowLeft size={16} className="mr-1" />
                Back to Order Summary
            </button>
            {paymentMethod === 'cod' && (
                <button
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-medium w-full sm:w-auto ${!captchaInput || captchaInput !== captchaText || isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                        }`}
                    disabled={!captchaInput || captchaInput !== captchaText || isProcessing}
                    onClick={handlePlaceOrder}
                    aria-label={`Place order for ₹${total.toFixed(2)} with Cash on Delivery`}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <LockIcon size={16} className="mr-2" />
                            <span className="text-sm sm:text-base">Place Order (₹{total.toFixed(2)})</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

NavigationButtons.propTypes = {
    dispatch: PropTypes.func.isRequired,
    setCurrentStep: PropTypes.func.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    captchaInput: PropTypes.string.isRequired,
    captchaText: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    handlePlaceOrder: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired
};

export default NavigationButtons;