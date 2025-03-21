


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreditCard, ShoppingBag, Truck, CheckCircle } from 'lucide-react';

// Import components
import AddressSelection from '../../customer/profile/ManageAddresses';
import OrderSummary from './Summary';
import Payment from './Payment';
import OrderConfirmation from './OrderConfirmation';
import OrderSummarySidebar from './OrderSummarySidebar';

// Import actions from Redux
import { setCurrentStep, setConfirmationData } from '../../../store/slices/checkoutSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CheckOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentStep, address, order, payment } = useSelector((state) => state.checkout);
    const [orderResponse, setOrderResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Steps in checkout process
    const steps = [
        { id: 'address', label: 'Shipping Address', icon: Truck },
        { id: 'summary', label: 'Order Summary', icon: ShoppingBag },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'confirmation', label: 'Confirmation', icon: CheckCircle }
    ];

    // Calculate order summary for sidebar - Fixed to properly access nested data
    const calculateOrderSummary = () => {
        if (!order?.productDetails) return null;

        return {
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
        // Redirect back to product page if no product is selected
        if (!order.productDetails && currentStep !== 'confirmation') {
            toast.error("No product selected for checkout");
            navigate('/');
            return;
        }

        // If user directly accesses confirmation without completing order
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

    const handlePlaceOrder = async (paymentMethod, captchaValue, paypalOrderID) => {

        console.log("handlePlaceOrder called with:", { paymentMethod, captchaValue, paypalOrderID });

        if (paymentMethod === 'cod' && captchaValue === '') {
            toast.error("Please complete the captcha verification");
            return Promise.reject(new Error("Captcha verification required"));
        }

        if (!address || !address[0]._id) {
            toast.error("Please select a shipping address");
            return Promise.reject(new Error("Shipping address required"));
        }

        // Additional validation for PayPal
        if (paymentMethod === 'paypal' && !paypalOrderID) {
            toast.error("PayPal payment not completed. Please try again.");
            return Promise.reject(new Error("PayPal order ID missing"));
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
                // Include PayPal-specific data if applicable
                ...(paymentMethod === 'paypal' && {
                    paypalOrderID: paypalOrderID, // Send PayPal order ID to backend
                }),
            };

            console.log("Sending order data to API:", orderData);

            const response = await axios.post(
                `${API_BASE_URL}/user/place-orders`,
                orderData,
                { withCredentials: true }
            );

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
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vertical Checkout Steps (Left Side) */}
                    <div className="lg:w-1/6">
                        <div className="bg-white rounded-lg shadow-sm p-4">
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
                                            <div className="ml-6 my-2 h-8 w-px relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                                                <div
                                                    className={`absolute left-0 top-0 w-px ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-black h-full' : 'bg-gray-200 h-0'
                                                        } transition-all duration-300`}
                                                ></div>
                                                <div className={`absolute -left-[3px] bottom-0 transform rotate-45 w-2 h-2 ${steps.findIndex(s => s.id === currentStep) > index ? 'border-r border-b border-black' : 'border-r border-b border-gray-200'
                                                    }`}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:w-3/4">
                        {currentStep === 'confirmation' ? (
                            // Full width confirmation page
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <OrderConfirmation orderDetails={orderResponse} />
                            </div>
                        ) : (
                            // Two-column Layout for other steps
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Main Content Column */}
                                <div className="lg:w-2/3">
                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                        {renderStepContent()}
                                    </div>
                                </div>

                                {/* Sidebar Column */}
                                {order?.productDetails && (
                                    <div className="lg:w-1/3">
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