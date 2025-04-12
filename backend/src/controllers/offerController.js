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

import Product from "../models/productModel.js"
import ProductOffer from "../models/productOfferModel.js";
import CategoryOffer from "../models/categoryOfferModel.js";


export const checkOffer = async (req, res) => {

    try {

        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(FORBIDDEN).json({ message: "Product not found" });
        }

        const currentDate = new Date();

        const productOffers = await ProductOffer.find({
            products: productId,
            status: 'active',
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        const categoryOffers = await CategoryOffer.find({
            category: product.category,
            status: 'active',
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        const offers = [
            ...productOffers.map(offer => ({
                name: offer.name,
                discount: offer.discount,
                endDate: offer.endDate,
                type: 'product'
            })),
            ...categoryOffers.map(offer => ({
                name: offer.name,
                discount: offer.discount,
                endDate: offer.endDate,
                type: 'category'
            }))
        ];

        res.status(OK).json({
            success: true,
            message: "offer vailable",
            offers
        });

    } catch (error) {

        console.error("Error fetching offers:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error"
        });
    }
}



