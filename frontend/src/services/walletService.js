import httpClient from "./httpClient";

export const getWalletDetails = async (queryParams) => {
    try {
        const response = await httpClient.get("/user/wallet?${queryParams}");
        return response;
    } catch (error) {
        console.error("Error fetching wallet details:", error);
        throw error;
    }
}