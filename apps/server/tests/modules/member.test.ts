import { describe, expect, it } from "bun:test"
import { CreateUserAndVerify, userAuthPayload } from "../helpers/payload.js"

describe("Organization Member", () => {
  it("Member Auth", async () => {
    // create a user profile
    const res = await CreateUserAndVerify({ ...userAuthPayload, email: "new-member@test.com" })
    console.log(res)
    expect(res.user.role).toBe("user")
  })
})
