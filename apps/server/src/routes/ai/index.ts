import { Elysia, t } from "elysia";
import { generateBusinessPlan } from "../../services/ai/index.ts";
import { authGuard } from "../../auth/auth.ts";

export const aiRoutes = new Elysia()
  .use(authGuard)
  .post("/generate-plan", async ({ body }) => {
    const plan = await generateBusinessPlan(body);
    return plan;
  }, {
    body: t.Object({
      niche: t.String(),
      businessName: t.String(),
      details: t.String(),
      country: t.String()
    }),
    auth: true,

  });

export default aiRoutes;
