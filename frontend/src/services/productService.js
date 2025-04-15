
import httpClient from "./httpClient";

export const newArrivals = async (page, PRODUCTS_PER_PAGE) => {
    try {
        const response = await httpClient.get(`/user/new-arrivals?page=${page}&limit=${PRODUCTS_PER_PAGE}`);
        return response;
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        throw error;
    }
}

export const topSelling = async (page, PRODUCTS_PER_PAGE) => {
    try {
        const response = await httpClient.get(`/user/top-selling?page=${page}&limit=${PRODUCTS_PER_PAGE}`);
        return response;
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        throw error;
    }
}

export const productOffers = async (productId) => {
    try {
        const response = await httpClient.get(`/user/offers/product/${productId}`)
        return response;
    } catch (error) {
        console.error("Error fetching product offers:", error);
        throw error;

    }
}

export const getProductList = async (params) => {
    try {
        const response = await httpClient.get(`/user/product-list`, { params });
        return response;
    } catch (error) {
        console.error("Error fetching product list:", error);
        throw error;
    }

}

export const addProduct = async (formData) => {
    try {
        const response = await httpClient.post(`/seller/add-products`, formData);
        return response;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}

export const getProductDetils = async (productId) => {
    try {
        const response = await httpClient.get(`/seller/products/${productId}`);
        return response;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
}

export const editProduct = async (productId, formData) => {
    try {
        const response = await httpClient.put(`/seller/edit-product/${productId}`, formData);
        return response;
    } catch (error) {
        console.error("Error editing product:", error);
        throw error;
    }
}


export const sellerProductList = async (params) => {
    try {
        const response = await httpClient.get(`/seller/products?${params}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await httpClient.delete(`/seller/delete-product/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}


export const productName = async () => {
    const response = await httpClient.get(`admin/product-names`)
    return response
}