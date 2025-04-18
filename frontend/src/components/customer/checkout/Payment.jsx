

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ArrowLeft, CreditCard, LockIcon, RefreshCw, Smartphone, Building, Truck, Wallet, Plus, Lock } from 'lucide-react';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// import { setCurrentStep } from '../../../store/slices/checkoutSlice';
// import axios from 'axios';
// import walletLogo from "../../../assets/images/walletLogo.jpg";
// import paypalLogo from "../../../assets/images/paypalLogo.png";
// import cashOnDelivery from "../../../assets/images/cashOnDeliveryLogo.jpg";
// import razarpay from "../../../assets/images/razarpay.png";
// import { toast } from 'react-toastify';
// import { getWalletBalance, initiateRazorpayPayment } from '../../../services/walletService';

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// function Payment({ onPlaceOrder }) {
//     const dispatch = useDispatch();
//     const { order } = useSelector((state) => state.checkout);
//     const total = useSelector((state) => state.checkout.totalPrice);
//     const [{ isPending }] = usePayPalScriptReducer();

//     const [captchaInput, setCaptchaInput] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState('card');
//     const [captchaText, setCaptchaText] = useState("R8T29C");
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [paypalOrderID, setPaypalOrderID] = useState(null);
//     const [paypalError, setPaypalError] = useState(null);
//     const [walletBalance, setWalletBalance] = useState(0);
//     const [isLoadingWallet, setIsLoadingWallet] = useState(true);
//     const [walletError, setWalletError] = useState(null);
//     const [rechargeAmount, setRechargeAmount] = useState('');
//     const [showRechargeOptions, setShowRechargeOptions] = useState(false);
//     const [upiId, setUpiId] = useState('');
//     const [selectedBank, setSelectedBank] = useState('');

//     // Generate a new captcha when component loads
//     useEffect(() => {
//         generateNewCaptcha();
//         fetchWalletBalance();
//     }, []);

//     const fetchWalletBalance = async () => {
//         setIsLoadingWallet(true);
//         setWalletError(null);

//         try {
//             const response = await getWalletBalance()
//             // axios.get(`${API_BASE_URL}/user/get-wallet-balance`, {
//             //     withCredentials: true,
//             // });

//             if (response.data.success) {
//                 setWalletBalance(response.data.balance);
//             } else {
//                 setWalletError("Unable to fetch wallet balance. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error fetching wallet balance:", error);
//             setWalletError("Unable to fetch wallet balance. Please try again.");
//         } finally {
//             setIsLoadingWallet(false);
//         }
//     };

//     const generateNewCaptcha = () => {
//         const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
//         let result = '';
//         for (let i = 0; i < 6; i++) {
//             result += characters.charAt(Math.floor(Math.random() * characters.length));
//         }
//         setCaptchaText(result);
//         setCaptchaInput('');
//     };

//     const handleWalletPayment = () => {
//         if (captchaInput !== captchaText) {
//             return;
//         }

//         setIsProcessing(true);
//         onPlaceOrder('wallet', captchaInput)
//             .finally(() => setIsProcessing(false));
//     };

//     const handlePlaceOrder = () => {
//         if (paymentMethod === 'cod' && captchaInput !== captchaText) {
//             return;
//         }


//         setIsProcessing(true);
//         onPlaceOrder(paymentMethod, paymentMethod === 'cod' ? captchaInput : captchaText, paypalOrderID)
//             .finally(() => setIsProcessing(false));
//     };




//     const processRazorpay = async () => {
//         try {
//             if (paymentMethod === 'razorpay') {
//                 const orderTotal = (parseFloat(total) || 0).toFixed(2);

//                 const response = await initiateRazorpayPayment(orderTotal)

//                 console.log("Razorpay response:", response.data);

//                 if (response.data.success && response.data.order) {
//                     const { order } = response.data;

//                     const options = {
//                         key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_default_key_id',
//                         amount: order.amount,
//                         currency: order.currency,
//                         name: 'Adiyo.in',
//                         description: 'Order Checkout',
//                         order_id: order.id,
//                         handler: async function (paymentResponse) {
//                             const orderDetails = {
//                                 razorpay_order_id: paymentResponse.razorpay_order_id,
//                                 razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                                 razorpay_signature: paymentResponse.razorpay_signature,
//                             };

//                             try {
//                                 const verifyResponse = await onPlaceOrder("razorpay", '', orderDetails);
//                                 console.log("veryfyrespooo", verifyResponse);

//                                 if (verifyResponse.success) {
//                                     // Payment verified successfully
//                                     console.log("Payment verified successfully", verifyResponse);
//                                     // Any additional success handling
//                                 } else {
//                                     alert('Payment verification failed, please try again.');
//                                 }
//                             } catch (error) {
//                                 console.error("Error verifying payment:", error);
//                                 alert('Payment verification failed, please try again.');
//                             }
//                         },
//                         prefill: {
//                             name: 'Adithyan Binu',
//                             email: 'youremail@example.com'
//                         },
//                         theme: {
//                             color: '#3399cc'
//                         }
//                     };

//                     const rzp = new window.Razorpay(options);
//                     rzp.open();
//                 } else {
//                     throw new Error("Failed to create Razorpay order.");
//                 }
//             }
//         } catch (err) {
//             console.error('Payment processing error:', err);
//             toast.error('Payment processing failed. Please try again');
//         }
//     };


//     const createPaypalOrder = (data, actions) => {
//         const orderTotal = (parseFloat(total) || 0).toFixed(2);

//         if (orderTotal <= 0) {
//             console.error("Invalid order total for PayPal:", orderTotal);
//             setPaypalError("Invalid order amount");
//             return Promise.reject("Invalid order amount");
//         }

//         return actions.order.create({
//             purchase_units: [
//                 {
//                     amount: {
//                         value: orderTotal,
//                         currency_code: "USD"
//                     },
//                     description: "Order from Adiyo.in"
//                 }
//             ],
//             application_context: {
//                 shipping_preference: 'NO_SHIPPING'
//             }
//         });
//     };

//     // Handle PayPal approval (no capture on frontend)
//     const onApprovePaypal = (data, actions) => {
//         console.log("PayPal payment approved with orderID:", data.orderID);

//         setPaypalOrderID(data.orderID);
//         setIsProcessing(true);

//         // Call onPlaceOrder without capturing on frontend
//         return onPlaceOrder('paypal', captchaText, data.orderID)
//             .then(response => {
//                 console.log("Order placed successfully:", response);
//                 return response;
//             })
//             .catch(error => {
//                 console.error("Error during PayPal order processing:", error);
//                 setPaypalError(`Payment processing failed: ${error.message}`);
//                 throw error;
//             })
//             .finally(() => setIsProcessing(false));
//     };


//     const onPaypalError = (err) => {
//         console.error("PayPal error:", err);
//         setPaypalError(`Payment failed: ${err.message}`);
//     };

//     const PaymentOption = ({ id, title, description, icon: Icon, isDisabled }) => (
//         <div
//             className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === id ? 'border-black border-2 bg-gray-50' : 'border-gray-200'}`}

//             // onClick={() => setPaymentMethod(id)}
//             onClick={() => {
//                 if (!isDisabled) {
//                     setPaymentMethod(id);
//                 }
//             }
//             }
//         >
//             <div className="flex items-center">
//                 <input
//                     type="radio"
//                     id={id}
//                     disabled={isDisabled}
//                     checked={paymentMethod === id}
//                     onChange={() => setPaymentMethod(id)}
//                     className="mr-3 h-4 w-4 text-black focus:ring-black black-radio"
//                 />
//                 <div className="flex items-center flex-1">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${paymentMethod === id ? ' text-white' : ' text-gray-600'}`}>
//                         {/* <Icon size={20} /> */}
//                         <img src={Icon} alt="" />
//                     </div>
//                     <div>
//                         <div className="font-medium text-gray-900">{title}</div>
//                         <div className="text-sm text-gray-500">{description}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const PayPalOption = () => (
//         <div
//             className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === 'paypal' ? 'border-black border-2 bg-gray-50' : 'border-gray-200'}`}
//             onClick={() => setPaymentMethod('paypal')}
//         >
//             <div className="flex items-center">
//                 <input
//                     type="radio"
//                     id="paypal"
//                     checked={paymentMethod === 'paypal'}
//                     onChange={() => setPaymentMethod('paypal')}
//                     className="mr-3 h-4 w-4 text-black focus:ring-black black-radio"
//                 />
//                 <div className="flex items-center flex-1">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${paymentMethod === 'paypal' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
//                         {/* <span className="font-bold text-sm">PP</span> */}
//                         <img src={paypalLogo} alt="" />
//                     </div>
//                     <div>
//                         <div className="font-medium text-gray-900">PayPal</div>
//                         <div className="text-sm text-gray-500">Fast, secure payment</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );




//     return (
//         <div className="bg-white rounded-lg p-6 ">
//             <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
//                 <CreditCard className="text-black mr-3" size={24} />
//                 <h2 className="text-xl font-semibold text-gray-900">Payment Options</h2>
//             </div>

//             <div className="space-y-4 mb-8">
//                 <PaymentOption
//                     id="wallet"
//                     title="Wallet"
//                     description={isLoadingWallet ? "Loading balance..." : `Available balance: ₹${walletBalance.toFixed(2)}`}
//                     icon={walletLogo}
//                 />
//                 <PayPalOption />
//                 <PaymentOption
//                     id="razorpay"
//                     title="Razorpay"
//                     description="Secure Transactions"
//                     icon={razarpay}
//                 />

//                 <PaymentOption
//                     id="cod"
//                     title="Cash on Delivery"
//                     description={(total < 1000) ? "Not available for orders below 1000" : "Pay when you receive the product"}
//                     icon={cashOnDelivery}
//                     isDisabled={(total < 1000) ? true : false}
//                 />
//             </div>

//             {/* Wallet payment */}
//             {paymentMethod === 'wallet' && (
//                 <div className=" rounded-lg p-5 mb-6 bg-gray-50">
//                     <h3 className="font-medium text-gray-900 mb-4">Wallet Payment</h3>

//                     {isLoadingWallet ? (
//                         <div className="flex justify-center items-center p-4">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
//                         </div>
//                     ) : walletError ? (
//                         <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4">
//                             {walletError}
//                             <button
//                                 onClick={fetchWalletBalance}
//                                 className="ml-2 underline hover:text-black"
//                             >
//                                 Retry
//                             </button>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 mb-4">
//                                 <div>
//                                     <div className="text-sm text-gray-500">Available Balance</div>
//                                     <div className="text-2xl font-bold text-gray-900">₹{walletBalance.toFixed(2)}</div>
//                                 </div>

//                             </div>


//                             {walletBalance >= (total || 0) && (
//                                 <div className="mt-6 mb-2">
//                                     <div className="shadow-xl rounded-lg p-5 bg-gray-50">
//                                         <h3 className="font-medium text-gray-900 mb-4 flex items-center">
//                                             <LockIcon size={16} className="mr-2 text-gray-800" />
//                                             Security Verification
//                                         </h3>
//                                         <div className="flex items-center space-x-4">
//                                             <div className="bg-gradient-to-r from-black to-gray-800 text-white text-lg font-bold tracking-widest px-5 py-3 rounded-md select-none relative overflow-hidden">
//                                                 <div className="absolute inset-0 opacity-20">
//                                                     <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
//                                                 </div>
//                                                 <div className="relative">{captchaText}</div>
//                                             </div>
//                                             <button
//                                                 className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full"
//                                                 onClick={generateNewCaptcha}
//                                                 title="Generate new captcha"
//                                             >
//                                                 <RefreshCw size={18} />
//                                             </button>
//                                             <div className="mt-4 ml-30 mb-6">
//                                                 <label className="text-sm text-gray-700 block mb-1">Enter the code here</label>
//                                                 <input
//                                                     type="text"
//                                                     className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                                                     value={captchaInput}
//                                                     onChange={(e) => setCaptchaInput(e.target.value)}
//                                                     placeholder="Enter captcha"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {walletBalance >= (total || 0) && (
//                                 <button
//                                     className={`w-full mt-4 px-4 py-2 rounded-md ${!captchaInput || captchaInput !== captchaText || isProcessing
//                                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                         : 'bg-black text-white hover:bg-gray-800'
//                                         }`}
//                                     disabled={!captchaInput || captchaInput !== captchaText || isProcessing}
//                                     onClick={handleWalletPayment}
//                                 >
//                                     {isProcessing ? (
//                                         <span className="flex items-center justify-center">
//                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                             Processing...
//                                         </span>
//                                     ) : (
//                                         <span>Pay Now (₹{(total || 0).toFixed(2)})</span>
//                                     )}
//                                 </button>
//                             )}
//                         </>
//                     )}
//                 </div>
//             )}

//             {paymentMethod === 'paypal' && (
//                 <div className="shadow-2xl rounded-lg p-5 mb-6 bg-gray-50">
//                     <h3 className="font-medium text-gray-900 mb-4">PayPal Checkout</h3>

//                     {paypalError && (
//                         <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-black">
//                             {paypalError}
//                         </div>
//                     )}

//                     {paypalOrderID && (
//                         <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-gray-800">
//                             PayPal order created! Processing your order...
//                         </div>
//                     )}

//                     <div className="paypal-button-container">
//                         {isPending ? (
//                             <div className="flex justify-center items-center p-4">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
//                             </div>
//                         ) : (
//                             <PayPalButtons
//                                 createOrder={createPaypalOrder}
//                                 onApprove={onApprovePaypal}
//                                 onError={onPaypalError}
//                                 onCancel={() => console.log("PayPal transaction cancelled")}
//                                 style={{
//                                     layout: 'horizontal',
//                                     color: 'blue',
//                                     shape: 'rect',
//                                     label: 'pay'
//                                 }}
//                             />
//                         )}
//                     </div>

//                     <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
//                         <LockIcon size={12} className="mr-1" />
//                         Your payment information is secured by PayPal
//                     </div>
//                 </div>
//             )}

//             {paymentMethod === 'razorpay' && (
//                 <div className="shadow-lg rounded-lg p-5 mb-6 bg-gray-50">
//                     <h3 className="font-medium text-gray-900 mb-4">RazorPay Checkout</h3>
//                     <div className="flex flex-col items-center">
//                         <button
//                             onClick={() => {
//                                 processRazorpay()
//                             }}
//                             className={`w-full h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group

//                                  bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300  border-amber-300'
//                                 } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98]`}
//                         >
//                             <div className="flex items-center justify-center relative overflow-hidden">
//                                 <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
//                                 <span className="font-semibold">Pay with <span className="text-2xl italic text-blue-600 animate-pulse">Razorpay</span></span>
//                             </div>
//                         </button>
//                         <div className="text-gray-500 mt-3 text-sm flex ">{<Lock size={14} className='mr-1' />}Your payment information is secured by Razorpay</div>
//                     </div>
//                 </div>
//             )}


//             {paymentMethod === 'cod' && (
//                 <div className="mt-6 mb-8">
//                     <div className="shadow-xl rounded-lg p-5 bg-gray-50">
//                         <h3 className="font-medium text-gray-900 mb-4 flex items-center">
//                             <LockIcon size={16} className="mr-2 text-gray-800" />
//                             Security Verification
//                         </h3>
//                         <div className="flex items-center space-x-4">
//                             <div className="bg-gradient-to-r from-black to-gray-800 text-white text-lg font-bold tracking-widest px-5 py-3 rounded-md select-none relative overflow-hidden">
//                                 <div className="absolute inset-0 opacity-20">
//                                     <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
//                                 </div>
//                                 <div className="relative">{captchaText}</div>
//                             </div>
//                             <button
//                                 className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full"
//                                 onClick={generateNewCaptcha}
//                                 title="Generate new captcha"
//                             >
//                                 <RefreshCw size={18} />
//                             </button>
//                             <div className="mt-4 ml-30 mb-8">
//                                 <label className="text-sm text-gray-700 block mb-1">Enter the code here</label>
//                                 <input
//                                     type="text"
//                                     className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                                     value={captchaInput}
//                                     onChange={(e) => setCaptchaInput(e.target.value)}
//                                     placeholder="Enter captcha"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="flex items-center justify-between mt-6">
//                 <button
//                     className="text-gray-600 hover:text-black flex items-center transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
//                     onClick={() => dispatch(setCurrentStep('summary'))}
//                     disabled={isProcessing}
//                 >
//                     <ArrowLeft size={16} className="mr-1" />
//                     Back to Order Summary
//                 </button>

//                 {/* Show the place order button only for COD */}
//                 {paymentMethod === 'cod' && (
//                     <button
//                         className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center font-medium ${(!captchaInput || captchaInput !== captchaText || isProcessing)
//                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                             : 'bg-black text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
//                             }`}
//                         disabled={!captchaInput || captchaInput !== captchaText || isProcessing}
//                         onClick={handlePlaceOrder}
//                     >
//                         {isProcessing ? (
//                             <>
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 <LockIcon size={16} className="mr-2" />
//                                 Place Order (₹{total || '0.00'})
//                             </>
//                         )}
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Payment;










import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, CreditCard, LockIcon, RefreshCw, Smartphone, Building, Truck, Wallet, Plus, Lock } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { setCurrentStep } from '../../../store/slices/checkoutSlice';
import axios from 'axios';
import walletLogo from "../../../assets/images/walletLogo.jpg";
import paypalLogo from "../../../assets/images/paypalLogo.png";
import cashOnDelivery from "../../../assets/images/cashOnDeliveryLogo.jpg";
import razarpay from "../../../assets/images/razarpay.png";
import { toast } from 'react-toastify';
import { getWalletBalance, initiateRazorpayPayment } from '../../../services/walletService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Payment({ onPlaceOrder }) {
    const dispatch = useDispatch();
    const { order } = useSelector((state) => state.checkout);
    const total = useSelector((state) => state.checkout.totalPrice);
    const [{ isPending }] = usePayPalScriptReducer();

    const [captchaInput, setCaptchaInput] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [captchaText, setCaptchaText] = useState("R8T29C");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paypalOrderID, setPaypalOrderID] = useState(null);
    const [paypalError, setPaypalError] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isLoadingWallet, setIsLoadingWallet] = useState(true);
    const [walletError, setWalletError] = useState(null);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [showRechargeOptions, setShowRechargeOptions] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    // Generate a new captcha when component loads
    useEffect(() => {
        generateNewCaptcha();
        fetchWalletBalance();
    }, []);

    const fetchWalletBalance = async () => {
        setIsLoadingWallet(true);
        setWalletError(null);

        try {
            const response = await getWalletBalance()

            if (response.data.success) {
                setWalletBalance(response.data.balance);
            } else {
                setWalletError("Unable to fetch wallet balance. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            setWalletError("Unable to fetch wallet balance. Please try again.");
        } finally {
            setIsLoadingWallet(false);
        }
    };

    const generateNewCaptcha = () => {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaText(result);
        setCaptchaInput('');
    };

    const handleWalletPayment = () => {
        if (captchaInput !== captchaText) {
            return;
        }

        setIsProcessing(true);
        onPlaceOrder('wallet', captchaInput)
            .finally(() => setIsProcessing(false));
    };

    const handlePlaceOrder = () => {
        if (paymentMethod === 'cod' && captchaInput !== captchaText) {
            return;
        }

        setIsProcessing(true);
        onPlaceOrder(paymentMethod, paymentMethod === 'cod' ? captchaInput : captchaText, paypalOrderID)
            .finally(() => setIsProcessing(false));
    };

    const processRazorpay = async () => {
        try {
            if (paymentMethod === 'razorpay') {
                const orderTotal = (parseFloat(total) || 0).toFixed(2);

                const response = await initiateRazorpayPayment(orderTotal)

                console.log("Razorpay response:", response.data);

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
                                const verifyResponse = await onPlaceOrder("razorpay", '', orderDetails);
                                console.log("veryfyrespooo", verifyResponse);

                                if (verifyResponse.success) {
                                    // Payment verified successfully
                                    console.log("Payment verified successfully", verifyResponse);
                                    // Any additional success handling
                                } else {
                                    alert('Payment verification failed, please try again.');
                                }
                            } catch (error) {
                                console.error("Error verifying payment:", error);
                                alert('Payment verification failed, please try again.');
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
                } else {
                    throw new Error("Failed to create Razorpay order.");
                }
            }
        } catch (err) {
            console.error('Payment processing error:', err);
            toast.error('Payment processing failed. Please try again');
        }
    };

    const createPaypalOrder = (data, actions) => {
        const orderTotal = (parseFloat(total) || 0).toFixed(2);

        if (orderTotal <= 0) {
            console.error("Invalid order total for PayPal:", orderTotal);
            setPaypalError("Invalid order amount");
            return Promise.reject("Invalid order amount");
        }

        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: orderTotal,
                        currency_code: "USD"
                    },
                    description: "Order from Adiyo.in"
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    // Handle PayPal approval (no capture on frontend)
    const onApprovePaypal = (data, actions) => {
        console.log("PayPal payment approved with orderID:", data.orderID);

        setPaypalOrderID(data.orderID);
        setIsProcessing(true);

        // Call onPlaceOrder without capturing on frontend
        return onPlaceOrder('paypal', captchaText, data.orderID)
            .then(response => {
                console.log("Order placed successfully:", response);
                return response;
            })
            .catch(error => {
                console.error("Error during PayPal order processing:", error);
                setPaypalError(`Payment processing failed: ${error.message}`);
                throw error;
            })
            .finally(() => setIsProcessing(false));
    };

    const onPaypalError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError(`Payment failed: ${err.message}`);
    };

    const PaymentOption = ({ id, title, description, icon: Icon, isDisabled }) => (
        <div
            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === id ? 'border-black border-2 bg-gray-50' : 'border-gray-200'}`}
            onClick={() => {
                if (!isDisabled) {
                    setPaymentMethod(id);
                }
            }}
        >
            <div className="flex items-center">
                <input
                    type="radio"
                    id={id}
                    disabled={isDisabled}
                    checked={paymentMethod === id}
                    onChange={() => !isDisabled && setPaymentMethod(id)}
                    className="mr-2 sm:mr-3 h-4 w-4 text-black focus:ring-black black-radio"
                />
                <div className="flex items-center flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <img src={Icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{title}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{description}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PayPalOption = () => (
        <div
            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === 'paypal' ? 'border-black border-2 bg-gray-50' : 'border-gray-200'}`}
            onClick={() => setPaymentMethod('paypal')}
        >
            <div className="flex items-center">
                <input
                    type="radio"
                    id="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-2 sm:mr-3 h-4 w-4 text-black focus:ring-black black-radio"
                />
                <div className="flex items-center flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                        <img src={paypalLogo} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">PayPal</div>
                        <div className="text-xs sm:text-sm text-gray-500">Fast, secure payment</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200">
                <CreditCard className="text-black mr-2 sm:mr-3" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Options</h2>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <PaymentOption
                    id="wallet"
                    title="Wallet"
                    description={isLoadingWallet ? "Loading balance..." : `Available balance: ₹${walletBalance.toFixed(2)}`}
                    icon={walletLogo}
                />
                <PayPalOption />
                <PaymentOption
                    id="razorpay"
                    title="Razorpay"
                    description="Secure Transactions"
                    icon={razarpay}
                />
                <PaymentOption
                    id="cod"
                    title="Cash on Delivery"
                    description={(total < 1000) ? "Not available for orders below 1000" : "Pay when you receive the product"}
                    icon={cashOnDelivery}
                    isDisabled={(total < 1000) ? true : false}
                />
            </div>

            {/* Wallet payment */}
            {paymentMethod === 'wallet' && (
                <div className="rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Wallet Payment</h3>

                    {isLoadingWallet ? (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-800"></div>
                        </div>
                    ) : walletError ? (
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 text-sm">
                            {walletError}
                            <button
                                onClick={fetchWalletBalance}
                                className="ml-2 underline hover:text-black"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 mb-4">
                                <div>
                                    <div className="text-xs sm:text-sm text-gray-500">Available Balance</div>
                                    <div className="text-lg sm:text-2xl font-bold text-gray-900">₹{walletBalance.toFixed(2)}</div>
                                </div>
                            </div>

                            {walletBalance >= (total || 0) && (
                                <div className="mt-4 sm:mt-6 mb-2">
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
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {walletBalance >= (total || 0) && (
                                <button
                                    className={`w-full mt-4 px-4 py-2 rounded-md text-sm sm:text-base ${!captchaInput || captchaInput !== captchaText || isProcessing
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    disabled={!captchaInput || captchaInput !== captchaText || isProcessing}
                                    onClick={handleWalletPayment}
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span>Pay Now (₹{(total || 0).toFixed(2)})</span>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div className="shadow-xl sm:shadow-2xl rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">PayPal Checkout</h3>

                    {paypalError && (
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-black text-sm">
                            {paypalError}
                        </div>
                    )}

                    {paypalOrderID && (
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-gray-800 text-sm">
                            PayPal order created! Processing your order...
                        </div>
                    )}

                    <div className="paypal-button-container">
                        {isPending ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-800"></div>
                            </div>
                        ) : (
                            <PayPalButtons
                                createOrder={createPaypalOrder}
                                onApprove={onApprovePaypal}
                                onError={onPaypalError}
                                onCancel={() => console.log("PayPal transaction cancelled")}
                                style={{
                                    layout: 'horizontal',
                                    color: 'blue',
                                    shape: 'rect',
                                    label: 'pay'
                                }}
                            />
                        )}
                    </div>

                    <div className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center justify-center">
                        <LockIcon size={12} className="mr-1" />
                        Your payment information is secured by PayPal
                    </div>
                </div>
            )}

            {paymentMethod === 'razorpay' && (
                <div className="shadow-md sm:shadow-lg rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">RazorPay Checkout</h3>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => {
                                processRazorpay()
                            }}
                            className={`w-full h-12 sm:h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group
                                bg-gradient-to-r from-amber-100 to-amber-200 text-gray-700 hover:from-amber-200 hover:to-amber-300 border-amber-300
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-[0.98]`}
                        >
                            <div className="flex items-center justify-center relative overflow-hidden">
                                <span className="absolute inset-0 bg-white/10 rounded transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                                <span className="font-semibold text-sm sm:text-base">Pay with <span className="text-xl sm:text-2xl italic text-blue-600 animate-pulse">Razorpay</span></span>
                            </div>
                        </button>
                        <div className="text-gray-500 mt-3 text-xs sm:text-sm flex items-center">
                            <Lock size={12} className='mr-1' />
                            Your payment information is secured by Razorpay
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'cod' && (
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3 sm:gap-0">
                <button
                    className="text-gray-600 hover:text-black flex items-center justify-center transition-colors px-4 py-2 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                    onClick={() => dispatch(setCurrentStep('summary'))}
                    disabled={isProcessing}
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Order Summary
                </button>

                {/* Show the place order button only for COD */}
                {paymentMethod === 'cod' && (
                    <button
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-medium w-full sm:w-auto ${(!captchaInput || captchaInput !== captchaText || isProcessing)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                            }`}
                        disabled={!captchaInput || captchaInput !== captchaText || isProcessing}
                        onClick={handlePlaceOrder}
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <LockIcon size={16} className="mr-2" />
                                <span className="text-sm sm:text-base">Place Order (₹{total || '0.00'})</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Payment;