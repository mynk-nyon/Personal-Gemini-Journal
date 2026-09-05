import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. Gemini API calls will fail.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing-key");

// Use a production-suitable model for chat
export const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  }
});

// Use a production-suitable model for structured JSON outputs (Journal Summaries)
export const summaryModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.2, // Lower temperature for more deterministic JSON output
    responseMimeType: "application/json",
  }
});
