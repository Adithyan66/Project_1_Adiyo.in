


// import mongoose from "mongoose";


// const variantSchema = new mongoose.Schema({

//     size: {
//         type: String
//     },
//     stock: {
//         type: Number
//     }
// });

// // Define a basic review schema (expand as needed)
// const reviewSchema = new mongoose.Schema({

//     user: {
//         type: String
//     },
//     comment: {
//         type: String
//     },
//     rating: {
//         type: Number
//     }
// });

// const productSchema = new mongoose.Schema({

//     name: {
//         type: String,
//         required: true
//     },
//     shortDescription: {
//         type: String
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
//     discountPrice: {
//         type: Number
//     },
//     discountPercentage: {
//         type: Number
//     },
//     material: {
//         type: String
//     },
//     careInstructions: [String],

//     gender: {
//         type: String,
//         enum: ['male'], default: 'male'
//     },
//     totalStock: {
//         type: Number
//     },
//     variants: [variantSchema],

//     imageUrls: [String],

//     imagePublicIds: [String],

//     reviews: [reviewSchema],

//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Product = mongoose.model("Product", productSchema);

// export default Product;







import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    imageUrls: [String]
});

const reviewSchema = new mongoose.Schema({
    user: { type: String },
    comment: { type: String },
    rating: { type: Number }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String },
    brand: { type: String },
    category: { type: String, default: "Men's Clothing" },
    subCategory: { type: String },
    sku: { type: String, unique: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercentage: { type: Number },
    material: { type: String },
    careInstructions: [String],
    gender: { type: String, enum: ['male'], default: 'male' },
    totalStock: { type: Number },

    // New fields added:
    color: { type: String },
    size: [String],
    dressStyle: { type: String },
    isBlocked: { type: Boolean, default: false },
    isListed: { type: Boolean, default: true },

    variants: [variantSchema],
    imageUrls: [String],
    imagePublicIds: [String],
    reviews: [reviewSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

export default Product;

