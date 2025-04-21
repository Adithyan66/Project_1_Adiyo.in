

import PropTypes from 'prop-types';


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
                        <img src={item.productImg} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Product ID: {item.product}</p>
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
            productName: PropTypes.string.isRequired,
            productImg: PropTypes.string.isRequired,
            color: PropTypes.string,
            size: PropTypes.string,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            discountedPrice: PropTypes.number.isRequired
        })
    ).isRequired
};
