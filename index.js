import { createHttpServer } from "./server/http.js";
import { configDotenv } from "dotenv";
import { runSocketServer } from "./server/socket.js";

// Load environment variables
configDotenv();

const PORT = process.env.PORT || 3001;

// 1. Create the HTTP server instance (without starting it).
const httpServer = createHttpServer();

// 2. Create the Socket.IO server and attach it to the HTTP server.
const io = runSocketServer(httpServer);

// 3. Now, start the HTTP server to listen for connections.
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // TODO: Add any post-start logic here, like initializing services that need the running server.
});

// TODO: You might want to export `httpServer` and `io` if other parts of your application need them.
// For example:
// export { httpServer, io };
