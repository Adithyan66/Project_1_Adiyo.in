export const getTransactionStatusBadge = (status) => {
    const statusClasses = {
        'completed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800',
        'cancelled': 'bg-gray-100 text-gray-800',
        'processing': 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};


export const getTransactionTypeLabel = (type) => {
    const labels = {
        'credit': 'Credit',
        'debit': 'Debit',
        'refund': 'Refund',
        'withdrawal': 'Withdrawal',
        'order_payment': 'Order Payment',
        'order_refund': 'Order Refund',
        'return_refund': 'Return Refund',
        'cancellation_refund': 'Cancellation Refund',
        'referral': 'Referral Bonus',
        'admin': 'Admin Adjustment',
        'purchase': 'Purchase'
    };
    return labels[type] || type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

