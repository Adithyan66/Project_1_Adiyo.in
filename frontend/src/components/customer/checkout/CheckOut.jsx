


// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { CreditCard, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
// import AddressSelection from '../../customer/profile/ManageAddresses';
// import OrderSummary from './Summary';
// import Payment from './Payment';
// import OrderConfirmation from './OrderConfirmation';
// import OrderSummarySidebar from './OrderSummarySidebar';
// import { setCurrentStep, setConfirmationData } from '../../../store/slices/checkoutSlice';
// import { placeOrder } from '../../../services/checkoutService';




// const CheckOut = () => {



//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { currentStep, address, order, payment, coupon } = useSelector((state) => state.checkout);
//     const [orderResponse, setOrderResponse] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const steps = [
//         { id: 'address', label: 'Shipping Address', icon: Truck },
//         { id: 'summary', label: 'Order Summary', icon: ShoppingBag },
//         { id: 'payment', label: 'Payment', icon: CreditCard },
//         { id: 'confirmation', label: 'Confirmation', icon: CheckCircle }
//     ];

//     const calculateOrderSummary = () => {
//         if (!order?.productDetails) return null;

//         return {
//             productCategory: order.productDetails.category,
//             productDetails: order.productDetails,
//             productColor: order.productColor,
//             productSize: order.productSize,
//             quantity: order.quantity,
//             deliveryCharge: 0,
//             estimatedDeliveryDays: "3-5",
//             paymentMethod: payment?.method || "Credit Card"
//         };
//     };

//     useEffect(() => {

//         if (!order.productDetails && currentStep !== 'confirmation') {
//             toast.error("No product selected for checkout");
//             navigate('/');
//             return;
//         }

//         if (currentStep === 'confirmation' && !orderResponse) {
//             dispatch(setCurrentStep('address'));
//         }
//     }, [order.productDetails, currentStep, navigate, dispatch, orderResponse]);

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 'address':
//                 return <AddressSelection checkOut={true} renderStepContent={renderStepContent} />;
//             case 'summary':
//                 return <OrderSummary />;
//             case 'payment':
//                 return <Payment onPlaceOrder={handlePlaceOrder} />;
//             case 'confirmation':
//                 return <OrderConfirmation orderDetails={orderResponse} />;
//             default:
//                 return null;
//         }
//     };

//     const handlePlaceOrder = async (paymentMethod, captchaValue, orderId) => {

//         console.log("handlePlaceOrder called with:", { paymentMethod, captchaValue, orderId });

//         if (paymentMethod === 'cod' && captchaValue === '') {
//             toast.error("Please complete the captcha verification");
//             return Promise.reject(new Error("Captcha verification required"));
//         }

//         if (!address || !address[0]._id) {
//             toast.error("Please select a shipping address");
//             return Promise.reject(new Error("Shipping address required"));
//         }

//         if (paymentMethod === 'paypal' && !orderId) {
//             toast.error("PayPal payment not completed. Please try again.");
//             return Promise.reject(new Error("PayPal order ID missing"));
//         }

//         if (paymentMethod === "razorpay" && !orderId) {
//             toast.error("razorpay payment not completed. Please try again.");
//             return Promise.reject(new Error("razorpay order ID missing"));
//         }

//         setIsLoading(true);

//         try {
//             const orderData = {
//                 addressId: address[0]._id,
//                 productDetails: {
//                     productId: order.productDetails._id,
//                     productColor: order.productColor,
//                     productSize: order.productSize,
//                     quantity: order.quantity,
//                 },
//                 paymentMethod: paymentMethod,
//                 ...(paymentMethod === 'paypal' && {
//                     paypalOrderID: orderId,
//                 }),
//                 ...(paymentMethod === 'razorpay' && {
//                     razorpayOrderDetails: {
//                         razorpay_order_id: orderId.razorpay_order_id,
//                         razorpay_payment_id: orderId.razorpay_payment_id,
//                         razorpay_signature: orderId.razorpay_signature
//                     }
//                 }),
//                 couponCode: coupon

//             };

//             console.log("Sending order data to API:", orderData);

//             const response = await placeOrder(orderData);


//             console.log("API response:", response.data);

//             if (response.data.success) {
//                 setOrderResponse(response.data.order);
//                 toast.success("Order placed successfully!");
//                 dispatch(setConfirmationData(response.data.order));
//                 dispatch(setCurrentStep('confirmation'));
//                 return response.data;
//             }
//         } catch (error) {
//             console.error("Error placing order:", error);
//             toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
//             throw error;
//         } finally {
//             setIsLoading(false);
//         }
//     };




//     return (
//         <div className="mt-[100px]">
//             <div className="max-w-[1500px] mx-auto px-2 mb-20">
//                 <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Vertical Checkout Steps (Left Side) */}
//                     <div className="lg:w-1/6 ">
//                         <div className="bg-white rounded-lg shadow-sm p-4 sticky top-40">
//                             <div className="flex flex-col">
//                                 {steps.map((step, index) => (
//                                     <div key={step.id} className="mb-6 last:mb-0">
//                                         <div className="flex items-center">
//                                             <div className={`flex items-center justify-center w-12 h-12 rounded-full 
//                                             ${currentStep === step.id ? 'bg-black text-white' :
//                                                     steps.findIndex(s => s.id === currentStep) > index ? 'bg-black text-white' : 'bg-gray-200'}`}>
//                                                 <step.icon size={20} />
//                                             </div>
//                                             <span className={`ml-3 text-sm font-medium ${currentStep === step.id ? 'text-black' : 'text-gray-500'}`}>
//                                                 {step.label}
//                                             </span>
//                                         </div>

//                                         {/* Arrow between steps */}
//                                         {index < steps.length - 1 && (
//                                             <div className="ml-4 my-2 h-8 w-px relative">
//                                                 <div className="absolute left-0 top-0 bottom-0 w-px "></div>
//                                                 <div
//                                                     className={`absolute left-1 top-0 w-px ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-black h-full border-4 ' : 'bg-gray-200 h-0 border-4'
//                                                         } transition-all duration-300`}
//                                                 ></div>
//                                                 <div className={`absolute -left-[3px] bottom-0 transform rotate-45 w-6 h-6 ${steps.findIndex(s => s.id === currentStep) > index ? ' border-r-4 border-black border-b-4 ' : 'border-r-4 border-b-4 border-gray-200'
//                                                     }`}></div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content Area */}
//                     <div className="lg:w-3/4">
//                         {currentStep === 'confirmation' ? (
//                             // Full width confirmation page
//                             <div className="bg-white rounded-lg shadow-sm p-4">
//                                 <OrderConfirmation orderDetails={orderResponse} />
//                             </div>
//                         ) : (
//                             // Two-column Layout for other steps
//                             <div className="flex flex-col lg:flex-row gap-6">
//                                 {/* Main Content Column */}
//                                 <div className="lg:w-2/3">
//                                     <div className="bg-white rounded-lg shadow-sm p-4">
//                                         {renderStepContent()}
//                                     </div>
//                                 </div>

//                                 {/* Sidebar Column */}
//                                 {order?.productDetails && (
//                                     <div className="lg:w-1/3 ">
//                                         <OrderSummarySidebar orderDetails={calculateOrderSummary()} />
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Loading Overlay */}
//                 {isLoading && (
//                     <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white p-5 rounded-lg shadow-lg flex items-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
//                             <span>Processing your order...</span>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CheckOut;









import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import AddressSelection from '../../customer/profile/ManageAddresses';
import OrderSummary from './Summary';
import Payment from './Payment';
import OrderConfirmation from './OrderConfirmation';
import OrderSummarySidebar from './OrderSummarySidebar';
import { setCurrentStep, setConfirmationData } from '../../../store/slices/checkoutSlice';
import { placeOrder } from '../../../services/checkoutService';

const CheckOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentStep, address, order, payment, coupon } = useSelector((state) => state.checkout);
    const [orderResponse, setOrderResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        { id: 'address', label: 'Shipping Address', icon: Truck },
        { id: 'summary', label: 'Order Summary', icon: ShoppingBag },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'confirmation', label: 'Confirmation', icon: CheckCircle }
    ];

    const calculateOrderSummary = () => {
        if (!order?.productDetails) return null;

        return {
            productCategory: order.productDetails.category,
            productDetails: order.productDetails,
            productColor: order.productColor,
            productSize: order.productSize,
            quantity: order.quantity,
            deliveryCharge: 0,
            estimatedDeliveryDays: "3-5",
            paymentMethod: payment?.method || "Credit Card"
        };
    };

    useEffect(() => {
        if (!order.productDetails && currentStep !== 'confirmation') {
            toast.error("No product selected for checkout");
            navigate('/');
            return;
        }

        if (currentStep === 'confirmation' && !orderResponse) {
            dispatch(setCurrentStep('address'));
        }
    }, [order.productDetails, currentStep, navigate, dispatch, orderResponse]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 'address':
                return <AddressSelection checkOut={true} renderStepContent={renderStepContent} />;
            case 'summary':
                return <OrderSummary />;
            case 'payment':
                return <Payment onPlaceOrder={handlePlaceOrder} />;
            case 'confirmation':
                return <OrderConfirmation orderDetails={orderResponse} />;
            default:
                return null;
        }
    };

    const handlePlaceOrder = async (paymentMethod, captchaValue, orderId) => {
        console.log("handlePlaceOrder called with:", { paymentMethod, captchaValue, orderId });

        if (paymentMethod === 'cod' && captchaValue === '') {
            toast.error("Please complete the captcha verification");
            return Promise.reject(new Error("Captcha verification required"));
        }

        if (!address || !address[0]._id) {
            toast.error("Please select a shipping address");
            return Promise.reject(new Error("Shipping address required"));
        }

        if (paymentMethod === 'paypal' && !orderId) {
            toast.error("PayPal payment not completed. Please try again.");
            return Promise.reject(new Error("PayPal order ID missing"));
        }

        if (paymentMethod === "razorpay" && !orderId) {
            toast.error("razorpay payment not completed. Please try again.");
            return Promise.reject(new Error("razorpay order ID missing"));
        }

        setIsLoading(true);

        try {
            const orderData = {
                addressId: address[0]._id,
                productDetails: {
                    productId: order.productDetails._id,
                    productColor: order.productColor,
                    productSize: order.productSize,
                    quantity: order.quantity,
                },
                paymentMethod: paymentMethod,
                ...(paymentMethod === 'paypal' && {
                    paypalOrderID: orderId,
                }),
                ...(paymentMethod === 'razorpay' && {
                    razorpayOrderDetails: {
                        razorpay_order_id: orderId.razorpay_order_id,
                        razorpay_payment_id: orderId.razorpay_payment_id,
                        razorpay_signature: orderId.razorpay_signature
                    }
                }),
                couponCode: coupon
            };

            console.log("Sending order data to API:", orderData);

            const response = await placeOrder(orderData);
            console.log("API response:", response.data);

            if (response.data.success) {
                setOrderResponse(response.data.order);
                toast.success("Order placed successfully!");
                dispatch(setConfirmationData(response.data.order));
                dispatch(setCurrentStep('confirmation'));
                return response.data;
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-[100px]">
            <div className="max-w-[1500px] mx-auto px-2 mb-20">
                {/* Mobile Horizontal Steps - Only shown on mobile */}
                <div className="lg:hidden mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                                        ${currentStep === step.id ? 'bg-black text-white' :
                                            steps.findIndex(s => s.id === currentStep) > index ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                        <step.icon size={18} />
                                    </div>
                                    <span className="text-xs mt-1 text-center font-medium">
                                        {currentStep === step.id && step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vertical Checkout Steps (Left Side) - Only visible on desktop */}
                    <div className="hidden lg:block lg:w-1/6">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-40">
                            <div className="flex flex-col">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="mb-6 last:mb-0">
                                        <div className="flex items-center">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-full 
                                            ${currentStep === step.id ? 'bg-black text-white' :
                                                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                                <step.icon size={20} />
                                            </div>
                                            <span className={`ml-3 text-sm font-medium ${currentStep === step.id ? 'text-black' : 'text-gray-500'}`}>
                                                {step.label}
                                            </span>
                                        </div>

                                        {/* Arrow between steps */}
                                        {index < steps.length - 1 && (
                                            <div className="ml-4 my-2 h-8 w-px relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-px"></div>
                                                <div
                                                    className={`absolute left-1 top-0 w-px ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-black h-full border-4 ' : 'bg-gray-200 h-0 border-4'
                                                        } transition-all duration-300`}
                                                ></div>
                                                <div className={`absolute -left-[3px] bottom-0 transform rotate-45 w-6 h-6 ${steps.findIndex(s => s.id === currentStep) > index ? ' border-r-4 border-black border-b-4 ' : 'border-r-4 border-b-4 border-gray-200'
                                                    }`}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:w-3/4 w-full">
                        {currentStep === 'confirmation' ? (
                            // Full width confirmation page
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <OrderConfirmation orderDetails={orderResponse} />
                            </div>
                        ) : (
                            // Two-column Layout for other steps (responsive)
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Main Content Column */}
                                <div className="lg:w-2/3 w-full">
                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                        {renderStepContent()}
                                    </div>
                                </div>

                                {/* Sidebar Column */}
                                {order?.productDetails && (
                                    <div className="lg:w-1/3 w-full mt-6 lg:mt-0">
                                        <OrderSummarySidebar orderDetails={calculateOrderSummary()} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
                            <span>Processing your order...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckOut;