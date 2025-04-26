
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

// import User from "../models/userModel.js";








// export const customersList = async (req, res) => {

//     try {
//         const {
//             page = 1,
//             limit = 10,
//             sortBy = "registrationDate",
//             sortOrder = "desc",
//             search = "",
//             status
//         } = req.query;


//         const filter = { role: "customer" };

//         if (status !== undefined) {
//             filter.isActive = status === "true";
//         }

//         if (search) {
//             filter.$or = [
//                 { username: { $regex: search, $options: "i" } },
//                 { userId: { $regex: search, $options: "i" } },
//                 { email: { $regex: search, $options: "i" } },
//                 { firstName: { $regex: search, $options: "i" } },
//                 { lastName: { $regex: search, $options: "i" } }
//             ];
//         }

//         const sort = {};
//         sort[sortBy] = sortOrder === "asc" ? 1 : -1;

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const skip = (pageNum - 1) * limitNum;

//         const customers = await User.find(filter)
//             .sort(sort)
//             .skip(skip)
//             .limit(limitNum);

//         const totalCustomers = await User.countDocuments(filter);

//         res.status(OK).json({
//             status: true,
//             message: "Customers details fetched successfully",
//             customers,
//             totalCustomers,
//             currentPage: pageNum,
//             totalPages: Math.ceil(totalCustomers / limitNum)
//         });

//     } catch (error) {

//         console.error("Error fetching customers:", error);
//         res.status(INTERNAL_SERVER_ERROR)
//             .json({
//                 status: false,
//                 message: "Server error",
//                 error: error.message
//             });
//     }
// };

// export const customerDetails = async (req, res) => {

//     try {

//         const id = req.params.customerId

//         const customer = await User.findById(id)

//         res.status(OK).json({
//             status: true,
//             message: "customer details fetched succesfully",
//             customer
//         })

//     } catch (error) {

//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "server error"
//         })
//     }
// }

// export const blockUser = async (req, res) => {

//     const { id } = req.params;
//     const { isActive } = req.query;

//     if (isActive === undefined) {

//         return res.status(BAD_REQUEST).json({
//             status: false,
//             message: "Missing required query parameter: isActive",
//         });
//     }

//     const lowerIsActive = isActive.toLowerCase();

//     if (lowerIsActive !== "true" && lowerIsActive !== "false") {

//         return res.status(BAD_REQUEST).json({
//             status: false,
//             message: "Invalid value for isActive. Must be 'true' or 'false'.",
//         });
//     }

//     const newIsActive = lowerIsActive === "true";

//     try {

//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(NOT_FOUND).json({
//                 status: false,
//                 message: "User does not exist",
//             });
//         }

//         if (user.isActive === newIsActive) {
//             return res.status(OK).json({
//                 status: true,
//                 message: `User is already ${user.isActive ? "unblocked" : "blocked"}`,
//             });
//         }

//         user.isActive = newIsActive;

//         await user.save();

//         res.status(OK).json({
//             status: true,
//             message: `User ${newIsActive ? "unblocked" : "blocked"} successfully`,
//         });

//     } catch (error) {

//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message: "Server error",
//             error: error.message,
//         });
//     }
// };












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

import User from "../models/userModel.js";

export const customersList = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "registrationDate",
            sortOrder = "desc",
            search = "",
            status
        } = req.query;

        const filter = { role: "customer" };

        if (status !== undefined) {
            filter.isActive = status === "true";
        }

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const customers = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const totalCustomers = await User.countDocuments(filter);

        res.status(OK).json({
            success: true,
            message: messages.CUSTOMER.FETCHED_SUCCESSFULLY,
            customers,
            totalCustomers,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCustomers / limitNum)
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CUSTOMER.FAILED_FETCH,
            error: error.message
        });
    }
};

export const customerDetails = async (req, res) => {
    try {
        const id = req.params.customerId;
        const customer = await User.findById(id);

        if (!customer) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CUSTOMER.NOT_FOUND
            });
        }

        res.status(OK).json({
            success: true,
            message: messages.CUSTOMER.DETAILS_FETCHED_SUCCESSFULLY,
            customer
        });
    } catch (error) {
        console.error("Error fetching customer details:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CUSTOMER.FAILED_FETCH_DETAILS
        });
    }
};

export const blockUser = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.query;

    if (isActive === undefined) {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.CUSTOMER.MISSING_IS_ACTIVE
        });
    }

    const lowerIsActive = isActive.toLowerCase();
    if (lowerIsActive !== "true" && lowerIsActive !== "false") {
        return res.status(BAD_REQUEST).json({
            success: false,
            message: messages.CUSTOMER.INVALID_IS_ACTIVE
        });
    }

    const newIsActive = lowerIsActive === "true";

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(NOT_FOUND).json({
                success: false,
                message: messages.CUSTOMER.NOT_FOUND
            });
        }

        if (user.isActive === newIsActive) {
            return res.status(OK).json({
                success: true,
                message: newIsActive ? messages.CUSTOMER.ALREADY_UNBLOCKED : messages.CUSTOMER.ALREADY_BLOCKED
            });
        }

        user.isActive = newIsActive;
        await user.save();

        res.status(OK).json({
            success: true,
            message: newIsActive ? messages.CUSTOMER.UNBLOCKED_SUCCESSFULLY : messages.CUSTOMER.BLOCKED_SUCCESSFULLY
        });
    } catch (error) {
        console.error("Error updating customer status:", error);
        res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: messages.CUSTOMER.FAILED_BLOCK,
            error: error.message
        });
    }
};