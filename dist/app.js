"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = require("./drizzle/db");
const Auth_routes_1 = __importDefault(require("./Auth/Auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// --- CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173'
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`CORS Error: Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};
// --- MIDDLEWARE STACK ---
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Default route with Laikipia University Clearance Portal database health check and system metrics
app.get('/', async (req, res) => {
    let dbStatus = "connected";
    try {
        await db_1.pool.query('SELECT 1');
    }
    catch (error) {
        dbStatus = "disconnected";
        console.error("Database connection health check failed:", error);
    }
    const memoryUsage = process.memoryUsage();
    const metrics = {
        uptime: process.uptime(), // Uptime in seconds
        timestamp: new Date().toISOString(),
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`,
        },
        database: dbStatus
    };
    const statusCode = dbStatus === "connected" ? 200 : 500;
    res.status(statusCode).json({
        status: dbStatus === "connected" ? "success" : "error",
        message: "Laikipia University Student Clearance Portal API is running",
        metrics
    });
});
// Routes
app.use("/api/users", Auth_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
