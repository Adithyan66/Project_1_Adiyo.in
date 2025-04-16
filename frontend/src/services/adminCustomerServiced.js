

import httpClient from "./httpClient";


export const getCustomersList = async (params) => {
    const response = await httpClient.get(`admin/customers-list?${params}`)
    return response
}

export const getCustomerDetails = async (id) => {
    try {
        const response = await httpClient.get(`/admin/${id}/customer-details`);
        return response;
    } catch (error) {
        console.error("Error fetching customer details:", error);
        throw error;
    }
}


export const toggleUserBlockStatus = async (id, currentStatus) => {
    try {
        const response = await httpClient.patch(`/admin/block-user/${id}?isActive=${!currentStatus}`);
        return response;
    } catch (error) {
        console.error("Error toggling user block status:", error);
        throw error;
    }
}
