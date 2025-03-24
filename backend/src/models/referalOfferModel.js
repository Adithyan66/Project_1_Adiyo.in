
import mongoose from 'mongoose';

const ReferralOfferSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    rewardAmount: {
        type: Number,
        required: true,
        min: 1
    },
    rewardType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    method: {
        type: String,
        enum: ['token', 'code'],
        default: 'token'
    },
    minPurchase: {
        type: Number,
        default: 0,
        min: 0
    },
    validity: {
        type: Number,
        required: true,
        min: 1,
        description: 'Validity period in days'
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

ReferralOfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ReferralOffer = mongoose.model("ReferralOffer", ReferralOfferSchema);

export default ReferralOffer;