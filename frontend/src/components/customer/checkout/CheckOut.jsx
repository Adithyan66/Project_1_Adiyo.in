




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

const CheckoutPage = () => {
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

        // Pass the entire data structure to the sidebar component
        // It will handle the extraction of correct price, color, and size details
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

    const handlePlaceOrder = async (paymentMethod, captchaValue) => {
        // Validate captcha
        if (captchaValue === '') {
            toast.error("Please complete the captcha verification");
            return;
        }

        if (!address || !address[0]._id) {
            toast.error("Please select a shipping address");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare order data
            const orderData = {
                addressId: address[0]._id,
                productDetails: {
                    productId: order.productDetails._id,
                    productColor: order.productColor,
                    productSize: order.productSize,
                    quantity: order.quantity
                },
                paymentMethod: paymentMethod
            };

            // Send API request to create order
            const response = await axios.post(
                `${API_BASE_URL}/user/place-orders`,
                orderData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setOrderResponse(response.data.order);
                toast.success("Order placed successfully!");
                dispatch(setConfirmationData(response.data.order))
                dispatch(setCurrentStep('confirmation'));
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-[100px]">
            <div className="max-w-6xl mx-auto px-4  mb-20">
                {/* Checkout Steps */}
                <div className="mb-10 ">
                    <div className="flex justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center w-1/4">
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${currentStep === step.id ? 'bg-black text-white' :
                                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-black text-white' : 'bg-gray-200'
                                    }`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`text-sm font-medium ${currentStep === step.id ? 'text-black' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className="absolute left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conditional Layout based on current step */}
                {currentStep === 'confirmation' ? (
                    // Full width confirmation page
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <OrderConfirmation orderDetails={orderResponse} />
                    </div>
                ) : (
                    // Two-column Layout for other steps
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content Column */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-sm p-6">
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

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

export default CheckoutPage;