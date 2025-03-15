import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },

    selectedColor: {
        type: String,
        required: true,
    },

    selectedSize: {
        type: String,
        enum: ["small", "medium", "large", "extraLarge"],
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, "Quantity must be at least 1"],
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
