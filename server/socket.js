/**
 * @file Manages the Socket.IO server setup and client interactions.
 * @module server/socket
 */

import { Server as SocketIoServer } from "socket.io";

/**
 * Initializes and runs the Socket.IO server.
 * @param {import('node:http').Server} httpServer - The HTTP server instance to attach Socket.IO to.
 * @returns {SocketIoServer} The initialized Socket.IO server instance.
 */
export function runSocketServer(httpServer) {

    const io = new SocketIoServer(httpServer, {
            cors: {
                // WARNING: Using "*" for origin in production is a security risk.
                // It allows any domain to connect. For production, replace with specific client URLs.
                // Example: origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [],
                origin: process.env.CLIENT_URL || "*",
                methods: ["GET", "POST"]
            }
        }
    );

    io.on("connection", socket => {
        console.log(`Client connected: ${socket.id}`);

        // Basic error handling for the socket connection
        socket.on("error", (err) => {
            console.error(`Socket error for client ${socket.id}:`, err);
        });

        socket.on("disconnect", (reason) => {
            console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
        });

        // TODO: Implement authentication and authorization for connected clients.
        // For example, verify a JWT token passed during handshake:
        // socket.use((packet, next) => {
        //   if (isValidToken(socket.handshake.auth.token)) {
        //     next();
        //   } else {
        //     next(new Error('Authentication error'));
        //   }
        // });

        // TODO: Add more event listeners and business logic here.
    });

    // Global error handling for the Socket.IO server itself
    io.on("error", (err) => {
        console.error("Socket.IO server error:", err);
    });

    return io;
}
