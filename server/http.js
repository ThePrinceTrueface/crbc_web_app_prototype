/**
 * @file This file is responsible for creating, configuring, and managing the lifecycle of the application's HTTPS server.
 * It includes server instantiation, error handling, and graceful shutdown procedures.
 * @module server/http
 */

import https from "node:https";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";

// Load environment variables from a .env file into process.env
configDotenv();

/**
 * @typedef {object} ServerOptions
 * @property {Buffer} key - The private key for the SSL certificate.
 * @property {Buffer} cert - The public certificate.
 */

let serverOptions;

try {
    /**
     * Configuration options for the HTTPS server.
     * Reads the SSL key and certificate from paths specified in environment variables.
     * @type {ServerOptions}
     */
    serverOptions = {
        key: readFileSync(process.env.HTTPS_KEY),
        cert: readFileSync(process.env.HTTPS_CERT),
    };
} catch (err) {
    console.error("\n--- CRITICAL ERROR: FAILED TO READ SSL CERTIFICATES ---");
    console.error(`Error details: ${err.message}`);
    console.error("Please check the following:");
    console.error(`1. Ensure the paths in your .env file for HTTPS_KEY and HTTPS_CERT are correct.`);
    console.error(`   - HTTPS_KEY path: ${process.env.HTTPS_KEY}`);
    console.error(`   - HTTPS_CERT path: ${process.env.HTTPS_CERT}`);
    console.error("2. Ensure the files exist at these locations.");
    console.error("3. Ensure the application has the necessary permissions to read these files.");
    console.error("----------------------------------------------------------\n");
    process.exit(1); // Exit the process with an error code
}


/**
 * Creates and configures the HTTPS server instance.
 * Note: This function creates the server but does not start it (i.e., it does not call `listen()`).
 * The server should be started manually after being passed to other services like Socket.IO.
 * @param {import('node:http').RequestListener} [routingEngine] - The request handler logic, typically an Express app or another router. If not provided, a default "Hello World" handler is used.
 * @returns {import('node:https').Server} The configured, but not started, HTTPS server instance.
 */
export function createHttpServer(routingEngine) {
    const server = https.createServer(serverOptions, routingEngine ?? ((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Hello World!"); 
    }));

    /**
     * Handles critical server errors by logging a specific message and exiting the process.
     * These are typically errors that occur during server startup or network configuration.
     * @param {NodeJS.ErrnoException} err - The error object.
     */
    function handleError(err) {
        // The `listen` call will trigger this handler for certain errors (e.g., port in use).
        // We log a specific, helpful message and exit, as the server cannot run.
        let message;
        switch (err.code) {
            case "EADDRINUSE":
                message = `Error: Port ${err.port} is already in use. Please close the other process or choose a different port.`;
                break;
            case "EACCES":
                message = `Error: Permission denied to use port ${err.port}. Try running with sudo or using a port > 1024.`;
                break;
            default:
                // For other critical errors, we log the full error and exit.
                console.error("A critical server error occurred:", err);
                process.exit(1);
                return; // Exit immediately
        }
        console.error(message);
        process.exit(1);
    }

    /**
     * Gracefully shuts down the HTTP server.
     */
    function shutdown() {
        console.log("Shutting down server gracefully...");
        server.close((err) => {
            if (err) {
                console.error("Error during server shutdown:", err);
                process.exit(1);
            } else {
                console.log("Server has been shut down successfully.");
                process.exit(0);
            }
        });
    }

    server.on("error", handleError);
    server.on("close", () => console.log("HTTP Server instance closed."));

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    return server;
}
