

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
