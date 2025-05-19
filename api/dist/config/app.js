"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appOptions = void 0;
exports.registerPlugins = registerPlugins;
const prisma_1 = __importDefault(require("../plugins/prisma"));
const swagger_1 = __importDefault(require("../plugins/swagger"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
exports.appOptions = {
    logger: {
        level: process.env.LOG_LEVEL || "info",
        transport: {
            target: "pino-pretty",
        },
    },
};
async function registerPlugins(app) {
    // Register plugins
    await app.register(prisma_1.default);
    await app.register(swagger_1.default);
    // Register routes
    await app.register(user_routes_1.default, { prefix: "/api/v1" });
    // Add global hooks
    app.addHook("onRequest", async (request, reply) => {
        request.log.info({ url: request.url, method: request.method }, "Incoming request");
    });
    app.addHook("onResponse", async (request, reply) => {
        request.log.info({
            url: request.url,
            method: request.method,
            statusCode: reply.statusCode,
        }, "Request completed");
    });
    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        const statusCode = error.statusCode || 500;
        reply.status(statusCode).send({
            statusCode,
            error: error.name || "Internal Server Error",
            message: error.message || "Something went wrong",
        });
    });
}
