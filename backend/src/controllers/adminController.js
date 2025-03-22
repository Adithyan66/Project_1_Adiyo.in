
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js"




export const customersList = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "registrationDate",
            sortOrder = "desc",
            search = "",
            status
        } = req.query;


        const filter = { role: "customer" };

        // Add status filter if provided
        if (status !== undefined) {
            filter.isActive = status === "true";
        }

        // Add search functionality if search term is provided
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } }
            ];
        }

        // Build the sort object
        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Calculate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Query customers with pagination and sorting
        const customers = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const totalCustomers = await User.countDocuments(filter);

        res.status(200).json({
            status: true,
            message: "Customers details fetched successfully",
            customers,
            totalCustomers,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCustomers / limitNum)
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};

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
// export const getProducts = async (req, res) => {
//     try {

//         const products = await Product.find({ deletedAt: null }).populate('category');

//         console.log(products);

//         res.status(200).json({
//             status: true,
//             message: "products fetched succesfully",
//             products
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Failed to fetch products",
//             error: error.message
//         });
//     }
// }

export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search = "",
            category
        } = req.query;

        // Build the filter object
        const filter = {};

        filter.deletedAt = null;

        // Add category filter if provided
        if (category && category !== "all") {
            filter.category = category;
        }

        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Build the sort object
        const sort = {};

        // Handle special case for category sorting
        if (sortBy === "category") {
            // We'll use aggregation for category sorting
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            const pipeline = [
                { $match: filter },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryInfo"
                    }
                },
                { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
                { $sort: { "categoryInfo.name": sortOrder === "asc" ? 1 : -1 } },
                { $skip: skip },
                { $limit: limitNum }
            ];

            const products = await Product.aggregate(pipeline);
            const totalProducts = await Product.countDocuments(filter);

            return res.status(200).json({
                status: true,
                message: "Products fetched successfully",
                products,
                totalProducts,
                currentPage: pageNum,
                totalPages: Math.ceil(totalProducts / limitNum)
            });
        }

        // Regular sorting for other fields
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Calculate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Query products with pagination and sorting
        const products = await Product.find(filter)
            .populate("category", "name")
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            status: true,
            message: "Products fetched successfully",
            products,
            totalProducts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum)
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const deleteProduct = async (req, res) => {

    try {
        console.log("dellllllllllllllllllllllll");

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
        console.log("workedddddddddddd");

        const categories = await Category.find();
        console.log(categories);

        res.status(200).json({
            success: true,
            message: "category fetches succesfully",
            categories
        });
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

export const getOrders = async (req, res) => {
    try {


        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search;
        const status = req.query.status;


        const filter = {};

        if (search) {
            filter.$or = [
                { _id: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }
        if (status && status !== 'all') {
            filter.status = status;
        }

        const ordersPromise = Order.find(filter).populate("user")
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        const countPromise = Order.countDocuments(filter);

        const [orders, totalOrders] = await Promise.all([ordersPromise, countPromise]);

        res.status(200).json({
            success: true,
            message: "data fetchedn succesfully",
            orders,
            totalOrders
        });

    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders. Please try again later.'
        });
    }
}




export const getOrderDetails = async (req, res) => {

    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate('user', 'username email phoneNumber')
            .populate('orderItems.product', 'name colors brand sku');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const formattedOrder = order.toObject({ virtuals: true });


        formattedOrder.products = order.orderItems.map((item) => {
            const product = item.product;

            const colorData = product.colors.find((c) => c.color === item.color) || {};
            return {
                _id: product._id,
                name: product.name,
                image: colorData.images?.[0] || '',
                price: item.price,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                variant: `${item.color} / ${item.size}`,
                sku: product.sku,
            };
        });


        delete formattedOrder.orderItems;
        formattedOrder.status = formattedOrder.orderStatus;

        res.json(formattedOrder);

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Server error while fetching order details' });
    }
};



export const updateOrderStatus = async (req, res) => {

    try {
        const { orderId } = req.params;
        const { status } = req.body;


        const validStatuses = ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'return requested', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        const formattedOrder = order.toObject({ virtuals: true });
        formattedOrder.status = order.orderStatus;
        res.status(200).json({
            ststus: true,
            message: 'Order status updated successfully',
            order: formattedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating status'
        });
    }
};



export const handleReturnVerification = async (req, res) => {

    try {
        const { orderId } = req.params;
        const { approved } = req.body; // Expecting { approved: true/false }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if return is requested
        if (order.returnStatus !== 'requested') {
            return res.status(400).json({ message: 'No return requested for this order' });
        }

        if (approved) {
            order.returnStatus = 'approved';
            order.orderStatus = 'returned';
            // Refund logic can be added here, e.g., updating user's wallet
            // const user = await User.findById(order.user);
            // user.walletBalance = (user.walletBalance || 0) + order.totalAmount;
            // await user.save();
        } else {
            order.returnStatus = 'rejected';
            order.orderStatus = 'delivered'; // Revert to delivered if rejected
        }

        await order.save();

        // Format response
        const formattedOrder = order.toObject({ virtuals: true });
        formattedOrder.status = order.orderStatus;
        res.json({
            message: approved ? 'Return approved successfully' : 'Return rejected',
            order: formattedOrder,
        });
    } catch (error) {
        console.error('Error processing return verification:', error);
        res.status(500).json({ message: 'Server error while processing return' });
    }
};




export const verifyReturn = async (req, res) => {

    const { orderId } = req.params;
    const { productId, userId, amount, approved } = req.body;

    if (!productId || !userId || amount == null || typeof approved !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: productId, userId, amount, or approved flag.",
        });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.orderStatus !== "return requested") {
            return res.status(400).json({
                success: false,
                message: "Order is not pending return verification.",
            });
        }

        if (order.user?.toString() !== userId) {
            return res.status(400).json({
                success: false,
                message: "User ID mismatch with the order.",
            });
        }

        order.orderStatus = approved ? "returned" : "delivered";

        order.returnVerification = {
            approved,
            amount,
            verifiedAt: new Date(),
        };

        order.returnStatus = approved ? "completed" : "rejected";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Return verification processed successfully.",
        });

    } catch (error) {
        console.error("Error processing return verification:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while processing return verification.",
        });
    }
}