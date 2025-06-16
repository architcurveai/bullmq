// clearQueue.js
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: `${__dirname}/.env` });
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import logger from './src/utils/logger.js';

// The name of your queue
const QUEUE_NAME = 'llm-prompts';

// Redis connection options
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_PASSWORD:', process.env.REDIS_PASSWORD ? '******' : 'Not set'); // Mask password for security

const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// Instantiate the queue
const queue = new Queue(QUEUE_NAME, { connection: redisConnection });

async function clearQueue() {
  try {
    logger.info(`Connecting to queue: ${QUEUE_NAME}`);

    // This forcefully removes all jobs and data from the queue.
    // Use with caution!
    await queue.obliterate();

    logger.info(`Successfully obliterated all tasks in the '${QUEUE_NAME}' queue.`);
  } catch (error) {
    logger.error(`Failed to clear the queue: ${error.message}`);
  } finally {
    // Close the connections
    await queue.close();
    await redisConnection.quit();
  }
}

clearQueue();
