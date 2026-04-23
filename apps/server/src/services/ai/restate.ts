import * as restate from "@restatedev/restate-sdk";
import { TerminalError } from "@restatedev/restate-sdk";
import { AIPayload, AIProvider } from "./types.ts";
import { GeminiProvider } from "./providers/gemini.ts";
import { OpenAIProvider } from "./providers/openai.ts";
import { AnthropicProvider } from "./providers/anthropic.ts";
import { OpenRouterProvider } from "./providers/openrouter.ts";
import { GeminiBusinessPlanSchema, normalizeBusinessPlan } from "./schema.ts";
import { opik } from "../opik.ts";
// Orchestrator Service
export const aiService = restate.service({
  name: "aiService",
  handlers: {
    async generateBusinessPlan(ctx: restate.Context, data: AIPayload) {
      const trace = opik.trace({
        name: "generateBusinessPlan",
        input: { niche: data.niche, country: data.country, details: data.details },
      });

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
        const span = trace.span({
          name: `call-${provider.name}`,
          input: { provider: provider.name, prompt },
        });

        const startTime = Date.now();

        try {
          const result = await ctx.run(
            `call-${provider.name}`,
            () => provider.generateContent(prompt, GeminiBusinessPlanSchema),
            { maxRetryAttempts: 2 }
          );

          if (result) {
            try {
              const { content, usage } = result;
              const normalized = normalizeBusinessPlan(content);

              span.update({
                output: normalized,
                usage: {
                  prompt_tokens: usage.promptTokens,
                  completion_tokens: usage.completionTokens,
                  total_tokens: usage.totalTokens,
                },
                metadata: { latency: Date.now() - startTime }
              });
              span.end();

              trace.update({
                output: normalized,
                metadata: {
                  prompt_tokens: usage.promptTokens,
                  completion_tokens: usage.completionTokens,
                  total_tokens: usage.totalTokens,
                }
              });

              // --- QUICK QUALITY/HALLUCINATION CHECK ---
              const isLowQuality = !normalized.brandIdentity.name || normalized.brandIdentity.mission.length < 20;

              trace.score({
                name: "hallucination_flag",
                value: isLowQuality ? 1 : 0, // 1 means flagged
                reason: isLowQuality ? "Response missing core brand identity or mission too short" : "Structural check passed"
              });

              trace.end();

              return normalized;
            } catch (normErr) {
              ctx.console.warn(`Provider ${provider.name} returned invalid structure, failing over`, normErr);
              span.score({
                name: "hallucination_flag",
                value: 1,
                reason: `Provider ${provider.name} returned invalid structure, failing over`,
              });
              span.end();
              lastError = normErr;
              continue; // Try next provider
            }
          }
        } catch (err) {
          ctx.console.warn(`Provider ${provider.name} failed, failing over`, err);
          span.update({
            metadata: { error: (err as Error).message },
            errorInfo: {
              message: (err as Error).message,
              traceback: (err as Error).stack || `Provider ${provider.name} failed, failing over`,
              exceptionType: (err as Error).constructor.name,
            }
          });
          span.end();
          lastError = err;
        }
      }

      trace.update({
        metadata: { status: "FAILED_ALL_PROVIDERS" },
        errorInfo: {
          message: `All AI providers failed: ${(lastError as Error)?.message ?? "unknown"}`,
          traceback: (lastError as Error)?.stack || "Error",
          exceptionType: (lastError as Error)?.constructor.name || "Error",
        }
      });
      trace.end();

      throw new TerminalError(
        `All AI providers failed: ${(lastError as Error)?.message ?? "unknown"}`
      );
    },
  }
});
