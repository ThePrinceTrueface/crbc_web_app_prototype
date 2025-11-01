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
import hpp from "hpp";
import expressLayouts from 'express-ejs-layouts';

// Using import.meta.dirname for ES module compatibility to get the current directory path.
const __dirname = import.meta.dirname;

// Initialize the Express application.
const app = express();

// --- View Engine and Layout Configuration ---
app.use(expressLayouts);
app.set('layout', 'layout/main'); // Set the default layout file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);


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

// 3. Serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, "public")));

// --- Middlewares for API routes only ---

// 4. Enable CORS.
app.use(cors({
    origin: process.env.CLIENT_URL?.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// 5. Body Parsers.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 6. Data Sanitization.
app.use(hpp());
// TODO: Uncomment if you use MongoDB and install express-mongo-sanitize
// import mongoSanitize from "express-mongo-sanitize";
// app.use(mongoSanitize());


// --- Page Rendering Routes ---

/**
 * @route GET /
 * @description Renders the homepage using the main layout.
 * @access Public
 */
app.get("/", (req, res) => {
    res.render('index', { title: 'CRBC - Accueil' });
});

// --- API Routes ---
// TODO: Add API-specific routes here.
// Example: app.use("/api/users", userRoutes);


// --- 404 Handler ---
// This middleware should be the last one to catch all unhandled requests.
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page non trouvée', noLoader: true });
});


export default app;
