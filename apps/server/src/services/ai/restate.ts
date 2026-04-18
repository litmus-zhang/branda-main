import * as restate from "@restatedev/restate-sdk";
import { Type } from "@google/genai";
import { AIPayload, AIProvider } from "./types.js";
import { GeminiProvider } from "./providers/gemini.js";
import { OpenAIProvider } from "./providers/openai.js";
import { AnthropicProvider } from "./providers/anthropic.js";
import { OpenRouterProvider } from "./providers/openrouter.js";

// The business plan schema from direct Gemini implementation
const businessPlanSchema = {
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
              url: { type: Type.STRING }
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
};

// Orchestrator Service
export const aiService = restate.service({
  name: "aiService",
  handlers: {
    async generateBusinessPlan(ctx: restate.Context, data: AIPayload) {
      const providers: AIProvider[] = [
        new GeminiProvider(),
        new OpenAIProvider(),
        new AnthropicProvider(),
        new OpenRouterProvider()
      ];

      const prompt = `
        You are an expert business consultant and brand strategist.
        Create a comprehensive business startup package for a new entrepreneur.
        
        Business Details:
        - Niche/Industry: ${data.niche}
        - Business Name Idea: ${data.businessName || "Suggest a creative name"}
        - Specific Details: ${data.details}
        - Country of Operations: ${data.country}

        Generate a complete JSON response according to the requested schema.
      `;

      // Failover logic
      for (const provider of providers) {
        try {
          console.log(`Attempting generation with provider: ${provider.name}`);
          
          // Use ctx.run to track the external call and provide durability
          const result = await ctx.run(`call-${provider.name}`, () => 
            provider.generateContent(prompt, businessPlanSchema)
          );

          if (result) {
            console.log(`Successfully generated plan with ${provider.name}`);
            return result;
          }
        } catch (error) {
          console.error(`Provider ${provider.name} failed:`, error);
          // Continue to next provider
        }
      }

      throw new Error("All AI providers failed to generate a response.");
    }
  }
});
