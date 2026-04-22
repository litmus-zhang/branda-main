import type { ElysiaApp } from "../../server.ts"
import Elysia, { t } from "elysia"
import { authGuard } from "../../auth/auth.ts"
import {
  deleteOne,
  getOneByID,
  getUserWorkspaces,
  insertOne,
  updateOne,
} from "../../db/index.ts"
import { models } from "../../db/model.ts"

const { workspaces: workspaceInsert } = models.insert

export type NewWorkspace = typeof workspaceInsert

export default (app: ElysiaApp) => app.model({
  Workspace: t.Object(workspaceInsert as any),
})
  .guard({
    tags: ["Workspaces"],
    detail: {
      description: "Manage workspaces",
    },
  })
  .use(authGuard)
  .get("", ({ user: { id: userId } }: { user: { id: string } }) =>
    getUserWorkspaces(userId), {
    auth: true,
  })
  .get("/:id", ({ params: { id } }: { params: { id: string } }) => getOneByID("workspace", id), {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .post("/new", async ({
    user: { id: ownerId },
    body,
  }: {
    body: NewWorkspace
    user: { id: string }
  }) => insertOne("workspace", {
    ...body,
    ownerId,
  }), {
    body: t.Object(workspaceInsert as any),
    auth: true,
  })
  .put("/:id", ({
    params: { id },
    body,
  }: {
    params: { id: string }
    body: Partial<NewWorkspace>
  }) => updateOne("workspace", id, body), {
    body: t.Partial(t.Object(workspaceInsert as any)),
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .delete("/:id", ({ params: { id } }: { params: { id: string } }) => {
    return deleteOne("workspace", id)
  }, {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
