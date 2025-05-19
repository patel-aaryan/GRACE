"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_datastore_1 = require("../datastores/user.datastore");
class UserService {
    fastify;
    userDatastore;
    constructor(fastify) {
        this.fastify = fastify;
        this.userDatastore = new user_datastore_1.UserDatastore(fastify);
    }
    async createUser(userData) {
        const existingUser = await this.userDatastore.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        // In a real app, you would hash the password here
        return this.userDatastore.create(userData);
    }
    async getUser(id) {
        const user = await this.userDatastore.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async updateUser(id, userData) {
        await this.getUser(id); // Check if user exists
        if (userData.email) {
            const existingUser = await this.userDatastore.findByEmail(userData.email);
            if (existingUser && existingUser.id !== id) {
                throw new Error("Email is already in use");
            }
        }
        // In a real app, you would hash the password here if it's being updated
        return this.userDatastore.update(id, userData);
    }
    async deleteUser(id) {
        await this.getUser(id); // Check if user exists
        await this.userDatastore.delete(id);
    }
    async getAllUsers() {
        return this.userDatastore.findAll();
    }
}
exports.UserService = UserService;
