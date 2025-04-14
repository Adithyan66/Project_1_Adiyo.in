


import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyRazorpayPayment = async (req, res, next) => {
    try {
        console.log("middleware", req.body);

        if (req.body.paymentMethod === "razorpay") {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

            const generated_signature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (generated_signature === razorpay_signature) {
                req.body = {
                    ...req.body,
                    paymentMethod: "razorpay",
                    razorpayOrderID: razorpay_order_id
                };
                next();

            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Payment verification failed.'
                });
            }
        } else {
            next();
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error during verification.'
        });
    }
};



