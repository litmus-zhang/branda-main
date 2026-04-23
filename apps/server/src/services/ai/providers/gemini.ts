import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../../../config.js";
import { AIProvider } from "../types.ts";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  }

  async generateContent(prompt: string, schema?: any): Promise<any> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return {
      content: JSON.parse(text),
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0
      }
    };
  }
}
