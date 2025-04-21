
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';



export const OrderSummary = ({ orderDate, paymentMethod, paymentStatus, totalAmount }) => (

    <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Date Placed:</span>
                <span className="font-medium text-gray-900">{orderDate}</span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                </span>
            </div>
            <div className="flex justify-between mb-3">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-medium text-gray-900 capitalize">{paymentStatus}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

OrderSummary.propTypes = {
    orderDate: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired
};