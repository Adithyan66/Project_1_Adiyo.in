

import jwt from 'jsonwebtoken';
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

import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {

    try {

        const token = req.cookies.session

        console.log("this is token", token);



        if (!token) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Access denied. No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'User not found or token invalid'
            });
        }

        if (!user.isActive) {
            return res.status(FORBIDDEN).json({
                success: false,
                message: 'User account is blocked'
            });
        }

        req.user = { userId: user._id, role: user.role };

        console.log("helloo", req.user);


        next();

    } catch (error) {

        console.error('Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(UNAUTHORIZED).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};



export const authenticateAdmin = async (req, res, next) => {


    try {
        // Check if we've already authenticated this request to prevent double execution
        if (req.user) {
            // If user is already authenticated, just check admin role
            if (req.user.role !== "admin") {
                return res.status(FORBIDDEN).json({
                    success: false,
                    message: 'User is not Admin'
                });
            }
            return next();
        }

        const token = req.cookies.session;

        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Access denied. No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'User not found or token invalid'
            });
        }

        if (!user.isActive) {
            return res.status(FORBIDDEN).json({
                success: false,
                message: 'User account is blocked'
            });
        }

        if (user.role !== "admin") {
            return res.status(FORBIDDEN).json({
                success: false,
                message: 'User is not Admin'
            });
        }

        req.user = { userId: decoded.userId };

        next();

    } catch (error) {
        console.error('Admin authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(UNAUTHORIZED).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(FORBIDDEN).json({
            success: false,
            message: 'Admin authentication failed'
        });
    }
};