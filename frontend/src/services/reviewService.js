import httpClient from "./httpClient";

export const getReviewbyProductId = async (productId) => {
    try {
        const response = await httpClient.get(`/user/${productId}/reviews`);
        return response;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
}

export const addReview = async (productId, rating, comment) => {
    try {
        const response = await httpClient.post(`/user/${productId}/addreviews`, {
            rating,
            comment
        });
        return response;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}