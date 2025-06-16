// src/plugins/llmClient.js
import fp from 'fastify-plugin';
import axios from 'axios';

async function llmClient(fastify, opts) {
  const client = axios.create({
    baseURL: process.env.LLM_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });

  fastify.decorate('llmClient', client);
}

export default fp(llmClient);
