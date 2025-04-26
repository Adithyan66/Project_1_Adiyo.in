
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

// import ProductOffer from "../models/productOfferModel.js";
// import { updateProductDiscounts, updateProductDiscountsForSingleProduct } from "../services/discountService.js";


// export const createProductOffer = async (req, res) => {

//     try {

//         const { name, discount, products, startDate, endDate } = req.body;

//         const newOffer = new ProductOffer({
//             name,
//             discount,
//             products,
//             startDate,
//             endDate
//         });

//         const savedOffer = await newOffer.save();

//         await updateProductDiscounts()

//         res.status(CREATED).json({
//             success: true,
//             message: "Product offer created successfully",
//             offer: savedOffer
//         });

//     } catch (error) {

//         console.error("Error creating product offer:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Failed to create product offer",
//             error: error.message
//         });
//     }
// };

// export const editProductOffer = async (req, res) => {

//     try {

//         const { id } = req.params

//         const payload = req.body

//         const updatedOffer = await ProductOffer.findByIdAndUpdate(id, payload, { new: true })

//         if (!updatedOffer) {

//             return res.status(FORBIDDEN).json({
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

//         console.log("error updating product offer", error)
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }


// export const deleteProductOffer = async (req, res) => {

//     try {
//         const offerId = req.params.id;

//         const offer = await ProductOffer.findById(offerId);

//         if (!offer) {
//             return res.status(404).json({ success: false, message: 'Product offer not found' });
//         }

//         const affectedProductIds = [...offer.products];

//         await ProductOffer.findByIdAndDelete(offerId);

//         let updatedCount = 0;
//         for (const productId of affectedProductIds) {
//             const result = await updateProductDiscountsForSingleProduct(productId);
//             if (result.success) updatedCount++;
//         }

//         return res.status(OK).json({
//             success: true,
//             message: 'Product offer deleted successfully',
//             affectedProducts: affectedProductIds.length,
//             updatedProducts: updatedCount
//         });

//     } catch (error) {

//         console.error('Error deleting product offer:', error);
//         return res.status(INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
//     }
// };

// export const getAllProductOffers = async (req, res) => {

//     try {

//         const productOffers = await ProductOffer.find().populate("products", "name")

//         res.status(OK).json({
//             success: true,
//             message: "Product offers fetched successfully",
//             offers: productOffers
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

import ProductOffer from "../models/productOfferModel.js";
import { updateProductDiscounts, updateProductDiscountsForSingleProduct } from "../services/discountService.js";

export const createProductOffer = async (req, res) => {
    try {
        const { name, discount, products, startDate, endDate } = req.body;

        const newOffer = new ProductOffer({
            name,
            discount,
            products,
            startDate,
            endDate
        });

        const savedOffer = await newOffer.save();
        await updateProductDiscounts();

        res.status(CREATED).json({
            success: true,
            message: messages.PRODUCT_OFFER.CREATED_SUCCESSFULLY,
            offer: savedOffer
        });
    } catch (error) {
        console.error("Error creating product offer:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT_OFFER.FAILED_CREATE,
            error: error.message
        });
    }
};

export const editProductOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const updatedOffer = await ProductOffer.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedOffer) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT_OFFER.NOT_FOUND
            });
        }

        await updateProductDiscounts();

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT_OFFER.UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        console.error("Error updating product offer:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT_OFFER.FAILED_UPDATE
        });
    }
};

export const deleteProductOffer = async (req, res) => {
    try {
        const offerId = req.params.id;
        const offer = await ProductOffer.findById(offerId);

        if (!offer) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.PRODUCT_OFFER.NOT_FOUND
            });
        }

        const affectedProductIds = [...offer.products];
        await ProductOffer.findByIdAndDelete(offerId);

        let updatedCount = 0;
        for (const productId of affectedProductIds) {
            const result = await updateProductDiscountsForSingleProduct(productId);
            if (result.success) updatedCount++;
        }

        return res.status(OK).json({
            success: true,
            message: messages.PRODUCT_OFFER.DELETED_SUCCESSFULLY,
            affectedProducts: affectedProductIds.length,
            updatedProducts: updatedCount
        });
    } catch (error) {
        console.error('Error deleting product offer:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT_OFFER.FAILED_DELETE
        });
    }
};

export const getAllProductOffers = async (req, res) => {
    try {
        const productOffers = await ProductOffer.find().populate("products", "name");

        res.status(OK).json({
            success: true,
            message: messages.PRODUCT_OFFER.FETCHED_SUCCESSFULLY,
            offers: productOffers
        });
    } catch (error) {
        console.error("Error fetching product offers:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.PRODUCT_OFFER.FAILED_FETCH,
            error: error.message
        });
    }
};
