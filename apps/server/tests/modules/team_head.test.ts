// import { email } from "better-auth"
// import { describe, expect, it } from "bun:test"
// import * as pactum from "pactum"
// import { updateUserRole } from "../../src/db/index.js"
// import { createAdmin, CreateOrganization, CreateTeam, CreateUserAndVerify, organizationPayload, teamPayload, userAuthPayload } from "../helpers/payload.js"

// describe("Community Head", () => {
//   // create a user profile
//   // make the user an admin,
//   // then create an organization, a team,
//   // then create a new community member
//   // then update the role of the community member to community_head
//   // then create a new user
//   // then the community head can  now add the new user to the team/community
//   /// Link invited member with community head (referral tracking)
//   let admin,
//     organization,
//     team,
//     allTeams,
//     community_head,
//     member
//   it("Create an admin", async () => {
//     admin = await createAdmin("test-admin@gmail.com")
//     expect(admin!.user.email).toBe("test-admin@gmail.com")
//     console.log({ admin })
//   })
//   it("Create an organization", async () => {
//     organization = await CreateOrganization({
//       ...organizationPayload,
//       userId: admin!.user.id,
//     })
//     console.log({ organization })
//     expect(organization!.name).toBe(organizationPayload.name)
//     expect(organization!.members[0].userId).toBe(admin!.user.id)
//     expect(organization!.members[0].role).toBe("owner")
//   })
//   it("Get current organization", async () => {
//     await pactum.spec().get("/auth/organization/get-full-organization").withBearerToken(admin!.token).expectStatus(200).inspect()
//   })
//   it("Get all active members of an organization", async () => {
//     await pactum
//       .spec()
//       .get("/auth/organization/list-members")
//       .withBearerToken(admin!.token)
//       .expectStatus(200)
//       .inspect()
//   })
//   it("Create a team in an organization", async () => {
//     team = await CreateTeam({
//       ...teamPayload,
//       organizationId: organization!.id,
//     })
//     expect(team!.name).toBe(teamPayload.name)
//     expect(team!.organizationId).toBe(organization!.id)
//   })
//   it("Get all active teams in an organization", async () => {
//     allTeams = await pactum
//       .spec()
//       .get("/auth/organization/list-teams")
//       .withBearerToken(admin!.token)
//       .expectStatus(200)
//       .inspect()
//       .returns("res.body")
//     expect(allTeams.length).toBe(2)
//   })
//   it("Community Head registration", async () => {
//     community_head = await CreateUserAndVerify({ ...userAuthPayload, email: "community_head@test.com" })
//     const updatedUser = await updateUserRole(community_head.user.id, "admin")
//     console.log({ community_head })
//     expect(updatedUser[0].role).toBe("admin")
//     expect(updatedUser[0].id).toBe(community_head.user.id)
//   })
//   it("Get all teams/org the community head belongs to", async () => {
//     await pactum
//       .spec()
//       .get("/auth/organization/list-user-teams")
//       .withBearerToken(community_head!.token)
//       .expectStatus(200)
//       .inspect()
//       .expectBodyContains([])
//   })
//   it("Invite the community head to the organization", async () => {
//     await pactum
//       .spec()
//       .post("/auth/organization/invite-member")
//       .withBearerToken(admin!.token)
//       .withBody({
//         email: community_head!.user.email,
//         role: "community_head",
//         organizationId: organization!.id,
//         teamId: team!.id,
//       },

//       )
//       .expectStatus(200)
//       .stores("invitationId", "res.body.id")
//       .inspect()
//   })
//   it("the community head accept invite to the organization", async () => {
//     await pactum
//       .spec()
//       .post("/auth/organization/accept-invitation")
//       .withBearerToken(community_head!.token)
//       .withBody({
//         invitationId: "$S{invitationId}",
//       },
//       )
//       .expectStatus(200)
//       .inspect()
//   })
//   it("Get all teams/org the community head belongs to", async () => {
//     await pactum
//       .spec()
//       .get("/auth/organization/list-user-teams")
//       .withBearerToken(community_head!.token)
//       .expectStatus(200)
//       .inspect()
//   })
//   it("Get the members of the current organization", async () => {
//     const res = await pactum
//       .spec()
//       .get("/auth/organization/list-members")
//       .withBearerToken(community_head!.token)
//       .expectStatus(200)
//       .inspect()
//       .returns("res.body")
//     expect(res.total).toBe(2)
//   })
//   it("Create a new member", async () => {
//     member = await CreateUserAndVerify({ ...userAuthPayload, email: "member@test.com" })
//     expect(member!.user.email).toBe("member@test.com")
//   })

//   // it("Invite the member to the organization", async () => {
//   //   await pactum
//   //     .spec()
//   //     .post("/auth/organization/add-team-member")
//   //     .withBearerToken(admin!.token)
//   //     .withBody({
//   //       userId: member!.user.id,
//   //       role: "member",
//   //       organizationId: organization!.id,
//   //       teamId: team!.id,
//   //     },
//   //     )
//   //     .expectStatus(200)
//   //     // .stores("invitationId", "res.body.id")
//   //     .inspect()
//   // })
//   it("Invite the member to the organization", async () => {
//     await pactum
//       .spec()
//       .post("/auth/organization/invite-member")
//       .withBearerToken(admin!.token)
//       .withBody({
//         email: member!.user.email,
//         role: "member",
//         organizationId: organization!.id,
//         teamId: team!.id,
//       },
//       )
//       .expectStatus(200)
//       .stores("invitationId", "res.body.id")
//       .inspect()
//   })
//   it("the member accept invite to the organization", async () => {
//     await pactum
//       .spec()
//       .post("/auth/organization/accept-invitation")
//       .withBearerToken(member!.token)
//       .withBody({
//         invitationId: "$S{invitationId}",
//       },
//       )
//       .expectStatus(200)
//       .inspect()
//   })
//   it("Get the members of the current organization", async () => {
//     const res = await pactum
//       .spec()
//       .get("/auth/organization/list-members")
//       .withBearerToken(member!.token)
//       .expectStatus(200)
//       .inspect()
//       .returns("res.body")
//     expect(res.total).toBe(3)
//   })

//   // describe("Community Head Operations", () => {
//   //   it("Get all team in an organization", async () => {
//   //     await pactum.spec().get("/auth/organization/list-teams").withBearerToken(res!.token).inspect()
//   //     // expect(res.body).toBeDefined()
//   //     // expect(res.body).toHaveProperty("teams")
//   //     // expect(res.body.teams).toBeInstanceOf(Array)
//   //   })
//   //   // it("Create a community member", async () => {
//   //   //   const res = await CreateUserAndVerify({ ...userAuthPayload, email: "member@test.com" })
//   //   //   expect(res.user.role).toBe("user")
//   //   //   // capture credentials (voters card)
//   //   //   // add to team
//   //   //   await pactum
//   //   //     .spec()
//   //   //     .post("/auth/organization/add-team-member")
//   //   //     .withBearerToken("$S{authToken}")
//   //   //     .withJson({
//   //   //       teamId: "$S{teamId}", // required
//   //   //       userId: res.user.id, // required
//   //   //     })
//   //   //     .inspect()
//   //   // })
//   //   // get all teams in that organzation

//   //   // set active team
//   //   // then list active team members of the team
//   //   // it("List active team members of a team", async () => {
//   //   //   await pactum.spec().get("/auth/organization/list-team-members").withBearerToken("$S{authToken}").withJson({
//   //   //     teamId: "$S{teamId}", // required
//   //   //   }).inspect()
//   //   // })
//   // })
// })
