"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const app_1 = require("./config/app");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";
// Create Fastify instance
const server = (0, fastify_1.default)(app_1.appOptions);
// Start server
async function start() {
    try {
        // Register plugins and routes
        await (0, app_1.registerPlugins)(server);
        // Listen on port
        await server.listen({ port: PORT, host: HOST });
        console.log(`Server is running on http://${HOST}:${PORT}`);
        console.log(`Swagger documentation is available at http://${HOST}:${PORT}/documentation`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();
