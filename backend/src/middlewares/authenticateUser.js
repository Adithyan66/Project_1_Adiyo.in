import jwt from "jsonwebtoken"



export const authenticateUser = async (req, res, next) => {

    try {

        const token = req.cookies.session;

        if (!token) {

            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        req.user = { userId: decoded.userId };

        next();

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
};