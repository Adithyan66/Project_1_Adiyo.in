import httpClient from "./httpClient";


export const getUserReferrals = async (queryParams) => {
    try {
        const response = await httpClient.get(`/user/referrals?${queryParams.toString()}`);
        return response;
    } catch (error) {
        console.error("Error fetching user referrals:", error);
        throw error;
    }
}
