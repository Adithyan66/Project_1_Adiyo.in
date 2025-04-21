import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';


export const WhatsNext = () => (
    <div className="bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
        <ul className="space-y-4">
            {[
                'You will receive an order confirmation email with details of your purchase.',
                'We will notify you when your order has been shipped.',
                'You can track your order status in your account dashboard.'
            ].map((text, index) => (
                <li key={index} className="flex items-start">
                    <ArrowRight className="mr-2 text-gray-400 flex-shrink-0 mt-1" size={18} />
                    <p className="text-gray-600">{text}</p>
                </li>
            ))}
        </ul>
    </div>
);

export const NeedHelp = () => (
    <div className="p-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support team.
        </p>
        <a
            href="/contact"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            aria-label="Contact support"
        >
            Contact Support
            <ArrowRight className="ml-1" size={16} />
        </a>
    </div>
);
