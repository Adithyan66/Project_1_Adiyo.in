import { useState, useEffect } from 'react';
import {
    getCategoryList,
    addCategoryfunction,
    addSubcategoryfunction,
    deleteCategoryfunction,
    deleteSubcategoryfunction,
    updateCategoryfunction,
    updateSubcategoryfunction,
} from '../../services/categoryService';

const useCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await getCategoryList();
            const fetchedCategories = Array.isArray(response.data.categories)
                ? response.data.categories
                : response.data;
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0) {
                setSelectedCategoryId(fetchedCategories[0]._id);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = async (newCategory, resetForm) => {
        if (!newCategory.name) return;
        try {
            const response = await addCategoryfunction(newCategory);
            setCategories([...categories, response.data]);
            setSelectedCategoryId(response.data._id);
            resetForm();
            setIsAddingCategory(false);
        } catch (err) {
            setError('Failed to add category.');
            console.error(err);
        }
    };

    const addSubcategory = async (newSubcategory, resetForm) => {
        if (!newSubcategory.name || !selectedCategoryId) return;
        try {
            const response = await addSubcategoryfunction(selectedCategoryId, newSubcategory);
            setCategories(categories.map((category) =>
                category._id === selectedCategoryId
                    ? { ...category, subcategories: [...(category.subcategories || []), response.data] }
                    : category
            ));
            resetForm();
            setIsAddingSubcategory(false);
            fetchCategories();
        } catch (err) {
            setError('Failed to add subcategory.');
            console.error(err);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            await deleteCategoryfunction(categoryId);
            const updatedCategories = categories.filter((category) => category._id !== categoryId);
            setCategories(updatedCategories);
            setSelectedCategoryId(updatedCategories.length > 0 ? updatedCategories[0]._id : null);
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category.');
            console.error(err);
        }
    };

    const deleteSubcategory = async (subcategoryId) => {
        if (!selectedCategoryId) return;
        try {
            await deleteSubcategoryfunction(selectedCategoryId, subcategoryId);
            setCategories(categories.map((category) =>
                category._id === selectedCategoryId
                    ? {
                        ...category,
                        subcategories: (category.subcategories || []).filter((sc) => sc._id !== subcategoryId),
                    }
                    : category
            ));
            fetchCategories();
        } catch (err) {
            setError('Failed to delete subcategory.');
            console.error(err);
        }
    };

    const updateCategory = async (field, value) => {
        if (!selectedCategoryId) return;
        try {
            const selectedCategory = categories.find((c) => c._id === selectedCategoryId);
            const updatedCategory = { ...selectedCategory, [field]: value };
            await updateCategoryfunction(selectedCategoryId, updatedCategory);
            setCategories(categories.map((category) =>
                category._id === selectedCategoryId ? { ...category, [field]: value } : category
            ));
        } catch (err) {
            setError('Failed to update category.');
            console.error(err);
        }
    };

    const updateSubcategory = async (subcategoryId, field, value) => {
        if (!selectedCategoryId) return;
        try {
            const selectedCategory = categories.find((c) => c._id === selectedCategoryId);
            const subcategory = selectedCategory.subcategories?.find((sc) => sc._id === subcategoryId);
            if (!subcategory) return;
            const updatedSubcategory = { ...subcategory, [field]: value };
            await updateSubcategoryfunction(selectedCategoryId, subcategoryId, updatedSubcategory);
            setCategories(categories.map((category) =>
                category._id === selectedCategoryId
                    ? {
                        ...category,
                        subcategories: category.subcategories.map((sc) =>
                            sc._id === subcategoryId ? { ...sc, [field]: value } : sc
                        ),
                    }
                    : category
            ));
        } catch (err) {
            setError('Failed to update subcategory.');
            console.error(err);
        }
    };

    return {
        categories: Array.isArray(categories) ? categories : [],
        selectedCategoryId,
        setSelectedCategoryId,
        isLoading,
        error,
        setError,
        addCategory,
        addSubcategory,
        deleteCategory,
        deleteSubcategory,
        updateCategory,
        updateSubcategory,
        isAddingCategory,
        setIsAddingCategory,
        isAddingSubcategory,
        setIsAddingSubcategory,
    };
};

export default useCategoryManagement;