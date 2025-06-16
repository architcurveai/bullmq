import { config } from 'dotenv';
import fastifyLib from 'fastify';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dashboardPlugin from '../dashboard/dashboardPlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = fastifyLib();

// Import plugins and routes
import redisPlugin from './plugins/redis.js';
import bullmqPlugin from './plugins/bullmq.js';
import llmPromptRoutes from './routes/llmPrompt.js';

// Load environment variables
config({ path: path.resolve(__dirname, '../../.env') });

const start = async () => {
  try {
    // Register plugins
    try {
      await fastify.register(redisPlugin);
    } catch (err) {
      logger.error("Error registering redisPlugin:", err);
      process.exit(1);
    }

    try {
      await fastify.register(bullmqPlugin);
    } catch (err) {
      logger.error("Error registering bullmqPlugin:", err);
      process.exit(1);
    }

    try {
      await fastify.register(dashboardPlugin, {
        basePath: '/admin/queues', // You can configure the path here
      });
    } catch (err) {
      logger.error("Error registering dashboardPlugin:", err);
      process.exit(1);
    }

    // Register routes
    try {
      await fastify.register((instance, opts, done) => {
        instance.register(llmPromptRoutes, { prefix: '/api' });
        done();
      });
    } catch (err) {
      logger.error("Error registering routes:", err);
      process.exit(1);
    }

    const port = process.env.API_PORT || 3000;
    await fastify.listen({ port });
    logger.info(`API server listening on port ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

// Start the server
start();
