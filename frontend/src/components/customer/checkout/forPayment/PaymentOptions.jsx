

import PropTypes from 'prop-types';
import PaymentOption from './PaymentOption';

import walletLogo from "../../../../assets/images/walletLogo.jpg";
import paypalLogo from "../../../../assets/images/paypalLogo.png";
import cashOnDelivery from "../../../../assets/images/cashOnDeliveryLogo.jpg";
import razarpay from "../../../../assets/images/razarpay.png";
import PayPalOption from './PaypalOption';




const PaymentOptions = ({
    paymentMethod,
    setPaymentMethod,
    walletBalance,
    isLoadingWallet,
    total
}) => {
    return (
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <PaymentOption
                id="wallet"
                title="Wallet"
                description={isLoadingWallet ? "Loading balance..." : `Available balance: ₹${walletBalance.toFixed(2)}`}
                icon={walletLogo}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
            <PayPalOption
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
            <PaymentOption
                id="razorpay"
                title="Razorpay"
                description="Secure Transactions"
                icon={razarpay}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
            <PaymentOption
                id="cod"
                title="Cash on Delivery"
                description={total < 1000 ? "Not available for orders below 1000" : "Pay when you receive the product"}
                icon={cashOnDelivery}
                isDisabled={total < 1000}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
        </div>
    );
};

PaymentOptions.propTypes = {
    paymentMethod: PropTypes.string.isRequired,
    setPaymentMethod: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired,
    isLoadingWallet: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired
};

export default PaymentOptions;
