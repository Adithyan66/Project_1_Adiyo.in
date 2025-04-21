
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';


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
