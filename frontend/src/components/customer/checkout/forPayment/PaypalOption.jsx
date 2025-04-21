


// // import PropTypes from 'prop-types';

// // const PayPalOption = ({ setPaymentMethod }) => {
// //     return (
// //         <div
// //             className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${setPaymentMethod === 'paypal' ? 'border-black border-2 bg-gray-50' : 'border-gray-200'
// //                 }`}
// //             onClick={() => setPaymentMethod('paypal')}
// //         >
// //             <div className="flex items-center">
// //                 <input
// //                     type="radio"
// //                     id="paypal"
// //                     checked={setPaymentMethod === 'paypal'}
// //                     onChange={() => setPaymentMethod('paypal')}
// //                     className="mr-3 h-4 w-4 text-black focus:ring-black"
// //                 />
// //                 <div className="flex items-center flex-1">
// //                     <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
// //                         <img
// //                             src="https://via.placeholder.com/40"
// //                             alt="PayPal"
// //                             className="w-full h-full object-contain"
// //                         />
// //                     </div>
// //                     <div>
// //                         <div className="font-medium text-gray-900 text-base">PayPal</div>
// //                         <div className="text-sm text-gray-500">Fast, secure payment</div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // PayPalOption.propTypes = {
// //     setPaymentMethod: PropTypes.func.isRequired,
// // };

// // export default PayPalOption;








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











import PropTypes from 'prop-types';
import walletLogo from "../../../../assets/images/walletLogo.jpg";
import paypalLogo from "../../../../assets/images/paypalLogo.png";
import cashOnDelivery from "../../../../assets/images/cashOnDeliveryLogo.jpg";
import razarpay from "../../../../assets/images/razarpay.png";




const PayPalOption = ({ paymentMethod, setPaymentMethod }) => (
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
                className="mr-2 sm:mr-3 h-4 w-4 text-black focus:ring-black"
            />
            <div className="flex items-center flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <img src={paypalLogo} alt="PayPal" className="w-full h-full object-contain" />
                </div>
                <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">PayPal</div>
                    <div className="text-xs sm:text-sm text-gray-500">Fast, secure payment</div>
                </div>
            </div>
        </div>
    </div>
);

PayPalOption.propTypes = {
    paymentMethod: PropTypes.string.isRequired,
    setPaymentMethod: PropTypes.func.isRequired
};


export default PayPalOption