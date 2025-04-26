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

// import Coupon from "../models/couponModel.js";


// export const validateCoupon = async (req, res) => {

//     try {

//         const { code, orderTotal, productCategories } = req.body;

//         const coupon = await Coupon.findOne({ code, deletedAt: null });
//         if (!coupon) {
//             return res.status(NOT_FOUND).json({
//                 success: false,
//                 message: "Coupon not found"
//             });
//         }

//         const now = new Date();

//         if (coupon.activeFrom > now) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "Coupon is not active yet"
//             });
//         }

//         if (coupon.expiresAt < now) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "Coupon has expired"
//             });
//         }

//         if (coupon.usedCount >= coupon.maxUsage) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: "Coupon usage limit reached"
//             });
//         }

//         if (coupon.minimumOrderValue && orderTotal < coupon.minimumOrderValue) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 message: `Minimum order value for this coupon is ${coupon.minimumOrderValue}`
//             });
//         }

//         if (coupon.applicableCategories) {
//             const prodCategoriesArray = Array.isArray(productCategories) ?
//                 productCategories : [productCategories];

//             const couponCategoryId = coupon.applicableCategories.toString();
//             let categoryMatched = false;

//             for (const category of prodCategoriesArray) {
//                 const categoryId = category._id ? category._id.toString() : category.toString();
//                 if (categoryId === couponCategoryId) {
//                     categoryMatched = true;
//                     break;
//                 }
//             }

//             if (!categoryMatched) {
//                 return res.status(BAD_REQUEST).json({
//                     success: false,
//                     message: "Coupon is not applicable for the selected product categories"
//                 });
//             }
//         }

//         res.status(OK).json({
//             success: true,
//             coupon
//         });

//     } catch (error) {

//         console.error("Error validating coupon: ", error);
//         res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
//     }
// }


// export const addCoupon = async (req, res) => {

//     try {

//         const couponData = req.body;

//         const newCoupon = new Coupon(couponData);

//         await newCoupon.save()

//         res.status(OK).json({
//             status: true,
//             message: "coupon created succesfully"
//         })
//     } catch (error) {

//         console.error("Error creating coupon:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message
//         });
//     }
// }

// export const updateCoupon = async (req, res) => {

//     try {

//         const couponId = req.body.id
//         await Coupon.findByIdAndUpdate(couponId, req.body, { new: true })

//         res.status(OK).json({
//             success: true,
//             message: "coupon updated succesfully"
//         })

//     } catch (error) {

//         console.error("Error updating coupon:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: error.message
//         });
//     }
// }



// export const getCoupons = async (req, res) => {

//     try {

//         const coupons = await Coupon.find({ deletedAt: null }).populate("applicableCategories")

//         res.status(OK).json({
//             status: true,
//             message: "coupons fetched succesfully",
//             coupons
//         })

//     } catch (error) {
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "server error"
//         })

//     }
// }

// export const deleteCoupon = async (req, res) => {

//     try {

//         const couponId = req.params.id

//         const coupon = await Coupon.findByIdAndUpdate(couponId,
//             { deletedAt: new Date() },
//             { new: true }
//         );

//         if (!coupon) {
//             return res.status(NOT_FOUND).json({
//                 status: false,
//                 message: "coupon not found"
//             })
//         }

//         res.status(OK).json({
//             status: true,
//             message: "coupon deleted succesfully",
//             coupon
//         })

//     } catch (error) {

//         console.error('Error soft deleting product:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
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

import Coupon from "../models/couponModel.js";
import mongoose from "mongoose";
import Category from "../models/categoryModel.js"

export const validateCoupon = async (req, res) => {
    try {
        const { code, orderTotal, productCategories } = req.body;

        const coupon = await Coupon.findOne({ code, deletedAt: null });
        if (!coupon) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.COUPON.NOT_FOUND
            });
        }

        const now = new Date();

        if (coupon.activeFrom > now) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.COUPON.NOT_ACTIVE_YET
            });
        }

        if (coupon.expiresAt < now) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.COUPON.EXPIRED
            });
        }

        if (coupon.usedCount >= coupon.maxUsage) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.COUPON.USAGE_LIMIT_REACHED
            });
        }

        if (coupon.minimumOrderValue && orderTotal < coupon.minimumOrderValue) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.COUPON.MINIMUM_ORDER_VALUE_NOT_MET
            });
        }

        if (coupon.applicableCategories) {
            const prodCategoriesArray = Array.isArray(productCategories) ?
                productCategories : [productCategories];

            const couponCategoryId = coupon.applicableCategories.toString();
            let categoryMatched = false;

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
                    message: messages.COUPON.NOT_APPLICABLE_FOR_CATEGORIES
                });
            }
        }

        res.status(OK).json({
            success: true,
            message: messages.COUPON.VALIDATED_SUCCESSFULLY,
            coupon
        });
    } catch (error) {
        console.error("Error validating coupon: ", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.COUPON.FAILED_VALIDATE
        });
    }
};

// export const addCoupon = async (req, res) => {
//     try {
//         const couponData = req.body;
//         console.log(couponData);

//         const newCoupon = new Coupon(couponData);

//         await newCoupon.save();

//         res.status(CREATED).json({
//             success: true,
//             message: messages.COUPON.CREATED_SUCCESSFULLY
//         });
//     } catch (error) {
//         console.error("Error creating coupon:", error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: messages.COUPON.FAILED_CREATE
//         });
//     }
// };



export const addCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        const errors = [];

        // Required fields
        const requiredFields = ["name", "code", "activeFrom", "expiresAt", "maxUsage", "discountValue"];
        requiredFields.forEach((field) => {
            if (!couponData[field]) {
                errors.push(`${field} is required`);
            }
        });

        // Validate name
        if (couponData.name && (typeof couponData.name !== "string" || couponData.name.trim() === "")) {
            errors.push("Name must be a non-empty string");
        }

        // Validate code
        if (couponData.code) {
            if (typeof couponData.code !== "string" || couponData.code.trim() === "") {
                errors.push("Code must be a non-empty string");
            } else {
                // Check for uniqueness
                const existingCoupon = await Coupon.findOne({ code: couponData.code.trim() });
                if (existingCoupon) {
                    errors.push("Coupon code already exists");
                }
            }
        }

        // Validate discountType
        if (couponData.discountType && !["fixed", "percentage"].includes(couponData.discountType)) {
            errors.push("Discount type must be 'fixed' or 'percentage'");
        }

        // Validate discountValue
        if (couponData.discountValue && (typeof couponData.discountValue !== "number" || couponData.discountValue < 0)) {
            errors.push("Discount value must be a non-negative number");
        }

        // Validate minimumOrderValue
        if (couponData.minimumOrderValue && (typeof couponData.minimumOrderValue !== "number" || couponData.minimumOrderValue < 0)) {
            errors.push("Minimum order value must be a non-negative number");
        }

        // Validate dates
        if (couponData.activeFrom && couponData.expiresAt) {
            const activeFrom = new Date(couponData.activeFrom);
            const expiresAt = new Date(couponData.expiresAt);

            if (isNaN(activeFrom.getTime()) || isNaN(expiresAt.getTime())) {
                errors.push("Active from and expires at must be valid dates");
            } else {
                if (activeFrom >= expiresAt) {
                    errors.push("Active from must be before expires at");
                }
                // Optional: Prevent activeFrom in the past
                // const now = new Date();
                // if (activeFrom < now) {
                //   errors.push("Active from cannot be in the past");
                // }
            }
        }

        // Validate maxUsage
        if (couponData.maxUsage && (typeof couponData.maxUsage !== "number" || couponData.maxUsage < 0 || !Number.isInteger(couponData.maxUsage))) {
            errors.push("Max usage must be a non-negative integer");
        }

        // Validate applicableCategories
        if (couponData.applicableCategories) {
            if (!mongoose.Types.ObjectId.isValid(couponData.applicableCategories)) {
                errors.push("Applicable categories must be a valid ObjectId");
            } else {
                const category = await Category.findById(couponData.applicableCategories);
                if (!category) {
                    errors.push("Applicable category does not exist");
                }
            }
        }

        // Return validation errors if any
        if (errors.length > 0) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        // Set default discountType if not provided
        if (!couponData.discountType) {
            couponData.discountType = "fixed";
        }

        // Create and save the coupon
        const newCoupon = new Coupon(couponData);
        await newCoupon.save();

        res.status(CREATED).json({
            success: true,
            message: messages.COUPON.CREATED_SUCCESSFULLY,
            data: newCoupon,
        });
    } catch (error) {
        console.error("Error creating coupon:", error);

        // Handle specific errors
        if (error.code === 11000) {
            // Duplicate key error (e.g., code uniqueness)
            return res.status(CONFLICT).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.COUPON.FAILED_CREATE,
        });
    }
};
export const updateCoupon = async (req, res) => {
    try {
        const couponId = req.body.id;
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, req.body, { new: true });

        if (!updatedCoupon) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.COUPON.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.COUPON.UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.COUPON.FAILED_UPDATE
        });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ deletedAt: null }).populate("applicableCategories");

        res.status(OK).json({
            success: true,
            message: messages.COUPON.FETCHED_SUCCESSFULLY,
            coupons
        });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.COUPON.FAILED_FETCH
        });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const coupon = await Coupon.findByIdAndUpdate(
            couponId,
            { deletedAt: new Date() },
            { new: true }
        );

        if (!coupon) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.COUPON.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.COUPON.DELETED_SUCCESSFULLY,
            coupon
        });
    } catch (error) {
        console.error('Error soft deleting coupon:', error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.COUPON.FAILED_DELETE
        });
    }
};