import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"]
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    }
});

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: "India"
    },
    phoneNumber: {
        type: String,
        required: true
    },
    alternatePhone: {
        type: String
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["card", "upi", "netbanking", "cod", "paypal"]
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["pending", "paid", "failed", "refunded", "completed"],
        default: "pending"
    },
    paymentDetails: {
        transactionId: { type: String },
        paymentProvider: { type: String },
        paymentDate: { type: Date }
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled", "returned", "pending", "out for delivery", "return requested"],
        default: "placed"
    },
    trackingNumber: {
        type: String
    },
    deliveryNotes: {
        type: String
    },
    estimatedDeliveryDate: {
        type: Date
    },
    cancelReason: {
        type: String
    },
    returnReason: {
        type: String
    },
    returnStatus: {
        type: String,
        enum: ["none", "requested", "approved", "rejected", "completed"],
        default: "none"
    },
    invoice: {
        number: { type: String },
        issuedAt: { type: Date },
        url: { type: String }
    }
}, { timestamps: true });


orderSchema.virtual('orderNumber').get(function () {
    const timestamp = this._id.getTimestamp();
    const dateString = new Date(timestamp).toISOString().slice(0, 10).replace(/-/g, '');
    const objectIdEnd = this._id.toString().slice(-4);
    return `ORDER-${dateString}-${objectIdEnd}`;
});


orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;