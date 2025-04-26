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


// import { generateUniqueReferralCode } from "../services/generateUnique.js";
// import { UserReferral } from "../models/referralModel.js";


// export const referalDetails = async (req, res) => {

//     try {

//         const userId = req.user.userId
//         const { page, limit, search } = req.query

//         let referralData = await UserReferral.findOne({ user: userId }).populate({
//             path: "referrals",
//             match: search ? {
//                 $or: [
//                     { name: { $regex: search, $options: "i" } },
//                     { email: { $regex: search, $options: "i" } }
//                 ]
//             } : {},
//             options: {
//                 sort: { createdAt: -1 },
//                 skip: (page - 1) * limit,
//                 limit: limit
//             }
//         })

//         if (!referralData) {

//             let referralCode = await generateUniqueReferralCode()

//             await UserReferral.create({
//                 user: userId,
//                 referralCode,
//                 referralLink: `https://adiyo.in/join/${referralCode}`,
//                 referrals: []
//             });

//             referralData = await UserReferral.findOne({ user: userId })

//             return res.status(HttpStatusCode.CREATED).json({
//                 success: true,
//                 message: "Referral data Created",
//                 referralDetails: {
//                     referralCode: referralData.referralCode,
//                     referralLink: referralData.referralLink,
//                 },
//             })
//         }

//         const formattedRefferals = referralData.referrals.map(ref =>
//         ({
//             id: ref._id,
//             name: ref.name,
//             email: ref.email,
//             joinedDate: ref.joinedDate,
//             status: ref.status,
//             amount: ref.amount,
//         })
//         )

//         const totalReferrals = search
//             ? referralData.referrals.length
//             : referralData.stats.totalReferrals;

//         res.status(HttpStatusCode.OK).json({
//             success: true,
//             message: "Referral data fetched successfully",
//             referralDetails: {
//                 referralCode: referralData.referralCode,
//                 referralLink: referralData.referralLink,
//                 totalEarned: referralData.stats.totalEarned,
//                 pendingAmount: referralData.stats.pendingAmount,
//                 totalReferrals: referralData.stats.totalReferrals,
//                 activeReferrals: referralData.stats.activeReferrals,
//             },
//             referrals: formattedRefferals,
//             pagination: {
//                 page: page || 1,
//                 limit,
//                 totalReferrals,
//                 totalPages: Math.ceil(totalReferrals / limit)
//             }
//         })

//     } catch (error) {

//         console.error("Error fetching referral details:", error);
//         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal server error"
//         });
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

import { generateUniqueReferralCode } from "../services/generateUnique.js";
import { UserReferral } from "../models/referralModel.js";

export const referalDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10, search } = req.query;

        let referralData = await UserReferral.findOne({ user: userId }).populate({
            path: "referrals",
            match: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            } : {},
            options: {
                sort: { createdAt: -1 },
                skip: (parseInt(page) - 1) * parseInt(limit),
                limit: parseInt(limit)
            }
        });

        if (!referralData) {
            let referralCode = await generateUniqueReferralCode();

            await UserReferral.create({
                user: userId,
                referralCode,
                referralLink: `https://adiyo.in/join/${referralCode}`,
                referrals: []
            });

            referralData = await UserReferral.findOne({ user: userId });

            return res.status(CREATED).json({
                success: true,
                message: messages.REFERRAL.CREATED_SUCCESSFULLY,
                referralDetails: {
                    referralCode: referralData.referralCode,
                    referralLink: referralData.referralLink,
                },
            });
        }

        const formattedReferrals = referralData.referrals.map(ref => ({
            id: ref._id,
            name: ref.name,
            email: ref.email,
            joinedDate: ref.joinedDate,
            status: ref.status,
            amount: ref.amount,
        }));

        const totalReferrals = search
            ? referralData.referrals.length
            : referralData.stats.totalReferrals;

        res.status(OK).json({
            success: true,
            message: messages.REFERRAL.FETCHED_SUCCESSFULLY,
            referralDetails: {
                referralCode: referralData.referralCode,
                referralLink: referralData.referralLink,
                totalEarned: referralData.stats.totalEarned,
                pendingAmount: referralData.stats.pendingAmount,
                totalReferrals: referralData.stats.totalReferrals,
                activeReferrals: referralData.stats.activeReferrals,
            },
            referrals: formattedReferrals,
            pagination: {
                page: parseInt(page) || 1,
                limit: parseInt(limit),
                totalReferrals,
                totalPages: Math.ceil(totalReferrals / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching referral details:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.REFERRAL.FAILED_FETCH
        });
    }
};