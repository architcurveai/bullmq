module.exports = {
  apps: [
    {
      name: 'llm-api',
      script: './src/api/server.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: ['./src/api', './src/services', './src/dashboard'],
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env', // Add this line
    },
    {
      name: 'llm-worker',
      script: './src/worker/llmWorker.js',
      instances: 3,
      watch: ['./src/worker', './src/services', './src/dashboard'],
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env', // Add this line
    },
  ],
};
