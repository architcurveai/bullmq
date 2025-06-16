import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import logger from '../utils/logger.js';
import semaphore from '../utils/semaphore.js';

// Initialize with the correct class name
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function generateText(prompt) {
  return semaphore.run(async () => {
    logger.info(`Acquired semaphore, calling Gemini API with prompt: ${prompt}`);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      const response = await result.text;
      logger.info(`Gemini API Response: ${response}`);
      return response;
    } catch (error) {
      logger.error(`Gemini API Error: ${error.message}, ${error.stack}`);
      logger.error(`Gemini API Error: ${JSON.stringify(error.response ? error.response.data : error)}`);
      throw error;
    }
  });
}

export default { generateText };
