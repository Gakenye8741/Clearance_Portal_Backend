"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./drizzle/db");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Start server and handle graceful shutdown for the database pool
const server = app_1.default.listen(PORT, () => {
    console.log(`🚀 Laikipia University Clearance Portal Server running on http://localhost:${PORT}`);
    // Display initial system metrics on startup
    const memoryUsage = process.memoryUsage();
    console.log("--- Initial System Metrics ---");
    console.log(`Uptime: ${Math.round(process.uptime())} seconds`);
    console.log(`Memory Usage (RSS): ${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`);
    console.log(`Memory Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`);
    console.log("----------------------------");
});
// Handle graceful shutdown on termination signals
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Closing HTTP server and database pool gracefully...`);
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await db_1.pool.end();
            console.log("Database connection pool has been closed.");
            process.exit(0);
        }
        catch (err) {
            console.error("Error during database pool shutdown:", err);
            process.exit(1);
        }
    });
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
