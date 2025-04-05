
import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending'
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    convertedAt: {
        type: Date
    }
}, { timestamps: true });



const UserReferralSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    referralLink: {
        type: String,
        required: true
    },
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral'
    }],
    stats: {
        totalEarned: {
            type: Number,
            default: 0
        },
        pendingAmount: {
            type: Number,
            default: 0
        },
        totalReferrals: {
            type: Number,
            default: 0
        },
        activeReferrals: {
            type: Number,
            default: 0
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });









// ReferralSchema.index({ user: 1 });
// ReferralSchema.index({ status: 1 });
// UserReferralSchema.index({ referralCode: 1 });
// UserReferralSchema.index({ user: 1 });

// UserReferralSchema.methods.generateReferralLink = function (baseUrl = 'https://adiyo.in/join/') {
//     return `${baseUrl}${this.referralCode}`;
// };

UserReferralSchema.methods.updateStats = async function () {
    const Referral = mongoose.model('Referral');
    console.log('this.referrals', this.referrals);

    const [totalReferrals, activeReferrals, paidReferrals, pendingReferrals] = await Promise.all([
        Referral.countDocuments({ _id: { $in: this.referrals } }),
        Referral.countDocuments({ _id: { $in: this.referrals }, status: 'active' }),
        Referral.find({ _id: { $in: this.referrals }, isPaid: true }),
        Referral.find({ _id: { $in: this.referrals }, isPaid: false, status: 'active' })
    ]);

    const totalEarned = paidReferrals.reduce((sum, ref) => sum + ref.amount, 0);
    const pendingAmount = pendingReferrals.reduce((sum, ref) => sum + ref.amount, 0);

    this.stats = {
        totalEarned,
        pendingAmount,
        totalReferrals,
        activeReferrals
    };

    this.lastUpdated = Date.now();
    return this.save();
};


const Referral = mongoose.model('Referral', ReferralSchema);
const UserReferral = mongoose.model('UserReferral', UserReferralSchema);

export { Referral, UserReferral };