import { faker } from "@faker-js/faker"
import * as pactum from "pactum"
import { capturedToken } from "../../src/auth/auth.js"
import { updateUserRole } from "../../src/db/index.js"

const userAuthPayload = {
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  name: faker.internet.username(),
}

const organizationPayload = {
  name: faker.company.name(),
  slug: faker.lorem.slug(),
  userId: "$S{userId}",

}

const eventPayload = {
  name: faker.lorem.words(2),
  description: faker.lorem.sentence(),
  startDate: faker.date.soon(),
  endDate: faker.date.future(),
  organizationId: "$S{orgId}",
}

const teamPayload = {
  name: `${faker.location.city()} Team`,
  organizationId: "$S{orgId}",
}

export async function CreateUserAndVerify(credentials: typeof userAuthPayload = userAuthPayload) {
  await pactum
    .spec()
    .post("/auth/sign-up/email")
    .withJson(credentials)

  await pactum
    .spec()
    .post("/auth/sign-in/email")
    .withJson(credentials)
    .expectJsonLike({
      message: "Email not verified",
    })
    .expectStatus(403)

  await pactum
    .spec()
    .get("/auth/verify-email")
    .withQueryParams({
      token: capturedToken,
    })
    .expectStatus(200)

  const res = await pactum
    .spec()
    .post("/auth/sign-in/email")
    .withJson(credentials)
    .stores("authToken", "token")
    .stores("userId", "user.id")
    // .inspect()
    .expectStatus(200)
    .returns("res.body")
  return res
}

export async function CreateOrganization(payload: typeof organizationPayload = organizationPayload) {
  // const res = await CreateUserAndVerify({ ...userAuthPayload, email: "admin@test.com" })
  // const updatedUser = await updateUserRole(res.user.id)
  return await pactum
    .spec()
    .post("/auth/organization/create")
    .withBearerToken("$S{authToken}")
    .withJson({ ...payload })
    .expectStatus(200)
    .stores("orgId", "id")
    .inspect()
    .returns("res.body")
}
export async function CreateTeam(payload: typeof teamPayload = teamPayload) {
  return await pactum
    .spec()
    .post("/auth/organization/create-team")
    .withBearerToken("$S{authToken}")
    .withJson(payload)
    .expectStatus(200)
    .inspect()
    .stores("teamId", "id")
    .returns("res.body")
}

export async function createAdmin(email: string = "admin@test.com") {
  const res = await CreateUserAndVerify({ ...userAuthPayload, email })
  await updateUserRole(res.user.id)

  return res
}

export const numberRegex = /^\d+$/

export {
  organizationPayload,
  teamPayload,
  userAuthPayload,
  eventPayload
}
