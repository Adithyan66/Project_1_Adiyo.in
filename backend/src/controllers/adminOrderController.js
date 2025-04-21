
import HttpStatusCode from "../utils/httpStatusCodes.js";

const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode

import Order from "../models/orderModel.js"
import { Wallet, Transaction, ReturnRefund } from '../models/walletModel.js';
import mongoose from "mongoose";
import { generateTransactionId } from "../services/generateTransactionId.js";



export const getOrders = async (req, res) => {
    try {


        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search;
        const status = req.query.status;

        console.log(req.query);


        const filter = {};

        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: 'i' } },
            ];
        }
        if (status && status !== 'all') {
            filter.orderStatus = status;
        }

        const ordersPromise = Order.find(filter).populate("user")
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        const countPromise = Order.countDocuments(filter);

        const [orders, totalOrders] = await Promise.all([ordersPromise, countPromise]);

        res.status(OK).json({
            success: true,
            message: "data fetchedn succesfully",
            orders,
            totalOrders
        });

    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(INTERNAL_SERVER_ERROR).json({
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
            return res.status(NOT_FOUND).json({ message: 'Order not found' });
        }

        const formattedOrder = order.toObject({ virtuals: true });


        formattedOrder.products = order.orderItems.map((item) => {

            const product = item.product;

            const colorData = product.colors.find((c) => c.color === item.color) || {};
            console.log("okomdkoveofjvogfbogfnbogbogb ojgfohj", colorData.images);

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
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error while fetching order details' });
    }
};



export const updateOrderStatus = async (req, res) => {

    try {
        const { orderId } = req.params;
        const { status } = req.body;


        const validStatuses = ['pending', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'return requested', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(BAD_REQUEST).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(NOT_FOUND).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        const formattedOrder = order.toObject({ virtuals: true });
        formattedOrder.status = order.orderStatus;
        res.status(OK).json({
            ststus: true,
            message: 'Order status updated successfully',
            order: formattedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
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
            return res.status(NOT_FOUND).json({ message: 'Order not found' });
        }


        if (order.returnStatus !== 'requested') {
            return res.status(BAD_REQUEST).json({ message: 'No return requested for this order' });
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

        res.status(OK).json({
            message: approved ? 'Return approved successfully' : 'Return rejected',
            order: formattedOrder,
        });
    } catch (error) {
        console.error('Error processing return verification:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
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
        return res.status(BAD_REQUEST).json({
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
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.orderStatus !== "return requested") {

            await session.abortTransaction();
            session.endSession();
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Order is not pending return verification.",
            });
        }

        if (order.user?.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(BAD_REQUEST).json({
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
                transactionId: generateTransactionId(),
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

        return res.status(OK).json({
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
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error while processing return verification.",
            error: error.message
        });
    }
};
