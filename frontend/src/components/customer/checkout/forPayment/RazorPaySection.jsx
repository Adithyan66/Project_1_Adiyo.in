



// import React from 'react';
// import PropTypes from 'prop-types';
// import { Lock } from 'lucide-react';
// import { initiateRazorpayPayment } from '../../../../services/walletService';
// import { toast } from 'react-toastify';

// const RazorpaySection = ({ total, onPlaceOrder }) => {

//     const processRazorpay = async () => {
//         try {
//             const orderTotal = (parseFloat(total) || 0).toFixed(2);
//             const response = await initiateRazorpayPayment(orderTotal);
//             console.log("Razorpay response:", response.data);

//             if (response.data.success && response.data.order) {
//                 const { order } = response.data;
//                 const options = {
//                     key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_default_key_id',
//                     amount: order.amount,
//                     currency: order.currency,
//                     name: 'Adiyo.in',
//                     description: 'Order Checkout',
//                     order_id: order.id,
//                     handler: async function (paymentResponse) {
//                         const orderDetails = {
//                             razorpay_order_id: paymentResponse.razorpay_order_id,
//                             razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                             razorpay_signature: paymentResponse.razorpay_signature,
//                         };
//                         try {
//                             const verifyResponse = await onPlaceOrder("razorpay", '', orderDetails);
//                             console.log("Razorpay verify response:", verifyResponse);
//                             if (verifyResponse.success) {
//                                 toast.success("Payment verified successfully");
//                             } else {
//                                 toast.error('Payment verification failed, please try again.');
//                             }
//                         } catch (error) {
//                             console.error("Error verifying payment:", error);
//                             toast.error('Payment verification failed, please try again.');
//                         }
//                     },
//                     prefill: {
//                         name: 'Adithyan Binu',
//                         email: 'youremail@example.com'
//                     },
//                     theme: {
//                         color: '#3399cc'
//                     }
//                 };
//                 const rzp = new window.Razorpay(options);
//                 rzp.open();
//             } else {
//                 throw new Error("Failed to create Razorpay order.");
//             }
//         } catch (err) {
//             console.error('Payment processing error:', err);
//             toast.error('Payment processing failed. Please try again');
//         }
//     };

//     return (
//         <div className="shadow-md sm:shadow-lg rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
//             <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Razorpay Checkout</h3>
//             <div className="flex flex-col items-center">
//                 <button
//                     onClick={processRazorpay}
//                     className={`w-full h-12 sm:h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group
//                         bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border-amber-300
//                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98]`}
//                     aria-label="Pay with Razorpay"
//                 >
//                     <div className="flex items-center justify-center relative overflow-hidden">
//                         <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
//                         <span className="font-semibold text-sm sm:text-base">Pay with <span className="text-xl sm:text-2xl italic text-blue-600 animate-pulse">Razorpay</span></span>
//                     </div>
//                 </button>
//                 <div className="text-gray-500 mt-3 text-xs sm:text-sm flex items-center">
//                     <Lock size={12} className="mr-1" />
//                     Your payment information is secured by Razorpay
//                 </div>
//             </div>
//         </div>
//     );
// };

// RazorpaySection.propTypes = {
//     total: PropTypes.number.isRequired,
//     onPlaceOrder: PropTypes.func.isRequired
// };

// export default RazorpaySection;










import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import useRazorpay from '../../../../hooks/user/checkout/useRazorpay';

const RazorpaySection = ({ total, onPlaceOrder }) => {
    const { processRazorpay } = useRazorpay(onPlaceOrder);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const result = await processRazorpay(total);
        if (!result.success) {
            toast.error('Payment initiation failed. Please try again or contact support.');
        }
        setIsProcessing(false);
    };

    return (
        <div className="shadow-md sm:shadow-lg rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Razorpay Checkout</h3>
            <div className="flex flex-col items-center">
                <button
                    onClick={handlePayment}
                    className={`w-full h-12 sm:h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border-amber-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isProcessing}
                    aria-label="Pay with Razorpay"
                >
                    <div className="flex items-center justify-center relative overflow-hidden">
                        <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                        <span className="font-semibold text-sm sm:text-base">
                            {isProcessing ? 'Processing...' : 'Pay with '}
                            {!isProcessing && <span className="text-xl sm:text-2xl italic text-blue-600 animate-pulse">Razorpay</span>}
                        </span>
                    </div>
                </button>
                <div className="text-gray-500 mt-3 text-xs sm:text-sm flex items-center">
                    <Lock size={12} className="mr-1" />
                    Your payment information is secured by Razorpay
                </div>
            </div>
        </div>
    );
};

RazorpaySection.propTypes = {
    total: PropTypes.number.isRequired,
    onPlaceOrder: PropTypes.func.isRequired
};

export default RazorpaySection;