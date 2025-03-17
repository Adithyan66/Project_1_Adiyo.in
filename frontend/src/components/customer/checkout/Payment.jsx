// import { ArrowLeft, CreditCard, LockIcon, RefreshCw } from 'lucide-react'
// import React, { useState } from 'react'

// function Payment() {



//     const [captchaInput, setCaptchaInput] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState('card');

//     const captchaText = "R8T29C";




//     return (
//         <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center mb-6">
//                 <CreditCard className="text-black mr-2" size={24} />
//                 <h2 className="text-xl font-semibold text-gray-800">Payment Options</h2>
//             </div>

//             <div className="space-y-4 mb-8">
//                 <div
//                     className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
//                     onClick={() => setPaymentMethod('card')}
//                 >
//                     <div className="flex items-center">
//                         <input
//                             type="radio"
//                             checked={paymentMethod === 'card'}
//                             onChange={() => setPaymentMethod('card')}
//                             className="mr-3"
//                         />
//                         <div>
//                             <div className="font-medium">Credit / Debit Card</div>
//                             <div className="text-sm text-gray-500">All major cards accepted</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'upi' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
//                     onClick={() => setPaymentMethod('upi')}
//                 >
//                     <div className="flex items-center">
//                         <input
//                             type="radio"
//                             checked={paymentMethod === 'upi'}
//                             onChange={() => setPaymentMethod('upi')}
//                             className="mr-3"
//                         />
//                         <div>
//                             <div className="font-medium">UPI</div>
//                             <div className="text-sm text-gray-500">Pay using UPI apps</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'netbanking' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
//                     onClick={() => setPaymentMethod('netbanking')}
//                 >
//                     <div className="flex items-center">
//                         <input
//                             type="radio"
//                             checked={paymentMethod === 'netbanking'}
//                             onChange={() => setPaymentMethod('netbanking')}
//                             className="mr-3"
//                         />
//                         <div>
//                             <div className="font-medium">Net Banking</div>
//                             <div className="text-sm text-gray-500">All major banks supported</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
//                     onClick={() => setPaymentMethod('cod')}
//                 >
//                     <div className="flex items-center">
//                         <input
//                             type="radio"
//                             checked={paymentMethod === 'cod'}
//                             onChange={() => setPaymentMethod('cod')}
//                             className="mr-3"
//                         />
//                         <div>
//                             <div className="font-medium">Cash on Delivery</div>
//                             <div className="text-sm text-gray-500">Pay when you receive the product</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Captcha */}
//             <div className="mt-6 mb-8">
//                 <div className="border rounded-lg p-4">
//                     <h3 className="font-medium text-gray-900 mb-4">Verification</h3>
//                     <div className="flex items-center space-x-4">
//                         <div className="bg-gray-800 text-white text-lg font-bold tracking-widest px-4 py-2 rounded select-none">
//                             {captchaText}
//                         </div>
//                         <button className="text-black">
//                             <RefreshCw size={18} />
//                         </button>
//                     </div>
//                     <div className="mt-3">
//                         <label className="text-sm text-gray-700 block mb-1">Enter the code shown above</label>
//                         <input
//                             type="text"
//                             className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                             value={captchaInput}
//                             onChange={(e) => setCaptchaInput(e.target.value)}
//                             placeholder="Enter captcha"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="flex items-center justify-between mt-6">
//                 <button
//                     className="text-gray-600 hover:text-black flex items-center"
//                     onClick={() => dispatch(setCurrentStep('summary'))}
//                 >
//                     <ArrowLeft size={16} className="mr-1" />
//                     Back to Order Summary
//                 </button>

//                 <button
//                     className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center"
//                     disabled={!captchaInput || captchaInput !== captchaText}
//                 >
//                     <LockIcon size={16} className="mr-2" />
//                     Place Order
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default Payment















import { ArrowLeft, CreditCard, LockIcon, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep } from '../../../store/slices/checkoutSlice';

function Payment({ onPlaceOrder }) {

    const dispatch = useDispatch();
    const { order } = useSelector((state) => state.checkout);

    const [captchaInput, setCaptchaInput] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [captchaText, setCaptchaText] = useState("R8T29C");
    const [isProcessing, setIsProcessing] = useState(false);

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
        // setCaptchaText(result);
        setCaptchaText("a")
        setCaptchaInput('');
    };

    // Handle place order button click
    const handlePlaceOrder = () => {
        if (captchaInput !== captchaText) {
            return; // Button will be disabled, but extra check
        }

        setIsProcessing(true);

        // Call the parent component's order handler
        onPlaceOrder(paymentMethod, captchaInput)
            .finally(() => setIsProcessing(false));
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-6">
                <CreditCard className="text-black mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Payment Options</h2>
            </div>

            <div className="space-y-4 mb-8">
                <div
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('card')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="mr-3"
                        />
                        <div>
                            <div className="font-medium">Credit / Debit Card</div>
                            <div className="text-sm text-gray-500">All major cards accepted</div>
                        </div>
                    </div>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'upi' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('upi')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="mr-3"
                        />
                        <div>
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-gray-500">Pay using UPI apps</div>
                        </div>
                    </div>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'netbanking' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('netbanking')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'netbanking'}
                            onChange={() => setPaymentMethod('netbanking')}
                            className="mr-3"
                        />
                        <div>
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-gray-500">All major banks supported</div>
                        </div>
                    </div>
                </div>

                <div
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('cod')}
                >
                    <div className="flex items-center">
                        <input
                            type="radio"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="mr-3"
                        />
                        <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">Pay when you receive the product</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment details based on selected method */}
            {paymentMethod === 'card' && (
                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Card Details</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Card Number</label>
                            <input
                                type="text"
                                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">CVV</label>
                                <input
                                    type="text"
                                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-700 block mb-1">Name on Card</label>
                            <input
                                type="text"
                                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'upi' && (
                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">UPI Details</h3>
                    <div>
                        <label className="text-sm text-gray-700 block mb-1">UPI ID</label>
                        <input
                            type="text"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="yourname@upi"
                        />
                    </div>
                </div>
            )}

            {paymentMethod === 'netbanking' && (
                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Select Bank</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                            <div
                                key={bank}
                                className="border rounded-md p-2 text-center cursor-pointer hover:bg-gray-50"
                            >
                                {bank} Bank
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Captcha */}
            <div className="mt-6 mb-8">
                <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Verification</h3>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-800 text-white text-lg font-bold tracking-widest px-4 py-2 rounded select-none">
                            {captchaText}
                        </div>
                        <button
                            className="text-black"
                            onClick={generateNewCaptcha}
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    <div className="mt-3">
                        <label className="text-sm text-gray-700 block mb-1">Enter the code shown above</label>
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

            {/* Order Summary */}
            {/* <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                {order.productDetails && (
                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Product:</span>
                            <span className="font-medium">{order.productDetails.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Size:</span>
                            <span>{order.productSize}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Color:</span>
                            <div className="flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: order.productColor }}
                                ></div>
                                <span>{order.productColor}</span>
                            </div>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Quantity:</span>
                            <span>{order.quantity}</span>
                        </div>
                    </div>
                )}

                <div className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Subtotal:</span>
                        <span>₹{order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Shipping:</span>
                        <span>{order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity > 999 ? 'Free' : '₹99'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Tax (18%):</span>
                        <span>₹{Math.round(order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity * 0.18)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>₹{
                            order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity +
                            (order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity > 999 ? 0 : 99) +
                            Math.round(order.productDetails?.colors.find(c => c.color === order.productColor)?.discountPrice * order.quantity * 0.18)
                        }</span>
                    </div>
                </div>
            </div> */}

            <div className="flex items-center justify-between mt-6">
                <button
                    className="text-gray-600 hover:text-black flex items-center"
                    onClick={() => dispatch(setCurrentStep('summary'))}
                    disabled={isProcessing}
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Order Summary
                </button>

                <button
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                            Place Order
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Payment;