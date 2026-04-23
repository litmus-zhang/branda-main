import { afterAll, beforeAll } from "bun:test"
import { clearDb } from "../src/db/index.js"
import { createTestServer } from "./helpers/setup.js"

let shutdown: () => Promise<void>

beforeAll(async () => {
  console.log("[global] Starting test server…")
  shutdown = (await createTestServer()).shutdown
})

afterAll(async () => {
  console.log("[global] Cleaning DB…")
  await clearDb()

  console.log("[global] Stopping test server…")
  await shutdown()
})
