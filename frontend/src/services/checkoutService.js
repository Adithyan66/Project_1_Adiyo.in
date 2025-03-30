import httpClient from "./httpClient";


export const placeOrder = async (orderData) => {
    try {
        const response = await httpClient.post(`/user/place-orders`, orderData);
        return response;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
}