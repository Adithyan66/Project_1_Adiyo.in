


// // import PropTypes from 'prop-types';

// // const PaymentOption = ({ id, title, description, icon, isDisabled, fetchWalletBalance, setPaymentMethod }) => {

// //     return (
// //         <div
// //             className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${setPaymentMethod === id ? 'border-black border-2 bg-gray-50' : 'border-gray-200'
// //                 } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
// //             onClick={() => {
// //                 if (!isDisabled) {
// //                     setPaymentMethod(id);
// //                     if (id === 'wallet' && fetchWalletBalance) fetchWalletBalance();
// //                 }
// //             }}
// //         >
// //             <div className="flex items-center">
// //                 <input
// //                     type="radio"
// //                     id={id}
// //                     disabled={isDisabled}
// //                     checked={setPaymentMethod === id}
// //                     onChange={() => !isDisabled && setPaymentMethod(id)}
// //                     className="mr-3 h-4 w-4 text-black focus:ring-black"
// //                 />
// //                 <div className="flex items-center flex-1">
// //                     <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
// //                         <img src={icon} alt={title} className="w-full h-full object-contain" />
// //                     </div>
// //                     <div>
// //                         <div className="font-medium text-gray-900 text-base">{title}</div>
// //                         <div className="text-sm text-gray-500">{description}</div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // PaymentOption.propTypes = {
// //     id: PropTypes.string.isRequired,
// //     title: PropTypes.string.isRequired,
// //     description: PropTypes.string.isRequired,
// //     icon: PropTypes.string.isRequired,
// //     isDisabled: PropTypes.bool,
// //     fetchWalletBalance: PropTypes.func,
// //     setPaymentMethod: PropTypes.func.isRequired,
// // };

// // PaymentOption.defaultProps = {
// //     isDisabled: false,
// //     fetchWalletBalance: null,
// // };

// // export default PaymentOption;








// import PropTypes from 'prop-types';

// const PayPalOption = ({ paymentMethod, setPaymentMethod }) => {
//     return (
//         <div
//             className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === 'paypal' ? 'border-black border-2 bg-gray-50' : 'border-gray-200'
//                 }`}
//             onClick={() => setPaymentMethod('paypal')}
//         >
//             <div className="flex items-center">
//                 <input
//                     type="radio"
//                     id="paypal"
//                     checked={paymentMethod === 'paypal'}
//                     onChange={() => setPaymentMethod('paypal')}
//                     className="mr-3 h-4 w-4 text-black focus:ring-black"
//                 />
//                 <div className="flex items-center flex-1">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
//                         <img
//                             src="https://via.placeholder.com/40"
//                             alt="PayPal"
//                             className="w-full h-full object-contain"
//                         />
//                     </div>
//                     <div>
//                         <div className="font-medium text-gray-900 text-base">PayPal</div>
//                         <div className="text-sm text-gray-500">Fast, secure payment</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// PayPalOption.propTypes = {
//     paymentMethod: PropTypes.string.isRequired,
//     setPaymentMethod: PropTypes.func.isRequired,
// };

// export default PayPalOption;




// src/components/checkout/Payment/PaymentOptions.jsx
import React from 'react';
import PropTypes from 'prop-types';
import walletLogo from "../../../../assets/images/walletLogo.jpg";
import paypalLogo from "../../../../assets/images/paypalLogo.png";
import cashOnDelivery from "../../../../assets/images/cashOnDeliveryLogo.jpg";
import razarpay from "../../../../assets/images/razarpay.png";






const PaymentOption = ({ id, title, description, icon, isDisabled, paymentMethod, setPaymentMethod }) => (

    <div
        className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === id ? 'border-black border-2 bg-gray-50' : 'border-gray-200'}`}
        onClick={() => !isDisabled && setPaymentMethod(id)}
    >
        <div className="flex items-center">
            <input
                type="radio"
                id={id}
                disabled={isDisabled}
                checked={paymentMethod === id}
                onChange={() => !isDisabled && setPaymentMethod(id)}
                className="mr-2 sm:mr-3 h-4 w-4 text-black focus:ring-black"
            />
            <div className="flex items-center flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <img src={icon} alt={title} className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{title}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{description}</div>
                </div>
            </div>
        </div>
    </div>
);

PaymentOption.PropTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    paymentMethod: PropTypes.string.isRequired,
    setPaymentMethod: PropTypes.func.isRequired
};



export default PaymentOption