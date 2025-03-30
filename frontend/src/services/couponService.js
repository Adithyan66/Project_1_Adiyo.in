import httpClient from "./httpClient";

export const validateCoupon = async (code, orderTotal, productCategories) => {
    try {
        const response = await httpClient.post(`/user/coupons/validate`, { code, orderTotal, productCategories });
        return response;
    } catch (error) {
        console.error("Error validating coupon:", error);
        throw error;
    }
}