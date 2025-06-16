import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

export async function generate(req, reply) {
  const { prompt } = req.body;

  if (!prompt) {
    return reply.status(400).send({ error: 'Prompt is required' });
  }

  const taskId = uuidv4();

  try {
    await req.server.redis.set(`task:${taskId}:status`, 'queued');
    await req.server.queue.add('generate-text', { taskId, prompt });

    logger.info(`Task enqueued: ${taskId}`);
    return reply.status(202).send({ taskId });
  } catch (error) {
    logger.error(`Failed to enqueue task: ${error.message}`);
    return reply.status(500).send({ error: 'Failed to enqueue task' });
  }
}

export async function getStatus(req, reply) {
  const { taskId } = req.params;
  const status = await req.server.redis.get(`task:${taskId}:status`);

  if (!status) {
    return reply.status(404).send({ error: 'Task not found' });
  }

  const response = await req.server.redis.get(`task:${taskId}:response`);

  return reply.send({ taskId, status, response: response ? JSON.parse(response) : null });
}