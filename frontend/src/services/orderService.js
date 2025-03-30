
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