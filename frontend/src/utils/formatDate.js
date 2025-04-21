

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};


export const getEstimatedDelivery = (estimatedDeliveryDays) => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + parseInt(estimatedDeliveryDays.split('-')[1]));
    return deliveryDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};


export const formatCurrency = (amount) => {
    return Number(amount).toFixed(2);
};