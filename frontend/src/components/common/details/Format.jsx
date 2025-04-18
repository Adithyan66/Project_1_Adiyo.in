

export const formatAmount = (amount, type) => {
    const isCredit = ['credit', 'refund', 'return_refund', 'cancellation_refund', 'referral'].includes(type);
    return (
        <span className={`font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
            {isCredit ? '+' : '-'}₹{Math.abs(amount).toFixed(2)}
        </span>
    );
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
