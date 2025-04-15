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


export const addCategoryfunction = async (newCategory) => {
    try {
        const response = await httpClient.post(`/admin/add-category`, newCategory);
        return response;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
}




export const addSubcategoryfunction = async (selectedCategoryId, newSubcategory) => {
    try {
        const response = await httpClient.post(`/admin/${selectedCategoryId}/add-subcategories`, newSubcategory);
        return response;
    } catch (error) {
        console.error("Error adding subcategory:", error);
        throw error;
    }
}


export const deleteCategoryfunction = async (categoryId) => {
    try {
        const response = await httpClient.delete(`/admin/delete-categories/${categoryId}`);
        return response;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}


export const deleteSubcategoryfunction = async (selectedCategoryId, subcategoryId) => {
    try {
        const response = await httpClient.delete(`/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`);
        return response;
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        throw error;
    }
}

export const updateCategoryfunction = async (selectedCategoryId, updatedCategory) => {
    console.log("hiiiiiiiiiiiiiiiiiii");

    try {
        const response = await httpClient.put(`/admin/categories/${selectedCategoryId}`, updatedCategory);
        return response;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}


export const updateSubcategoryfunction = async (selectedCategoryId, subcategoryId, updatedSubcategory) => {
    try {
        const response = await httpClient.put(`/admin/categories/${selectedCategoryId}/subcategories/${subcategoryId}`, updatedSubcategory);
        return response;
    } catch (error) {
        console.error("Error updating subcategory:", error);
        throw error;
    }
}
