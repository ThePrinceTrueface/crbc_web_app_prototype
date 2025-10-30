/**
 * @file This file is responsible for creating, configuring, and managing the lifecycle of the application's HTTPS server.
 * It includes server instantiation, error handling, and graceful shutdown procedures.
 * @module server/http
 */

import https from "node:https";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";
import path from "node:path";

// Load environment variables from a .env file into process.env
configDotenv();

/**
 * @typedef {object} ServerOptions
 * @property {Buffer} key - The private key for the SSL certificate.
 * @property {Buffer} cert - The public certificate.
 */

/**
 * Configuration options for the HTTPS server.
 * Reads the SSL key and certificate from paths specified in environment variables.
 * @type {ServerOptions}
 */
const serverOptions = {
    key: readFileSync(path.join(process.cwd(), process.env.HTTPS_KEY)),
    cert: readFileSync(path.join(process.cwd(), process.env.HTTPS_CERT)),
};

/**
 * The singleton HTTPS server instance for the application.
 * @type {import('node:https').Server}
 */
const server = https.createServer(serverOptions, (req, res) => {
    // Basic request handler, sends a "Hello World!" response.
    // This should be replaced with actual application routing and logic.
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Hello World!");
});

/**
 * Handles critical server errors.
 * Logs a specific message for common network errors and terminates the application.
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
        case "EADDRNOTAVAIL":
            message = `Error: Address ${err.address} is not available.`;
            break;
        case "ECONNREFUSED":
            message = `Error: Connection refused by the server at ${err.address}:${err.port}.`;
            break;
        case "ECONNRESET":
            message = `Error: Connection reset by the server at ${err.address}:${err.port}.`;
            break;
        default:
            console.error("An unexpected server error occurred:", err);
            // For unknown errors, we might not want to exit immediately,
            // but for this application's purpose, we will.
            process.exit(1);
            return;
    }
    console.error(message);
    process.exit(1);
}

/**
 * Gracefully shuts down the HTTP server.
 * This function is registered to be called on SIGINT and SIGTERM signals.
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

/**
 * Starts the HTTP server and makes it listen on a specified port.
 * @param {number} port - The port number for the server to listen on.
 * @param {(port: number) => void} onListen - A callback function executed when the server starts listening. It receives the port number as an argument.
 * @returns {import('node:https').Server} The running HTTP server instance.
 */
export const runHttpServer = (port, onListen) => {
    return server.listen(port, () => onListen(port));
};
