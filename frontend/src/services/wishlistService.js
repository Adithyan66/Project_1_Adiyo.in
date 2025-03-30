import httpClient from "./httpClient";

export const checkProductInWishlist = async () => {
    try {
        const response = await httpClient.get(`/user/wishlist`);
        return response;
    } catch (error) {
        console.error("Error checking product in wishlist:", error);
        throw error;
    }
}

export const removeFromWishlist = async (data) => {
    try {
        const response = await httpClient.delete(`/user/wishlist/remove`, { data });
        return response;
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        throw error;
    }
}

export const addToWishlist = async (data) => {
    try {
        await httpClient.post(`/user/wishlist/add`, { data });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        throw error;
    }
}