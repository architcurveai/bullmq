import { Semaphore } from 'async-mutex';

const concurrency = parseInt(process.env.GEMINI_CONCURRENCY, 10) || 3;
const semaphore = new Semaphore(concurrency);

// Create a wrapper to match the p-semaphore API
const semaphoreWrapper = {
  async run(fn) {
    const [value, release] = await semaphore.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
};

export default semaphoreWrapper;