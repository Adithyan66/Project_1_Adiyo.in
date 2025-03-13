
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import Category from "../models/categoryModel.js";



export const customersList = async (req, res) => {

    try {

        const customers = await User.find({ role: "customer" })

        res.status(200).json({
            status: true,
            message: "customers details fetched succesfully",
            customers
        })


    } catch (error) {
        res.status(500).json({
            statsu: false,
            message: "server error"
        })
    }
}


export const customerDetails = async (req, res) => {

    try {

        const id = req.params.customerId

        const customer = await User.findById(id)

        res.status(200).json({
            status: true,
            message: "customer details fetched succesfully",
            customer
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "server error"
        })

    }
}

export const blockUser = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.query;

    // Validate isActive is provided
    if (isActive === undefined) {
        return res.status(400).json({
            status: false,
            message: "Missing required query parameter: isActive",
        });
    }

    // Validate isActive is either "true" or "false" (case-insensitive)
    const lowerIsActive = isActive.toLowerCase();
    if (lowerIsActive !== "true" && lowerIsActive !== "false") {
        return res.status(400).json({
            status: false,
            message: "Invalid value for isActive. Must be 'true' or 'false'.",
        });
    }

    // Convert to boolean
    const newIsActive = lowerIsActive === "true";

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User does not exist",
            });
        }

        // Check if the current status is the same as the new status
        if (user.isActive === newIsActive) {
            return res.status(200).json({
                status: true,
                message: `User is already ${user.isActive ? "unblocked" : "blocked"}`,
            });
        }

        // Update and save the user
        user.isActive = newIsActive;
        await user.save();

        res.status(200).json({
            status: true,
            message: `User ${newIsActive ? "unblocked" : "blocked"} successfully`,
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
};
export const getProducts = async (req, res) => {
    try {

        const products = await Product.find({ deletedAt: null }).populate('category');

        console.log(products);

        res.status(200).json({
            status: true,
            message: "products fetched succesfully",
            products
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            status: true,
            message: 'Product soft deleted successfully',
            product
        });

    } catch (error) {

        console.error('Error soft deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

export const productDetails = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Product details fetched successfully",
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }

}

export const addCoupon = async (req, res) => {

    try {
        const couponData = req.body;

        const newCoupon = new Coupon(couponData);

        await newCoupon.save()

        res.status(200).json({
            status: true,
            message: "coupon created succesfully"
        })
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({
            status: false,
            message: error.message
        });

    }
}

export const getCoupons = async (req, res) => {

    try {

        const coupons = await Coupon.find({ deletedAt: null })

        res.status(200).json({
            status: true,
            message: "coupons fetched succesfully",
            coupons
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "server error"
        })

    }
}

export const deleteCoupon = async (req, res) => {

    try {



        const couponId = req.params.id

        const coupon = await Coupon.findByIdAndUpdate(couponId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                status: false,
                message: "coupon not found"
            })
        }

        console.log("hellooo");

        res.status(200).json({
            status: true,
            message: "coupon deleted succesfully",
            coupon
        })

    } catch (error) {

        console.error('Error soft deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const addCategory = async (req, res) => {

    try {

        const { name, description, thumbnail } = req.body;

        if (!name) {

            return res.status(400).json({ error: 'Category name is required.' });

        }
        const newCategory = new Category({ name, description, thumbnail });

        const savedCategory = await newCategory.save();

        res.status(201).json(savedCategory);

    } catch (error) {

        console.error('Error adding category:', error);

        res.status(500).json({ error: 'Server error while adding category.' });

    }
}


export const addSubCategories = async (req, res) => {

    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Subcategory name is required.' });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        const newSubcategory = { name };

        category.subcategories.push(newSubcategory);

        await category.save();

        const addedSubcategory = category.subcategories[category.subcategories.length - 1];

        res.status(201).json(addedSubcategory);

    } catch (error) {

        console.error('Error adding subcategory:', error);

        res.status(500).json({ error: 'Server error while adding subcategory.' });

    }
}


export const getCategories = async (req, res) => {

    try {
        const categories = await Category.find();
        console.log(categories);

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error while fetching categories.' });
    }
}


export const editSubcategoryName = async (req, res) => {

    try {
        const { categoryId, subcategoryId } = req.params;

        const updateData = req.body;


        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        const subcategory = category.subcategories.id(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found.' });
        }

        Object.assign(subcategory, updateData);

        await category.save();


        res.status(200).json(subcategory);

    } catch (error) {

        console.error('Error updating subcategory:', error);
        res.status(500).json({ error: 'Server error while updating subcategory.' });
    }
}


export const deleteCategories = async (req, res) => {

    try {
        const { categoryId } = req.params;
        console.log(categoryId);


        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {

            return res.status(404).json({ error: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category deleted successfully.' });

    } catch (error) {

        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Server error while deleting category.' });
    }
}


export const deleteSubCategories = async (req, res) => {

    console.log("hiiiii");


    try {
        const { categoryId, subcategoryId } = req.params;


        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        category.subcategories.pull(subcategoryId);

        await category.save();

        res.status(200).json({ message: 'Subcategory deleted successfully.' });

    } catch (error) {

        console.error('Error deleting subcategory:', error);

        res.status(500).json({ error: 'Server error while deleting subcategory.' });
    }

}