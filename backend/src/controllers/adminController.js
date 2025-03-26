
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js"
import { Wallet, Transaction, ReturnRefund } from '../models/walletModel.js';
import mongoose from "mongoose";
import ProductOffer from "../models/productOfferModel.js";
import CategoryOffer from "../models/categoryOfferModel.js";
import ReferralOffer from "../models/referalOfferModel.js";



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
        const categories = await Category.find();

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
    const { productId, userId, approved } = req.body;

    console.log(productId, userId, approved, orderId);

    if (!productId || !userId || typeof approved !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: productId, userId, or approved flag.",
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.orderStatus !== "return requested") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Order is not pending return verification.",
            });
        }

        if (order.user?.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "User ID mismatch with the order.",
            });
        }

        // Calculate refund amount based on subtotal (already includes discounts) minus shipping
        // For now we're assuming the entire order is being returned
        const refundAmount = order.totalAmount - order.shippingFee;

        order.orderStatus = approved ? "returned" : "delivered";
        order.returnVerification = {
            approved,
            verifiedAt: new Date(),
        };
        order.returnStatus = approved ? "completed" : "rejected";

        await order.save({ session });

        // Process refund if return is approved
        if (approved) {
            // Find or create user wallet
            let wallet = await Wallet.findOne({ userId }).session(session);
            if (!wallet) {
                wallet = new Wallet({
                    userId,
                    balance: 0,
                    pendingBalance: 0
                });
            }

            // Update wallet balance
            wallet.balance += refundAmount;
            await wallet.save({ session });

            // Create transaction record
            const transaction = new Transaction({
                walletId: wallet._id,
                userId,
                type: 'credit',
                amount: refundAmount,
                balance: wallet.balance,
                description: `Refund for returned order #${order.orderNumber || orderId}`,
                status: 'completed',
                source: 'return_refund',
                reference: {
                    orderId: order._id
                },
                metadata: new Map([
                    ['productId', productId],
                    ['returnReason', order.returnReason || 'Not specified'],
                    ['returnDate', new Date()],
                    ['originalAmount', order.totalAmount],
                    ['shippingFee', order.shippingFee]
                ])
            });

            await transaction.save({ session });

            // Create ReturnRefund record
            const returnRefund = new ReturnRefund({
                userId,
                orderId,
                transactionId: transaction._id,
                amount: refundAmount,
                status: 'completed',
                reason: order.returnReason || 'Return approved by admin',
                approvedBy: req.user?._id, // Assuming the admin user is available in the request
                approvalNotes: 'Return verified and approved',
                approvedAt: new Date()
            });

            await returnRefund.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: approved
                ? `Return verification processed successfully. ₹${refundAmount.toFixed(2)} has been credited to the user's wallet.`
                : "Return verification processed successfully.",
            refundAmount: approved ? refundAmount : 0
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error("Error processing return verification:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while processing return verification.",
            error: error.message
        });
    }
};


export const productNames = async (req, res) => {
    try {
        const productsData = await Product.find({ deletedAt: null }, { _id: 1, name: 1 });

        if (!productsData || productsData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully fetched product names",
            products: productsData
        });
    } catch (error) {
        console.error("Error fetching product names", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




export const createProductOffer = async (req, res) => {

    try {
        const { name, discount, products, startDate, endDate } = req.body;

        // Optionally, add any further validation here

        // Create a new ProductOffer instance
        const newOffer = new ProductOffer({
            name,
            discount,
            products,
            startDate,
            endDate
        });

        // Save the offer in the database
        const savedOffer = await newOffer.save();
        console.log(name);

        res.status(201).json({
            success: true,
            message: "Product offer created successfully",
            offer: savedOffer
        });
    } catch (error) {
        console.error("Error creating product offer:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product offer",
            error: error.message
        });
    }
};





export const getAllProductOffers = async (req, res) => {
    try {
        // Fetch all product offers and populate the products field with product names
        const productOffers = await ProductOffer.find().populate("products", "name")

        res.status(200).json({
            success: true,
            message: "Product offers fetched successfully",
            offers: productOffers
        });
    } catch (error) {
        console.error("Error fetching product offers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product offers",
            error: error.message
        });
    }
};




export const createCategoryOffer = async (req, res) => {

    try {
        const { name, discount, category, startDate, endDate } = req.body;



        // Optionally, add any further validation here

        // Create a new ProductOffer instance
        const newOffer = new CategoryOffer({
            name,
            discount,
            category,
            startDate,
            endDate
        });

        // Save the offer in the database
        const savedOffer = await newOffer.save();

        console.log(category);

        res.status(201).json({
            success: true,
            message: "category offer created successfully",
            offer: savedOffer
        });
    } catch (error) {
        console.error("Error creating category offer:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create category offer",
            error: error.message
        });
    }
};




export const getAllCategoryOffers = async (req, res) => {
    try {
        // Fetch all product offers and populate the products field with product names
        const categoryOffers = await CategoryOffer.find().populate("category", "name")

        res.status(200).json({
            success: true,
            message: "Product offers fetched successfully",
            offers: categoryOffers
        });
    } catch (error) {
        console.error("Error fetching product offers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product offers",
            error: error.message
        });
    }
};





export const createReferalOffer = async (req, res) => {

    try {
        const { name, rewardAmount, rewardType, method, minPurchase, validity } = req.body;

        // Create new offer instance
        const newOffer = new ReferralOffer({
            name,
            rewardAmount,
            rewardType,
            method,
            minPurchase,
            validity
        });

        const savedOffer = await newOffer.save();
        res.status(201).json({ success: true, data: savedOffer });
    } catch (error) {
        console.error('Error creating referral offer:', error);
        res.status(500).json({ success: false, message: 'Server error while creating offer.' });
    }
}



export const getReferalOffers = async (req, res) => {
    try {
        const offers = await ReferralOffer.find({});
        res.status(200).json({ success: true, offers });
    } catch (error) {
        console.error("Error fetching referral offers:", error);
        res.status(500).json({ success: false, message: "Server error while fetching offers." });
    }
}


export const editReferalOffer = async (req, res) => {

    try {
        const offerId = req.params.id;
        const { name, rewardAmount, rewardType, method, minPurchase, validity } = req.body;

        const updatedOffer = await ReferralOffer.findByIdAndUpdate(
            offerId,
            { name, rewardAmount, rewardType, method, minPurchase, validity },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({ success: false, message: 'Referral offer not found.' });
        }

        res.status(200).json({ success: true, data: updatedOffer });
    } catch (error) {
        console.error('Error updating referral offer:', error);
        res.status(500).json({ success: false, message: 'Server error while updating offer.' });
    }
}







export const salesReport = async (req, res) => {

    console.log("workeddd");


    try {
        // Retrieve query parameters for filtering, sorting, and pagination
        const {
            searchTerm,
            dateRange,       // Options: all, today, last7days, thisMonth, custom
            customStartDate, // used when dateRange === 'custom'
            customEndDate,   // used when dateRange === 'custom'
            page = 1,
            pageSize = 10,
            sortBy = 'createdAt', // default sort field (you can allow others like totalAmount)
            sortOrder = 'desc'
        } = req.query;

        // Build filter object based on provided parameters
        let filters = {};

        // For a search term, you might want to search in order status or totalAmount.
        // Note: orderNumber is a virtual field and cannot be directly queried.
        if (searchTerm) {
            filters.$or = [
                { orderStatus: { $regex: searchTerm, $options: 'i' } },
                { totalAmount: Number(searchTerm) || 0 },
                { orderId: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Filter by date range using the createdAt field
        const now = new Date();
        if (dateRange === 'today') {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            filters.createdAt = { $gte: start, $lt: end };
        } else if (dateRange === 'last7days') {
            const start = new Date();
            start.setDate(now.getDate() - 6); // last 7 days (including today)
            filters.createdAt = { $gte: start, $lte: now };
        } else if (dateRange === 'thisMonth') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            filters.createdAt = { $gte: start, $lt: end };
        } else if (dateRange === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            filters.createdAt = { $gte: start, $lte: end };
        }
        // For 'all', no date filter is applied

        // Set up sort options based on provided sort field and order.
        // You can extend this logic to allow sorting on additional fields.
        let sortOptions = {};
        if (sortBy === 'totalAmount' || sortBy === 'discount') {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'createdAt') {
            sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // default fallback
        }

        // Count the total number of documents that match the filters (for pagination)
        const totalCount = await Order.countDocuments(filters);

        // Build an aggregation pipeline to return both summary info and paginated data
        const pipeline = [
            { $match: filters },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalSales: { $sum: '$totalAmount' },
                                overallDiscount: { $sum: '$discount' },
                                totalOrders: { $sum: 1 }
                            }
                        }
                    ],
                    data: [
                        { $sort: sortOptions },
                        { $skip: (Number(page) - 1) * Number(pageSize) },
                        { $limit: Number(pageSize) }
                    ]
                }
            }
        ];

        const result = await Order.aggregate(pipeline);
        const summary = result[0].summary[0] || {
            totalSales: 0,
            overallDiscount: 0,
            totalOrders: 0
        };
        const data = result[0].data;

        // Send the report response in a format that the frontend can easily use
        res.json({
            summary,
            data,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / Number(pageSize)),
                currentPage: Number(page),
                pageSize: Number(pageSize)
            }
        });
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ error: 'Failed to generate sales report.' });
    }
}
