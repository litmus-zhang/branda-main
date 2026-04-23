import type { ElysiaApp } from "../../src/server.js"
import * as pactum from "pactum"
import { app } from "../../src/server.js"

export async function createTestServer() {
  const server: ElysiaApp = app.listen(0)
  const baseURL = `http://127.0.0.1:${server.server?.port}`
  pactum.request.setBaseUrl(baseURL)

  async function shutdown() {
    // await clearDb()
    await server.stop()
  }
  return { server, baseURL, shutdown }
}

export const filePath = "./tests/helpers/test.txt"
