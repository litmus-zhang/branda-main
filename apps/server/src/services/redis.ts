import { Redis } from "ioredis"
import { config } from "../config.js"

export const redis = new Redis({
  host: config.REDIS_HOST,
  // for bullmq
  maxRetriesPerRequest: null,
})
