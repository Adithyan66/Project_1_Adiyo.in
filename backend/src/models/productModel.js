// import mongoose from "mongoose";


// const productSchema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String
//     },
//     brand: {
//         type: String
//     },
//     category: {
//         type: String,
//         default: "Men's Clothing"
//     },
//     subCategory: {
//         type: String
//     },
//     sku: {
//         type: String,
//         unique: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     material: {
//         type: String
//     },
//     careInstructions: {
//         type: String
//     },
//     gender: {
//         type: String,
//         enum: ['male'],
//         default: 'male'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     variants: [variantSchema],
//     images: [String],
//     reviews: [reviewSchema]

// });


// const Product = mongoose.model("product", productSchema);

// export default Product







import mongoose from "mongoose";

// Define a simple variant schema for sizes and stock
const variantSchema = new mongoose.Schema({
    size: { type: String },
    stock: { type: Number }
});

// Define a basic review schema (expand as needed)
const reviewSchema = new mongoose.Schema({
    user: { type: String },
    comment: { type: String },
    rating: { type: Number }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortDescription: { type: String }, // Added to match form
    description: { type: String },
    brand: { type: String },
    category: { type: String, default: "Men's Clothing" },
    subCategory: { type: String },
    sku: { type: String, unique: true },
    price: { type: Number, required: true }, // Base price
    discountPrice: { type: Number },          // Added field for final price after discount
    discountPercentage: { type: Number },       // Added field for discount percentage
    material: { type: String },
    careInstructions: { type: String },
    gender: { type: String, enum: ['male'], default: 'male' },
    variants: [variantSchema], // Will store sizes and stock information
    images: [String], // Store image URLs
    reviews: [reviewSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
