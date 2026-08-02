"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyAuthenticatedUser = exports.memberAuth = exports.adminAuth = exports.authMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = async (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const authMiddleware = (allowedRoles = "any") => {
    return async (req, res, next) => {
        const authHeader = req.header("Authorization");
        // Clean "Bearer " prefix and strip accidental quotes/backslashes
        let token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
        if (token) {
            token = token.replace(/[\\"]/g, '').trim();
        }
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = await (0, exports.verifyToken)(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        // Attach to request
        req.user = decodedToken;
        if (allowedRoles === "any" || allowedRoles.includes(decodedToken.role)) {
            return next();
        }
        return res.status(403).json({ error: "Access forbidden" });
    };
};
exports.authMiddleware = authMiddleware;
// Simplified role-specific exports
exports.adminAuth = (0, exports.authMiddleware)(["admin"]);
exports.memberAuth = (0, exports.authMiddleware)(["member"]);
exports.anyAuthenticatedUser = (0, exports.authMiddleware)("any");
