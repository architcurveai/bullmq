# LLM API and Worker Service

## Description

This project provides an API and worker service for processing Large Language Model (LLM) prompts using BullMQ for queue management, Redis for data storage, and Google Gemini for LLM interactions. The API exposes endpoints for submitting prompts, while the worker processes these prompts in the background. A dashboard is also included for monitoring the queues.

## Features

*   **API for submitting LLM prompts:** Allows users to submit prompts for processing.
*   **Background processing of prompts:** Uses BullMQ to queue and process prompts asynchronously.
*   **Redis for data storage:** Stores queue data and other relevant information in Redis.
*   **Google Gemini integration:** Leverages the Google Gemini API for LLM interactions.
*   **PM2 process management:** Uses PM2 for managing the API and worker processes in production.
*   **BullMQ Dashboard:** Provides a web interface for monitoring and managing BullMQ queues.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd llm
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the project root with the following variables:

    ```
    API_PORT=3000
    REDIS_HOST=<redis_host>
    REDIS_PORT=<redis_port>
    REDIS_PASSWORD=<redis_password>
    GOOGLE_API_KEY=<google_api_key>
    ```

    Replace the placeholders with your actual values.

## Configuration

The application can be configured using environment variables. The following variables are available:

*   `API_PORT`: The port on which the API server will listen (default: 3000).
*   `REDIS_HOST`: The hostname or IP address of the Redis server.
*   `REDIS_PORT`: The port number of the Redis server.
*   `REDIS_PASSWORD`: The password for the Redis server.
*   `GOOGLE_API_KEY`: The API key for the Google Gemini API.

## Usage

1.  **Start the Redis server:**

    Ensure that the Redis server is running and accessible.

2.  **Start the API and worker processes:**

    Use PM2 to manage the application:

    ```bash
    pm2 start ecosystem.config.cjs
    ```

3.  **Access the API:**

    The API server will be running on the configured port (default: 3000). You can access the API endpoints at `http://localhost:3000/api`.

4.  **Access the BullMQ Dashboard:**

    The BullMQ dashboard is available at `http://localhost:3000/admin/queues`.

## Microservice Deployment

This project can be deployed as a microservice on any platform that supports Node.js and PM2. To deploy the application, follow these steps:

1.  **Build the application:**

    ```bash
    npm install
    ```

2.  **Configure environment variables:**

    Set the environment variables required for the application to run.

3.  **Deploy the application:**

    Use PM2 to manage the application:

    ```bash
    pm2 start ecosystem.config.cjs
    ```

## API Endpoints

The following API endpoints are available:

*   `POST /api/llmPrompt`: Submits a new LLM prompt for processing.

## Task Status and Monitoring

The status of tasks can be monitored via the API. The following statuses are available:

*   `queued`: The task has been enqueued and is waiting to be processed.
*   `processing`: The task is currently being processed by a worker.
*   `completed`: The task has been successfully completed.
*   `failed`: The task has failed to complete.

## Monitoring Task Status

To check the status of a task, use the following API endpoint:

`GET /api/llmPrompt/:taskId`

This endpoint will return a JSON object with the following properties:

*   `taskId`: The ID of the task.
*   `status`: The current status of the task.
*   `response`: The response from the LLM, if the task has completed successfully.

## Handling Task Failures

If a task fails, the `status` property will be set to `failed`. The reason for the failure can be found in the logs of the worker process.

## Dashboard

The BullMQ dashboard provides a web interface for monitoring and managing BullMQ queues. You can use the dashboard to:

*   View the status of queues.
*   Inspect jobs in the queues.
*   Retry or remove jobs.
*   Pause or resume queues.

The dashboard is available at `http://localhost:3000/admin/queues`.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

ISC
