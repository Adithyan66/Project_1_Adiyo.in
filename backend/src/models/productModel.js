
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
});

const colorSchema = new mongoose.Schema({
    color: { type: String, required: true },
    images: {
        type: [String],
        validate: {
            validator: function (val) {
                return val.length === 5;
            },
            message: "Each color variation must have exactly 5 images.",
        },
        required: true,
    },
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true, max: [999, "Discount price must not exceed 999"] },
    discountPercentage: { type: Number, required: true },
    variants: {
        small: { type: variantSchema, required: true },
        medium: { type: variantSchema, required: true },
        large: { type: variantSchema, required: true },
        extraLarge: { type: variantSchema, required: true },
    },
    totalStock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String },
    brand: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: true },
    sku: { type: String, required: true, unique: true },
    material: { type: String },
    careInstructions: [String],
    totalQuantity: { type: Number, default: 0 },
    colors: [colorSchema],
    deletedAt: { type: Date, default: null }
},
    { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

export default Product