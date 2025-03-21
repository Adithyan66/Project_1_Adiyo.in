


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, CreditCard, LockIcon, RefreshCw, Smartphone, Building, Truck } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { setCurrentStep } from '../../../store/slices/checkoutSlice';

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
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
    });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    // Generate a new captcha when component loads
    useEffect(() => {
        generateNewCaptcha();
    }, []);

    // Generate a random captcha string
    const generateNewCaptcha = () => {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaText(result);
        setCaptchaInput('');
    };

    // Handle place order for COD
    const handlePlaceOrder = () => {
        if (paymentMethod === 'cod' && captchaInput !== captchaText) {
            return; // Button will be disabled for COD if captcha doesn't match
        }

        setIsProcessing(true);
        onPlaceOrder(paymentMethod, paymentMethod === 'cod' ? captchaInput : captchaText, paypalOrderID)
            .finally(() => setIsProcessing(false));
    };

    // Handle card payment submission
    const handleCardPayment = () => {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard) {
            return;
        }

        setIsProcessing(true);
        onPlaceOrder('card', captchaText)
            .finally(() => setIsProcessing(false));
    };

    // Handle UPI payment submission
    const handleUpiPayment = () => {
        if (!upiId) {
            return;
        }

        setIsProcessing(true);
        onPlaceOrder('upi', captchaText)
            .finally(() => setIsProcessing(false));
    };

    // Handle Net Banking payment submission
    const handleNetBankingPayment = () => {
        if (!selectedBank) {
            return;
        }

        setIsProcessing(true);
        onPlaceOrder('netbanking', captchaText)
            .finally(() => setIsProcessing(false));
    };

    // Create PayPal order
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
                        currency_code: "USD" // Adjust if needed
                    },
                    description: "Order from Your Store Name"
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

    // Handle PayPal errors
    const onPaypalError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError(`Payment failed: ${err.message}`);
    };

    // Handle card input changes
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const PaymentOption = ({ id, title, description, icon: Icon }) => (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setPaymentMethod(id)}
        >
            <div className="flex items-center">
                <input
                    type="radio"
                    id={id}
                    checked={paymentMethod === id}
                    onChange={() => setPaymentMethod(id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${paymentMethod === id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{title}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PayPalOption = () => (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setPaymentMethod('paypal')}
        >
            <div className="flex items-center">
                <input
                    type="radio"
                    id="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${paymentMethod === 'paypal' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <span className="text-blue-600 font-bold text-sm">PP</span>
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-500">Fast, secure payment</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
                <CreditCard className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Payment Options</h2>
            </div>

            <div className="space-y-4 mb-8">
                <PaymentOption
                    id="card"
                    title="Credit / Debit Card"
                    description="All major cards accepted"
                    icon={CreditCard}
                />
                <PayPalOption />
                <PaymentOption
                    id="upi"
                    title="UPI"
                    description="Pay using UPI apps"
                    icon={Smartphone}
                />
                <PaymentOption
                    id="netbanking"
                    title="Net Banking"
                    description="All major banks supported"
                    icon={Building}
                />
                <PaymentOption
                    id="cod"
                    title="Cash on Delivery"
                    description="Pay when you receive the product"
                    icon={Truck}
                />
            </div>

            {/* Payment details based on selected method */}
            {paymentMethod === 'card' && (
                <div className="border rounded-lg p-5 mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Card Details</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardInputChange}
                                className="border rounded-md pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleCardInputChange}
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardInputChange}
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Name on Card</label>
                            <input
                                type="text"
                                name="nameOnCard"
                                value={cardDetails.nameOnCard}
                                onChange={handleCardInputChange}
                                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="mt-2 flex items-center">
                            <div className="flex space-x-2">
                                <img src="/api/placeholder/40/25" alt="Visa" className="h-6 object-contain" />
                                <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6 object-contain" />
                                <img src="/api/placeholder/40/25" alt="American Express" className="h-6 object-contain" />
                            </div>
                            <div className="ml-auto text-xs text-gray-500 flex items-center">
                                <LockIcon size={12} className="mr-1" />
                                Secured by SSL
                            </div>
                        </div>
                        <button
                            className={`w-full mt-4 px-4 py-2 rounded-md ${!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard || isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            disabled={!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.nameOnCard || isProcessing}
                            onClick={handleCardPayment}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <span>Pay Now</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {paymentMethod === 'paypal' && (
                <div className="border rounded-lg p-5 mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">PayPal Checkout</h3>

                    {paypalError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                            {paypalError}
                        </div>
                    )}

                    {paypalOrderID && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
                            PayPal order created! Processing your order...
                        </div>
                    )}

                    <div className="paypal-button-container">
                        {isPending ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

                    <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                        <LockIcon size={12} className="mr-1" />
                        Your payment information is secured by PayPal
                    </div>
                </div>
            )}

            {paymentMethod === 'upi' && (
                <div className="border rounded-lg p-5 mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">UPI Details</h3>
                    <div>
                        <label className="text-sm text-gray-700 block mb-1">UPI ID</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Smartphone size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="border rounded-md pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="yourname@upi"
                            />
                        </div>
                        <div className="mt-4 flex justify-center space-x-6">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <img src="/api/placeholder/30/30" alt="UPI app" />
                                </div>
                                <span className="text-xs text-gray-600">PhonePe</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <img src="/api/placeholder/30/30" alt="UPI app" />
                                </div>
                                <span className="text-xs text-gray-600">GPay</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <img src="/api/placeholder/30/30" alt="UPI app" />
                                </div>
                                <span className="text-xs text-gray-600">Paytm</span>
                            </div>
                        </div>
                        <button
                            className={`w-full mt-6 px-4 py-2 rounded-md ${!upiId || isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            disabled={!upiId || isProcessing}
                            onClick={handleUpiPayment}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <span>Pay Now</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {paymentMethod === 'netbanking' && (
                <div className="border rounded-lg p-5 mb-6 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Select Bank</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                            <div
                                key={bank}
                                className={`border rounded-md p-3 text-center cursor-pointer hover:bg-white hover:shadow-md transition-all ${selectedBank === bank ? 'border-blue-600 bg-blue-50' : ''}`}
                                onClick={() => setSelectedBank(bank)}
                            >
                                <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Building size={18} className="text-gray-600" />
                                </div>
                                <div className="text-sm font-medium">{bank} Bank</div>
                            </div>
                        ))}
                    </div>
                    <button
                        className={`w-full mt-6 px-4 py-2 rounded-md ${!selectedBank || isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        disabled={!selectedBank || isProcessing}
                        onClick={handleNetBankingPayment}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </span>
                        ) : (
                            <span>Pay Now</span>
                        )}
                    </button>
                </div>
            )}

            {paymentMethod === 'cod' && (
                <div className="mt-6 mb-8">
                    <div className="border rounded-lg p-5 bg-gray-50">
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                            <LockIcon size={16} className="mr-2 text-blue-600" />
                            Security Verification
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-lg font-bold tracking-widest px-5 py-3 rounded-md select-none relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
                                </div>
                                <div className="relative">{captchaText}</div>
                            </div>
                            <button
                                className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full"
                                onClick={generateNewCaptcha}
                                title="Generate new captcha"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                        <div className="mt-4">
                            <label className="text-sm text-gray-700 block mb-1">Enter the code shown above</label>
                            <input
                                type="text"
                                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Enter captcha"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mt-6">
                <button
                    className="text-gray-600 hover:text-black flex items-center transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => dispatch(setCurrentStep('summary'))}
                    disabled={isProcessing}
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Order Summary
                </button>

                {/* Show the place order button only for COD */}
                {paymentMethod === 'cod' && (
                    <button
                        className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center font-medium ${(!captchaInput || captchaInput !== captchaText || isProcessing)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
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
                                Place Order (₹{order?.total || '0.00'})
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Payment;
