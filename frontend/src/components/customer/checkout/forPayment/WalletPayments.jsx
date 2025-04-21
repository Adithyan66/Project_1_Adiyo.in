



import PropTypes from 'prop-types';
import { LockIcon, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const WalletPayment = ({
    paymentMethod,
    walletBalance,
    isLoadingWallet,
    walletError,
    total,
    captchaInput,
    setCaptchaInput,
    captchaText,
    generateNewCaptcha,
    onPlaceOrder,
}) => {
    if (paymentMethod !== 'wallet') return null;

    const handleWalletPayment = () => {
        if (captchaInput !== captchaText) {
            toast.error('Invalid captcha');
            return;
        }
        onPlaceOrder('wallet', captchaInput);
    };

    return (
        <div className="rounded-lg p-5 mb-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4 text-lg">Wallet Payment</h3>
            {isLoadingWallet ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                </div>
            ) : walletError ? (
                <div className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 text-sm">
                    {walletError}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 mb-4">
                        <div>
                            <div className="text-sm text-gray-500">Available Balance</div>
                            <div className="text-2xl font-bold text-gray-900">
                                ₹{walletBalance.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    {walletBalance >= total && (
                        <div className="mt-6 mb-2">
                            <div className="shadow-xl rounded-lg p-5 bg-gray-50">
                                <h3 className="font-medium text-gray-900 mb-4 flex items-center text-base">
                                    <LockIcon size={14} className="mr-2 text-gray-800" />
                                    Security Verification
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                    <div className="bg-gradient-to-r from-black to-gray-800 text-white text-lg font-bold tracking-widest px-5 py-3 rounded-md select-none relative overflow-hidden mb-3 sm:mb-0">
                                        <div className="absolute inset-0 opacity-20">
                                            <div
                                                className="absolute top-0 left-0 w-full h-full"
                                                style={{
                                                    background:
                                                        'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                                                }}
                                            ></div>
                                        </div>
                                        <div className="relative">{captchaText}</div>
                                    </div>
                                    <button
                                        className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mb-3 sm:mb-0"
                                        onClick={generateNewCaptcha}
                                        title="Generate new captcha"
                                        aria-label="Generate new captcha"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                    <div className="w-full">
                                        <label className="text-sm text-gray-700 block mb-1">
                                            Enter the code here
                                        </label>
                                        <input
                                            type="text"
                                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            placeholder="Enter captcha"
                                            aria-label="Enter captcha code"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {walletBalance >= total && (
                        <button
                            className={`w-full mt-4 px-4 py-2 rounded-md text-base ${!captchaInput || captchaInput !== captchaText
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            disabled={!captchaInput || captchaInput !== captchaText}
                            onClick={handleWalletPayment}
                            aria-label={`Pay with wallet for ₹${total.toFixed(2)}`}
                        >
                            <span>Pay Now (₹{total.toFixed(2)})</span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

WalletPayment.propTypes = {
    paymentMethod: PropTypes.string.isRequired,
    walletBalance: PropTypes.number.isRequired,
    isLoadingWallet: PropTypes.bool.isRequired,
    walletError: PropTypes.string,
    total: PropTypes.number.isRequired,
    captchaInput: PropTypes.string.isRequired,
    setCaptchaInput: PropTypes.func.isRequired,
    captchaText: PropTypes.string.isRequired,
    generateNewCaptcha: PropTypes.func.isRequired,
    onPlaceOrder: PropTypes.func.isRequired,
};

WalletPayment.defaultProps = {
    walletError: null,
};

export default WalletPayment;