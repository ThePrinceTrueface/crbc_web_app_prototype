import {runHttpServer} from "./server/http.js";
import {configDotenv} from "dotenv";
configDotenv()

const PORT = process.env.PORT || 3001;

const httpServer = runHttpServer(PORT, (port) => console.log(`Server running on port ${port}`))

// {}