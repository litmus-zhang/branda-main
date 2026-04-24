import { describe, it, expect, beforeAll } from "bun:test"
import * as pactum from "pactum"
import { faker } from "@faker-js/faker"
import { CreateUserAndVerify } from "../helpers/payload"

describe("AI API - Business Plan Generation", () => {
    let user: any

    beforeAll(async () => {
        user = await CreateUserAndVerify({
            email: "ai-test-" + faker.internet.email(),
            password: "password123",
            name: "ai tester",
        })
    })

    describe("POST /ai/generate-plan", () => {
        const validPayload = {
            niche: "Artificial Intelligence",
            businessName: "Branda AI",
            details: "A platform for brand automation",
            country: "United States"
        }

        it("should fail without authentication", async () => {
            await pactum
                .spec()
                .post("/ai/generate-plan")
                .withJson(validPayload)
                .expectStatus(401)
        })

        it("should fail with invalid payload (missing niche)", async () => {
            await pactum
                .spec()
                .post("/ai/generate-plan")
                .withBearerToken(user.token)
                .withJson({
                    businessName: "Test",
                    details: "Test",
                    country: "USA"
                })
                .expectStatus(422)
        })

        // it("should fail with invalid payload (empty details)", async () => {
        //     await pactum
        //         .spec()
        //         .post("/ai/generate-plan")
        //         .withBearerToken(user.token)
        //         .withJson({
        //             ...validPayload,
        //             details: ""
        //         })
        //         .expectStatus(422)
        // })

        // it("should generate a plan with valid inputs", async () => {
        //     // Note: This might take time or fail if Restate/LLM is down
        //     // In a real robust suite, we'd mock the AI service call
        //     await pactum
        //         .spec()
        //         .post("/ai/generate-plan")
        //         .withBearerToken(user.token)
        //         .withJson(validPayload)
        //         .expectStatus(200)
        //         .expectJsonLike({
        //             brandIdentity: {
        //                 name: "Branda AI"
        //             }
        //         })
        //         .expectBodyContains("brandIdentity")
        //         .expectBodyContains("marketing")
        //         .expectBodyContains("systems")
        //         .expectBodyContains("crm")
        // }, {
        //     timeout: 60000
        // }) // AI generation can be slow

        // it("should handle service errors gracefully", async () => {
        //     // Test with impossible inputs or check for 500
        //     await pactum
        //         .spec()
        //         .post("/ai/generate-plan")
        //         .withBearerToken(user.token)
        //         .withJson({
        //             ...validPayload,
        //             niche: "asdfghjkl" // Random junk
        //         })
        //         .inspect()
        //     // Depending on LLM, this might still return something or error
        //     // .expect((ctx) => {
        //     //     expect([200, 500]).toContain(ctx.res.statusCode?.toString())
        //     // })
        // })
    })
})
