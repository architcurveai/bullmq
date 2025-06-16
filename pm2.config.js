export default {
  apps: [
    {
      name: 'llm-api',
      script: './src/api/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'llm-worker',
      script: './src/worker/llmWorker.js',
      instances: 3,
      watch: ['./src/worker', './src/services'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
