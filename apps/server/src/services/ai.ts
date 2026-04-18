import * as restate from "@restatedev/restate-sdk-clients";
import { config } from "../config.js";
import { aiService } from "./ai/restate.js";

export const generateBusinessPlan = async (data: {
  niche: string;
  businessName: string;
  details: string;
  country: string;
}) => {
  const rs = restate.connect({ url: config.RESTATE_URL });
  
  try {
    const plan = await rs.serviceClient(aiService).generateBusinessPlan(data);
    return plan;
  } catch (error) {
    console.error("Durable AI generation failed:", error);
    throw error;
  }
};
