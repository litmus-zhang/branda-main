import { GoogleGenAI, Type } from "@google/genai";
import { BusinessPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBusinessPlan = async (data: {
  niche: string;
  businessName: string;
  details: string;
  country: string;
}): Promise<BusinessPlan> => {
  const prompt = `
    You are an expert business consultant and brand strategist.
    Create a comprehensive business startup package for a new entrepreneur.
    
    Business Details:
    - Niche/Industry: ${data.niche}
    - Business Name Idea: ${data.businessName || "Suggest a creative name"}
    - Specific Details: ${data.details}
    - Country of Operations: ${data.country}

    Generate a complete JSON response containing:
    1. Brand Identity: 
       - Name, slogan, mission, vision, color palette hex codes, font recommendations, tone of voice.
       - Logo Concept: A text description of the logo.
       - Logo SVG: A minimal, professional, and modern SVG code string for the logo. Ensure the SVG has a viewBox, uses the suggested colors, and looks good. Do not use external images.
    2. Marketing Strategy: Target audience profile, best channels (provide channel name only, e.g. "Instagram"), general strategy summary, 5 specific content ideas.
    3. Operational Systems: 3 key Standard Operating Procedures (SOPs) with steps, recommended tech stack.
    4. CRM Setup: Customer onboarding process steps, and 3 mock customer profiles.
    5. Funding & Grants: List 3 relevant venture capital firms or angel networks and 3 specific government or private grants available in ${data.country} for this niche.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brandIdentity: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                slogan: { type: Type.STRING },
                mission: { type: Type.STRING },
                vision: { type: Type.STRING },
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                fonts: { type: Type.ARRAY, items: { type: Type.STRING } },
                logoConcept: { type: Type.STRING },
                logoSvg: { type: Type.STRING, description: "Raw SVG code string for the logo" },
                toneOfVoice: { type: Type.STRING },
              },
              required: ["name", "slogan", "mission", "vision", "colors", "fonts", "logoConcept", "logoSvg", "toneOfVoice"]
            },
            marketing: {
              type: Type.OBJECT,
              properties: {
                targetAudience: { type: Type.STRING },
                keyChannels: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            url: { type: Type.STRING, description: "Leave empty string"}
                        },
                        required: ["name", "url"]
                    } 
                },
                strategy: { type: Type.STRING },
                contentIdeas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING }
                    },
                    required: ["title", "description", "type"]
                  }
                }
              },
              required: ["targetAudience", "keyChannels", "strategy", "contentIdeas"]
            },
            systems: {
              type: Type.OBJECT,
              properties: {
                sops: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "steps"]
                  }
                },
                techStackRecommendation: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      tool: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    },
                    required: ["category", "tool", "reason"]
                  }
                }
              },
              required: ["sops", "techStackRecommendation"]
            },
            crm: {
              type: Type.OBJECT,
              properties: {
                onboardingProcess: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["step", "description"]
                  }
                },
                mockCustomers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      status: { type: Type.STRING, enum: ["Lead", "Active", "Churned"] },
                      email: { type: Type.STRING }
                    },
                    required: ["name", "status", "email"]
                  }
                }
              },
              required: ["onboardingProcess", "mockCustomers"]
            },
            funding: {
              type: Type.OBJECT,
              properties: {
                ventureFunds: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      website: { type: Type.STRING }
                    },
                    required: ["name", "focus", "website"]
                  }
                },
                grants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      deadline: { type: Type.STRING },
                      website: { type: Type.STRING }
                    },
                    required: ["name", "amount", "deadline", "website"]
                  }
                }
              },
              required: ["ventureFunds", "grants"]
            }
          },
          required: ["brandIdentity", "marketing", "systems", "crm", "funding"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as BusinessPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};