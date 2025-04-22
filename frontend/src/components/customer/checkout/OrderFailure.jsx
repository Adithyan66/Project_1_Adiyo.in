import { XCircle, AlertTriangle, RefreshCw, ArrowRight, RotateCcw, Calendar, Mail, ShoppingBag, HelpCircle, Wallet } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const OrderFailure = ({ orderData, walletBalance }) => {
    const navigate = useNavigate();

    if (!orderData) {
        return <div className="text-center p-8">Loading order information...</div>;
    }

    const {
        order,
        message,
        orderId,
        createdAt,
        orderNumber,
        paymentMethod,
        paymentStatus,
        shippingAddress,
        orderItems,
        subtotal,
        shippingFee,
        tax,
        discount,
        totalAmount,
        generatedOrderNumber
    } = orderData;

    const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const errorCode = orderId;
    const errorMessage = message;

    // const retryPayment = () => {
    //     navigate('/checkout/payment');
    // };

    // const contactSupport = () => {
    //     navigate('/contact');
    // };

    return (
        <div className="max-w-5xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <FailureHeader orderNumber={generatedOrderNumber} errorCode={errorCode} />
            <div className="p-8">
                <div className="mb-8">
                    <ErrorDetails
                        errorMessage={errorMessage}
                        errorCode={errorCode}
                        attemptedDate={formattedDate}
                        paymentMethod={paymentMethod}
                        paymentStatus={paymentStatus}
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-8">
                    <OrderAttemptSummary
                        attemptedDate={formattedDate}
                        paymentMethod={paymentMethod}
                        paymentStatus={paymentStatus}
                        totalAmount={totalAmount}
                        walletBalance={walletBalance}
                    />
                    <ShippingAddress shippingAddress={shippingAddress} />
                </div>

                <ProductDetails items={orderItems} />

                <PriceDetails
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    tax={tax}
                    discount={discount}
                    totalAmount={totalAmount}
                />

                {/* <RecommendedActions
                    retryPayment={retryPayment}
                    contactSupport={contactSupport}
                /> */}
            </div>
            <WhatsNext />
            <NeedHelp />
        </div>
    );
};

OrderFailure.propTypes = {
    orderData: PropTypes.shape({
        success: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        order: PropTypes.shape({
            orderId: PropTypes.string.isRequired,
            orderNumber: PropTypes.string.isRequired,
            generatedOrderNumber: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
            paymentMethod: PropTypes.string.isRequired,
            paymentStatus: PropTypes.string.isRequired,
            shippingAddress: PropTypes.object.isRequired,
            orderItems: PropTypes.array.isRequired,
            subtotal: PropTypes.number.isRequired,
            shippingFee: PropTypes.number.isRequired,
            tax: PropTypes.number.isRequired,
            discount: PropTypes.number.isRequired,
            totalAmount: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    walletBalance: PropTypes.number.isRequired
};

export const FailureHeader = ({ orderNumber, errorCode }) => (
    <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white py-12 px-6 text-center">
        <XCircle className="mx-auto mb-4 text-white" size={48} />
        <h2 className="text-3xl font-bold mb-2">Order Failed</h2>
        <p className="text-gray-200 text-lg">We couldn't process your order at this time</p>
        <p className="mt-2 text-gray-200 font-medium">Order #{orderNumber}</p>
        <p className="mt-2 text-gray-200 text-sm">Reference ID: {errorCode}</p>
    </div>
);

FailureHeader.propTypes = {
    orderNumber: PropTypes.string.isRequired,
    errorCode: PropTypes.string.isRequired
};

export const ErrorDetails = ({ errorMessage, errorCode, attemptedDate, paymentMethod, paymentStatus }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
            <AlertTriangle className="text-red-600 mr-4 flex-shrink-0 mt-1" size={24} />
            <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Order Failed</h3>
                <p className="text-gray-700 mb-3">{errorMessage}</p>
                <div className="flex flex-wrap text-sm gap-x-6 gap-y-2 text-gray-600">
                    <span>Date: {attemptedDate}</span>
                    <span>Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
                    <span>Payment Status: <span className="capitalize">{paymentStatus}</span></span>
                </div>
            </div>
        </div>
    </div>
);

ErrorDetails.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    errorCode: PropTypes.string.isRequired,
    attemptedDate: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired
};

export const OrderAttemptSummary = ({ attemptedDate, paymentMethod, paymentStatus, totalAmount, walletBalance }) => (
    <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Attempt Summary</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Attempt Date:</span>
                <span className="font-medium text-gray-900">{attemptedDate}</span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                </span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-medium text-amber-600 capitalize">{paymentStatus}</span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
            {walletBalance > 0 && (
                <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="text-gray-600 flex items-center">
                        <Wallet size={16} className="mr-1" /> Wallet Balance:
                    </span>
                    <span className="font-semibold text-green-600">₹{walletBalance.toFixed(2)}</span>
                </div>
            )}
        </div>
    </div>
);

OrderAttemptSummary.propTypes = {
    attemptedDate: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    walletBalance: PropTypes.number.isRequired
};

export const ShippingAddress = ({ shippingAddress }) => (
    <div className="md:w-1/2 md:pl-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
            <p className="text-gray-600">{shippingAddress.address}</p>
            <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
            <p className="text-gray-600">{shippingAddress.country}</p>
            <p className="text-gray-600 mt-2">Phone: {shippingAddress.phoneNumber}</p>
            {shippingAddress.alternatePhone && (
                <p className="text-gray-600">Alt. Phone: {shippingAddress.alternatePhone}</p>
            )}
        </div>
    </div>
);

ShippingAddress.propTypes = {
    shippingAddress: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        alternatePhone: PropTypes.string
    }).isRequired
};

export const ProductDetails = ({ items }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {items.map((item, index) => (
                <div
                    key={item._id || index}
                    className={`flex items-center p-5 ${index < items.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img src={`/api/placeholder/80/80`} alt={`Product ${index}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                        <h4 className="font-medium text-gray-900">Product ID: {item.product}</h4>
                        <div className="flex flex-wrap text-sm text-gray-600 mt-1">
                            {item.color && <span className="mr-3">Color: {item.color}</span>}
                            {item.size && <span className="mr-3">Size: {item.size}</span>}
                            <span>Qty: {item.quantity}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">₹{item.discountedPrice.toFixed(2)}</p>
                        {item.price !== item.discountedPrice && (
                            <p className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

ProductDetails.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            product: PropTypes.string.isRequired,
            color: PropTypes.string,
            size: PropTypes.string,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            discountedPrice: PropTypes.number.isRequired
        })
    ).isRequired
};

export const PriceDetails = ({ subtotal, shippingFee, tax, discount, totalAmount }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Details</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="text-gray-900">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span>
            </div>
            {tax > 0 && (
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
            )}
            {discount > 0 && (
                <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

PriceDetails.propTypes = {
    subtotal: PropTypes.number.isRequired,
    shippingFee: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired
};

export const RecommendedActions = ({ retryPayment, contactSupport }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {[
                {
                    label: 'Try Again',
                    icon: RefreshCw,
                    action: retryPayment,
                    bg: 'bg-red-600 text-white hover:bg-red-700'
                },
                {
                    label: 'Choose Another Item',
                    icon: ShoppingBag,
                    action: () => navigate('/products-list'),
                    bg: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                },
                {
                    label: 'Contact Support',
                    icon: HelpCircle,
                    action: contactSupport,
                    bg: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }
            ].map(({ label, icon: Icon, action, bg }, index) => (
                <button
                    key={index}
                    onClick={action}
                    className={`flex items-center justify-center py-3 px-6 rounded-lg transition duration-300 ${bg}`}
                    aria-label={label}
                >
                    <Icon className="mr-2" size={18} />
                    {label}
                </button>
            ))}
        </div>
    );
};

RecommendedActions.propTypes = {
    retryPayment: PropTypes.func.isRequired,
    contactSupport: PropTypes.func.isRequired
};

export const WhatsNext = () => (
    <div className="bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What You Can Do Next</h3>
        <ul className="space-y-4">
            {[
                'Check our product catalog for alternative items that are in stock.',
                'If your payment was refunded to your wallet, you can use it for future purchases.',
                'Add items to your wishlist to be notified when they are back in stock.',
                'Contact our support team if you need any assistance with your order.'
            ].map((text, index) => (
                <li key={index} className="flex items-start">
                    <ArrowRight className="mr-2 text-gray-400 flex-shrink-0 mt-1" size={18} />
                    <p className="text-gray-600">{text}</p>
                </li>
            ))}
        </ul>
    </div>
);

export const NeedHelp = ({ contactSupport }) => (
    <div className="p-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-4">
            Our customer support team is available to help you resolve any issues with your order.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={contactSupport}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                aria-label="Contact support"
            >
                <HelpCircle className="mr-2" size={18} />
                Contact Support
            </button>
            <a
                href="mailto:support@example.com"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                aria-label="Email support"
            >
                <Mail className="mr-2" size={18} />
                Email Support Team
            </a>
        </div>
    </div>
);

NeedHelp.propTypes = {
    contactSupport: PropTypes.func.isRequired
};

export default OrderFailure;