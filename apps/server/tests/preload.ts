import { join } from "node:path"
import { PGlite } from "@electric-sql/pglite"
import { mock } from "bun:test"
import { drizzle } from "drizzle-orm/pglite"
import { migrate } from "drizzle-orm/pglite/migrator"
import redis from "ioredis"

console.time("PGLite init")
// const db = drizzle.mock({ schema })
// const testDB = await startTestDb()

// console.log({ testDB })
const pglite = new PGlite()
const db = drizzle(pglite)

// mock.module("pg", () => ({ default: () => pglite }))

mock.module("resend", () => ({
  Resend: class {
    emails = {
      send: () => Promise.resolve({ success: true, data: { id: "mocked resend" } }),
    }
  },
}))
// mock.module("@polar-sh/sdk", () => ({
//   Polar: class {
//     emails = {
//       send: () => Promise.resolve({ success: true, data: { id: "mocked polar" } }),
//     }
//   },
// }))
mock.module("drizzle-orm/node-postgres", () => ({ drizzle }))
mock.module("drizzle-orm/postgres-js'", () => ({ drizzle }))
mock.module("ioredis", () => ({ Redis: redis, default: redis }))

await migrate(db, {
  migrationsFolder: join(import.meta.dirname, "..", "drizzle"),
})

console.timeEnd("PGLite init")
