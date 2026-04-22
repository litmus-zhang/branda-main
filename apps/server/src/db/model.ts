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
      workspaces: table.workspace,

    },
    "select",
  ),
} as const
