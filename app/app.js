/**
 * @file Main application file for the Express server.
 * @module app/app
 * @description This file initializes the Express application and configures essential middleware in a secure and performant order.
 */

import express from "express";
import cors from "cors";
import path from "node:path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize"; // TODO: Uncomment if you use MongoDB
import hpp from "hpp";

// Using import.meta.dirname for ES module compatibility to get the current directory path.
const __dirname = import.meta.dirname;

// Initialize the Express application.
const app = express();

// --- Middleware Configuration (Order is crucial for security and performance) ---

// 1. Apply basic security headers.
app.use(helmet());

// 2. Apply rate limiting to all requests to prevent abuse.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use(apiLimiter);

// 3. Serve static files. Requests for existing static files will be handled here and will not proceed further.
app.use(express.static(path.join(__dirname, "public")));

// --- Middlewares for API routes only ---
// These will not run for static file requests, which is more efficient.

// 4. Enable CORS.
// TODO: For production, ensure CLIENT_URL is a specific, trusted list of domains.
app.use(cors({
    origin: process.env.CLIENT_URL?.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// 5. Body Parsers.
// TODO: Consider adding a size limit like { limit: '10kb' } to prevent large payloads.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 6. Data Sanitization.
// TODO: Uncomment these lines if you add the corresponding packages.
// app.use(mongoSanitize());
app.use(hpp());


// --- API Routes ---

/**
 * @route GET /
 * @description A simple health-check or welcome route.
 * @access Public
 */
app.get("/", (req, res) => {
    res.send("API is running!");
});

// TODO: Add other application routes here.
// Example: app.use("/api/users", userRoutes);


export default app;
