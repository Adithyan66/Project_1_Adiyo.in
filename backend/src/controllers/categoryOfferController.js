
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
// import CategoryOffer from "../models/categoryOfferModel.js";
// import { updateProductDiscounts, updateProductDiscountsForSingleProduct } from "../services/discountService.js";


// export const createCategoryOffer = async (req, res) => {

//     try {

//         const { name, discount, category, startDate, endDate } = req.body;

//         const newOffer = new CategoryOffer({
//             name,
//             discount,
//             category,
//             startDate,
//             endDate
//         });

//         const savedOffer = await newOffer.save();

//         await updateProductDiscounts()

//         res.status(CREATED).json({
//             success: true,
//             message: "category offer created successfully",
//             offer: savedOffer
//         });

//     } catch (error) {

//         console.error("Error creating category offer:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Failed to create category offer",
//             error: error.message
//         });
//     }
// };


// export const editCategoryOffer = async (req, res) => {

//     try {

//         const id = req.params.id

//         const payload = req.body

//         const offer = await CategoryOffer.findByIdAndUpdate(id, payload, { new: true })

//         if (!offer) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: "offer not found"
//             })
//         }

//         await updateProductDiscounts()

//         res.status(OK).json({
//             success: true,
//             message: "offer edited succesfully"
//         })

//     } catch (error) {

//         console.log("error in editing category offer", error)
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: true,
//             message: "server error"
//         })
//     }
// }


// export const deleteCategoryOffer = async (req, res) => {

//     try {
//         const id = req.params.id

//         const offer = await CategoryOffer.findById(id)

//         if (!offer) {
//             return res.status(FORBIDDEN).json({
//                 success: false,
//                 message: "failed to find offer"
//             })
//         }

//         const products = await Product.find({ deletedAt: null })

//         let affectedProducts = products.filter((product) => product.category.toString() == offer.category.toString());

//         const isDeleted = await CategoryOffer.findByIdAndDelete(id)

//         if (!isDeleted) {
//             return res.status(FORBIDDEN).json({
//                 success: false,
//                 message: "failed to delete offer"
//             })
//         }

//         for (const product of affectedProducts) {
//             await updateProductDiscountsForSingleProduct(product._id)
//         }

//         res.status(OK).json({
//             success: true,
//             message: "offer deleted succesfully"
//         })

//     } catch (error) {

//         console.log("error in category offer delection", error)
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }

// export const getAllCategoryOffers = async (req, res) => {

//     try {

//         const categoryOffers = await CategoryOffer.find().populate("category", "name")

//         res.status(OK).json({
//             success: true,
//             message: "Product offers fetched successfully",
//             offers: categoryOffers
//         });
//     } catch (error) {

//         console.error("Error fetching product offers:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Failed to fetch product offers",
//             error: error.message
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
import CategoryOffer from "../models/categoryOfferModel.js";
import { updateProductDiscounts, updateProductDiscountsForSingleProduct } from "../services/discountService.js";

export const createCategoryOffer = async (req, res) => {
    try {
        const { name, discount, category, startDate, endDate } = req.body;

        const newOffer = new CategoryOffer({
            name,
            discount,
            category,
            startDate,
            endDate
        });

        const savedOffer = await newOffer.save();
        await updateProductDiscounts();

        res.status(CREATED).json({
            success: true,
            message: messages.CATEGORY_OFFER.CREATED_SUCCESSFULLY,
            offer: savedOffer
        });
    } catch (error) {
        console.error("Error creating category offer:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY_OFFER.FAILED_CREATE,
            error: error.message
        });
    }
};

export const editCategoryOffer = async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;

        const offer = await CategoryOffer.findByIdAndUpdate(id, payload, { new: true });
        if (!offer) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY_OFFER.NOT_FOUND
            });
        }

        await updateProductDiscounts();

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY_OFFER.UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        console.log("Error in editing category offer:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY_OFFER.FAILED_UPDATE
        });
    }
};

export const deleteCategoryOffer = async (req, res) => {
    try {
        const id = req.params.id;
        const offer = await CategoryOffer.findById(id);

        if (!offer) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CATEGORY_OFFER.NOT_FOUND
            });
        }

        const products = await Product.find({ deletedAt: null });
        let affectedProducts = products.filter((product) => product.category.toString() == offer.category.toString());

        const isDeleted = await CategoryOffer.findByIdAndDelete(id);
        if (!isDeleted) {
            return res.status(FORBIDDEN).json({
                success: false,
                message: messages.CATEGORY_OFFER.FAILED_DELETE
            });
        }

        for (const product of affectedProducts) {
            await updateProductDiscountsForSingleProduct(product._id);
        }

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY_OFFER.DELETED_SUCCESSFULLY
        });
    } catch (error) {
        console.log("Error in category offer deletion:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY_OFFER.FAILED_DELETE
        });
    }
};

export const getAllCategoryOffers = async (req, res) => {
    try {
        const categoryOffers = await CategoryOffer.find().populate("category", "name");

        res.status(OK).json({
            success: true,
            message: messages.CATEGORY_OFFER.FETCHED_SUCCESSFULLY,
            offers: categoryOffers
        });
    } catch (error) {
        console.error("Error fetching category offers:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CATEGORY_OFFER.FAILED_FETCH,
            error: error.message
        });
    }
};