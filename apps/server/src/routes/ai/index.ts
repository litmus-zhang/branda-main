import { Elysia, t } from "elysia";
import { generateBusinessPlan } from "../../services/ai/index.ts";

export const aiRoutes = new Elysia()

  .post("/generate-plan", async ({ body }) => {
    const plan = await generateBusinessPlan(body);
    return plan;
  }, {
    body: t.Object({
      niche: t.String(),
      businessName: t.String(),
      details: t.String(),
      country: t.String()
    })
  });

export default aiRoutes;
