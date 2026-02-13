import env from "env-var"

export const config = {
  NODE_ENV: env
    .get("NODE_ENV")
    .default("development")
    .asEnum(["production", "test", "development"]),

  PORT: env.get("PORT").default(3000).asPortNumber(),
  GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").required().asString(),
  GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
  API_URL: env.get("API_URL").default(`https://${env.get("PUBLIC_DOMAIN").asString()}`).asString(),
  DATABASE_URL: env.get("DATABASE_URL").required().asString(),
  REDIS_HOST: env.get("REDIS_HOST").default("localhost").asString(),
  POSTHOG_API_KEY: env.get("POSTHOG_API_KEY").default("it's a secret").asString(),
  POSTHOG_HOST: env.get("POSTHOG_HOST").default("localhost").asString(),
  S3_ENDPOINT: env.get("S3_ENDPOINT").default("http://localhost:9000").asString(),
  S3_ACCESS_KEY_ID: env.get("S3_ACCESS_KEY_ID").default("minio").asString(),
  S3_SECRET_ACCESS_KEY: env.get("S3_SECRET_ACCESS_KEY").default("minio").asString(),
  S3_BUCKET_NAME: env.get("S3_BUCKET_NAME").default("minio").asString(),
  LOCK_STORE: env.get("LOCK_STORE").default("memory").asEnum(["memory", "redis"]),
  FRONTEND_URL: env.get("FRONTEND_URL").default("http://localhost:3000").asString(),
  AUTH_CORS: env
    .get("AUTH_CORS")
    .default("http://localhost:3000")
    .asString()
    .split(","),
  RESEND_API_KEY: env.get("RESEND_API_KEY").required().asString(),
  GOTENBERG_ENDPOINT: env.get("GOTENBERG_ENDPOINT").default("http://localhost:3100").asString(),
}
