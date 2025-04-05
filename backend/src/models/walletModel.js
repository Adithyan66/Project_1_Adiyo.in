


import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    pendingBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Removed: WalletSchema.index({ userId: 1 });


const TransactionSchema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
        index: true  // inline index declaration
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true  // inline index declaration
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'refund', 'withdrawal', 'order_payment', 'order_refund', 'return_refund', 'cancellation_refund', 'referral'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    balance: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['order_refund', 'order_payment', 'manual_credit', 'withdrawal', 'return_refund', 'cancellation_refund', 'referral'],
        required: true
    },
    reference: {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            index: true
        },
        returnId: {
            type: Schema.Types.ObjectId,
            ref: 'Return'
        },
        paymentId: String,
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'Admin'
        }
    },
    metadata: {
        type: Map,
        of: Schema.Types.Mixed
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Only add compound or additional indexes that are not declared inline
TransactionSchema.index({ walletId: 1, type: 1 });
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ createdAt: -1 });
// Removed: TransactionSchema.index({ 'reference.orderId': 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });


TransactionSchema.statics.getWalletSummary = async function (walletId) {
    console.log("wallet id", walletId);

    return this.aggregate([
        { $match: { walletId } },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);

};

TransactionSchema.statics.getMonthlyStats = async function (userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.aggregate([
        {
            $match: {
                userId,
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
};

const ReturnRefundSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvalNotes: String,
    approvedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });



// Create models
export const Wallet = mongoose.model('Wallet', WalletSchema);
export const Transaction = mongoose.model('Transaction', TransactionSchema);
export const ReturnRefund = mongoose.model('ReturnRefund', ReturnRefundSchema);
