import fp from 'fastify-plugin';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { FastifyAdapter } from '@bull-board/fastify';

async function dashboardPlugin(fastify, options) {
  // The BullMQ plugin must be registered before this one so that `fastify.queue` is available
  if (!fastify.queue) {
    throw new Error('BullMQ queue is not available. Please register the BullMQ plugin before the dashboard plugin.');
  }

  const serverAdapter = new FastifyAdapter();
  const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(fastify.queue)],
    serverAdapter: serverAdapter,
  });

  // Use the basePath from the plugin options, with a default fallback
  const basePath = options.basePath || '/admin/queues';
  serverAdapter.setBasePath(basePath);

  // Register the Bull Board UI routes
  fastify.register(serverAdapter.registerPlugin(), { prefix: basePath });

  // Add a log to confirm the dashboard is set up
  fastify.addHook('onReady', () => {
    fastify.log.info(`Bull Dashboard available at http://localhost:${process.env.API_PORT || 3000}${basePath}`);
  });
}

export default fp(dashboardPlugin);