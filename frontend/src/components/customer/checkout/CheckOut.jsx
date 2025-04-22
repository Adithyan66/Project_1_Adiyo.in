



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import AddressSelection from '../../customer/profile/ManageAddresses';
import useCheckout from '../../../hooks/user/checkout/useCheckOut';

const Checkout = ({
    checkoutState,
    setCurrentStep,
    setConfirmationData,
    clearCart,
    isCartCheckout = false,
    OrderSummaryComponent,
    PaymentComponent,
    OrderConfirmationComponent,
    OrderFailureComponent,
    OrderSummarySidebarComponent
}) => {
    const navigate = useNavigate();

    const {
        currentStep,
        orderResponse,
        isLoading,
        calculateOrderSummary,
        handlePlaceOrder
    } = useCheckout({
        checkoutState,
        setCurrentStep,
        setConfirmationData,
        clearCart,
        isCartCheckout,
        navigate,
        toast
    });

    const steps = [
        { id: 'address', label: 'Shipping Address', icon: Truck },
        { id: 'summary', label: 'Order Summary', icon: ShoppingBag },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'confirmation', label: 'Confirmation', icon: CheckCircle }
    ];

    console.log("is cartcheck out true or false ", isCartCheckout);

    const renderStepContent = () => {
        switch (currentStep) {
            case 'address':
                return <AddressSelection checkOut={true} />;
            case 'summary':
                return <OrderSummaryComponent isCartCheckout={isCartCheckout} />;
            case 'payment':
                return <PaymentComponent onPlaceOrder={handlePlaceOrder} cartOrder={isCartCheckout} />;
            case 'confirmation':
                return <OrderConfirmationComponent orderDetails={orderResponse} isCartCheckout={isCartCheckout} />;
            default: return null;
        }
    };

    if (isLoading) {
        return (
            <div>
                <h1>Processing...</h1>
            </div>
        );
    }

    return (
        <div className="mt-[100px]">
            <div className="max-w-[1500px] mx-auto px-2 mb-20">
                {/* Mobile Horizontal Steps */}
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
                    {/* Vertical Checkout Steps (Desktop) */}
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
                                        {index < steps.length - 1 && (
                                            <div className="ml-4 my-2 h-8 w-px relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-px"></div>
                                                <div
                                                    className={`absolute left-1 top-0 w-px ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-black h-full border-4' : 'bg-gray-200 h-0 border-4'} transition-all duration-300`}
                                                ></div>
                                                <div className={`absolute -left-[3px] bottom-0 transform rotate-45 w-6 h-6 ${steps.findIndex(s => s.id === currentStep) > index ? 'border-r-4 border-black border-b-4' : 'border-r-4 border-b-4 border-gray-200'}`}></div>
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
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <OrderConfirmationComponent orderDetails={orderResponse} isCartCheckout={isCartCheckout} />
                            </div>
                        ) : currentStep === 'failure' ? (
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <OrderFailureComponent orderData={orderResponse} />
                            </div>) : (
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-2/3 w-full">
                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                        {renderStepContent()}
                                    </div>
                                </div>
                                {calculateOrderSummary()?.items?.length > 0 && (
                                    <div className="lg:w-1/3 w-full mt-6 lg:mt-0">
                                        <OrderSummarySidebarComponent orderDetails={calculateOrderSummary()} isCartCheckout={isCartCheckout} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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

export default Checkout;