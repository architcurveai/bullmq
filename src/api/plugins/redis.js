import fp from 'fastify-plugin';
import Redis from 'ioredis';

async function redisPlugin(fastify, options) {
  console.log('Connecting to Redis at:', process.env.REDIS_HOST, 'port:', process.env.REDIS_PORT);
  
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxmemoryPolicy: 'noeviction',
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

  redis.on('connect', () => {
    console.log('Successfully connected to Redis');
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', (instance, done) => {
    instance.redis.quit(done);
  });
}

export default fp(redisPlugin);
