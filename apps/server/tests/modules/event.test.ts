// import { faker } from "@faker-js/faker"
// import { describe, expect, it } from "bun:test"
// import * as pactum from "pactum"
// import { updateUserRole } from "../../src/db/index.js"
// import { CreateUserAndVerify, userAuthPayload } from "../helpers/payload.js"
// import { filePath } from "../helpers/setup.js"

// describe("Posts", () => {
//   let community_head
//   it("Create a community head", async () => {
//     community_head = await CreateUserAndVerify({ ...userAuthPayload, email: "community_head+post@test.com" })
//     const updatedUser = await updateUserRole(community_head.user.id, "admin")
//     pactum.spec().stores("userId", community_head.user.id)
//     // console.log({ updatedUser })
//     expect(updatedUser[0].role).toBe("admin")
//     expect(updatedUser[0].id).toBe(community_head.user.id)
//   })
//   describe("Community Post", () => {
//     it("POST /posts - should allow only community head/admin post a content without media attachment", async () => {
//       await pactum
//         .spec()
//         .post("/posts/new")
//         .withBearerToken("$S{authToken}")
//         .withBody({
//           content: faker.lorem.paragraph(4),
//           user_id: "$S{userId}",
//           media_urls: [
//             faker.image.url(),
//             faker.image.url(),
//           ],
//         })
//         // .withFile(filePath)
//         .expectStatus(200)
//         .inspect()
//     })
//     it("GET /posts - should allow all member see  all published posts", async () => {
//       await pactum
//         .spec()
//         .get("/posts")
//         .withBearerToken("$S{authToken}")
//         .expectStatus(200)
//         .inspect()
//     })
//   })
//   // describe("Post Media – Two Phase Commit", () => {
//   //   it("PHASE 1: should create a post without media", async () => {
//   //     await pactum
//   //       .spec()
//   //       .post("/posts/new")
//   //       .withBearerToken("$S{authToken}")
//   //       .withBody({
//   //         content: faker.lorem.paragraph(3),
//   //         user_id: "$S{userId}",
//   //       })
//   //       .expectStatus(200)
//   //       .expectJsonLike({
//   //         data: {
//   //           id: /^[a-z0-9-]+$/,
//   //         },
//   //       })
//   //       .stores("postId", "data.id")
//   //       .inspect()
//   //   })

//   //   it("PHASE 2: should request presigned URL and attach media to post", async () => {
//   //     await pactum
//   //       .spec()
//   //       .post("/posts/$S{postId}/media/presign")
//   //       .withBearerToken("$S{authToken}")
//   //       .withFile(filePath)
//   //       .expectStatus(200)
//   //       .expectJsonLike({

//   //         uploadUrl: /^http:\/\/.*/,
//   //         mediaId: /^[a-z0-9-]+$/,
//   //       })
//   //       .stores("mediaId", "mediaId")
//   //       .inspect()
//   //   })

//   //   it("VERIFY: media should be linked to the post", async () => {
//   //     await pactum
//   //       .spec()
//   //       .get("/posts/$S{postId}")
//   //       .withBearerToken("$S{authToken}")
//   //       .expectStatus(200)
//   //       .inspect()
//   //   })
//   // })

//   describe("Admin Post", () => { })
//   describe("Content Moderation", () => { })
// })
