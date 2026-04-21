import OpenAI from "openai";
import { config } from "../../../config.js";
import { AIProvider } from "../types.ts";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI | null = null;

  constructor() {
    if (config.OPENAI_API_KEY) {
      this.client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    }
  }

  async generateContent(prompt: string): Promise<any> {
    if (!this.client) throw new Error("OpenAI API key not configured");

    const response = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from OpenAI");
    return JSON.parse(content);
  }
}
