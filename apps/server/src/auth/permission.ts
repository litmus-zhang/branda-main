import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements, memberAc, ownerAc } from "better-auth/plugins/organization/access"

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
export const permission_statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const

export const ac = createAccessControl(permission_statement)

export const admin = ac.newRole({
  project: ["create", "update", "share", "delete"],
  ...adminAc.statements,
})
export const owner = ac.newRole({
  project: ["create", "update", "share"],
  ...ownerAc.statements,
})
export const member = ac.newRole({
  ...memberAc.statements,
})
