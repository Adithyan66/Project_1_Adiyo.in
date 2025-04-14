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


export const addCoupon = async (req, res) => {

    try {

        const couponData = req.body;

        const newCoupon = new Coupon(couponData);

        await newCoupon.save()

        res.status(OK).json({
            status: true,
            message: "coupon created succesfully"
        })
    } catch (error) {

        console.error("Error creating coupon:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

export const updateCoupon = async (req, res) => {

    try {

        const couponId = req.body.id
        await Coupon.findByIdAndUpdate(couponId, req.body, { new: true })

        res.status(OK).json({
            success: true,
            message: "coupon updated succesfully"
        })

    } catch (error) {

        console.error("Error updating coupon:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}



export const getCoupons = async (req, res) => {

    try {

        const coupons = await Coupon.find({ deletedAt: null }).populate("applicableCategories")

        res.status(OK).json({
            status: true,
            message: "coupons fetched succesfully",
            coupons
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "server error"
        })

    }
}

export const deleteCoupon = async (req, res) => {

    try {

        const couponId = req.params.id

        const coupon = await Coupon.findByIdAndUpdate(couponId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!coupon) {
            return res.status(NOT_FOUND).json({
                status: false,
                message: "coupon not found"
            })
        }

        res.status(OK).json({
            status: true,
            message: "coupon deleted succesfully",
            coupon
        })

    } catch (error) {

        console.error('Error soft deleting product:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
}
