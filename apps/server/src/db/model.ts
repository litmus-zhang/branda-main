import { createInsertSchema } from "drizzle-typebox"
import { table } from "./schema.js"
import { spreads } from "./utils.js"
import { t } from "elysia"

export const models = {
  insert: spreads(
    {
      user: table.user,
      account: table.account,
      session: table.session,
      verification: table.verification,
      credentials: table.credentials,
      events: createInsertSchema(table.events, {
        name: t.String(),
        description: t.Optional(t.String()),
        startDate: t.Date({
          format: "date-time",
          examples: ["2026-02-02T13:38:06.714Z"],
          error: "Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS.SSSZ"
        }),
        endDate: t.Date({
          format: "date-time",
          examples: ["2026-06-25T03:29:56.394Z"],
          error: "Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS.SSSZ"
        }),
      }),
      files: table.files,
      tickets: table.ticket,
      workspaces: createInsertSchema(table.workspace, {
        name: t.String(),
        slug: t.String(),
        ownerId: t.Optional(t.String()),
        description: t.Optional(t.String()),
        collaborators: t.Optional(t.Array(t.Any())),
        createdAt: t.Optional(t.Date({ default: new Date().toISOString() })),
        updatedAt: t.Optional(t.Date({ default: new Date().toISOString() })),
        tier: t.Optional(t.String({ default: "Free" }))
      }),
    },
    "insert",
  ),

  select: spreads(
    {
      user: table.user,
      account: table.account,
      session: table.session,
      verification: table.verification,
      credentials: table.credentials,
      files: table.files,
      events: table.events,
      tickets: table.ticket,
      workspaces: table.workspace,

    },
    "select",
  ),
} as const
