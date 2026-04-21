import OpenAI from "openai";
import { config } from "../../../config.js";
import { AIProvider } from "../types.ts";

export class OpenRouterProvider implements AIProvider {
  name = "openrouter";
  private client: OpenAI | null = null;

  constructor() {
    if (config.OPENROUTER_API_KEY) {
      this.client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: config.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": config.FRONTEND_URL, // Optional, for OpenRouter rankings
          "X-Title": "Branda", // Optional
        }
      });
    }
  }

  async generateContent(prompt: string): Promise<any> {
    if (!this.client) throw new Error("OpenRouter API key not configured");

    const response = await this.client.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Or some other model available through OpenRouter
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenRouter");
    return JSON.parse(content);
  }
}
