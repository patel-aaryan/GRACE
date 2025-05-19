import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "../validators/user.validator";

export default async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController(fastify);

  fastify.post(
    "/users",
    {
      schema: createUserSchema,
      onRequest: [],
    },
    userController.createUser.bind(userController)
  );

  fastify.get(
    "/users/:id",
    {
      schema: getUserSchema,
      onRequest: [],
    },
    userController.getUser.bind(userController)
  );

  fastify.put(
    "/users/:id",
    {
      schema: updateUserSchema,
      onRequest: [],
    },
    userController.updateUser.bind(userController)
  );

  fastify.delete(
    "/users/:id",
    {
      schema: deleteUserSchema,
      onRequest: [],
    },
    userController.deleteUser.bind(userController)
  );

  fastify.get(
    "/users",
    {
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
    },
    userController.getAllUsers.bind(userController)
  );
}
