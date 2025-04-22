import { Transaction, Wallet } from "../models/walletModel.js";



// Add this function for processing refunds to user wallet
const processWalletRefund = async (userId, amount, orderId, paymentMethod, paymentDetails) => {
    try {
        // Find user wallet
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            // Create wallet if it doesn't exist
            const newWallet = new Wallet({
                userId,
                balance: amount
            });
            await newWallet.save();

            // Create transaction record
            const transaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: newWallet._id,
                userId,
                type: 'refund',
                amount,
                balance: amount,
                description: `Refund for order #${orderId}`,
                status: 'completed',
                source: 'order_refund',
                reference: {
                    orderId,
                    paymentMethod,
                    originalPaymentDetails: paymentDetails
                }
            });

            await transaction.save();
            return {
                success: true,
                walletId: newWallet._id,
                transactionId: transaction._id
            };
        } else {
            // Update existing wallet
            const newBalance = wallet.balance + amount;
            wallet.balance = newBalance;
            await wallet.save();

            // Create transaction record
            const transaction = new Transaction({
                transactionId: generateTransactionId(),
                walletId: wallet._id,
                userId,
                type: 'refund',
                amount,
                balance: newBalance,
                description: `Refund for order #${orderId}`,
                status: 'completed',
                source: 'order_refund',
                reference: {
                    orderId,
                    paymentMethod,
                    originalPaymentDetails: paymentDetails
                }
            });

            await transaction.save();
            return {
                success: true,
                walletId: wallet._id,
                transactionId: transaction._id
            };
        }
    } catch (error) {
        console.error('Wallet refund error:', error);
        return {
            success: false,
            error: error.message || 'Wallet refund failed'
        };
    }
};


export default processWalletRefund