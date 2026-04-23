import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { Opik } from "opik";
import { BusinessPlan } from '@/lib/types';

const opik = new Opik({
  projectName: "branda-chat-ai",
  apiKey: process.env.OPIK_API_KEY,
  workspaceName: process.env.OPIK_WORKSPACE,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, workspaceContext } = await req.json() as { messages: UIMessage[], workspaceContext: BusinessPlan };

  const trace = opik.trace({
    name: "chatInteraction",
    input: { messages, workspaceId: workspaceContext.id },
    metadata: { workspaceContext } // Critical for hallucination detection
  });

  const result = await streamText({
    model: "mistral/ministral-3b",
    system: `
      You are an elite AI Co-Founder and business consultant. 
      Your goal is to help the user brainstorm and refine their business idea.
      
      You have FULL ACCESS to the current workspace details provided below. 
      Use this context to give highly specific, actionable, and relevant advice.
      If the user's request contradicts the established plan, ask them if they want to pivot or update the plan.
      
      WORKSPACE CONTEXT:
      ${JSON.stringify(workspaceContext, null, 2)}
    `,
    messages: await convertToModelMessages(messages),
    maxRetries: 2,
    onFinish: ({ text, usage }) => {
      trace.update({
        output: { text },
        metadata: {
          prompt_tokens: usage.inputTokens,
          completion_tokens: usage.outputTokens,
          output_token_details: usage.outputTokenDetails,
          total_tokens: usage.totalTokens,
        },
        
      });
      trace.end();
    }
  });

  return result.toUIMessageStreamResponse();
}
