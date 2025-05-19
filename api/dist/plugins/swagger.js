"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const swaggerPlugin = async (fastify) => {
    await fastify.register(swagger_1.default, {
        swagger: {
            info: {
                title: "API Documentation",
                description: "API documentation using Swagger",
                version: "1.0.0",
            },
            host: "localhost:3000",
            schemes: ["http"],
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [{ name: "users", description: "User related endpoints" }],
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: "/documentation",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
    });
};
exports.default = (0, fastify_plugin_1.default)(swaggerPlugin);
