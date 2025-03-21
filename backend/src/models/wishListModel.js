import mongoose from 'mongoose';

const WishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    selectedColor: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [WishlistItemSchema]
}, { timestamps: true });


const Wishlist = mongoose.model("Wishlist", WishlistSchema)

export default Wishlist;