"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    fastify;
    userService;
    constructor(fastify) {
        this.fastify = fastify;
        this.userService = new user_service_1.UserService(fastify);
    }
    async createUser(request, reply) {
        try {
            const user = await this.userService.createUser(request.body);
            const { password, ...userWithoutPassword } = user;
            return reply.code(201).send(userWithoutPassword);
        }
        catch (error) {
            request.log.error(error);
            return reply.code(400).send({ message: error.message });
        }
    }
    async getUser(request, reply) {
        try {
            const user = await this.userService.getUser(request.params.id);
            const { password, ...userWithoutPassword } = user;
            return reply.code(200).send(userWithoutPassword);
        }
        catch (error) {
            request.log.error(error);
            return reply.code(404).send({ message: error.message });
        }
    }
    async updateUser(request, reply) {
        try {
            const user = await this.userService.updateUser(request.params.id, request.body);
            const { password, ...userWithoutPassword } = user;
            return reply.code(200).send(userWithoutPassword);
        }
        catch (error) {
            request.log.error(error);
            return reply.code(400).send({ message: error.message });
        }
    }
    async deleteUser(request, reply) {
        try {
            await this.userService.deleteUser(request.params.id);
            return reply.code(204).send();
        }
        catch (error) {
            request.log.error(error);
            return reply.code(404).send({ message: error.message });
        }
    }
    async getAllUsers(request, reply) {
        try {
            const users = await this.userService.getAllUsers();
            const usersWithoutPasswords = users.map((user) => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return reply.code(200).send(usersWithoutPasswords);
        }
        catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: "Internal server error" });
        }
    }
}
exports.UserController = UserController;
