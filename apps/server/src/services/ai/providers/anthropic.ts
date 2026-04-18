import Anthropic from "@anthropic-ai/sdk";
import { config } from "../../../config.js";
import { AIProvider } from "../types.js";

export class AnthropicProvider implements AIProvider {
  name = "claude";
  private client: Anthropic | null = null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    }
  }

  async generateContent(prompt: string): Promise<any> {
    if (!this.client) throw new Error("Anthropic API key not configured");

    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt + "\n\nOutput only a valid JSON object." }],
    });

    const content = response.content[0];
    if (content!.type !== "text") throw new Error("Unexpected response type from Claude");
    
    // Attempt to extract JSON if it's wrapped in markers
    const jsonStr = content!.text!.match(/\{[\s\S]*\}/)?.[0] || content!.text!;
    return JSON.parse(jsonStr);
  }
}
