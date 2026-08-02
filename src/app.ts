import express, { Application, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import helmet from "helmet";
import { pool } from './drizzle/db';
import AuthRouter from './Auth/Auth.routes';
import schoolRouter from './services/schools/school.route';
import NonAcademicDeptRouter from './services/NonAcademicDepartments/NonAcademicDepartment.route';
import userRouter from './services/Users/User.route';

dotenv.config();

const app: Application = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173'
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Error: Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};

// --- MIDDLEWARE STACK ---
app.use(cors(corsOptions)); 

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route with Laikipia University Clearance Portal database health check and system metrics
app.get('/', async (req, res: Response) => {
    let dbStatus = "connected";
    try {
        await pool.query('SELECT 1');
    } catch (error) {
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
app.use("/api/users", AuthRouter);
app.use("/api/schools", schoolRouter);
app.use("/api/non-academic-departments", NonAcademicDeptRouter);
app.use("/api/users", userRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;