// testGeminiAPI.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; // For securely loading API key

dotenv.config(); // Load environment variables from .env file

// IMPORTANT: Replace with your actual API key or load from environment variable
// It's highly recommended to use an environment variable for security
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAn_qxo8vzJPh0nESxGB_1zuhE8MD1Iuk0"; // Your actual key or load from process.env

if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY === "AIzaSyAn_qxo8vzJPh0nESxGB_1zuhE8MD1Iuk0") { // Added your specific key for check
    console.error("Error: API Key is not set or is still the placeholder. Please set GEMINI_API_KEY in your .env file or replace the placeholder.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI({ apiKey: API_KEY });

async function runTest() {
  try {
    console.log("Attempting to connect to Gemini API with provided key...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for a simpler test

    const prompt = "Say hi.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("SUCCESS! API Response:", text);
  } catch (error) {
    console.error("API Test FAILED!");
    console.error("Error details:", error.message);
    if (error.response && error.response.status) {
        console.error("HTTP Status Code:", error.response.status);
    }
    if (error.response && error.response.data) {
        console.error("API Error Response Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.error("\nPossible reasons for 'API key not valid' (400 Bad Request):");
    console.error("1. API Key is invalid or has expired.");
    console.error("2. API Key is restricted (IP address, HTTP referrer) and the request is not matching restrictions.");
    console.error("3. Billing is not enabled or there are billing issues on your Google Cloud Project.");
    console.error("4. The Generative Language API is not enabled for your project.");
    console.error("5. You're trying to use a model that isn't available or enabled for your region/project.");
  }
}

runTest();