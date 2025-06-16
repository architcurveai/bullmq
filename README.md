Start the API and Workers: Use PM2 to manage the application.


pm2 start ecosystem.config.js


Check Status: You can monitor the processes using:


pm2 list
pm2 logs



PS C:\jee_module\LLM> node clearQueue.js
REDIS_HOST: redis-12569.c61.us-east-1-3.ec2.redns.redis-cloud.com
REDIS_PORT: 12569
REDIS_PASSWORD: ******
[11:18:23.523] INFO (24948): Connecting to queue: llm-prompts
IMPORTANT! Eviction policy is volatile-lru. It should be "noeviction"
[11:18:24.886] INFO (24948): Successfully obliterated all tasks in the 'llm-prompts' queue.



C:\jee_module\LLM> pm2 stop all
[PM2] Applying action stopProcessId on app [all](ids: [ 0, 1, 2, 3 ])
[PM2] [llm-worker](1) ✓
[PM2] [llm-api](0) ✓
[PM2] [llm-worker](2) ✓
[PM2] [llm-worker](3) ✓
┌────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ llm-api       │ default     │ 1.0.0   │ cluster │ 0        │ 0      │ 213  │ stopped   │ 0%       │ 0b       │ Dell     │ disabled │
│ 1  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 0        │ 0      │ 3    │ stopped   │ 0%       │ 0b       │ Dell     │ disabled │
│ 2  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 0        │ 0      │ 3    │ stopped   │ 0%       │ 0b       │ Dell     │ disabled │
│ 3  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 0        │ 0      │ 3    │ stopped   │ 0%       │ 0b       │ Dell     │ disabled │
└────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘




PS C:\jee_module\LLM> pm2 start ecosystem.config.cjs
[PM2] Applying action restartProcessId on app [llm-worker](ids: [ 1, 2, 3 ])
[PM2] Applying action restartProcessId on app [llm-api](ids: [ 0 ])
[PM2] [llm-worker](1) ✓
[PM2] [llm-worker](2) ✓
[PM2] [llm-api](0) ✓
[PM2] [llm-worker](3) ✓
┌────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ llm-api       │ default     │ 1.0.0   │ cluster │ 13940    │ 1s     │ 168  │ online    │ 34.4%    │ 56.8mb   │ Dell     │ disabled │
│ 1  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 19828    │ 1s     │ 1    │ online    │ 45.3%    │ 67.9mb   │ Dell     │ enabled  │
│ 2  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 22276    │ 1s     │ 1    │ online    │ 37.5%    │ 64.5mb   │ Dell     │ enabled  │
│ 3  │ llm-worker    │ default     │ 1.0.0   │ cluster │ 28860    │ 0s     │ 1    │ online    │ 59.3%    │ 50.1mb   │ Dell     │ enabled  │
└────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘




You need to explicitly tell PM2 to stop the applications.

PowerShell

# To stop all running applications/task/worker
pm2 stop all

# To restart all applications/task/worker (useful after changing .env)
pm2 restart all

# To completely remove them from PM2's list
pm2 delete all




How it works (simplified):

When a worker process starts, it initializes the BullMQ Worker instance.
BullMQ establishes a connection to Redis.
The worker enters an event loop. It waits for messages from Redis (new jobs, job updates, etc.).
When a job is available and a lock is acquired, the worker's handler function (your custom logic) is executed.
Because Node.js is single-threaded for JavaScript execution, a single worker process processes one job at a time. However, due to Node.js's non-blocking I/O, if your job involves network calls (e.g., downloading an image) or database queries, the worker won't sit idle during those waits; it can briefly context-switch to handle other internal events while waiting for the I/O operation to complete.




Note  : To check particular port  : 

netstat -ano | findstr :3000

TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING       16332
TCP    [::1]:3000             [::]:0                 LISTENING       16332
TCP    [::1]:3000             [::1]:61630            ESTABLISHED     16332
TCP    [::1]:61630            [::1]:3000             ESTABLISHED     1772

Note : check PID
tasklist /FI "PID eq 16332"

Note : kill PID
taskkill /PID 16332 /F

Note : Now port is Free to user 
