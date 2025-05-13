import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();  // Load .env variables

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function improvePrompt(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",  // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a jewelry design assistant." },
        { role: "user", content: `Improve this jewelry design prompt: ${prompt}` }
      ],
    });

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ ChatGPT API error:", err.message);
    return "Prompt improvement failed.";
  }
}
export async function getMeshSettings(prompt) {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a jewelry 3D mesh advisor." },
        { role: "user", content: `Suggest smoothing level, reconstruction depth, and simplification for: ${prompt}` }
      ]
    });
    return response.data.choices[0].message.content;
  }