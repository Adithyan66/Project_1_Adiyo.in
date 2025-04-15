

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

import jwt from "jsonwebtoken"

// export const authenticateAdmin = async (req, res, next) => {

//     try {
//         const token = req.cookies.session;

//         console.log("authentucatingggggggggggggggggg", token);

//         if (!token) {
//             return res.status(BAD_REQUEST).json({
//                 success: false,
//                 mesage: "No TOken Provided"
//             })
//         }



//         const decode = jwt.verify(token, process.env.JWT_SECRET || "secret")

//         if (decode.role === "admin") {
//             return next()
//         }
//         res.status(UNAUTHORIZED).json({
//             success: false,
//             message: "not authorized"
//         })

//     } catch (error) {

//         console.log("error in authenticating admin", error)
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }




export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.session;

        if (!token) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "No token provided"
            });
        }

        console.log("Authenticating admin with token:", token);

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (decode.role === "admin") {
            return next();
        }

        return res.status(UNAUTHORIZED).json({
            success: false,
            message: "Not authorized"
        });
    } catch (error) {
        console.error("Error in authenticating admin:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error"
        });
    }
};