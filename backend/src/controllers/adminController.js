
import HttpStatusCode from "../utils/httpStatusCodes.js";

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
import { updateProductDiscounts, updateProductDiscountsForSingleProduct } from "../services/discountService.js";


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

        if (status !== undefined) {
            filter.isActive = status === "true";
        }

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const customers = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalCustomers = await User.countDocuments(filter);

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: "Customers details fetched successfully",
            customers,
            totalCustomers,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCustomers / limitNum)
        });
    } catch (error) {
        console.error("Error fetching customers:", error);

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({
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

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: "customer details fetched succesfully",
            customer
        })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "server error"
        })

    }
}

export const blockUser = async (req, res) => {

    const { id } = req.params;
    const { isActive } = req.query;

    if (isActive === undefined) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Missing required query parameter: isActive",
        });
    }

    const lowerIsActive = isActive.toLowerCase();

    if (lowerIsActive !== "true" && lowerIsActive !== "false") {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid value for isActive. Must be 'true' or 'false'.",
        });
    }

    const newIsActive = lowerIsActive === "true";

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                status: false,
                message: "User does not exist",
            });
        }

        if (user.isActive === newIsActive) {
            return res.status(HttpStatusCode.OK).json({
                status: true,
                message: `User is already ${user.isActive ? "unblocked" : "blocked"}`,
            });
        }

        user.isActive = newIsActive;

        await user.save();

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: `User ${newIsActive ? "unblocked" : "blocked"} successfully`,
        });

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
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

        const filter = {};

        filter.deletedAt = null;

        if (category && category !== "all") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const sort = {};

        if (sortBy === "category") {
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

            return res.status(HttpStatusCode.OK).json({
                status: true,
                message: "Products fetched successfully",
                products,
                totalProducts,
                currentPage: pageNum,
                totalPages: Math.ceil(totalProducts / limitNum)
            });
        }

        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filter)
            .populate("category", "name")
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments(filter);

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: "Products fetched successfully",
            products,
            totalProducts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum)
        });

    } catch (error) {

        console.error("Error fetching products:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!product) {
            return res.status(HttpStatusCode.NOT_FOUND)
                .json({
                    success: false,
                    message: 'Product not found'
                });
        }

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: 'Product soft deleted successfully',
            product
        });

    } catch (error) {

        console.error('Error soft deleting product:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({
                success: false,
                message: 'Server error'
            });
    }

}

export const productDetails = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(HttpStatusCode.NOT_FOUND)
                .json({
                    status: false,
                    message: "Product not found"
                });
        }

        res.status(HttpStatusCode.OK)
            .json({
                status: true,
                message: "Product details fetched successfully",
                product
            });

    } catch (error) {

        console.error("Error fetching product:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({
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

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: "coupon created succesfully"
        })
    } catch (error) {

        console.error("Error creating coupon:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

export const updateCoupon = async (req, res) => {

    try {

        const couponId = req.body.id
        await Coupon.findByIdAndUpdate(couponId, req.body, { new: true })

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "coupon updated succesfully"
        })

    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}



export const getCoupons = async (req, res) => {

    try {

        const coupons = await Coupon.find({ deletedAt: null }).populate("applicableCategories")

        res.status(HttpStatusCode.OK).json({
            status: true,
            message: "coupons fetched succesfully",
            coupons
        })

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
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

        res.status(HttpStatusCode.OK).json({
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

        res.status(HttpStatusCode.CREATED).json(savedCategory);

    } catch (error) {

        console.error('Error adding category:', error);

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while adding category.'
        });

    }
}


export const addSubCategories = async (req, res) => {

    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: 'Subcategory name is required.'
            });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: 'Category not found.'
            });
        }

        const newSubcategory = { name };

        category.subcategories.push(newSubcategory);

        await category.save();

        const addedSubcategory = category.subcategories[category.subcategories.length - 1];

        res.status(HttpStatusCode.CREATED).json(addedSubcategory);

    } catch (error) {

        console.error('Error adding subcategory:', error);

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error while adding subcategory.' });

    }
}


export const getCategories = async (req, res) => {

    try {
        const categories = await Category.find();

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "category fetches succesfully",
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error while fetching categories.' });
    }
}


export const editSubcategoryName = async (req, res) => {

    try {
        const { categoryId, subcategoryId } = req.params;

        const updateData = req.body;


        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Category not found.' });
        }

        const subcategory = category.subcategories.id(subcategoryId);

        if (!subcategory) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Subcategory not found.' });
        }

        Object.assign(subcategory, updateData);

        await category.save();


        res.status(HttpStatusCode.OK).json(subcategory);

    } catch (error) {

        console.error('Error updating subcategory:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error while updating subcategory.' });
    }
}


export const deleteCategories = async (req, res) => {

    try {
        const { categoryId } = req.params;
        console.log(categoryId);


        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {

            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(HttpStatusCode.OK).json({
            success: false,
            message: 'Category deleted successfully.'
        });

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
            return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Category not found.' });
        }

        category.subcategories.pull(subcategoryId);

        await category.save();

        res.status(HttpStatusCode.OK).json({ message: 'Subcategory deleted successfully.' });

    } catch (error) {

        console.error('Error deleting subcategory:', error);

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Server error while deleting subcategory.' });
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

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "data fetchedn succesfully",
            orders,
            totalOrders
        });

    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
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
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Order not found' });
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
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error while fetching order details' });
    }
};



export const updateOrderStatus = async (req, res) => {

    try {
        const { orderId } = req.params;
        const { status } = req.body;


        const validStatuses = ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'return requested', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        const formattedOrder = order.toObject({ virtuals: true });
        formattedOrder.status = order.orderStatus;
        res.status(HttpStatusCode.OK).json({
            ststus: true,
            message: 'Order status updated successfully',
            order: formattedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while updating status'
        });
    }
};



export const handleReturnVerification = async (req, res) => {

    try {
        const { orderId } = req.params;
        const { approved } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Order not found' });
        }


        if (order.returnStatus !== 'requested') {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'No return requested for this order' });
        }

        if (approved) {
            order.returnStatus = 'approved';
            order.orderStatus = 'returned';
            // Refund logic cheyyanam 
        } else {
            order.returnStatus = 'rejected';
            order.orderStatus = 'delivered';
        }

        await order.save();


        const formattedOrder = order.toObject({ virtuals: true });
        formattedOrder.status = order.orderStatus;

        res.status(HttpStatusCode.OK).json({
            message: approved ? 'Return approved successfully' : 'Return rejected',
            order: formattedOrder,
        });
    } catch (error) {
        console.error('Error processing return verification:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while processing return'
        });
    }
};



export const verifyReturn = async (req, res) => {

    const { orderId } = req.params;
    const { productId, userId, approved } = req.body;

    console.log(productId, userId, approved, orderId);

    if (!productId || !userId || typeof approved !== "boolean") {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
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
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.orderStatus !== "return requested") {

            await session.abortTransaction();
            session.endSession();
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "Order is not pending return verification.",
            });
        }

        if (order.user?.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "User ID mismatch with the order.",
            });
        }


        const refundAmount = order.totalAmount - order.shippingFee;

        order.orderStatus = approved ? "returned" : "delivered";
        order.returnVerification = {
            approved,
            verifiedAt: new Date(),
        };
        order.returnStatus = approved ? "completed" : "rejected";

        await order.save({ session });


        if (approved) {

            let wallet = await Wallet.findOne({ userId }).session(session);
            if (!wallet) {
                wallet = new Wallet({
                    userId,
                    balance: 0,
                    pendingBalance: 0
                });
            }

            wallet.balance += refundAmount;
            await wallet.save({ session });

            const transaction = new Transaction({
                walletId: wallet._id,
                userId,
                type: 'return_refund',
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


            const returnRefund = new ReturnRefund({
                userId,
                orderId,
                transactionId: transaction._id,
                amount: refundAmount,
                status: 'completed',
                reason: order.returnReason || 'Return approved by admin',
                approvedBy: req.user?._id,
                approvalNotes: 'Return verified and approved',
                approvedAt: new Date()
            });

            await returnRefund.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(HttpStatusCode.OK).json({
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
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
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
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "No products found"
            });
        }

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Successfully fetched product names",
            products: productsData
        });
    } catch (error) {
        console.error("Error fetching product names", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error"
        });
    }
};




export const createProductOffer = async (req, res) => {

    try {
        const { name, discount, products, startDate, endDate } = req.body;

        const newOffer = new ProductOffer({
            name,
            discount,
            products,
            startDate,
            endDate
        });


        const savedOffer = await newOffer.save();
        console.log(name);

        await updateProductDiscounts()

        res.status(HttpStatusCode.CREATED).json({
            success: true,
            message: "Product offer created successfully",
            offer: savedOffer
        });


    } catch (error) {
        console.error("Error creating product offer:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create product offer",
            error: error.message
        });
    }
};

export const editProductOffer = async (req, res) => {

    try {
        const { id } = req.params

        const payload = req.body

        console.log("payload", payload);


        const updatedOffer = await ProductOffer.findByIdAndUpdate(id, payload, { new: true })

        if (!updatedOffer) {
            return res.status(HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "offer not found"
            })
        }

        await updateProductDiscounts()

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "offer edited succesfully"
        })

    } catch (error) {
        console.log("error updating product offer", error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}


export const deleteProductOffer = async (req, res) => {
    try {
        const offerId = req.params.id;

        const offer = await ProductOffer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ success: false, message: 'Product offer not found' });
        }

        const affectedProductIds = [...offer.products];

        await ProductOffer.findByIdAndDelete(offerId);

        let updatedCount = 0;
        for (const productId of affectedProductIds) {
            const result = await updateProductDiscountsForSingleProduct(productId);
            if (result.success) updatedCount++;
        }

        return res.status(HttpStatusCode.OK).json({
            success: true,
            message: 'Product offer deleted successfully',
            affectedProducts: affectedProductIds.length,
            updatedProducts: updatedCount
        });
    } catch (error) {
        console.error('Error deleting product offer:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
};

export const getAllProductOffers = async (req, res) => {
    try {
        const productOffers = await ProductOffer.find().populate("products", "name")

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Product offers fetched successfully",
            offers: productOffers
        });
    } catch (error) {
        console.error("Error fetching product offers:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch product offers",
            error: error.message
        });
    }
};




export const createCategoryOffer = async (req, res) => {

    try {
        const { name, discount, category, startDate, endDate } = req.body;


        const newOffer = new CategoryOffer({
            name,
            discount,
            category,
            startDate,
            endDate
        });

        const savedOffer = await newOffer.save();

        await updateProductDiscounts()

        res.status(HttpStatusCode.CREATED).json({
            success: true,
            message: "category offer created successfully",
            offer: savedOffer
        });
    } catch (error) {
        console.error("Error creating category offer:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create category offer",
            error: error.message
        });
    }
};


export const editCategoryOffer = async (req, res) => {

    try {
        const id = req.params.id

        const payload = req.body

        const offer = await CategoryOffer.findByIdAndUpdate(id, payload, { new: true })

        if (!offer) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "offer not found"
            })
        }

        await updateProductDiscounts()

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "offer edited succesfully"
        })

    } catch (error) {

        console.log("error in editing category offer", error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: true,
            message: "server error"
        })
    }
}


export const deleteCategoryOffer = async (req, res) => {

    try {
        const id = req.params.id

        const offer = await CategoryOffer.findById(id)

        if (!offer) {
            return res.status(HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "failed to find offer"
            })
        }

        const products = await Product.find({ deletedAt: null })

        let affectedProducts = products.filter((product) => product.category.toString() == offer.category.toString());

        console.log("affectedddddddddddddddddd", affectedProducts);

        const isDeleted = await CategoryOffer.findByIdAndDelete(id)

        if (!isDeleted) {
            return res.status(HttpStatusCode.FORBIDDEN).json({
                success: false,
                message: "failed to delete offer"
            })
        }

        for (const product of affectedProducts) {
            await updateProductDiscountsForSingleProduct(product._id)
        }


        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "offer deleted succesfully"
        })

    } catch (error) {

        console.log("error in category offer delection", error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}

export const getAllCategoryOffers = async (req, res) => {
    try {

        const categoryOffers = await CategoryOffer.find().populate("category", "name")

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Product offers fetched successfully",
            offers: categoryOffers
        });
    } catch (error) {
        console.error("Error fetching product offers:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch product offers",
            error: error.message
        });
    }
};





export const createReferalOffer = async (req, res) => {

    try {

        const { name, rewardAmount, validity } = req.body;


        const newOffer = new ReferralOffer({
            name,
            rewardAmount,
            validity
        });

        const savedOffer = await newOffer.save();

        console.log("hello", name, rewardAmount, validity);
        res.status(HttpStatusCode.CREATED).json({
            success: true,
            data: savedOffer
        });
    } catch (error) {
        console.error('Error creating referral offer:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while creating offer.'
        });
    }
}



export const getReferalOffers = async (req, res) => {
    try {
        const offers = await ReferralOffer.find({ deletedAt: null });
        res.status(HttpStatusCode.OK).json({ success: true, offers });
    } catch (error) {
        console.error("Error fetching referral offers:", error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error while fetching offers." });
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
            return res.status(HttpStatusCode.NOT_FOUND).json({ success: false, message: 'Referral offer not found.' });
        }

        res.status(HttpStatusCode.OK).json({ success: true, data: updatedOffer });

    } catch (error) {
        console.error('Error updating referral offer:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Server error while updating offer.' });
    }
}







export const salesReport = async (req, res) => {

    console.log("workeddd");


    try {

        const {
            searchTerm,
            dateRange,
            customStartDate,
            customEndDate,
            page = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;


        let filters = {};

        if (searchTerm) {
            filters.$or = [
                { orderStatus: { $regex: searchTerm, $options: 'i' } },
                { totalAmount: Number(searchTerm) || 0 },
                { orderId: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const now = new Date();
        if (dateRange === 'today') {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            filters.createdAt = { $gte: start, $lt: end };
        } else if (dateRange === 'last7days') {
            const start = new Date();
            start.setDate(now.getDate() - 6);
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


        let sortOptions = {};
        if (sortBy === 'totalAmount' || sortBy === 'discount') {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'createdAt') {
            sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const totalCount = await Order.countDocuments(filters);

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

        res.status(HttpStatusCode.OK).json({
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
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to generate sales report.' });
    }
}


export const toggleReferalStatus = async (req, res) => {

    try {

        const { id } = req.params

        const { status } = req.body

        if (status) {

            const offers = await ReferralOffer.updateMany({}, { isActive: false })
            console.log(offers);
        }


        const update = await ReferralOffer.findByIdAndUpdate(id, { isActive: status }, { new: true })

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "offer not found"
            })
        }

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "status updated successfully",
            offer: update
        })


    } catch (error) {
        console.error('Error updating referral offer status:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while updating offer status.'
        });
    }
}

export const deleteReferealOffer = async (req, res) => {

    try {

        const { id } = req.params

        const offer = await ReferralOffer.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "failed to delete offer"
            })
        }

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "offer deleted succesfully"
        })

    } catch (error) {
        console.log("error in deleting referral offer", error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}

export const walletTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find({}).populate("userId").populate("walletId")
        console.log("transactions", transactions);


        if (!transactions) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                success: false,
                message: "no transactions found"
            })
        }

        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "transactions fetched successfully",
            transactions
        })

    } catch (error) {
        console.log("error in fetching transactions", error)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "server error"
        })
    }
}

export const getDashboardData = async (req, res) => {


    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear()
    const years = new Array.from({ length: 5, }, (_, i) => currentYear - i)

    try {

        const year = parseInt(req.query.year)
        const month = parseInt(req.query.month)
        const timeFilter = req.query.timeFilter
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        console.log("query", req.query);
        let aggr = {}

        if (timeFilter == "yearly") {
            aggr = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year + 1}-01-01`)
                        },
                        orderStatus: "shipped"
                    }
                }, {
                    $group: {
                        _id: { $year: "$createdAt" },
                        count: { $sum: 1 }
                    },
                }, {
                    $sort: {
                        _id: 1
                    }
                }
            ]
        } else if (timeFilter == "monthly") {
            aggr = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${date}-${month}-01`),
                            $lte: new Date(`${date}-${month + 1}-01`)
                        },
                        orderStatus: "shipped"
                    },
                    $group: {
                        _id: { $month: "$createdAt" },
                        count: { $sum: 1 }
                    },
                    $sort: {
                        _id: 1
                    }
                }
            ]
        } else if (timeFilter == "weekly") {
            aggr = [
                {
                    $addFields: {
                        isoWeek: { $isoWeek: "$createdAt" },
                        isoYear: { $isoyear: "$createdAt" }
                    },
                    $match: {
                        createdAt: { $gte: new Date(new Date() - 1000 * 60 * 60 * 24 * 7 * 5) }
                    },
                    $group: {
                        _id: {
                            week: "$isoWeek",
                            year: "$isoYear"
                        }
                    }
                }
            ]
        } else if (timeFilter == "custom") {
            aggr = [
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    },
                    $group: {
                        _id: {
                            $month: "$createdAt"
                        },
                        count: { $sum: 1 }
                    },
                    $sort: {
                        _id: 1
                    }
                }
            ]
        }


        const ordersData = await Order.aggregate(aggr)

        if (timeFilter == "monthly") {
            const orders = months.map((month, ind) => {
                const match = ordersData.find((order) => order._id == ind + 1)
                return {
                    month,
                    count: match ? match.count : 0
                }
            })
        } else if (timeFilter == "yearly") {
            const orders = years.map((year, ind) => {
                const match = ordersData.find((order) => order._id == year)
                return {
                    year,
                    count: match ? match.count : 0
                }
            })
        }


        console.log(orders);





    } catch (error) {

    }
}