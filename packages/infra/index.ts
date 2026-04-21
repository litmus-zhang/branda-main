import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an ECR repository to store our app image
const repo = new awsx.ecr.Repository("web-app-repo", {
    forceDelete: true,
});

// Build and push the image to the ECR repository
// Note: We use the monorepo root as the context so the Dockerfile can access workspace dependencies
const image = new awsx.ecr.Image("web-app-image", {
    repositoryUrl: repo.url,
    context: "../../",
    dockerfile: "../../apps/web/Dockerfile",
    platform: "linux/amd64",
});

// Create an IAM role for App Runner to access ECR
const accessRole = new aws.iam.Role("apprunner-access-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "build.apprunner.amazonaws.com"
            }
        }]
    }),
});

new aws.iam.RolePolicyAttachment("apprunner-access-policy", {
    role: accessRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess",
});

// Create an IAM role for the App Runner instance at runtime
const instanceRole = new aws.iam.Role("apprunner-instance-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "tasks.apprunner.amazonaws.com"
            }
        }]
    }),
});

// Create the App Runner Service
const service = new aws.apprunner.Service("web-app-service", {
    serviceName: "branda-web-app",
    sourceConfiguration: {
        authenticationConfiguration: {
            accessRoleArn: accessRole.arn,
        },
        imageRepository: {
            imageIdentifier: image.imageUri,
            imageRepositoryType: "ECR",
            imageConfiguration: {
                port: "3000",
                runtimeEnvironmentVariables: {
                    "NODE_ENV": "production",
                    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "your-publishable-key",
                    "CLERK_SECRET_KEY": "your-secret-key",
                },
            },
        },
        autoDeploymentsEnabled: true,
    },
    instanceConfiguration: {
        cpu: "1024", // 1 vCPU
        memory: "2048", // 2 GB
        instanceRoleArn: instanceRole.arn,
    },
});

// Export the App Runner service URL
export const url = service.serviceUrl;
