import type { ElysiaApp } from "../../server.js"
import Elysia, { t } from "elysia"
import { authGuard } from "../../auth/auth.js"
import { config } from "../../config.js"
import { deleteOne, getOneByID, getUserMedia, insertOne } from "../../db/index.js"
import { models } from "../../db/model.js"
import { deleteFileFromS3, generateDownloadUrl, generatePresignedUrl } from "../../services/s3.js"

const { files: mediaInsert } = models.insert


export default (media: ElysiaApp) => media.model({
  Event: t.Object(mediaInsert as any),
})
  .model({
    Post: t.Object(mediaInsert as any),
  })
  .guard({
    tags: ["User Files/Credentials"],
    detail: {
      description: "Require user to be logged in",
    },
  })
  .use(authGuard)
  .post("/new", async ({ user, body }: { user: { id: string }, body: { file: File } }) => {
    try {
      const { id: uploaded_by } = user
      const { file } = body

      const key = `${file.name}`

      const { uploadUrl, message } = await generatePresignedUrl({
        key,
        type: file.type,
      })

      const { data } = await insertOne("files", {
        key,
        filename: file.name,
        mime_type: file.type,
        size: file.size,
        bucket: config.S3_BUCKET_NAME,
        uploaded_by,
      })

      return { uploadUrl, message, data }
    }
    catch (error) {
      console.log({ error })
      throw new Error("Error Uploading file", { cause: error })
    }
  }, {
    auth: true,
    body: t.Object({
      file: t.File(),
    }),
  })
  .get("/all", async ({ user }: { user: { id: string } }) => {
    try {
      const { id: created_by } = user
      return getUserMedia(created_by)
    }
    catch (error) {
      throw new Error("Error Uploading media", { cause: error })
    }
  }, {
    auth: true,
    body: t.Object({
      file: t.File(),
    }),
  })
  .get("/:id/download", async ({ params }: { params: { id: string } }) => {
    const { data } = await getOneByID("files", params.id)
    const url = await generateDownloadUrl(data?.key)
    return { url }
  })
  .delete("/:id", async ({ params: { id } }: { params: { id: string } }) => {
    const { data } = await getOneByID("files", id)
    await deleteFileFromS3(data?.key)
    await deleteOne("files", id)
    return { message: "File deleted sucessfully" }
  }, {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })
  .get("/:id", async ({ params: { id } }: { params: { id: string } }) => getOneByID("files", id), {
    params: t.Object({
      id: t.String(),
    }),
    auth: true,
  })

