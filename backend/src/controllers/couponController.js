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

import Coupon from "../models/couponModel.js";


export const validateCoupon = async (req, res) => {

    try {

        const { code, orderTotal, productCategories } = req.body;

        const coupon = await Coupon.findOne({ code, deletedAt: null });
        if (!coupon) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: "Coupon not found"
            });
        }
        console.log(coupon);


        const now = new Date();

        if (coupon.activeFrom > now) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Coupon is not active yet"
            });
        }

        if (coupon.expiresAt < now) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Coupon has expired"
            });
        }

        if (coupon.usedCount >= coupon.maxUsage) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Coupon usage limit reached"
            });
        }

        if (coupon.minimumOrderValue && orderTotal < coupon.minimumOrderValue) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: `Minimum order value for this coupon is ${coupon.minimumOrderValue}`
            });
        }

        console.log("catt", coupon.applicableCategories, productCategories);

        if (coupon.applicableCategories) {
            const prodCategoriesArray = Array.isArray(productCategories) ?
                productCategories : [productCategories];

            const couponCategoryId = coupon.applicableCategories.toString();
            let categoryMatched = false;
            console.log(productCategories);


            for (const category of prodCategoriesArray) {
                const categoryId = category._id ? category._id.toString() : category.toString();
                if (categoryId === couponCategoryId) {
                    categoryMatched = true;
                    break;
                }
            }

            if (!categoryMatched) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: "Coupon is not applicable for the selected product categories"
                });
            }
        }

        res.status(OK).json({
            success: true,
            coupon
        });

    } catch (error) {

        console.error("Error validating coupon: ", error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
    }
}

