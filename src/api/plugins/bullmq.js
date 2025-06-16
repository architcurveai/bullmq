import fp from 'fastify-plugin';
import { Queue } from 'bullmq';

async function bullmqPlugin(fastify, options) {
  const queue = new Queue('llm-prompts', {
    connection: fastify.redis,
  });

  fastify.decorate('queue', queue);

  fastify.addHook('onClose', async (instance) => {
    await instance.queue.close();
  });
}

export default fp(bullmqPlugin);