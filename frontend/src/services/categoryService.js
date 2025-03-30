import httpClient from "./httpClient";

export const getCategoryList = async () => {
    try {
        const response = await httpClient.get(`/admin/categories`);
        return response;
    } catch (error) {
        console.error("Error fetching category list:", error);
        throw error;
    }
}

export const breadCrumbCategoryName = async (category, subCategory) => {
    try {
        const response = await httpClient.get(`/user/category-name/${category}/${subCategory}`);
        return response;
    } catch (error) {
        console.error("Error fetching category name:", error);
        throw error;
    }
}