import type { ElysiaApp } from "../../server.js"
import Elysia, { t } from "elysia"
import { authGuard } from "../../auth/auth.js"
import { config } from "../../config.js"
import { deleteOne, getOneByID, insertOne } from "../../db/index.js"
import { models } from "../../db/model.js"
import { deleteFileFromS3, generateDownloadUrl, generatePresignedUrl } from "../../services/s3.js"

const { credentials: credentialsInsert } = models.insert

export type NewCredentials = typeof credentialsInsert
const credentials: ElysiaApp = new Elysia({
  tags: ["Credentials"],
})
  .model({
    Credentials: t.Object(credentialsInsert as any),
  })
  .guard({
    detail: {
      description: "Require user to be logged in",
    },
  })
  .use(authGuard)
  .post("/new", async ({ user, body }: { user: { id: string }, body: { file: File } }) => {
    console.log({ user, body })

    const { file } = body

    const { uploadUrl, message } = await generatePresignedUrl(file)

    const key = `${file.name}`

    await insertOne("credentials", {
      key,
      filename: file.name,
      mime_type: file.type,
      size: file.size,
      bucket: config.S3_BUCKET_NAME,
      owner_id: user.id,
    })

    return { uploadUrl, message }
  }, {
    auth: true,
    body: t.Object({
      file: t.File(),
    }),
  })
  .get("/:id/download", async ({ params }: { params: { id: string } }) => {
    const { data } = await getOneByID("credentials", params.id)
    const url = await generateDownloadUrl(data.key)
    return { url }
  })
  .get("/", () => {
    return { message: "Get all credentials" }
  })
  .delete("/:id", async ({ params: { id } }: { params: { id: string } }) => {
    const { data } = await getOneByID("credentials", id)
    await deleteFileFromS3(data?.key)
    await deleteOne("credentials", id)
    return { message: "Credentials deleted sucessfully" }
  }, {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })

export default credentials
