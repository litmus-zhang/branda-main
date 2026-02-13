import { Resend } from "resend"
import { config } from "../config.js"

const resend = new Resend(config.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
  template,
}: {
  to: string[]
  subject: string
  html?: string
  // jsxTemplate?: unknown
  template?: { id: string, variables?: Record<string, string | number> | undefined } | any
  attachments?: {
    filename: string
    content: string
    type?: string
  }[]
}) {
  const options = {
    from: "hello@nemma.space",
    to,
    subject,
    attachments,
    ...(template ? { template } : html ? { html } : {}),
  }

  const { data, error } = await resend.emails.send(options as any)

  if (error) {
    return console.error({ error })
  }

  console.log({ data })
}
