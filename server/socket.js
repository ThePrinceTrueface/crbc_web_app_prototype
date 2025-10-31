/**
 * @file Manages the Socket.IO server setup and client interactions.
 * @module server/socket
 */

import { Server as SocketIoServer } from "socket.io";

/**
 * Creates and configures the Socket.IO server instance.
 * @param {import('node:http').Server} httpServer - The HTTP server instance to attach Socket.IO to.
 * @returns {SocketIoServer} The configured Socket.IO server instance.
 */
export function createSocketServer(httpServer) {

    const io = new SocketIoServer(httpServer, {
            cors: {
                // Use a specific allowlist of origins from environment variables for security.
                origin: process.env.CLIENT_URL?.split(","),
                methods: ["GET", "POST"]
            }
        }
    );

    io.on("connection", socket => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("error", (err) => {
            console.error(`Socket error for client ${socket.id}:`, err);
        });

        socket.on("disconnect", (reason) => {
            console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
        });

        // TODO: Implement authentication and authorization for connected clients.
    });

    io.on("error", (err) => {
        console.error("Socket.IO server error:", err);
    });

    return io;
}
