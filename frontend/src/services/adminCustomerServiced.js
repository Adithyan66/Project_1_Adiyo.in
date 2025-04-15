

import httpClient from "./httpClient";


export const getCustomersList = async (params) => {
    const response = await httpClient.get(`admin/customers-list?${params}`)
    return response
}