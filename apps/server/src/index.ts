import cluster from "node:cluster"
import os from "node:os"
import process from "node:process"
import { config } from "./config.js"
import { app } from "./server.js"
import { posthog } from "./services/posthog.js"

const signals = ["SIGINT", "SIGTERM"]

for (const signal of signals) {
  process.on(signal, async () => {
    console.log(`Received ${signal}. Initiating graceful shutdown...`)
    await app.stop()
    await posthog.shutdown()
    process.exit(0)
  })
}

process.on("uncaughtException", (error) => {
  console.error(error)
})

process.on("unhandledRejection", (error) => {
  console.error(error)
})

if (config.NODE_ENV === "production") {
  if (cluster.isPrimary) {
    for (let i = 0; i < os.availableParallelism(); i++) cluster.fork()
  }
}
else {
  await import("./server.js")
  console.log(`Worker ${process.pid} started`)
}


app.listen(config.PORT, () => console.log(`🦊 Server started at ${app.server?.url.origin}`))
