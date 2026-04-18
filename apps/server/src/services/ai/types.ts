export interface AIProvider {
  name: string;
  generateContent(prompt: string, schema?: any): Promise<any>;
}

export interface AIPayload {
  niche: string;
  businessName: string;
  details: string;
  country: string;
}
