import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, bearer, emailOTP, openAPI, organization } from "better-auth/plugins"
import { Elysia } from "elysia"
import { config } from "../config.js"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"
import { sendEmail } from "../services/resend.js"
import { replaceLocalhostUrl, ResendNotificationTemplatesSubject } from "../services/utils.js"

// eslint-disable-next-line import/no-mutable-exports
let capturedToken = ""

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  // baseURL: "http://localhost:3000",
  basePath: "/auth",
  trustedOrigins: [
    ...config.AUTH_CORS,
    "*.coderina.org",
    "https://*.coderina.org",
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const modifiedUrl = replaceLocalhostUrl(url, user?.role === "admin" ? "admin" : "user")
      capturedToken = token
      console.log("Verification token:", token)
      // console.log({ modifiedUrl })
      return sendEmail({
        to: [user.email],
        subject: ResendNotificationTemplatesSubject.VERIFICATION,
        template: {
          id: "verify-email-1",
          variables: {
            verificationUrl: modifiedUrl,
          },
        },
        // jsxTemplate: jsx(EmailVerificationTemplate, { verificationUrl: modifiedUrl }),
        // html: `Click the link to verify your email: ${modifiedUrl}`,
      })
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Send reset password email
      console.log({ user, token, url })
      const modifiedUrl = replaceLocalhostUrl(url, user.role === "admin" ? "admin" : "user")
      await sendEmail({
        to: [user.email],
        subject: ResendNotificationTemplatesSubject.RESET_OTP,
        template: {
          id: "forgot-password",
          variables: {
            resetPasswordUrl: modifiedUrl,

          },
        },
        // html: `Click the link to reset your email: ${modifiedUrl}`,
      })
    },

  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    openAPI(),
    bearer(),
    admin({
      defaultRole: "user",
    }),
    organization({
      // allowUserToCreateOrganization: async (user) => {
      //   // allow only admin users to create organizations
      //   return user.role === "admin"
      // },
      // ac, // Must be defined in order for dynamic access control to work
      // roles: {
      //   owner,
      //   adminRole,
      //   member,
      // },
      sendInvitationEmail: async ({ id, role, email, organization, invitation, inviter }) => {
        console.log({ id, role, email, organization, invitation, inviter })
        await sendEmail({
          to: [email],
          subject: ResendNotificationTemplatesSubject.INVITATION,
          template: {
            id: "new-member-invitation",
            variables: {
              teamName: organization.name,
              invitationLink: replaceLocalhostUrl(`${config.FRONTEND_URL}/auth/organization/invite-member?invitationId=${id}`, "user"),

            },
          },
          // html: `You have been invited to join ${organization.name} as ${role}. Click the link to accept the invitation: ${replaceLocalhostUrl(`${config.FRONTEND_URL}/auth/organization/invite-member?invitationId=${id}`, "user")}`,
        })
      },
      dynamicAccessControl: {
        enabled: true,
      },
      teams: {
        enabled: true,
        // maximumTeams: 10, // Optional: limit teams per organization
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
          await sendEmail({
            to: [email],
            subject: ResendNotificationTemplatesSubject.VERIFICATION_OTP,
            html: `Your OTP is: ${otp}`,
          })
        }
        else if (type === "email-verification") {
          // Send the OTP for email verification
          await sendEmail({
            to: [email],
            subject: ResendNotificationTemplatesSubject.VERIFICATION,
            html: `Your OTP is: ${otp}`,
          })
        }
        else {
          // Send the OTP for password reset
          await sendEmail({
            to: [email],
            subject: ResendNotificationTemplatesSubject.RESET_OTP,
            html: `Your OTP is: ${otp}`,
          })
        }
      },
    }),
  ],
})

export { capturedToken }

// let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => auth.api.generateOpenAPISchema()

export const OpenAPI = {
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null)

      for (const path of Object.keys(paths)) {
        const key = prefix + path
        const original = paths[path]!
        reference[key] = original

        for (const method of Object.keys(original)) {
          const operation = (reference[key] as any)[method]

          operation.tags = ["Authentication"]
        }
      }

      return reference
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const

export const authGuard = new Elysia({ name: "authGuard" })
  .macro({
    auth: {
      // You can use this in route definitions for strong typing
      async resolve({ request, set }) {
        // Verify the session from cookies or Authorization header
        const session = await auth.api.getSession({
          headers: request.headers,
        })

        if (!session) {
          set.status = 401
          throw new Error("Unauthorized")
        }

        // Expose user and session to the route context
        return {
          user: session.user,
          session: session.session,
        }
      },
    },
  })
  .derive(async ({ request }) => {
    // Auto-inject user/session in the request lifecycle
    const session = await auth.api.getSession({ headers: request.headers })
    if (session)
      return { user: session.user, session: session.session, role: session.user.role }

    // Optionally, leave undefined if not logged in
    return { user: null, session: null, role: null }
  })
