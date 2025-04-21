


// import PropTypes from 'prop-types';
// import { Lock } from 'lucide-react';
// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import { initiateRazorpayPayment } from '../../../../services/walletService';

// const RazorpayPayment = ({ paymentMethod, total, onPlaceOrder, cartOrder }) => {
//     const [isProcessing, setIsProcessing] = useState(false);

//     if (paymentMethod !== 'razorpay') return null;

//     const processRazorpay = async () => {
//         setIsProcessing(true);
//         try {
//             const orderTotal = (parseFloat(total) || 0).toFixed(2);
//             const response = await initiateRazorpayPayment(orderTotal);
//             if (response.data.success && response.data.order) {
//                 const { order } = response.data;
//                 const options = {
//                     key: 'your_default_key_id',
//                     amount: order.amount,
//                     currency: order.currency,
//                     name: 'Adiyo.in',
//                     description: cartOrder ? 'Cart Checkout' : 'Order Checkout',
//                     order_id: order.id,
//                     handler: async (paymentResponse) => {
//                         const orderDetails = {
//                             razorpay_order_id: paymentResponse.razorpay_order_id,
//                             razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                             razorpay_signature: paymentResponse.razorpay_signature,
//                         };
//                         try {
//                             const verifyResponse = await onPlaceOrder('razorpay', '', orderDetails);
//                             if (verifyResponse.success) {
//                                 toast.success('Payment verified successfully');
//                             } else {
//                                 toast.error('Payment verification failed, please try again.');
//                             }
//                         } catch (error) {
//                             toast.error('Payment verification failed, please try again.');
//                         }
//                     },
//                     prefill: {
//                         name: 'Adithyan Binu',
//                         email: 'youremail@example.com',
//                     },
//                     theme: {
//                         color: '#3399cc',
//                     },
//                 };
//                 const rzp = new window.Razorpay(options);
//                 rzp.open();
//             } else {
//                 throw new Error('Failed to create Razorpay order.');
//             }
//         } catch (err) {
//             toast.error('Payment processing failed. Please try again');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div className="shadow-lg rounded-lg p-5 mb-6 bg-gray-50">
//             <h3 className="font-medium text-gray-900 mb-4 text-lg">Razorpay Checkout</h3>
//             <div className="flex flex-col items-center">
//                 <button
//                     onClick={processRazorpay}
//                     className={`w-full h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group
//             bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border-amber-300
//             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                         }`}
//                     disabled={isProcessing}
//                     aria-label="Pay with Razorpay"
//                 >
//                     <div className="flex items-center justify-center relative overflow-hidden">
//                         <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
//                         <span className="font-semibold text-base">
//                             Pay with{' '}
//                             <span className="text-2xl italic text-blue-600 animate-pulse">
//                                 Razorpay
//                             </span>
//                         </span>
//                     </div>
//                 </button>
//                 <div className="text-gray-500 mt-3 text-sm flex items-center">
//                     <Lock size={12} className="mr-1" />
//                     Your payment information is secured by Razorpay
//                 </div>
//             </div>
//         </div>
//     );
// };

// RazorpayPayment.propTypes = {
//     paymentMethod: PropTypes.string.isRequired,
//     total: PropTypes.number.isRequired,
//     onPlaceOrder: PropTypes.func.isRequired,
//     cartOrder: PropTypes.bool.isRequired,
// };

// export default RazorpayPayment;








import PropTypes from 'prop-types';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { initiateRazorpayPayment } from '../../../../services/walletService';

const RazorpayPayment = ({ paymentMethod, total, onPlaceOrder, cartOrder }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (paymentMethod !== 'razorpay') return null;

    const processRazorpay = async () => {
        setIsProcessing(true);
        try {
            const orderTotal = (parseFloat(total) || 0).toFixed(2);
            const response = await initiateRazorpayPayment(orderTotal);
            if (response.data.success && response.data.order) {
                const { order } = response.data;
                const options = {
                    key: 'your_default_key_id',
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Adiyo.in',
                    description: cartOrder ? 'Cart Checkout' : 'Order Checkout',
                    order_id: order.id,
                    handler: async (paymentResponse) => {
                        const orderDetails = {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        };
                        try {
                            const verifyResponse = await onPlaceOrder('razorpay', '', orderDetails);
                            if (verifyResponse.success) {
                                toast.success('Payment verified successfully');
                            } else {
                                toast.error('Payment verification failed, please try again.');
                            }
                        } catch (error) {
                            toast.error('Payment verification failed, please try again.');
                        }
                    },
                    prefill: {
                        name: 'Adithyan Binu',
                        email: 'youremail@example.com',
                    },
                    theme: {
                        color: '#3399cc',
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                throw new Error('Failed to create Razorpay order.');
            }
        } catch (err) {
            toast.error('Payment processing failed. Please try again');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="shadow-lg rounded-lg p-5 mb-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4 text-lg">Razorpay Checkout</h3>
            <div className="flex flex-col items-center">
                <button
                    onClick={processRazorpay}
                    className={`w-full h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group
            bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border-amber-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={isProcessing}
                    aria-label="Pay with Razorpay"
                >
                    <div className="flex items-center justify-center relative overflow-hidden">
                        <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                        <span className="font-semibold text-base">
                            Pay with{' '}
                            <span className="text-2xl italic text-blue-600 animate-pulse">
                                Razorpay
                            </span>
                        </span>
                    </div>
                </button>
                <div className="text-gray-500 mt-3 text-sm flex items-center">
                    <Lock size={12} className="mr-1" />
                    Your payment information is secured by Razorpay
                </div>
            </div>
        </div>
    );
};

RazorpayPayment.propTypes = {
    paymentMethod: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    onPlaceOrder: PropTypes.func.isRequired,
    cartOrder: PropTypes.bool.isRequired,
};

export default RazorpayPayment;