import { join } from "node:path"
import { bearer } from "@elysiajs/bearer"
import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import { opentelemetry } from "@elysiajs/opentelemetry"
import { serverTiming } from "@elysiajs/server-timing"
import { Elysia } from "elysia"
import { autoload } from "elysia-autoload"
import { healthcheckPlugin } from "elysia-healthcheck"
import { Logestic } from "logestic"
import { config } from "./config.js"
import { auth, OpenAPI } from "./auth/auth.js"
import { clearDb, seedDb } from "./db/index.ts"

import { restateHandler } from "./services/ai/index.ts"

export const app = new Elysia()
  .use(bearer())
  .use(cors({
    origin: [
      "https://branda.dynage.technology",
      "https://www.branda.dynage.technology",
      "https://branda-web.up.railway.app",
      config.FRONTEND_URL,
      ...(config.AUTH_CORS?.split(",") || []),
    ].filter(Boolean),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }))

  .use(serverTiming())
  .use(opentelemetry())
  .use(
    healthcheckPlugin({
      prefix: "/health",
    }),
  )
  .all("/restate/*", ({ request }) => restateHandler(request))
  .use(
    autoload({
      dir: join(import.meta.dir, "routes"),
    }),
  )
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        info: {
          title: "Branda API",
          version: "v1.0.0",
        },
        servers: [
          {
            url: "http://localhost:4000",
            description: "Local development server",
          },
          {
            url: "https://branda-api.dynage.technology",
            description: "Production server",
          },
        ],
      },
      // references: fromTypes(process.env.NODE_ENV === "production"
      //   ? "dist/index.d.ts"
      //   : "src/index.ts"),
    }),
  )
  .use(Logestic.preset("common"))
  .mount(auth.handler)
// .get("/seed", async () => {
//   await seedDb()
//   return {
//     message: "Successfully seeded database",
//   }
// })
// .get("/clear", async () => {
//   await clearDb()
//   return {
//     message: "Successfully deleted database",
//   }
// })

export type ElysiaApp = typeof app
