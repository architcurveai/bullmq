import { GoogleGenerativeAI } from '@google/generative-ai'; // Use this one!

import logger from '../utils/logger.js';
import semaphore from '../utils/semaphore.js';

// Initialize with the correct class name
const ai = new GoogleGenerativeAI({ apiKey: "AIzaSyAn_qxo8vzJPh0nESxGB_1zuhE8MD1Iuk0" });

export async function generateText(prompt) {
  return semaphore.run(async () => {
    logger.info('Acquired semaphore, calling Gemini API...');
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      const response = await result.response;
      console.log(response);
      return response.text();
    } catch (error) {
      logger.error(`Gemini API Error: ${error.message}`);
      throw error;
    }
  });
}

export default { generateText };