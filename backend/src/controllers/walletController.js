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


import mongoose from "mongoose";
import { generateTransactionId } from "../services/generateTransactionId.js";
import { verifyPayPalOrder, capturePayPalPayment } from "../services/paypal.js";
import { Wallet, Transaction } from "../models/walletModel.js";


export const getWalletDetails = async (req, res) => {

    try {
        const { userId } = req.user;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(BAD_REQUEST).json({ message: 'Invalid user ID' });
        }

        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = await Wallet.create({
                userId,
                balance: 0,
                pendingBalance: 0,
                currency: 'INR',
                isActive: true,
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId };



        if (req.query.status && ['pending', 'completed', 'failed', 'cancelled'].includes(req.query.status)) {
            filter.status = req.query.status;
        }

        if (req.query.type && ['credit', 'debit'].includes(req.query.type)) {
            filter.type = req.query.type;
        }

        if (req.query.search) {
            filter.$or = [
                { description: { $regex: req.query.search, $options: 'i' } },
                { 'reference.orderId': req.query.search }
            ];
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reference.orderId', 'orderNumber')
            .lean();

        const totalTransactions = await Transaction.countDocuments(filter);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [walletSummary, monthlyStats] = await Promise.all([
            Transaction.getWalletSummary(wallet._id),
            Transaction.getMonthlyStats(userId, currentYear, currentMonth)
        ]);

        const summary = {
            totalSpent: 0,
            totalRefunded: 0,
            thisMonth: 0,
            pendingAmount: wallet.pendingBalance
        };

        walletSummary.forEach(item => {
            if (item._id === 'debit') {
                summary.totalSpent = item.total;
            } else if (item._id === 'credit') {
                summary.totalRefunded = item.total;
            }
        });

        monthlyStats.forEach(item => {
            summary.thisMonth += item.total;
        });

        const formattedTransactions = transactions.map(tx => {
            const orderIdValue = tx.reference && tx.reference.orderId ?
                (tx.reference.orderId.orderNumber || tx.reference.orderId.toString()) :
                '';

            return {
                id: tx._id,
                type: tx.type,
                amount: tx.amount,
                date: tx.createdAt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: tx.status,
                description: tx.description,
                orderId: orderIdValue,
                source: tx.source
            };
        });

        return res.status(OK).json({
            wallet: {
                balance: wallet.balance,
                pendingBalance: wallet.pendingBalance,
                currency: wallet.currency,
                isActive: wallet.isActive
            },
            summary,
            transactions: formattedTransactions,
            pagination: {
                page,
                limit,
                totalTransactions,
                totalPages: Math.ceil(totalTransactions / limit)
            }
        });

    } catch (error) {

        console.error('Error getting wallet details:', error);
        return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: error.message });
    }
};


export const getWalletBalance = async (req, res) => {

    try {
        const userId = req.user.userId;
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Wallet not found",
            });
        }

        res.status(OK).json({
            success: true,
            message: "Wallet balance fetched successfully",
            balance: wallet.balance,
        });
    } catch (error) {
        console.error("Error getting wallet balance:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error",
        });
    }
};

export const walletRecharge = async (req, res) => {

    const { userId } = req.user;
    const { paymentMethod, paypalOrderID, razorpayOrderID } = req.body;
    let { amount } = req.body;

    amount = Number(amount)

    if (!amount || amount <= 0) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: "Valid amount is required for wallet recharge"
        });
    }

    let paymentVerified = false;
    let paymentDetails = null;

    try {
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Wallet not found for this user"
            });
        }

        if (!wallet.isActive) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Wallet is inactive"
            });
        }

        if (paymentMethod === 'paypal') {
            if (!paypalOrderID) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "PayPal Order ID is required for PayPal payments"
                });
            }

            try {
                const paypalOrderDetails = await verifyPayPalOrder(paypalOrderID);

                const paypalAmount = parseFloat(paypalOrderDetails.purchase_units[0].amount.value);


                if (paypalAmount !== amount) {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: "Payment amount does not match the recharge amount"
                    });
                }

                paymentDetails = await capturePayPalPayment(paypalOrderID);
                paymentVerified = true;

            } catch (error) {

                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: error.message || "Failed to verify PayPal payment"
                });
            }
        } else if (paymentMethod === 'razorpay') {
            paymentVerified = true;

        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        if (paymentVerified) {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const transaction = new Transaction({
                    transactionId: generateTransactionId(),
                    walletId: wallet._id,
                    userId: userId,
                    type: 'credit',
                    amount: amount,
                    balance: wallet.balance + amount,
                    description: `Wallet recharge via ${paymentMethod}`,
                    status: 'completed',
                    source: 'manual_credit',
                    reference: {
                        paymentId: paymentMethod === 'paypal' ? paypalOrderID : razorpayOrderID
                    },
                    metadata: paymentDetails ? new Map(Object.entries(paymentDetails)) : new Map()
                });

                await transaction.save({ session });

                wallet.balance += amount;
                wallet.updatedAt = new Date();
                await wallet.save({ session });

                await session.commitTransaction();
                session.endSession();

                return res.status(OK).json({
                    success: true,
                    message: "Wallet recharged successfully",
                    data: {
                        transaction: {
                            id: transaction._id,
                            amount: transaction.amount,
                            type: transaction.type,
                            status: transaction.status,
                            createdAt: transaction.createdAt
                        },
                        wallet: {
                            id: wallet._id,
                            balance: wallet.balance,
                            currency: wallet.currency
                        }
                    }
                });
            } catch (error) {

                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        } else {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error("Wallet recharge error:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred during wallet recharge",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
