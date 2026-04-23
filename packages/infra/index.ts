import * as pulumi from "@pulumi/pulumi";
import * as vercel from "@pulumiverse/vercel";

// Configuration for your deployments
const config = new pulumi.Config();
const githubRepo = config.require("githubRepo"); // e.g., "username/branda-app"
const infisicalProjectId = config.require("infisicalProjectId");

// ---- 1. Vercel Backend (Web App) ----

const vercelProject = new vercel.Project("branda-web", {
    name: "branda-app",
    framework: "nextjs",
    gitRepository: {
        type: "github",
        repo: githubRepo,
    },
    // Vercel build settings for monorepo
    rootDirectory: "apps/web",
    installCommand: "pnpm install",
    buildCommand: "pnpm build",
});

// We inject Infisical keys into Vercel
// In a real prod environment, you'd use the Infisical Vercel Integration
// But here we show how to do it via Pulumi for full IaC control.
const envVars = [
    { key: "NEXT_PUBLIC_API_URL", value: config.require("serverUrl") },
    { key: "INFISICAL_PROJECT_ID", value: infisicalProjectId },
    // Add other critical keys here
];

envVars.forEach(v => {
    new vercel.ProjectEnvironmentVariable(`${v.key}-var`, {
        projectId: vercelProject.id,
        key: v.key,
        value: v.value,
        targets: ["production", "preview", "development"],
    });
});

// ---- 2. Render Backend (Elysia Server) ----

// Render doesn't have a first-party Pulumi provider, so we use their 
// 'Blueprint' (render.yaml) for the most stable and optimal IaC.
// We export the configuration that matches your Render dashboard setup.

export const vercelDeploymentUrl = vercelProject.name.apply(name => `https://${name}.vercel.app`);

/**
 * PRODUCTION CHECKLIST & STEPS:
 * 
 * 1. INFISICAL: 
 *    - Connect Infisical to your Vercel Project via the Infisical Dashboard.
 *    - This is more secure than injecting raw keys into Pulumi.
 * 
 * 2. RENDER:
 *    - Connect your GitHub repo to Render.
 *    - Point to 'apps/server/Dockerfile'.
 *    - Set the 'Build Command' to 'npm install' (Render handles the Docker build automatically).
 * 
 * 3. PULUMI SETUP:
 *    - pnpm add @pulumi/vercel
 *    - pulumi config set githubRepo your-org/repo
 *    - pulumi config set vercelToken your-token --secret
 */
