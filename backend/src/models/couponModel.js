
import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        discountType: {
            type: String,
            default: "fixed",
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            min: 0,
        },
        minOrderValue: {
            type: Number,
            min: 0,
        },
        activeFrom: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        maxUsage: {
            type: Number,
            required: true,
            min: 0,
        },
        usedCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        applicableCategories: [
            {
                type: String,
            },
        ],
        deletedAt: { type: Date, default: null }
    },
    {
        timestamps: true,
    }
);


const Coupen = mongoose.model("coupon", CouponSchema)

export default Coupen