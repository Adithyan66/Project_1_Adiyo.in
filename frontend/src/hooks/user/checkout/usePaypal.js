


import { useState } from 'react';

const usePaypal = (onPlaceOrder, captchaText) => {
    const [paypalOrderID, setPaypalOrderID] = useState(null);
    const [paypalError, setPaypalError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const createPaypalOrder = (data, actions, total) => {
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
                        currency_code: "USD"
                    },
                    description: "Order from Adiyo.in"
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const onApprove = (data, actions) => {
        console.log("PayPal payment approved with orderID:", data.orderID);
        setPaypalOrderID(data.orderID);
        setIsProcessing(true);

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

    const onError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError(`Payment failed: ${err.message}`);
    };

    return {
        paypalOrderID,
        paypalError,
        setPaypalError,
        isProcessing,
        createPaypalOrder,
        onApprove,
        onError
    };
};

export default usePaypal;