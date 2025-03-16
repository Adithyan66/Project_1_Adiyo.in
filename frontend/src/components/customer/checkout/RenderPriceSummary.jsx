import React from 'react'

function RenderPriceSummary({ product }) {

    const subtotal = product.price * product.quantity;
    const discountAmount = product.discount * product.quantity;
    const taxAmount = product.tax * product.quantity;
    const total = subtotal - discountAmount + taxAmount + product.shipping;

    return (
        <div className="bg-gray-50 p-4 rounded-lg ">
            <h3 className="font-medium text-gray-900 mb-4 ">Price Details</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Price ({product.quantity} item)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">- ₹{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span>{product.shipping > 0 ? `₹${product.shipping}` : 'FREE'}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="pt-2 text-green-600 text-xs">
                    You saved ₹{discountAmount.toLocaleString()} on this order
                </div>
            </div>
        </div>
    )
}

export default RenderPriceSummary
