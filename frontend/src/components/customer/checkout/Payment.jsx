

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setCartCurrentStep } from '../../../store/slices/cartCheckoutSlice';
import { setCurrentStep as checkoutSetCurrentStep } from '../../../store/slices/checkoutSlice';

import useCaptcha from '../../../hooks/user/checkout/useCaptha';
import usePaymentMethods from '../../../hooks/user/checkout/usePaymentMethod';
import useWalletPayment from '../../../hooks/user/checkout/useWalletPayment';
import usePaypal from '../../../hooks/user/checkout/usePaypal';
import useRazorpay from '../../../hooks/user/checkout/useRazorpay';

import PaymentOptions from './forPayment/PaymentOptions';
import WalletPaymentSection from './forPayment/WalletPaymentSection';
import PayPalSection from './forPayment/PaypalSection';
import RazorpaySection from './forPayment/RazorPaySection';
import CashOnDeliverySection from './forPayment/CashonDeliverySection';
import NavigationButtons from './forPayment/NavigationButton';

const Payment = ({ onPlaceOrder, cartOrder = false }) => {
    const dispatch = useDispatch();

    const { paymentMethod, setPaymentMethod } = usePaymentMethods();
    const { captchaInput, setCaptchaInput, captchaText, generateNewCaptcha } = useCaptcha();
    const { walletBalance, isLoadingWallet, walletError, fetchWalletBalance } = useWalletPayment();
    const { processRazorpay } = useRazorpay(onPlaceOrder);

    const [isProcessing, setIsProcessing] = React.useState(false);

    const setCurrentStep = cartOrder
        ? setCartCurrentStep
        : checkoutSetCurrentStep;

    const { order, totalPrice } = useSelector(state => cartOrder ? state.cartCheckout : state.checkout);

    const calculatedTotal = cartOrder
        ? order?.reduce((sum, item) => {
            const colorVariant = item.product?.colors?.find(c => c.color === item.selectedColor);
            return sum + (colorVariant?.discountPrice || 0) * item.quantity;
        }, 0) || 0
        : order?.productDetails?.colors?.find(c => c.color === order.productColor)?.discountPrice * order?.quantity || 0;

    const total = totalPrice || calculatedTotal;

    const {
        paypalOrderID,
        paypalError,
        setPaypalError,
        onApprove: onPaypalApprove
    } = usePaypal(onPlaceOrder, captchaText);

    useEffect(() => {
        generateNewCaptcha();
        fetchWalletBalance();
    }, []);

    const handleWalletPayment = () => {
        if (captchaInput !== captchaText) {
            toast.error("Invalid captcha");
            return;
        }
        setIsProcessing(true);
        onPlaceOrder('wallet', captchaInput)
            .finally(() => setIsProcessing(false));
    };

    const handlePlaceOrder = () => {
        if (paymentMethod === 'cod' && captchaInput !== captchaText) {
            toast.error("Invalid captcha");
            return;
        }
        setIsProcessing(true);
        onPlaceOrder(paymentMethod, paymentMethod === 'cod' ? captchaInput : captchaText, paypalOrderID)
            .finally(() => setIsProcessing(false));
    };

    const handleRazorpayPayment = () => {
        processRazorpay(total);
    };

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6 pb-3 border-b border-gray-200">
                <CreditCard className="text-black mr-2 sm:mr-3" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Options</h2>
            </div>

            <PaymentOptions
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                walletBalance={walletBalance}
                isLoadingWallet={isLoadingWallet}
                total={total}
            />

            {paymentMethod === 'wallet' && (
                <WalletPaymentSection
                    walletBalance={walletBalance}
                    isLoadingWallet={isLoadingWallet}
                    walletError={walletError}
                    fetchWalletBalance={fetchWalletBalance}
                    total={total}
                    captchaText={captchaText}
                    captchaInput={captchaInput}
                    setCaptchaInput={setCaptchaInput}
                    generateNewCaptcha={generateNewCaptcha}
                    isProcessing={isProcessing}
                    handleWalletPayment={handleWalletPayment}
                />
            )}

            {paymentMethod === 'paypal' && (
                <PayPalSection
                    total={total}
                    paypalError={paypalError}
                    paypalOrderID={paypalOrderID}
                    onApprove={onPaypalApprove}
                    setPaypalError={setPaypalError}
                />
            )}

            {paymentMethod === 'razorpay' && (
                <RazorpaySection
                    total={total}
                    onPlaceOrder={handleRazorpayPayment}
                />
            )}

            {paymentMethod === 'cod' && (
                <CashOnDeliverySection
                    captchaText={captchaText}
                    captchaInput={captchaInput}
                    setCaptchaInput={setCaptchaInput}
                    generateNewCaptcha={generateNewCaptcha}
                />
            )}

            <NavigationButtons
                dispatch={dispatch}
                setCurrentStep={setCurrentStep}
                paymentMethod={paymentMethod}
                captchaInput={captchaInput}
                captchaText={captchaText}
                isProcessing={isProcessing}
                handlePlaceOrder={handlePlaceOrder}
                total={total}
            />
        </div>
    );
};

Payment.propTypes = {
    onPlaceOrder: PropTypes.func.isRequired,
    cartOrder: PropTypes.bool
};

export default Payment;