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


export const checkUserCart = async () => {
    try {
        const response = await httpClient.get(`/user/check-cart`);
        return response;
    } catch (error) {
        console.error("Error checking user cart:", error);
        throw error;
    }
};


export const clearUserCart = async () => {
    try {
        const response = await httpClient.delete(`/user/clear-cart`);
        return response;
    } catch (error) {
        console.error("Error clearing user cart:", error);
        throw error;
    }
};


export const checkAvailable = async (items) => {
    try {
        const response = await httpClient.post("/user/check-cart-availablity", { items })
        return response
    } catch {
        console.error("Error checking cart:", error);
        throw error;
    }
}

