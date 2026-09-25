import jwt from "jsonwebtoken";

export const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Safely extract string ID whether payload stored string or legacy object
        let userId = null;
        if (decoded?.id) {
            userId = typeof decoded.id === "object" && decoded.id?._id
                ? decoded.id._id.toString()
                : (typeof decoded.id === "object" && decoded.id?.id ? decoded.id.id.toString() : decoded.id.toString());
        } else if (decoded?._id) {
            userId = decoded._id.toString();
        }

        if (!userId || userId === "[object Object]") {
            return res.status(401).json({ success: false, message: "Invalid token payload. Please login again." });
        }

        if (!req.body) req.body = {};
        req.body.userId = userId;
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};
