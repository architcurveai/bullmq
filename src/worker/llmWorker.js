import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import geminiService from '../services/geminiService.js';
import logger from '../utils/logger.js';

const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 1000, 5000);
    console.log(`Redis connection attempt ${times}, retrying in ${delay}ms...`);
    return delay;
  },
  reconnectOnError: (err) => {
    console.error('Redis connection error:', err.message);
    return true; // Reconnect on error
  }
});

const worker = new Worker('llm-prompts', async (job) => {
  const { taskId, prompt } = job.data;
  logger.info(`Processing task: ${taskId}`);

  try {
    await redisConnection.set(`task:${taskId}:status`, 'processing');
    const result = await geminiService.generateText(prompt);

    await redisConnection.set(`task:${taskId}:response`, JSON.stringify(result));
    await redisConnection.set(`task:${taskId}:status`, 'completed');
    logger.info(`Task completed: ${taskId}`);
  } catch (error) {
    logger.error(`Task failed: ${taskId}, ${error.message}`);
    await redisConnection.set(`task:${taskId}:status`, 'failed');
  }
}, { connection: redisConnection });

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} has failed with ${err.message}`);
});

logger.info('Worker started and listening for jobs...');
