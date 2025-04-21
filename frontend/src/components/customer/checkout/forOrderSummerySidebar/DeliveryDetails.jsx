import PropTypes from 'prop-types';

import React from 'react';
import { Clock, Truck } from 'lucide-react';
import { getEstimatedDelivery } from '../../../../utils/formatDate';







// Delivery Details Component
export const DeliveryDetails = ({ estimatedDeliveryDays }) => {
    return (
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-start mb-3">
                <Truck size={16} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                    <p className="font-medium text-gray-900 text-sm">Shipping</p>
                    <p className="text-gray-600 text-xs mt-1">Standard Delivery</p>
                </div>
            </div>
            <div className="flex items-start">
                <Clock size={16} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                    <p className="font-medium text-gray-900 text-sm">Estimated Delivery</p>
                    <p className="text-gray-600 text-xs mt-1">
                        {estimatedDeliveryDays} business days ({getEstimatedDelivery(estimatedDeliveryDays)})
                    </p>
                </div>
            </div>
        </div>
    );
};

DeliveryDetails.propTypes = {
    estimatedDeliveryDays: PropTypes.string.isRequired
};
