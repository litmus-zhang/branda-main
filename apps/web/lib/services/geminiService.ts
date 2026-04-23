import { BusinessPlan } from "@/lib/types";
import { api } from "@/lib/api";

export const generateBusinessPlan = async (data: {
  niche: string;
  businessName: string;
  details: string;
  country: string;
}): Promise<BusinessPlan> => {
  try {
    const plan = await api.post<BusinessPlan>("/ai/generate-plan", data);
    return plan;
  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};