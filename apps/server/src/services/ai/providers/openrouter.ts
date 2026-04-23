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

  async generateContent(prompt: string, schema?: any): Promise<any> {
    if (!this.client) throw new Error("OpenRouter API key not configured");

    const response = await this.client.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Or some other model available through OpenRouter
      messages: [{ role: "user", content: prompt }],
      response_format: schema ? {
        type: "json_schema",
        json_schema: {
          name: "business_plan",
          schema: this.convertToStandardJsonSchema(schema)
        }
      } : { type: "json_object" },
    });

    const content = response.choices[0]?.message.content;
    if (!content) throw new Error("No response from OpenRouter");
    return JSON.parse(content);
  }

  private convertToStandardJsonSchema(schema: any): any {
    if (!schema) return null;
    const convert = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      const newObj: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (key === 'type' && typeof obj[key] === 'number') {
           const types = ['unspecified', 'string', 'number', 'integer', 'boolean', 'array', 'object'];
           newObj[key] = types[obj[key]] || 'object';
        } else {
          newObj[key] = convert(obj[key]);
        }
      }
      return newObj;
    };
    return convert(schema);
  }
}
