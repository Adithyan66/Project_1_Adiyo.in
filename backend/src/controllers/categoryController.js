import HttpStatusCode from "../utils/httpStatusCodes.js";
const {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    UNPROCESSABLE_ENTITY,
    INTERNAL_SERVER_ERROR,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT
} = HttpStatusCode

import Category from "../models/categoryModel.js";


export const addCategory = async (req, res) => {

    try {

        const { name, description, thumbnail } = req.body;

        if (!name) {

            return res.status(BAD_REQUEST).json({ error: 'Category name is required.' });
        }
        const newCategory = new Category({ name, description, thumbnail });

        const savedCategory = await newCategory.save();

        res.status(CREATED).json(savedCategory);

    } catch (error) {

        console.error('Error adding category:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error while adding category.'
        });
    }
}


export const addSubCategories = async (req, res) => {

    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'Subcategory name is required.'
            });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: 'Category not found.'
            });
        }

        const newSubcategory = { name };

        category.subcategories.push(newSubcategory);

        await category.save();

        const addedSubcategory = category.subcategories[category.subcategories.length - 1];

        res.status(CREATED).json(addedSubcategory);

    } catch (error) {

        console.error('Error adding subcategory:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while adding subcategory.' });
    }
}


export const getCategories = async (req, res) => {

    try {

        const categories = await Category.find();

        res.status(OK).json({
            success: true,
            message: "category fetches succesfully",
            categories
        });

    } catch (error) {

        console.error('Error fetching categories:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while fetching categories.' });
    }
}


export const editSubcategoryName = async (req, res) => {

    try {
        const { categoryId, subcategoryId } = req.params;

        const updateData = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(NOT_FOUND).json({ error: 'Category not found.' });
        }

        const subcategory = category.subcategories.id(subcategoryId);

        if (!subcategory) {
            return res.status(NOT_FOUND).json({ error: 'Subcategory not found.' });
        }

        Object.assign(subcategory, updateData);

        await category.save();

        res.status(OK).json(subcategory);

    } catch (error) {

        console.error('Error updating subcategory:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while updating subcategory.' });
    }
}


export const deleteCategories = async (req, res) => {

    try {

        const { categoryId } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {

            return res.status(NOT_FOUND).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(OK).json({
            success: false,
            message: 'Category deleted successfully.'
        });

    } catch (error) {

        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Server error while deleting category.' });
    }
}


export const deleteSubCategories = async (req, res) => {

    try {

        const { categoryId, subcategoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(NOT_FOUND).json({ error: 'Category not found.' });
        }

        category.subcategories.pull(subcategoryId);

        await category.save();

        res.status(OK).json({ message: 'Subcategory deleted successfully.' });

    } catch (error) {

        console.error('Error deleting subcategory:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while deleting subcategory.' });
    }
}
