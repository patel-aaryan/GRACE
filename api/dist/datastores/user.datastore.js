"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatastore = void 0;
class UserDatastore {
    fastify;
    constructor(fastify) {
        this.fastify = fastify;
    }
    async create(userData) {
        return this.fastify.prisma.user.create({
            data: userData,
        });
    }
    async findById(id) {
        return this.fastify.prisma.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return this.fastify.prisma.user.findUnique({
            where: { email },
        });
    }
    async update(id, userData) {
        return this.fastify.prisma.user.update({
            where: { id },
            data: userData,
        });
    }
    async delete(id) {
        await this.fastify.prisma.user.delete({
            where: { id },
        });
    }
    async findAll() {
        return this.fastify.prisma.user.findMany();
    }
}
exports.UserDatastore = UserDatastore;
