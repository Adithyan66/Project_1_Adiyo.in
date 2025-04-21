

import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PayPalSection = ({ total, paypalError, paypalOrderID, onApprove, setPaypalError }) => {
    const [{ isPending }] = usePayPalScriptReducer();

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

    const onPaypalError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError(`Payment failed: ${err.message}`);
    };

    return (
        <div className="shadow-xl sm:shadow-2xl rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">PayPal Checkout</h3>
            {paypalError && (
                <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-black text-sm">
                    {paypalError}
                </div>
            )}
            {paypalOrderID && (
                <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 border-l-4 border-gray-800 text-sm">
                    PayPal order created! Processing your order...
                </div>
            )}
            <div className="paypal-button-container">
                {isPending ? (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-800"></div>
                    </div>
                ) : (
                    <PayPalButtons
                        createOrder={createPaypalOrder}
                        onApprove={onApprove}
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
            <div className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center justify-center">
                <LockIcon size={12} className="mr-1" />
                Your payment information is secured by PayPal
            </div>
        </div>
    );
};

PayPalSection.propTypes = {
    total: PropTypes.number.isRequired,
    paypalError: PropTypes.string,
    paypalOrderID: PropTypes.string,
    onApprove: PropTypes.func.isRequired,
    setPaypalError: PropTypes.func.isRequired
};

export default PayPalSection;
