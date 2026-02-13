import { describe, it } from "bun:test"
import * as pactum from "pactum"
import { filePath } from "../helpers/setup.js"

describe("Media Files management", () => {
  it("Generate presigned Url", async () =>
    await pactum
      .spec()
      .post("/files/new")
      .withBearerToken("$S{authToken}")
      .withFile(filePath)
      .expectBodyContains("Presigned URL generated successfully")
      .expectStatus(200)
      .stores("uploadUrl", "uploadUrl")
      .stores("data_id", "data.id")
      .stores("data_key", "data.key")
      .inspect())

  it("Upload a file", async () => {
    await pactum
      .spec()
      .put("$S{uploadUrl}")
      .withFile(filePath)
      .expectStatus(200)
      .inspect()
  })
  it("Get a download file", async () => {
    await pactum
      .spec()
      .get("/files/$S{data_id}/download")
      .withBearerToken("$S{authToken}")
      .expectStatus(200)
      .inspect()
  })
  it("Get a file", async () => {
    await pactum
      .spec()
      .get("/files/$S{data_id}")
      .withBearerToken("$S{authToken}")
      .expectStatus(200)
      .inspect()
  })
  it("Get all users files", async () => {
    await pactum
      .spec()
      .get("/files/all")
      .withBearerToken("$S{authToken}")
      .expectStatus(200)
      .inspect()
  })
  it("Delete a file", async () => {
    await pactum
      .spec()
      .delete("/files/$S{data_id}")
      .withBearerToken("$S{authToken}")
      .expectStatus(200)
      .inspect()
  })
})
