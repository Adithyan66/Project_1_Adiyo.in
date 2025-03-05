





// import mongoose from "mongoose";

// const variantSchema = new mongoose.Schema({
//     imageUrls: [String]
// });

// const reviewSchema = new mongoose.Schema({
//     user: { type: String },
//     comment: { type: String },
//     rating: { type: Number }
// });

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     shortDescription: { type: String },
//     description: { type: String },
//     brand: { type: String },
//     category: { type: String, default: "Men's Clothing" },
//     subCategory: { type: String },
//     sku: { type: String, unique: true },
//     price: { type: Number, required: true },
//     discountPrice: { type: Number },
//     discountPercentage: { type: Number },
//     material: { type: String },
//     careInstructions: [String],
//     gender: { type: String, enum: ['male'], default: 'male' },
//     totalStock: { type: Number },

//     // New fields added:
//     color: { type: String },
//     size: [String],
//     dressStyle: { type: String },
//     isBlocked: { type: Boolean, default: false },
//     isListed: { type: Boolean, default: true },

//     variants: [variantSchema],
//     imageUrls: [String],
//     imagePublicIds: [String],
//     reviews: [reviewSchema],
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });

// const Product = mongoose.model("Product", productSchema);

// export default Product;








import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
});

const colorSchema = new mongoose.Schema({
    color: { type: String, required: true },
    // Exactly 5 image URLs (you can store URLs from your image hosting service)
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
    // Variants: each color has its own set of sizes with stock information
    variants: {
        small: { type: variantSchema, required: true },
        medium: { type: variantSchema, required: true },
        large: { type: variantSchema, required: true },
        extraLarge: { type: variantSchema, required: true },
    },
    // Optionally, you can store a computed total stock for this color
    totalStock: { type: Number, default: 0 },
});

// Main Product Schema
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        shortDescription: { type: String },
        description: { type: String },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        // Extended subcategories based on men's and boys' clothing
        subCategory: {
            type: String,
            required: true,
            enum: ["Shirt", "Pant", "Kurtha", "Jogger", "Coat", "T-Shirt", "Shorts", "Track Pants"],
        },
        // SKU is auto-generated from brand, product name initials, and random numbers
        sku: { type: String, required: true, unique: true },
        material: { type: String },
        careInstructions: [String],
        // Array of color variations (each with its own images, pricing, and variants)
        colors: [colorSchema],
    },
    { timestamps: true }
);

const Product = mongoose.model("product", productSchema)

export default Product