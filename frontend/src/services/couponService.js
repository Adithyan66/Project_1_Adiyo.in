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

export const addCoupon = async (newCoupon) => {
    try {
        const response = await httpClient.post(`/admin/add-coupon`, newCoupon);
        return response;
    } catch (error) {
        console.error("Error adding coupon:", error);
        throw error;
    }
}


export const getCouponList = async () => {
    try {
        const response = await httpClient.get(`/admin/coupons`);
        return response;
    } catch (error) {
        console.error("Error fetching coupon list:", error);
        throw error;
    }
}


export const deleteCoupon = async (id) => {
    try {
        const response = await httpClient.delete(`/admin/delete-coupon/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting coupon:", error);
        throw error;
    }
}


export const editCoupon = async (newCoupon) => {
    try {
        const response = await httpClient.patch(`/admin/edit-coupon`, newCoupon);
        return response;
    } catch (error) {
        console.error("Error editing coupon:", error);
        throw error;
    }
}


