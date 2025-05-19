"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.updateUserSchema = exports.getUserSchema = exports.createUserSchema = void 0;
exports.createUserSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
            password: { type: "string", minLength: 6 },
        },
    },
    response: {
        201: {
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
};
exports.getUserSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
    response: {
        200: {
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
};
exports.updateUserSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
    body: {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
            password: { type: "string", minLength: 6 },
        },
    },
    response: {
        200: {
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
};
exports.deleteUserSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
        },
    },
    response: {
        204: {
            type: "null",
        },
    },
};
