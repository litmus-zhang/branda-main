import env from "env-var"
import { InfisicalSDK } from '@infisical/sdk'

export const baseConfig = {
  NODE_ENV: env.get("NODE_ENV").default("dev").asString(),
  PROJECT_ID: env.get("PROJECT_ID").asString(),
  DATABASE_URL: env.get("DATABASE_URL").asString(),
}

export const config: Record<string, any> = { ...baseConfig };

export const initConfig = async () => {
  const client = new InfisicalSDK();

  await client.auth().universalAuth.login({
    clientId: env.get("PROJECT_CLIENT_ID").required().asString(),
    clientSecret: env.get("PROJECT_CLIENT_SECRET").required().asString()
  });

  const { secrets } = await client.secrets().listSecrets({
    environment: baseConfig.NODE_ENV,
    projectId: baseConfig.PROJECT_ID!,
  });

  secrets.forEach(s => {
    config[s.secretKey] = s.secretValue;
  });

  console.log({ config })
  return config;
}
console.log({ config })

