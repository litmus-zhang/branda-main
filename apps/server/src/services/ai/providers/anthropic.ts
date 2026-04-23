import Anthropic from "@anthropic-ai/sdk";
import { config } from "../../../config.js";
import { AIProvider } from "../types.ts";

export class AnthropicProvider implements AIProvider {
  name = "claude";
  private client: Anthropic | null = null;

  constructor() {
    if (config.OPENROUTER_API_KEY) {
      this.client = new Anthropic({ apiKey: config.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });
    }
  }

  async generateContent(prompt: string, schema?: any): Promise<any> {
    if (!this.client) throw new Error("OPENROUTER_API_KEY not configured");

    const schemaInstruction = schema
      ? `\n\nYour output MUST be a valid JSON object strictly following this structure: ${JSON.stringify(schema)}`
      : "\n\nOutput only a valid JSON object.";

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt + schemaInstruction }],
    });

    const content = response.content[0];
    if (content!.type !== "text") throw new Error("Unexpected response type from Claude");

    const jsonStr = content!.text!.match(/\{[\s\S]*\}/)?.[0] || content!.text!;
    return JSON.parse(jsonStr);
  }
}
