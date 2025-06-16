// // geminiCall.js
// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config({ path: "../../.env" });

// const apiKey = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenAI({ apiKey });

// async function main() {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: "Explain how AI works in a few words",
//     });
//     console.log(response.text);
//   } catch (err) {
//     console.error("❌ Error:", err.message || err);
//   }
// }

// main();
