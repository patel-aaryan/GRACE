import { FastifyServerOptions } from "fastify";
import prismaPlugin from "../plugins/prisma";
import swaggerPlugin from "../plugins/swagger";
import userRoutes from "../routes/user.routes";

export const appOptions: FastifyServerOptions = {
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
    },
  },
};

export async function registerPlugins(app: any) {
  // Register plugins
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);

  // Register routes
  await app.register(userRoutes, { prefix: "/api/v1" });

  // Add global hooks
  app.addHook("onRequest", async (request: any, reply: any) => {
    request.log.info(
      { url: request.url, method: request.method },
      "Incoming request"
    );
  });

  app.addHook("onResponse", async (request: any, reply: any) => {
    request.log.info(
      {
        url: request.url,
        method: request.method,
        statusCode: reply.statusCode,
      },
      "Request completed"
    );
  });

  app.setErrorHandler((error: any, request: any, reply: any) => {
    request.log.error(error);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      statusCode,
      error: error.name || "Internal Server Error",
      message: error.message || "Something went wrong",
    });
  });
}
