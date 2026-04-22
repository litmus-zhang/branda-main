import { BusinessPlan } from '@/lib/types';
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, workspaceContext } = await req.json() as { messages: UIMessage[], workspaceContext: BusinessPlan };

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
  });

  return result.toUIMessageStreamResponse();
}
