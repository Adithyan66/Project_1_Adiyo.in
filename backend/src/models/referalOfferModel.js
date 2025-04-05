
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
    validity: {
        type: Number,
        required: true,
        min: 1,
        description: 'Validity period in days'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    referralToken: {
        type: String,
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

ReferralOfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ReferralOffer = mongoose.model("ReferralOffer", ReferralOfferSchema);

export default ReferralOffer;