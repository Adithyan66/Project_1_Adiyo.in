

// import { toast } from 'react-toastify';
// import { initiateRazorpayPayment } from '../../../services/walletService';

// const useRazorpay = (onPlaceOrder) => {
//     const processRazorpay = async (total) => {
//         try {
//             const orderTotal = (parseFloat(total) || 0).toFixed(2);
//             const response = await initiateRazorpayPayment(orderTotal);

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
//                             if (verifyResponse.success) {
//                                 toast.success("Payment verified successfully");
//                             } else {
//                                 toast.error('Payment verification failed, please try again.');
//                             }
//                             return verifyResponse;
//                         } catch (error) {
//                             console.error("Error verifying payment:", error);
//                             toast.error('Payment verification failed, please try again.');
//                             throw error;
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
//                 return { success: true };
//             } else {
//                 throw new Error("Failed to create Razorpay order.");
//             }
//         } catch (err) {
//             console.error('Payment processing error:', err);
//             toast.error('Payment processing failed. Please try again');
//             return { success: false, error: err.message };
//         }
//     };

//     return { processRazorpay };
// };

// export default useRazorpay;











import { toast } from 'react-toastify';
import { initiateRazorpayPayment } from '../../../services/walletService';

const useRazorpay = (onPlaceOrder) => {
    const processRazorpay = async (total) => {
        try {
            const orderTotal = (parseFloat(total) || 0).toFixed(2);
            const response = await initiateRazorpayPayment(orderTotal);

            if (response.data.success && response.data.order) {
                const { order } = response.data;
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_default_key_id',
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Adiyo.in',
                    description: 'Order Checkout',
                    order_id: order.id,
                    handler: async function (paymentResponse) {
                        const orderDetails = {
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        };

                        try {
                            const verifyResponse = await onPlaceOrder("razorpay", null, orderDetails);
                            if (verifyResponse.success) {
                                toast.success("Payment verified successfully");
                                return verifyResponse;
                            } else {
                                toast.error('Payment verification failed, please try again.');
                                return verifyResponse;
                            }
                        } catch (error) {
                            console.error("Error verifying payment:", error);
                            toast.error('Payment verification failed, please try again.');
                            throw error;
                        }
                    },
                    prefill: {
                        name: 'Adithyan Binu',
                        email: 'youremail@example.com'
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return { success: true };
            } else {
                throw new Error("Failed to create Razorpay order.");
            }
        } catch (err) {
            console.error('Payment processing error:', err);
            toast.error('Payment processing failed. Please try again');
            return { success: false, error: err.message };
        }
    };

    return { processRazorpay };
};

export default useRazorpay;