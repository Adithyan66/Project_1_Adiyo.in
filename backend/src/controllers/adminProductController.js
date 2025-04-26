
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

// import Product from "../models/productModel.js";



// export const getProducts = async (req, res) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             sortBy = "createdAt",
//             sortOrder = "desc",
//             search = "",
//             category
//         } = req.query;

//         const filter = {};

//         filter.deletedAt = null;

//         if (category && category !== "all") {
//             filter.category = category;
//         }

//         if (search) {
//             filter.$or = [
//                 { name: { $regex: search, $options: "i" } },
//                 { sku: { $regex: search, $options: "i" } },
//                 { description: { $regex: search, $options: "i" } }
//             ];
//         }

//         const sort = {};

//         if (sortBy === "category") {
//             const pageNum = parseInt(page);
//             const limitNum = parseInt(limit);
//             const skip = (pageNum - 1) * limitNum;

//             const pipeline = [
//                 { $match: filter },
//                 {
//                     $lookup: {
//                         from: "categories",
//                         localField: "category",
//                         foreignField: "_id",
//                         as: "categoryInfo"
//                     }
//                 },
//                 { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
//                 { $sort: { "categoryInfo.name": sortOrder === "asc" ? 1 : -1 } },
//                 { $skip: skip },
//                 { $limit: limitNum }
//             ];

//             const products = await Product.aggregate(pipeline);
//             const totalProducts = await Product.countDocuments(filter);

//             return res.status(OK).json({
//                 status: true,
//                 message: "Products fetched successfully",
//                 products,
//                 totalProducts,
//                 currentPage: pageNum,
//                 totalPages: Math.ceil(totalProducts / limitNum)
//             });
//         }

//         sort[sortBy] = sortOrder === "asc" ? 1 : -1;

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const skip = (pageNum - 1) * limitNum;

//         const products = await Product.find(filter)
//             .populate("category", "name")
//             .sort(sort)
//             .skip(skip)
//             .limit(limitNum);

//         const totalProducts = await Product.countDocuments(filter);

//         res.status(OK).json({
//             status: true,
//             message: "Products fetched successfully",
//             products,
//             totalProducts,
//             currentPage: pageNum,
//             totalPages: Math.ceil(totalProducts / limitNum)
//         });

//     } catch (error) {

//         console.error("Error fetching products:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };


// export const deleteProduct = async (req, res) => {

//     try {
//         const productId = req.params.id;
//         const product = await Product.findByIdAndUpdate(
//             productId,
//             { deletedAt: new Date() },
//             { new: true }
//         );

//         if (!product) {
//             return res.status(NOT_FOUND)
//                 .json({
//                     success: false,
//                     message: 'Product not found'
//                 });
//         }

//         res.status(OK).json({
//             status: true,
//             message: 'Product soft deleted successfully',
//             product
//         });

//     } catch (error) {

//         console.error('Error soft deleting product:', error);
//         res.status(INTERNAL_SERVER_ERROR)
//             .json({
//                 success: false,
//                 message: 'Server error'
//             });
//     }

// }

// export const productDetails = async (req, res) => {

//     const { id } = req.params;

//     try {
//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(NOT_FOUND)
//                 .json({
//                     status: false,
//                     message: "Product not found"
//                 });
//         }

//         res.status(OK)
//             .json({
//                 status: true,
//                 message: "Product details fetched successfully",
//                 product
//             });

//     } catch (error) {

//         console.error("Error fetching product:", error);
//         res.status(INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: "Server error"
//             });
//     }
// }




// export const productNames = async (req, res) => {
//     try {
//         const productsData = await Product.find({ deletedAt: null }, { _id: 1, name: 1 });

//         if (!productsData || productsData.length === 0) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: "No products found"
//             });
//         }

//         res.status(OK).json({
//             success: true,
//             message: "Successfully fetched product names",
//             products: productsData
//         });
//     } catch (error) {
//         console.error("Error fetching product names", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };











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

import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search = "",
            category
        } = req.query;

        const filter = {};

        filter.deletedAt = null;

        if (category && category !== "all") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const sort = {};

        if (sortBy === "category") {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            const pipeline = [
                { $match: filter },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryInfo"
                    }
                },
                { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
                { $sort: { "categoryInfo.name": sortOrder === "asc" ? 1 : -1 } },
                { $skip: skip },
                { $limit: limitNum }
            ];

            const products = await Product.aggregate(pipeline);
            const totalProducts = await Product.countDocuments(filter);

            return res.status(OK).json({
                success: true,
                message: messages.PRODUCT.FETCHED_SUCCESSFULLY,
                products,
                totalProducts,
                currentPage: pageNum,
                totalPages: Math.ceil(totalProducts / limitNum)
            });
        }

        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filter)
            .populate("category", "name")
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments(filter);

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.FETCHED_SUCCESSFULLY,
            products,
            totalProducts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum)
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_FETCH,
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!product) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.DELETED_SUCCESSFULLY,
            product
        });
    } catch (error) {
        console.error('Error soft deleting product:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_DELETE
        });
    }
};

export const productDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.DETAILS_FETCHED_SUCCESSFULLY,
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_FETCH_DETAILS
        });
    }
};

export const productNames = async (req, res) => {
    try {
        const productsData = await Product.find({ deletedAt: null }, { _id: 1, name: 1 });

        if (!productsData || productsData.length === 0) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT.NO_PRODUCTS_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT.NAMES_FETCHED_SUCCESSFULLY,
            products: productsData
        });
    } catch (error) {
        console.error("Error fetching product names:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT.FAILED_FETCH_NAMES
        });
    }
};