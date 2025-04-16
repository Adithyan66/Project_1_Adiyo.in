
import httpClient from "./httpClient";

export const orderDetailsById = async (orderId) => {
    try {
        const response = await httpClient.get(`/user/orders/${orderId}`);
        return response;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await httpClient.put(`/user/orders/${orderId}/cancel`, { reason })
        return response;

    } catch (error) {
        console.error("Error cancelling order:", error);
        throw error;
    }
}

export const returnRequest = async (orderId, items, reason) => {
    try {
        const response = await httpClient.post(`/user/orders/${orderId}/return`, { items, reason })
        return response;

    } catch (error) {
        console.error("Error requesting return:", error);
        throw error;
    }
}


export const getOrders = async () => {
    try {
        const response = await httpClient.get(`/user/orders`);
        return response;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}


export const getOrderDetails = async (orderId) => {
    try {
        const response = await httpClient.get(`/admin/orders/${orderId}`);
        return response;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}


export const updateOrderStatus = async (orderId, statusModal) => {
    try {
        const response = await httpClient.patch(`/admin/orders/${orderId}/status`, {
            status: statusModal.newStatus,
            note: statusModal.note
        });
        return response;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}


export const verifyReturnRequest = async (orderId, order, approved) => {
    try {
        const response = await httpClient.post(`/admin/orders/${orderId}/return-verification`, {
            productId: order._id,
            userId: order.user._id,
            approved
        });
        return response;
    } catch (error) {
        console.error("Error verifying return request:", error);
        throw error;
    }
}


export const getFilteredOrders = async (params) => {
    try {
        const response = await httpClient.get(`/admin/orders?${params}`);
        return response;
    } catch (error) {
        console.error("Error fetching filtered orders:", error);
        throw error;
    }
}



export const updateOrderStatusById = async (statusModal) => {
    try {
        const response = await httpClient.patch(`/admin/orders/${statusModal.orderId}/status`, {
            status: statusModal.newStatus
        });
        return response;
    } catch (error) {
        console.error("Error updating order status by ID:", error);
        throw error;
    }
}


export const verifyOrderReturn = async (returnModal, approved) => {
    try {
        const response = await httpClient.post(`/admin/orders/${returnModal.orderId}/return-verification`, {
            productId: returnModal.productId,
            userId: returnModal.userId,
            amount: returnModal.amount,
            approved
        });
        return response;
    } catch (error) {
        console.error("Error verifying order return:", error);
        throw error;
    }
}
