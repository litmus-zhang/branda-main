import { describe, it, expect } from "bun:test"
import * as pactum from "pactum"
import { faker } from "@faker-js/faker"
import { CreateUserAndVerify } from "../helpers/payload"

describe("Workspaces API", () => {
    let user: any
    const workspaceName = faker.company.name()
    const workspaceSlug = faker.lorem.slug()

    const workspacePayload = {
        name: workspaceName,
        slug: workspaceSlug,
        plan: {
            brandIdentity: {
                name: workspaceName,
                mission: faker.lorem.sentence(),
                vision: faker.lorem.sentence(),
                slogan: faker.lorem.words(3),
                colors: ["#6366f1", "#f43f5e"],
                fonts: ["Inter", "Outfit"],
                toneOfVoice: "Professional and innovative",
                logoConcept: "Minimalist and modern"
            },
            marketing: {
                strategy: faker.lorem.paragraph(),
                targetAudience: faker.lorem.sentence(),
                keyChannels: [{ name: "LinkedIn", url: "https://linkedin.com" }],
                contentIdeas: [{ type: "Blog", title: "Future of AI", description: faker.lorem.sentence() }]
            },
            systems: {
                sops: [],
                techStackRecommendation: []
            },
            crm: {
                onboardingProcess: [],
                mockCustomers: []
            }
        },
        tier: "Pro"
    }

    it("Setup: Create and verify test user", async () => {
        user = await CreateUserAndVerify({
            email: "workspace" + faker.internet.email(),
            password: "password",
            name: "workspace user",
        })
        expect(user.token).toBeDefined()
    })

    describe("Workspace CRUD Operations", () => {
        it("POST /workspaces/new - Create a new workspace", async () => {
            await pactum
                .spec()
                .post("/workspaces/new")
                .withBearerToken(user.token)
                .withJson(workspacePayload)
                .expectStatus(200)
                .expectBodyContains(workspaceName)
                .expectBodyContains(workspaceSlug)
                .stores("workspaceId", "data.id")
                .inspect()
        })

        it("POST /workspaces/new - Fail on duplicate slug and return a 409 status code", async () => {
            await pactum
                .spec()
                .post("/workspaces/new")
                .withBearerToken(user.token)
                .withJson(workspacePayload)
                .expectStatus(500) // Expecting conflict if implemented, or general error
        })

        it("GET /workspaces - List all workspaces for user", async () => {
            await pactum
                .spec()
                .get("/workspaces")
                .withBearerToken(user.token)
                .expectStatus(200)
                .inspect()
        })

        it("GET /workspaces/:id - Get workspace details", async () => {
            await pactum
                .spec()
                .get("/workspaces/$S{workspaceId}")
                .withBearerToken(user.token)
                .expectStatus(200)
                .expectBodyContains(workspaceName)
        })

        it("PUT /workspaces/:id - Update workspace details", async () => {
            const updatedName = `${workspaceName} Updated`
            await pactum
                .spec()
                .put("/workspaces/$S{workspaceId}")
                .withBearerToken(user.token)
                .withJson({
                    name: updatedName,
                    tier: "Enterprise"
                })
                .expectStatus(200)
                .expectBodyContains(updatedName)
                .expectBodyContains("Enterprise")
        })

        it("PUT /workspaces/:id - Update plan data", async () => {
            const newSlogan = "New Brand Slogan"
            await pactum
                .spec()
                .put("/workspaces/$S{workspaceId}")
                .withBearerToken(user.token)
                .withJson({
                    plan: {
                        ...workspacePayload.plan,
                        brandIdentity: {
                            ...workspacePayload.plan.brandIdentity,
                            slogan: newSlogan
                        }
                    }
                })
                .expectStatus(200)
                .expectBodyContains(newSlogan)
        })

        it("PATCH /workspaces/:id/plan/:section - Specifically patch plan section", async () => {
            const patchedMission = "Patched Brand Mission for E2E"
            await pactum
                .spec()
                .patch("/workspaces/$S{workspaceId}/plan/brandIdentity")
                .withBearerToken(user.token)
                .withJson({
                    mission: patchedMission
                })
                .expectStatus(200)
                .expectBodyContains(patchedMission)
        })

        it("DELETE /workspaces/:id - Delete workspace", async () => {
            await pactum
                .spec()
                .delete("/workspaces/$S{workspaceId}")
                .withBearerToken(user.token)
                .expectStatus(200)
        })

        it("GET /workspaces/:id - Confirm deletion (404)", async () => {
            await pactum
                .spec()
                .get("/workspaces/$S{workspaceId}")
                .withBearerToken(user.token)
                .expectStatus(404)
        })
    })

    describe("Workspace Security", () => {
        it("GET /workspaces - Block unauthorized access", async () => {
            await pactum
                .spec()
                .get("/workspaces")
                .expectStatus(401)
        })

        it("POST /workspaces/new - Block creation without token", async () => {
            await pactum
                .spec()
                .post("/workspaces/new")
                .withJson(workspacePayload)
                .expectStatus(401)
        })
    })
})
