// import HttpStatusCode from "../utils/httpStatusCodes.js";
// const {
//     OK,
//     CREATED,
//     ACCEPTED,
//     NO_CONTENT,
//     BAD_REQUEST,
//     UNAUTHORIZED,
//     FORBIDDEN,
//     NOT_FOUND,
//     METHOD_NOT_ALLOWED,
//     CONFLICT,
//     UNPROCESSABLE_ENTITY,
//     INTERNAL_SERVER_ERROR,
//     BAD_GATEWAY,
//     SERVICE_UNAVAILABLE,
//     GATEWAY_TIMEOUT
// } = HttpStatusCode

// import { razorpay } from "../middlewares/razopay.js";


// export const addMoneyRazopay = async (req, res) => {

//     try {
//         const { amount, paymentMethod } = req.body;

//         if (paymentMethod !== 'razorpay') {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Invalid payment method for this endpoint.'
//             });
//         }

//         const options = {
//             amount: amount * 100,
//             currency: 'INR',
//             receipt: `receipt_order_${Date.now()}`,
//         };


//         const order = await razorpay.orders.create(options);

//         if (!order) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: 'Order creation failed.'
//             });
//         }

//         return res.status(OK).json({
//             success: true,
//             order
//         });

//     } catch (error) {
//         console.error('Error in addMoney:', error);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


import HttpStatusCode from "../utils/httpStatusCodes.js";
import messages from "../utils/messages.js";

const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode;

import { razorpay } from "../middlewares/razopay.js";

export const addMoneyRazorpay = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;

        if (paymentMethod !== 'razorpay') {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.PAYMENT.INVALID_PAYMENT_METHOD
            });
        }

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: messages.PAYMENT.ORDER_CREATION_FAILED
            });
        }

        return res.status(OK).json({
            success: true,
            message: messages.PAYMENT.ORDER_CREATED_SUCCESSFULLY,
            order
        });
    } catch (error) {
        console.error('Error in addMoneyRazorpay:', error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PAYMENT.FAILED_PROCESS
        });
    }
};