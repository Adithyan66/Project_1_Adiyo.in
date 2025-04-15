


import httpClient from "./httpClient";

export const getProductOffers = async () => {
    const response = await httpClient.get(`admin/product-offers`)
    return response
}

export const getCategoryOffers = async () => {
    const response = await httpClient.get(`admin/category-offers`)
    return response
}

export const getReferalOffers = async () => {
    const response = await httpClient.get(`admin/referral-offers`)
    return response
}

export const editProductOffer = async (id, payload) => {
    const response = await httpClient.put(`admin/edit-product-offer/${id}`, payload)
    return response
}

export const createProductOffer = async (payload) => {
    const response = await httpClient.post(`admin/create-product-offer`, payload)
    return response
}

export const editCategoryOffer = async (id, payload) => {
    const response = await httpClient.put(`admin/category-offer/${id}`, payload)
    return response
}

export const createCategoryOffer = async (payload) => {
    const response = await httpClient.post(`admin/create-category-offer`, payload)
    return response
}
export const editReferalOffer = async (id, payload) => {
    const response = await httpClient.put(`admin/referral-offer/${id}`, payload)
    return response
}

export const createReferalOffer = async (payload) => {
    const response = await httpClient.post(`admin/create-referral-offer`, payload)
    return response
}


export const deleteOffer = async (offer, id) => {
    const response = await httpClient.delete(`admin/${offer}/${id}`)
    return response
}

export const toggleStatusOfOffers = async (offer, id, currentStatus) => {

    const response = await httpClient.patch(`admin/${offer}/toggle-status/${id}`, { status: currentStatus === true ? false : true })
    return response
}