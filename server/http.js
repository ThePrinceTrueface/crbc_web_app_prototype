/**
 * @file This file is responsible for creating, configuring, and managing the lifecycle of the application's HTTP/HTTPS server.
 * It includes server instantiation, error handling, and graceful shutdown procedures.
 * @module server/http
 */

import http from "node:http";
import https from "node:https";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";

// Load environment variables from a .env file into process.env
configDotenv();

/**
 * Creates and configures the HTTP or HTTPS server instance based on the environment.
 * In a production environment like Render (where RENDER=true), it creates a simple HTTP server.
 * In development, it creates an HTTPS server using SSL certificates specified in .env.
 * @param {import('node:http').RequestListener} [routingEngine] - The request handler logic, typically an Express app.
 * @returns {import('node:http').Server | import('node:https').Server} The configured, but not started, server instance.
 */
export function createHttpServer(routingEngine) {
    let server;

    const defaultHandler = (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Hello World!");
    };

    if (process.env.NO_HTTPS === 'true') {
        console.log("Render environment detected. Creating HTTP server.");
        server = http.createServer(routingEngine ?? defaultHandler);
    } else {
        console.log("Development environment detected. Creating HTTPS server.");
        let serverOptions;
        try {
            serverOptions = {
                key: readFileSync(process.env.HTTPS_KEY),
                cert: readFileSync(process.env.HTTPS_CERT),
            };
        } catch (err) {
            console.error("\n--- CRITICAL ERROR: FAILED TO READ SSL CERTIFICATES ---");
            console.error(`Error details: ${err.message}`);
            console.error("Please check your .env file and ensure HTTPS_KEY and HTTPS_CERT point to valid files.");
            console.error("----------------------------------------------------------\n");
            process.exit(1);
        }
        server = https.createServer(serverOptions, routingEngine ?? defaultHandler);
    }

    /**
     * Handles critical server errors.
     * @param {NodeJS.ErrnoException} err - The error object.
     */
    function handleError(err) {
        let message;
        switch (err.code) {
            case "EADDRINUSE":
                message = `Error: Port ${err.port} is already in use.`;
                break;
            case "EACCES":
                message = `Error: Permission denied to use port ${err.port}.`;
                break;
            default:
                console.error("A critical server error occurred:", err);
                process.exit(1);
                return;
        }
        console.error(message);
        process.exit(1);
    }

    /**
     * Gracefully shuts down the server.
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
    server.on("close", () => console.log("Server instance closed."));

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    return server;
}
