


import PropTypes from 'prop-types';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { LockIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PayPalPayment = ({ paymentMethod, total, onPlaceOrder, cartOrder }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const [paypalOrderID, setPaypalOrderID] = useState(null);
    const [paypalError, setPaypalError] = useState(null);

    if (paymentMethod !== 'paypal') return null;

    const createPaypalOrder = (data, actions) => {
        const orderTotal = (parseFloat(total) || 0).toFixed(2);
        if (orderTotal <= 0) {
            setPaypalError('Invalid order amount');
            return Promise.reject('Invalid order amount');
        }
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: orderTotal,
                        currency_code: 'USD',
                    },
                    description: cartOrder ? 'Cart order from Adiyo.in' : 'Order from Adiyo.in',
                },
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING',
            },
        });
    };

    const onApprovePaypal = (data, actions) => {
        setPaypalOrderID(data.orderID);
        return onPlaceOrder('paypal', '', data.orderID)
            .then((response) => response)
            .catch((error) => {
                setPaypalError(`Payment processing failed: ${error.message}`);
                throw error;
            });
    };

    const onPaypalError = (err) => {
        setPaypalError(`Payment failed: ${err.message}`);
    };

    return (
        <div className="shadow-2xl rounded-lg p-5 mb-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4 text-lg">PayPal Checkout</h3>
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    </div>
                ) : (
                    <PayPalButtons
                        createOrder={createPaypalOrder}
                        onApprove={onApprovePaypal}
                        onError={onPaypalError}
                        onCancel={() => toast.info('PayPal transaction cancelled')}
                        style={{
                            layout: 'horizontal',
                            color: 'blue',
                            shape: 'rect',
                            label: 'pay',
                        }}
                    />
                )}
            </div>
            <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                <LockIcon size={12} className="mr-1" />
                Your payment information is secured by PayPal
            </div>
        </div>
    );
};

PayPalPayment.propTypes = {
    paymentMethod: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    onPlaceOrder: PropTypes.func.isRequired,
    cartOrder: PropTypes.bool.isRequired,
};

export default PayPalPayment;