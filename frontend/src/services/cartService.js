import httpClient from "./httpClient";

export const addToCart = async (data) => {
    try {
        const response = await httpClient.post(`/user/cart/add`, { data });
        return response;
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw error;
    }
}

export const updateQuantity = async (itemId, newQuantity) => {
    try {
        const response = await httpClient.patch(`/user/cart-items/${itemId}`, { newQuantity });
        return response;
    } catch (error) {
        console.error("Error updating product quantity in cart:", error);
        throw error;
    }
}

export const deleteCartItem = async (itemId) => {
    try {
        const response = await httpClient.delete(`/user/cart-items/${itemId}`);
        return response;
    } catch (error) {
        console.error("Error deleting product from cart:", error);
        throw error;
    }
}

export const getCartItems = async () => {
    try {
        const response = await httpClient.get(`/user/cart-items`);
        return response;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error;
    }
}