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

// import Review from "../models/reviewModel.js";


// export const addReview = async (req, res) => {

//     try {

//         const userId = req.user.userId

//         const { rating, comment } = req.body;

//         const productId = req.params.productId;

//         const existingReview = await Review.findOne({ productId, userId });

//         if (existingReview) {

//             return res.status(BAD_REQUEST).json({
//                 status: false,
//                 message: "You have already reviewed this product."
//             });
//         }

//         const review = new Review({ productId, userId, rating, comment });

//         await review.save();

//         res.status(CREATED).json({
//             status: true,
//             message: "Review added successfully"
//             , review
//         });

//     } catch (error) {

//         console.log(error);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: error.message
//         });
//     }
// }


// export const getReviews = async (req, res) => {

//     try {

//         const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "username");

//         res.status(OK).json({
//             status: true,
//             message: "review fetched succesfully",
//             reviews
//         });

//     } catch (error) {
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "error on server"
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

import Review from "../models/reviewModel.js";

export const addReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: messages.REVIEW.ALREADY_REVIEWED
            });
        }

        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        res.status(CREATED).json({
            success: true,
            message: messages.REVIEW.CREATED_SUCCESSFULLY,
            review
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.REVIEW.FAILED_CREATE
        });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "username");

        res.status(OK).json({
            success: true,
            message: messages.REVIEW.FETCHED_SUCCESSFULLY,
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.REVIEW.FAILED_FETCH
        });
    }
};