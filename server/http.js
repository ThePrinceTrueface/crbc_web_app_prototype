import {createServer} from "node:http"

const server = createServer()

server.on("error", (err) => {
    switch (err.code) {
        case "EADDRINUSE":
            console.error(`Port ${err.port} is already in use.`);
            process.exit(1);
        case "EACCES":
            console.error(`Permission denied to use port ${err.port}.`);
            process.exit(1);
            break;
        case "EADDRNOTAVAIL":
            console.error(`Address ${err.address} is not available.`);
            process.exit(1);
            break;
        case "ECONNREFUSED":
            console.error(`Connection refused by the server at ${err.address}:${err.port}.`);
            process.exit(1);
            break;
        case "ECONNRESET":
            console.error(`Connection reset by the server at ${err.address}:${err.port}.`);
            process.exit(1);
            break;
        default:
            console.error("Server error:", err);
            break;
    }
})

server.on("close", () => console.log("HTTP Server closed."))

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

function shutdown() {
    console.log("Shutting down server...");
    server.close((err) => {
        if (err) {
            console.error("Error closing server:", err);
            process.exit(1);
        }
        console.log("Server gracefully shut down.");
        process.exit(0);
    })
}

export const runServer = (port, callback) => server.listen(port, () => callback(port))

// {}