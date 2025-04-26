// import HttpStatusCode from "../utils/httpStatusCodes.js";
// const {
//     OK,
//     CREATED,
//     ACCEPTED,
//     NO_CONTENT,
//     BAD_REQUEST,
//     UNAUTHORIZED,
//     FORBIDDEN,
//     NOT_FOUND,
//     METHOD_NOT_ALLOWED,
//     CONFLICT,
//     UNPROCESSABLE_ENTITY,
//     INTERNAL_SERVER_ERROR,
//     BAD_GATEWAY,
//     SERVICE_UNAVAILABLE,
//     GATEWAY_TIMEOUT
// } = HttpStatusCode

// import Category from "../models/categoryModel.js";


// export const addCategory = async (req, res) => {
//     try {
//         const { name, description, thumbnail } = req.body;

//         if (!name) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Category name is required.'
//             });
//         }

//         if (typeof name !== 'string') {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Category name must be a string.'
//             });
//         }

//         if (name.trim().length < 2 || name.trim().length > 50) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Category name must be between 2 and 50 characters.'
//             });
//         }


//         const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
//         if (existingCategory) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'A category with this name already exists.'
//             });
//         }

//         const newCategory = new Category({
//             name: name.trim(),
//             description: description ? description.trim() : undefined,
//             thumbnail
//         });

//         const savedCategory = await newCategory.save();

//         res.status(CREATED).json({
//             success: true,
//             data: savedCategory
//         });

//     } catch (error) {
//         console.error('Error adding category:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Server error while adding category.',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// }

// export const addSubCategories = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         const { name } = req.body;

//         if (!name) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Subcategory name is required.'
//             });
//         }

//         if (typeof name !== 'string') {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Subcategory name must be a string.'
//             });
//         }

//         if (name.trim().length < 2 || name.trim().length > 50) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'Subcategory name must be between 2 and 50 characters.'
//             });
//         }

//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: 'Category not found.'
//             });
//         }

//         const subcategoryExists = category.subcategories.some(
//             subcategory => subcategory.name.toLowerCase() === name.trim().toLowerCase()
//         );

//         if (subcategoryExists) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: 'A subcategory with this name already exists in this category.'
//             });
//         }

//         const newSubcategory = { name: name.trim() };

//         category.subcategories.push(newSubcategory);
//         await category.save();

//         const addedSubcategory = category.subcategories[category.subcategories.length - 1];

//         res.status(CREATED).json({
//             success: true,
//             data: addedSubcategory
//         });

//     } catch (error) {
//         console.error('Error adding subcategory:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: 'Server error while adding subcategory.',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// }


// export const getCategories = async (req, res) => {

//     try {

//         const categories = await Category.find();

//         res.status(OK).json({
//             success: true,
//             message: "category fetches succesfully",
//             categories
//         });

//     } catch (error) {

//         console.error('Error fetching categories:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while fetching categories.' });
//     }
// }


// export const editSubcategoryName = async (req, res) => {

//     try {
//         const { categoryId, subcategoryId } = req.params;

//         const updateData = req.body;

//         const category = await Category.findById(categoryId);

//         if (!category) {
//             return res.status(NOT_FOUND).json({ error: 'Category not found.' });
//         }

//         const subcategory = category.subcategories.id(subcategoryId);

//         if (!subcategory) {
//             return res.status(NOT_FOUND).json({ error: 'Subcategory not found.' });
//         }

//         Object.assign(subcategory, updateData);

//         await category.save();

//         res.status(OK).json(subcategory);

//     } catch (error) {

//         console.error('Error updating subcategory:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while updating subcategory.' });
//     }
// }


// export const deleteCategories = async (req, res) => {

//     try {

//         const { categoryId } = req.params;

//         const deletedCategory = await Category.findByIdAndDelete(categoryId);

//         if (!deletedCategory) {

//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: 'Category not found.'
//             });
//         }

//         res.status(OK).json({
//             success: false,
//             message: 'Category deleted successfully.'
//         });

//     } catch (error) {

//         console.error('Error deleting category:', error);
//         res.status(500).json({ error: 'Server error while deleting category.' });
//     }
// }


// export const deleteSubCategories = async (req, res) => {

//     try {

//         const { categoryId, subcategoryId } = req.params;

//         const category = await Category.findById(categoryId);

//         if (!category) {
//             return res.status(NOT_FOUND).json({ error: 'Category not found.' });
//         }

//         category.subcategories.pull(subcategoryId);

//         await category.save();

//         res.status(OK).json({ message: 'Subcategory deleted successfully.' });

//     } catch (error) {

//         console.error('Error deleting subcategory:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error while deleting subcategory.' });
//     }
// }














import HttpStatusCode from "../utils/httpStatusCodes.js";
import messages from "../utils/messages.js";

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
} = HttpStatusCode;

import Category from "../models/categoryModel.js";

export const addCategory = async (req, res) => {
    try {
        const { name, description, thumbnail } = req.body;

        if (!name) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.NAME_REQUIRED
            });
        }

        if (typeof name !== 'string') {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.NAME_INVALID_TYPE
            });
        }

        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.NAME_INVALID_LENGTH
            });
        }

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (existingCategory) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.ALREADY_EXISTS
            });
        }

        const newCategory = new Category({
            name: name.trim(),
            description: description ? description.trim() : undefined,
            thumbnail
        });

        const savedCategory = await newCategory.save();

        res.status(CREATED).json({
            success: true,
            message: messages.CATEGORY.ADDED_SUCCESSFULLY,
            data: savedCategory
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_ADD,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const addSubCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.SUBCATEGORY_NAME_REQUIRED
            });
        }

        if (typeof name !== 'string') {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.SUBCATEGORY_NAME_INVALID_TYPE
            });
        }

        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.SUBCATEGORY_NAME_INVALID_LENGTH
            });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY.NOT_FOUND
            });
        }

        const subcategoryExists = category.subcategories.some(
            subcategory => subcategory.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (subcategoryExists) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.CATEGORY.SUBCATEGORY_ALREADY_EXISTS
            });
        }

        const newSubcategory = { name: name.trim() };
        category.subcategories.push(newSubcategory);
        await category.save();

        const addedSubcategory = category.subcategories[category.subcategories.length - 1];

        res.status(CREATED).json({
            success: true,
            message: messages.CATEGORY.SUBCATEGORY_ADDED_SUCCESSFULLY,
            data: addedSubcategory
        });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_ADD_SUBCATEGORY,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY.FETCHED_SUCCESSFULLY,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_FETCH
        });
    }
};

// export const editSubcategoryName = async (req, res) => {
//     try {
//         const { categoryId, subcategoryId } = req.params;
//         const updateData = req.body;

//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: messages.CATEGORY.NOT_FOUND
//             });
//         }

//         const subcategory = category.subcategories.id(subcategoryId);
//         if (!subcategory) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: messages.CATEGORY.SUBCATEGORY_NOT_FOUND
//             });
//         }

//         Object.assign(subcategory, updateData);
//         await category.save();

//         res.status(OK).json({
//             success: true,
//             message: messages.CATEGORY.SUBCATEGORY_UPDATED_SUCCESSFULLY,
//             data: subcategory
//         });
//     } catch (error) {
//         console.error('Error updating subcategory:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: messages.CATEGORY.FAILED_UPDATE_SUBCATEGORY
//         });
//     }
// };

export const editSubcategoryName = async (req, res) => {
    const { categoryId, subcategoryId } = req.params;
    const rawName = (req.body.name || '').trim();

    if (!rawName) {
        return res.status(BAD_REQUEST).json({ success: false, message: messages.CATEGORY.SUBCATEGORY_NAME_REQUIRED });
    }

    const nameRegex = /^[A-Za-z0-9 ]{3,15}$/;
    if (!nameRegex.test(rawName)) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.CATEGORY.SUBCATEGORY_INVALID_NAME
        });
    }

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(NOT_FOUND).json({ success: false, message: messages.CATEGORY.NOT_FOUND });
        }

        const duplicate = category.subcategories.find(
            (sub) => sub._id.toString() !== subcategoryId && sub.name.toLowerCase() === rawName.toLowerCase()
        );
        if (duplicate) {
            return res.status(CONFLICT).json({
                success: false,
                message: messages.CATEGORY.SUBCATEGORY_DUPLICATE_NAME
            });
        }

        const subcategory = category.subcategories.id(subcategoryId);
        if (!subcategory) {
            return res.status(NOT_FOUND).json({ success: false, message: messages.CATEGORY.SUBCATEGORY_NOT_FOUND });
        }

        subcategory.name = rawName;
        await category.save();

        return res.status(OK).json({
            success: true,
            message: messages.CATEGORY.SUBCATEGORY_UPDATED_SUCCESSFULLY,
            data: subcategory
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_UPDATE_SUBCATEGORY
        });
    }
};


export const deleteCategories = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY.DELETED_SUCCESSFULLY
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_DELETE
        });
    }
};

export const deleteSubCategories = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY.NOT_FOUND
            });
        }

        category.subcategories.pull(subcategoryId);
        await category.save();

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY.SUBCATEGORY_DELETED_SUCCESSFULLY
        });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY.FAILED_DELETE_SUBCATEGORY
        });
    }
};




export const editCategory = async (req, res) => {
    const { id } = req.params;
    const rawName = (req.body.name || '').trim();

    // 1️⃣ Validate presence
    if (!rawName) {
        return res.status(BAD_REQUEST).json({ success: false, message: 'Category name is required' });
    }

    // 2️⃣ Validate format: 3-30 chars, letters/numbers/spaces only
    const nameRegex = /^[A-Za-z0-9 ]{3,30}$/;
    if (!nameRegex.test(rawName)) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: 'Invalid name: should be 3–30 letters, numbers or spaces'
        });
    }

    try {
        // 3️⃣ Check for duplicates (case-insensitive)
        const conflict = await Category.findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${rawName}$`, 'i') }
        });
        if (conflict) {
            return res.status(CONFLICT).json({
                success: false,
                message: `Category "${rawName}" already exists`
            });
        }

        // 4️⃣ Find and update
        const category = await Category.findById(id);
        if (!category) {
            return res.status(NOT_FOUND).json({ success: false, message: 'Category not found' });
        }

        category.name = rawName;
        await category.save();

        return res.status(OK).json({ success: true, data: category });
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Server error. Could not update category'
        });
    }
};