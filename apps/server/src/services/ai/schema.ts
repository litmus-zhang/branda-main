import { z } from "zod";
import { Type } from "@google/genai";

/**
 * Gemini-compatible schema definition.
 */
export const GeminiBusinessPlanSchema = {
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
              status: { type: Type.STRING },
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

/**
 * Unified Business Plan Schema using Zod for validation and transformation.
 */
export const BusinessPlanSchema = z.object({
  brandIdentity: z.object({
    name: z.string(),
    slogan: z.string(),
    mission: z.string(),
    vision: z.string(),
    colors: z.array(z.string()),
    fonts: z.array(z.string()),
    logoConcept: z.string(),
    logoSvg: z.string().describe("Raw SVG code string for the logo"),
    toneOfVoice: z.string(),
  }),
  marketing: z.object({
    targetAudience: z.string(),
    keyChannels: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })),
    strategy: z.string(),
    contentIdeas: z.array(z.object({
      title: z.string(),
      description: z.string(),
      type: z.string(),
    })),
  }),
  systems: z.object({
    sops: z.array(z.object({
      title: z.string(),
      steps: z.array(z.string()),
    })),
    techStackRecommendation: z.array(z.object({
      category: z.string(),
      tool: z.string(),
      reason: z.string(),
    })),
  }),
  crm: z.object({
    onboardingProcess: z.array(z.object({
      step: z.string(),
      description: z.string()
    })),
    mockCustomers: z.array(z.object({
      name: z.string(),
      status: z.enum(["Lead", "Active", "Churned"]),
      email: z.string(),
    })),
  }),
  funding: z.object({
    ventureFunds: z.array(z.object({
      name: z.string(),
      focus: z.string(),
      website: z.string(),
    })),
    grants: z.array(z.object({
      name: z.string(),
      amount: z.string(),
      deadline: z.string(),
      website: z.string(),
    })),
  }),
});

export type BusinessPlan = z.infer<typeof BusinessPlanSchema>;

/**
 * Normalizer function to handle deviated LLM outputs.
 * This is a scalable way to handle legacy or deviated formats.
 */
export function normalizeBusinessPlan(raw: any): BusinessPlan {
  // Deep clone to avoid mutating the original object if it comes from a cache
  let data = JSON.parse(JSON.stringify(raw));

  // Handle the specific OpenRouter/Legacy deviation provided by the user
  // The structure provided starts with an array containing an object with startup_package
  if (Array.isArray(data)) {
    data = data[0];
  }

  // Pre-cleaning for common LLM deviations
  if (data?.crm?.mockCustomers && Array.isArray(data.crm.mockCustomers)) {
    data.crm.mockCustomers = data.crm.mockCustomers.map((c: any) => {
      const status = c.status?.charAt(0).toUpperCase() + c.status?.slice(1).toLowerCase();
      const validStatuses = ["Lead", "Active", "Churned"];
      if (!validStatuses.includes(status)) {
        // Map common synonyms or default to Lead
        if (status === "Prospect") return { ...c, status: "Lead" };
        if (status === "Current") return { ...c, status: "Active" };
        if (status === "Lost") return { ...c, status: "Churned" };
        return { ...c, status: "Lead" };
      }
      return { ...c, status };
    });
  }

  // If it's a legacy startup_package format, map it
  if (data?.startup_package) {
    const pkg = data.startup_package;
    const p1 = pkg.phase_1_brand_strategy;
    const p2 = pkg.phase_2_go_to_market_strategy;
    const p3 = pkg.phase_3_financial_projections;
    const p4 = pkg.phase_4_operational_plan;

    return {
      brandIdentity: {
        name: data.business_name || p1.brand_positioning?.name || "Business Name",
        slogan: p1.brand_positioning?.tagline_options?.[0] || "Innovation through excellence",
        mission: p1.brand_positioning?.value_proposition || "To provide excellent service",
        vision: "To be a leader in the industry",
        colors: p1.brand_identity_guidelines?.color_palette?.primary_colors || ["#000000"],
        fonts: [p1.brand_identity_guidelines?.typography?.primary_font || "Arial"],
        logoConcept: p1.brand_identity_guidelines?.logo_suggestions?.[0] || "Minimalist logo",
        logoSvg: "<svg></svg>", // Default if missing
        toneOfVoice: p1.brand_positioning?.brand_voice || "Professional",
      },
      marketing: {
        targetAudience: p1.market_analysis?.target_audience?.join(", ") || "General",
        keyChannels: (p2.marketing_channels || []).map((ch: string) => ({ name: ch, url: "#" })),
        strategy: p1.brand_positioning?.value_proposition || "Market expansion",
        contentIdeas: [], // Map if available
      },
      systems: {
        sops: (p4.metrics_and_reporting || []).map((m: string) => ({ title: m, steps: ["Review", "Report"] })),
        techStackRecommendation: (p4.technology_infrastructure || []).map((t: string) => ({ category: "Infrastructure", tool: t, reason: "Requirement" })),
      },
      crm: {
        onboardingProcess: (p2.sales_strategy?.sales_process || "").split("->").map((s: string) => ({ step: s.trim(), description: s.trim() })),
        mockCustomers: data.crm?.mockCustomers || [],
      },
      funding: {
        ventureFunds: (p3.funding_sources || []).map((s: string) => ({ name: s, focus: "General", website: "#" })),
        grants: [],
      }
    } as BusinessPlan;
  }

  // Final validation attempt
  const parseResult = BusinessPlanSchema.safeParse(data);
  if (parseResult.success) return parseResult.data;

  throw new Error("Unable to normalize LLM output to BusinessPlan schema: " + JSON.stringify(parseResult.error?.format()));
}
