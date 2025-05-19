"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../validators/user.validator");
async function userRoutes(fastify) {
    const userController = new user_controller_1.UserController(fastify);
    fastify.post("/users", {
        schema: user_validator_1.createUserSchema,
        onRequest: [],
    }, userController.createUser.bind(userController));
    fastify.get("/users/:id", {
        schema: user_validator_1.getUserSchema,
        onRequest: [],
    }, userController.getUser.bind(userController));
    fastify.put("/users/:id", {
        schema: user_validator_1.updateUserSchema,
        onRequest: [],
    }, userController.updateUser.bind(userController));
    fastify.delete("/users/:id", {
        schema: user_validator_1.deleteUserSchema,
        onRequest: [],
    }, userController.deleteUser.bind(userController));
    fastify.get("/users", {
        schema: {
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            name: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                        },
                    },
                },
            },
            tags: ["users"],
            description: "Get all users",
        },
        onRequest: [],
    }, userController.getAllUsers.bind(userController));
}
