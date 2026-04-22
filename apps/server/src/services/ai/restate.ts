import * as restate from "@restatedev/restate-sdk";
import { TerminalError } from "@restatedev/restate-sdk";
import { AIPayload, AIProvider } from "./types.ts";
import { GeminiProvider } from "./providers/gemini.ts";
import { OpenAIProvider } from "./providers/openai.ts";
import { AnthropicProvider } from "./providers/anthropic.ts";
import { OpenRouterProvider } from "./providers/openrouter.ts";
import { GeminiBusinessPlanSchema, normalizeBusinessPlan } from "./schema.ts";



// Orchestrator Service
export const aiService = restate.service({
  name: "aiService",
  handlers: {
    async generateBusinessPlan(ctx: restate.Context, data: AIPayload) {
      const providers: AIProvider[] = [
        new GeminiProvider(),
        new OpenRouterProvider(),
        new AnthropicProvider(),
        new OpenAIProvider(),
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
      let lastError: unknown;
      for (const provider of providers) {
        try {
          // Bound per-provider retries so we actually fail over instead of
          // retrying one provider forever.
          const result = await ctx.run(
            `call-${provider.name}`,
            () => provider.generateContent(prompt, GeminiBusinessPlanSchema),
            { maxRetryAttempts: 2 }
          );

          if (result) {
            try {
              const normalized = normalizeBusinessPlan(result);
              return normalized;
            } catch (normErr) {
              ctx.console.warn(`Provider ${provider.name} returned invalid structure, failing over`, normErr);
              lastError = normErr;
              continue; // Try next provider
            }
          }
        } catch (err) {
          // Both transient (after retries exhausted → TerminalError) and
          // terminal errors land here; try the next provider.
          lastError = err;
          ctx.console.warn(`Provider ${provider.name} failed, failing over`, err);
        }
      }

      throw new TerminalError(
        `All AI providers failed: ${(lastError as Error)?.message ?? "unknown"}`
      );
    },
  }
});
