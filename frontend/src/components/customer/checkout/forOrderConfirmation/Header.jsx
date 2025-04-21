import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';



export const Header = ({ orderNumber }) => (
    <div className="bg-gradient-to-r from-gray-800 via-black to-gray-800 text-white py-12 px-6 text-center">
        <CheckCircle className="mx-auto mb-4 animate-pulse text-white" size={48} />
        <h2 className="text-3xl font-bold mb-2">Order Confirmed</h2>
        <p className="text-gray-300 text-lg">Thank you for your purchase!</p>
        <p className="mt-2 text-gray-300 font-medium">Order #{orderNumber}</p>
    </div>
);

Header.propTypes = {
    orderNumber: PropTypes.string.isRequired
};