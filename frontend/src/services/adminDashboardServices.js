


import httpClient from "./httpClient";

export const getDashboartData = async (params) => {
    try {
        const response = await httpClient.get(`admin/dashboard?${params}`)
        return response;
    } catch (error) {
        console.log("error fetcheing in dashboard data ", error)
        throw error
    }
}



export const getSalesReport = async (params) => {
    const response = await httpClient.get(`admin/sales-report`, { params })
    return response
}