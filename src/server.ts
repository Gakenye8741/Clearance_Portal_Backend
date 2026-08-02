import app from "./app";
import dotenv from "dotenv";
import { pool } from "./drizzle/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server and handle graceful shutdown for the database pool
const server = app.listen(PORT, () => {
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
const gracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Closing HTTP server and database pool gracefully...`);
    
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await pool.end();
            console.log("Database connection pool has been closed.");
            process.exit(0);
        } catch (err) {
            console.error("Error during database pool shutdown:", err);
            process.exit(1);
        }
    });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));