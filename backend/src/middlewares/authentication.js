

// import jwt from 'jsonwebtoken';
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

// export const authenticateUser = async (req, res, next) => {

//     try {

//         const token = req.cookies.session

//         console.log("this is token", token);



//         if (!token) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Access denied. No token provided'
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.userId).select('-password');

//         if (!user) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'User not found or token invalid'
//             });
//         }

//         if (!user.isActive) {
//             return res.status(FORBIDDEN).json({
//                 success: false,
//                 message: 'User account is blocked'
//             });
//         }

//         req.user = { userId: user._id, role: user.role };

//         console.log("helloo", req.user);


//         next();

//     } catch (error) {

//         console.error('Authentication error:', error);

//         if (error.name === 'JsonWebTokenError') {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }

//         if (error.name === 'TokenExpiredError') {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Token expired'
//             });
//         }

//         return res.status(UNAUTHORIZED).json({
//             success: false,
//             message: 'Authentication failed'
//         });
//     }
// };



// export const authenticateAdmin = async (req, res, next) => {


//     try {

//         if (req.user) {

//             if (req.user.role !== "admin") {
//                 return res.status(FORBIDDEN).json({
//                     success: false,
//                     message: 'User is not Admin'
//                 });
//             }

//             return next();
//         }

//         const token = req.cookies.session;
//         console.log(req.cookies)

//         console.log("Token from cookies:", token);

//         if (!token) {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Access denied. No token provided'
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.userId).select('-password');

//         if (!user) {

//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'User not found or token invalid'
//             });
//         }

//         if (!user.isActive) {
//             return res.status(FORBIDDEN).json({
//                 success: false,
//                 message: 'User account is blocked'
//             });
//         }

//         if (user.role !== "admin") {
//             return res.status(FORBIDDEN).json({
//                 success: false,
//                 message: 'User is not Admin'
//             });
//         }

//         req.user = { userId: decoded.userId };

//         next();

//     } catch (error) {

//         console.error('Admin authentication error:', error);

//         if (error.name === 'JsonWebTokenError') {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }

//         if (error.name === 'TokenExpiredError') {
//             return res.status(UNAUTHORIZED).json({
//                 success: false,
//                 message: 'Token expired'
//             });
//         }

//         return res.status(FORBIDDEN).json({
//             success: false,
//             message: 'Admin authentication failed'
//         });
//     }
// };


// ✅ Updated middleware with cleaner structure, token expiration handling, and improved reusability

import jwt from 'jsonwebtoken';
import HttpStatusCode from "../utils/httpStatusCodes.js";
import User from "../models/userModel.js";

const {
    UNAUTHORIZED,
    FORBIDDEN,
} = HttpStatusCode;

const verifyToken = async (req, res, roleCheck = null) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        console.log(token, "this is token");

        if (!token) throw new Error('NO_TOKEN');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) throw new Error('NO_USER');
        if (!user.isActive) throw new Error('BLOCKED_USER');
        if (roleCheck && user.role !== roleCheck) throw new Error('ROLE_MISMATCH');

        return { userId: user._id, role: user.role };

    } catch (err) {
        const errorResponses = {
            NO_TOKEN: { code: UNAUTHORIZED, message: "Access denied. No token provided" },
            NO_USER: { code: UNAUTHORIZED, message: "User not found or token invalid" },
            BLOCKED_USER: { code: FORBIDDEN, message: "User account is blocked" },
            ROLE_MISMATCH: { code: FORBIDDEN, message: "Access forbidden: insufficient permissions" },
            JsonWebTokenError: { code: UNAUTHORIZED, message: "Invalid token" },
            TokenExpiredError: { code: UNAUTHORIZED, message: "Token expired" },
        };

        const response = errorResponses[err.message] || errorResponses[err.name] || {
            code: UNAUTHORIZED,
            message: "Authentication failed"
        };

        return { error: true, ...response };
    }
};

export const authenticateUser = async (req, res, next) => {
    const result = await verifyToken(req, res);
    if (result.error) return res.status(result.code).json({ success: false, message: result.message });
    req.user = result;
    next();
};

export const authenticateAdmin = async (req, res, next) => {
    const result = await verifyToken(req, res, "admin");
    if (result.error) return res.status(result.code).json({ success: false, message: result.message });
    req.user = result;
    next();
};
