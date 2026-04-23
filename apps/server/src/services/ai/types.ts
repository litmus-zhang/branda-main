export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIResponse {
  content: any;
  usage: AIUsage;
}

export interface AIProvider {
  name: string;
  generateContent(prompt: string, schema?: any): Promise<AIResponse>;
}

export interface AIPayload {
  niche: string;
  businessName: string;
  details: string;
  country: string;
}
