import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    stock: { type: Number, default: 0 }
}, { timestamps: true });


const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    subcategories: { type: [SubcategorySchema], default: [] }
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema)

export default Category
