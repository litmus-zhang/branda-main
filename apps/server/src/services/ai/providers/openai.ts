import OpenAI from "openai";
import { config } from "../../../config.js";
import { AIProvider } from "../types.ts";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI | null = null;

  constructor() {
    if (config.OPENROUTER_API_KEY) {
      this.client = new OpenAI({ apiKey: config.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });
    }
  }

  async generateContent(prompt: string, schema?: any): Promise<any> {
    if (!this.client) throw new Error("OPENROUTER_API_KEY not configured");

    const response = await this.client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      response_format: schema ? {
        type: "json_schema",
        json_schema: {
          name: "business_plan",
          strict: false, // Some schemas might have complex requirements
          schema: this.convertToStandardJsonSchema(schema)
        }
      } : { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");
    return JSON.parse(content);
  }

  private convertToStandardJsonSchema(schema: any): any {
    // If it's already a standard JSON schema, return it
    // If it's the Gemini-style schema, we need to convert Type enums to strings
    if (!schema) return null;

    const convert = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const newObj: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (key === 'type' && typeof obj[key] === 'string' && (obj[key] === 'OBJECT' || obj[key] === 'STRING' || obj[key] === 'ARRAY' || obj[key] === 'NUMBER' || obj[key] === 'BOOLEAN')) {
          newObj[key] = obj[key].toLowerCase();
        } else if (key === 'type' && typeof obj[key] === 'number') {
          // Handle Gemini Type enum
          const types = ['unspecified', 'string', 'number', 'integer', 'boolean', 'array', 'object'];
          newObj[key] = types[obj[key]] || 'object';
        } else {
          newObj[key] = convert(obj[key]);
        }
      }
      return newObj;
    };

    const standard = convert(schema);
    // OpenAI requires additional properties for strict mode if used, but we'll keep it simple
    return standard;
  }
}
