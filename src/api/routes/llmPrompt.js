import { generate, getStatus } from '../controllers/llmController.js';

async function routes(fastify, options) {
  fastify.post('/generate', generate);
  fastify.get('/status/:taskId', getStatus);
}

export default routes;