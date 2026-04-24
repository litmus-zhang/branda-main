import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, bearer, emailOTP, openAPI, organization } from "better-auth/plugins"
import { Elysia } from "elysia"
import { config, initConfig } from "../config.js"
import { db } from "../db/index.js"
import * as schema from "../db/schema.js"
import { sendEmail } from "../services/resend.js"
import { replaceLocalhostUrl, ResendNotificationTemplatesSubject } from "../services/utils.js"

await initConfig()


// eslint-disable-next-line import/no-mutable-exports
let capturedToken = ""

console.log("Auth Config:", {
  baseURL: config.BETTER_AUTH_URL || config.API_URL,
  FRONTEND_URL: config.FRONTEND_URL,
  NODE_ENV: config.NODE_ENV
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  baseURL: config.BETTER_AUTH_URL || config.API_URL,
  basePath: "/auth",
  trustedOrigins: [
    ...(config.AUTH_CORS?.split(",") || []),
    config.FRONTEND_URL,
    "https://branda-web.up.railway.app",
    "https://branda.dynage.technology",
    "https://www.branda.dynage.technology",
    ""
  ].filter(Boolean),
  // advanced: {
  //   useSecureCookies: true,
  //   crossTab: true,
  // },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: "dynage.technology", // root domain
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const modifiedUrl = replaceLocalhostUrl(url, "user")
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
      const modifiedUrl = replaceLocalhostUrl(url, "user")
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
