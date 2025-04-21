
import React from 'react';

import PropTypes from 'prop-types';




export const ProductItem = ({ item, isCartCheckout }) => {
    const selectedColorObj = item.productDetails?.colors?.find(c => c.color === item.productColor) || {};
    const variantKey = item.productSize === "Small" ? "small" :
        item.productSize === "Medium" ? "medium" :
            item.productSize === "Large" ? "large" : "extraLarge";
    const selectedVariant = selectedColorObj.variants?.[variantKey] || {};

    return (
        <div className="flex items-center mb-3">
            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                {selectedColorObj.images?.[0] ? (
                    <img
                        src={selectedColorObj.images[0]}
                        alt={item.productDetails.name}
                        className="w-full h-full object-cover rounded"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-xs">No image</span>
                    </div>
                )}
            </div>
            <div className="ml-3 flex-grow">
                <h4 className="font-medium text-gray-900 text-sm">{item.productDetails.name}</h4>
                <div className="flex flex-wrap text-xs text-gray-600 mt-1">
                    <span className="mr-3">Color: {item.productColor}</span>
                    <span className="mr-3">Size: {item.productSize}</span>
                    <span>Qty: {item.quantity}</span>
                </div>
                {isCartCheckout && (
                    <div className="text-xs text-gray-600 mt-1">
                        <span>Stock: {selectedVariant.stock || 0} units</span>
                    </div>
                )}
            </div>
        </div>
    );
};

ProductItem.propTypes = {
    item: PropTypes.shape({
        productDetails: PropTypes.shape({
            name: PropTypes.string.isRequired,
            colors: PropTypes.arrayOf(
                PropTypes.shape({
                    color: PropTypes.string.isRequired,
                    images: PropTypes.arrayOf(PropTypes.string),
                    variants: PropTypes.object
                })
            )
        }).isRequired,
        productColor: PropTypes.string.isRequired,
        productSize: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired
    }).isRequired,
    isCartCheckout: PropTypes.bool.isRequired
};