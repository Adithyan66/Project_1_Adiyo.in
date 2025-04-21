import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Printer, ListOrdered, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';



export const OrderStatus = ({ deliveryDate }) => (

    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h3>
        <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-black rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between mt-4">
                {[
                    { icon: CheckCircle, label: 'Confirmed', active: true },
                    { icon: Package, label: 'Processing', active: false },
                    { icon: Truck, label: 'Shipped', active: false },
                    { icon: Calendar, label: 'Delivered', active: false }
                ].map(({ icon: Icon, label, active }, index) => (
                    <div key={index} className="text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${active ? 'bg-black' : 'bg-gray-300'}`}>
                            <Icon className={active ? 'text-white' : 'text-gray-600'} size={18} />
                        </div>
                        <p className="text-sm mt-2 text-gray-600">{label}</p>
                    </div>
                ))}
            </div>
        </div>
        <p className="text-gray-600 text-sm mt-4">
            Estimated delivery: <span className="font-medium text-gray-900">{deliveryDate}</span>
        </p>
    </div>
);

OrderStatus.propTypes = {
    deliveryDate: PropTypes.string.isRequired
};
