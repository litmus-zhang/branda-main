import * as z from "zod";

export const businessGenerateSchema = z.object({
  niche: z.string().min(2, "Please enter your business niche"),
  country: z.string().min(2, "Please enter your country"),
  businessName: z.string().optional(),
  details: z.string().min(10, "Please provide more details (at least 10 characters)"),
});

export type BusinessGenerateValues = z.infer<typeof businessGenerateSchema>;
