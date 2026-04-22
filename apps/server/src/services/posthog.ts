import { PostHog } from "posthog-node"
import { config } from "../config.js"

export const posthog = config.POSTHOG_API_KEY ? new PostHog(config.POSTHOG_API_KEY, {
  host: config.POSTHOG_HOST,
  disabled: config.NODE_ENV !== "production",
}) : null

posthog?.on("error", (err) => {
  console.error("PostHog had an error!", err)
})
