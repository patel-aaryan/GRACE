import Fastify from "fastify";
import { appOptions, registerPlugins } from "./config/app";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Create Fastify instance
const server = Fastify(appOptions);

// Start server
async function start() {
  try {
    // Register plugins and routes
    await registerPlugins(server);

    // Listen on port
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(
      `Swagger documentation is available at http://${HOST}:${PORT}/documentation`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
