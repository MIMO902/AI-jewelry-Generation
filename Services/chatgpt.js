import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from .env

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enhance the prompt using GPT
 * @param {string} prompt - The original user prompt
 * @returns {Promise<string>} - The improved prompt
 */
export async function improvePrompt(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // fallback to universally accessible model
      messages: [
        { role: "system", content: "You are a jewelry design assistant." },
        { role: "user", content: `Improve this jewelry design prompt: ${prompt}` }
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ ChatGPT API error:", err.message);
    return "Prompt improvement failed.";
  }
}

/**
 * Suggest mesh settings based on the jewelry description
 * @param {string} prompt - The prompt describing the jewelry
 * @returns {Promise<string>} - The suggested mesh parameters
 */
export async function getMeshSettings(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a jewelry 3D mesh advisor." },
        { role: "user", content: `Suggest smoothing level, reconstruction depth, and simplification for: ${prompt}` }
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ ChatGPT API error:", err.message);
    return "Mesh suggestion failed.";
  }
}
