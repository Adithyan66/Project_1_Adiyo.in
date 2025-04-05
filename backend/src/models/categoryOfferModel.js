

import mongoose from 'mongoose';

const CategoryOfferSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 99
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

CategoryOfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const CategoryOffer = mongoose.model("CategoryOffer", CategoryOfferSchema)

export default CategoryOffer;