import { createOpenAI } from "@ai-sdk/openai";

const aiClient = createOpenAI({
  apiKey: process.env.OPEN_AI_API_COMPATIBLE_KEY,
  baseURL: process.env.OPEN_AI_BASE_COMPATIBLE_URL,
});

export default aiClient;
