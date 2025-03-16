// import React, { useEffect, useState } from 'react';
// import {
//     MapPin, PlusCircle, CheckCircle, PencilIcon, Trash2,
//     ShoppingBag, CreditCard, Truck, ChevronRight, ArrowRight,
//     RefreshCw, LockIcon, ArrowLeft
// } from 'lucide-react';
// import axios from 'axios';
// import RenderPriceSummary from './RenderPriceSummary';
// import ManageAddresses from '../profile/ManageAddresses';
// import { useDispatch, useSelector } from 'react-redux';
// import { setCurrentStep } from '../../../store/slices/checkoutSlice';
// import Summary from './Summary';
// import Payment from './Payment';


// const API_BASE_URL = import.meta.env.VITE_API_URL;


// const Checkout = () => {

//     const dispatch = useDispatch()


//     const [addresses, setAddresses] = useState([
//         // {
//         //     _id: '1',
//         //     fullName: 'John Doe',
//         //     phoneNumber: '+91 9876543210',
//         //     address: '123 Tech Lane, Silicon Avenue',
//         //     landmark: 'Near Central Mall',
//         //     locality: 'Tech Park',
//         //     city: 'Bangalore',
//         //     state: 'Karnataka',
//         //     pincode: '560001',
//         //     addressType: 'Home',
//         //     isDefault: true,
//         //     isSelected: true
//         // },
//         // {
//         //     _id: '2',
//         //     fullName: 'John Doe',
//         //     phoneNumber: '+91 9876543211',
//         //     address: '456 Corporate Boulevard, Business District',
//         //     landmark: 'Opposite Metro Station',
//         //     locality: 'Financial Center',
//         //     city: 'Mumbai',
//         //     state: 'Maharashtra',
//         //     pincode: '400001',
//         //     addressType: 'Work',
//         //     isDefault: false,
//         //     isSelected: false
//         // }
//     ]);

//     const [product, setProduct] = useState({
//         _id: 'lt123',
//         name: 'MacBook Pro M3 Pro',
//         image: '/api/placeholder/200/150',
//         price: 179999,
//         discount: 10000,
//         quantity: 1,
//         tax: 14000,
//         shipping: 0
//     });

//     const [showModal, setShowModal] = useState(false);
//     const [activeAddress, setActiveAddress] = useState(null);
//     // const [step, setStep] = useState('address'); // address, summary, payment
//     // const [captchaInput, setCaptchaInput] = useState('');
//     // const [paymentMethod, setPaymentMethod] = useState('card');



//     const step = useSelector((state) => state.checkout.currentStep)


//     // Handle functions
//     const handleSelect = (id) => {
//         setAddresses(addresses.map(addr => ({
//             ...addr,
//             isSelected: addr._id === id
//         })));
//     };

//     const handleSetDefault = (id) => {
//         setAddresses(addresses.map(addr => ({
//             ...addr,
//             isDefault: addr._id === id ? true : false
//         })));
//     };

//     const handleDeleteAddress = (id) => {
//         setAddresses(addresses.filter(addr => addr._id !== id));
//     };

//     const handleModalClose = () => {
//         setShowModal(false);
//         setActiveAddress(null);
//     };

//     const handleQuantityChange = (change) => {
//         const newQty = Math.max(1, product.quantity + change);
//         setProduct({ ...product, quantity: newQty });
//     };

//     const getTypeIcon = (type) => {
//         if (type === 'Home') return <MapPin size={12} className="mr-1" />;
//         if (type === 'Work') return <ShoppingBag size={12} className="mr-1" />;
//         return null;
//     };


//     // const captchaText = "R8T29C";



//     return (
//         <div className="min-h-screen bg-gray-100 py-8">
//             <div className="max-w-7xl mx-auto px-4">
//                 <div className="flex items-center mb-6">
//                     <button
//                         className="text-gray-600 hover:text-black flex items-center"
//                         onClick={() => step !== 'address' ? dispatch(setCurrentStep('address')) : null}
//                     >
//                         <ArrowLeft size={18} className="mr-1" />
//                         Back
//                     </button>
//                     <h1 className="text-2xl font-semibold text-gray-900 ml-4">Checkout</h1>
//                 </div>

//                 {/* Progress indicator */}
//                 <div className="flex justify-center mb-8">
//                     <div className="flex items-center w-2/3">
//                         <div className={`flex flex-col items-center ${step === 'address' ? 'text-black' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
//                             <span className="text-xs mt-1">Address</span>
//                         </div>
//                         <div className={`flex-1 h-1 ${step === 'address' ? 'bg-gray-300' : 'bg-black'}`}></div>
//                         <div className={`flex flex-col items-center ${step === 'summary' ? 'text-black' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'summary' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
//                             <span className="text-xs mt-1">Summary</span>
//                         </div>
//                         <div className={`flex-1 h-1 ${step === 'payment' ? 'bg-black' : 'bg-gray-300'}`}></div>
//                         <div className={`flex flex-col items-center ${step === 'payment' ? 'text-black' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
//                             <span className="text-xs mt-1">Payment</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex flex-col md:flex-row gap-6">
//                     {/* Main Content */}
//                     <div className="w-full md:w-2/3 space-y-6">

//                         {step === 'address' && (
//                             <ManageAddresses checkOut={true} />
//                         )}

//                         {step === 'summary' && (
//                             <Summary />
//                         )}

//                         {step === 'payment' && (
//                             <Payment />
//                         )}
//                     </div>

//                     {/* Price Summary (Right Sidebar) */}
//                     <div className="w-full md:w-1/3 space-y-6">

//                         {<RenderPriceSummary product={product} />}

//                         <div className="bg-white p-4 rounded-lg">
//                             <div className="text-sm">
//                                 <div className="flex items-center mb-3">
//                                     <LockIcon size={14} className="mr-2 text-green-600" />
//                                     <span className="text-green-600 font-medium">Secure Checkout</span>
//                                 </div>
//                                 <div className="flex items-center mb-3">
//                                     <Truck size={14} className="mr-2 text-gray-600" />
//                                     <span className="text-gray-600">Free Delivery on orders above ₹5,000</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <RefreshCw size={14} className="mr-2 text-gray-600" />
//                                     <span className="text-gray-600">7 day replacement policy</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal placeholder for AddEditAddressModal component */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 max-w-lg w-full">
//                         <h2 className="text-xl font-semibold mb-4">{activeAddress ? 'Edit Address' : 'Add New Address'}</h2>
//                         <p className="text-gray-500 mb-8">This is a placeholder for the AddEditAddressModal component</p>
//                         <div className="flex justify-end">
//                             <button
//                                 className="mr-4 text-gray-500"
//                                 onClick={handleModalClose}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 className="bg-black text-white px-4 py-2 rounded-lg"
//                                 onClick={handleModalClose}
//                             >
//                                 {activeAddress ? 'Update Address' : 'Save Address'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Order Management (You would implement this separately) */}
//         </div>
//     );
// };

// export default Checkout;
























































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

// Import actions from Redux
import { setCurrentStep } from '../../../store/slices/checkoutSlice';

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

        if (!address || !address._id) {
            toast.error("Please select a shipping address");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare order data
            const orderData = {
                addressId: address._id,
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
                `${API_BASE_URL}/user/orders`,
                orderData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setOrderResponse(response.data.order);
                toast.success("Order placed successfully!");
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
        <div className="max-w-6xl mx-auto px-4 py-8 mt-[120px] mb-20">
            {/* Checkout Steps */}
            <div className="mb-10">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center w-1/4">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${currentStep === step.id ? 'bg-black text-white' :
                                steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500 text-white' : 'bg-gray-200'
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

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                {renderStepContent()}
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
    );
};

export default CheckoutPage;