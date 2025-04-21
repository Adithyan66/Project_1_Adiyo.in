import { useNavigate } from "react-router";
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';



export const ActionButtons = ({ generateInvoicePDF, printReceipt }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {[
                { label: 'Download Invoice', icon: Download, action: generateInvoicePDF, bg: 'bg-black text-white hover:bg-gray-800' },
                { label: 'Print Receipt', icon: Printer, action: printReceipt, bg: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
                { label: 'Order Details', icon: ListOrdered, action: () => navigate('/user/orders-list'), bg: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
                { label: 'Continue Shopping', icon: ShoppingBag, action: () => navigate('/products-list'), bg: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
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

ActionButtons.propTypes = {
    generateInvoicePDF: PropTypes.func.isRequired,
    printReceipt: PropTypes.func.isRequired
};