import { format } from "date-fns"
import QRCode from "qrcode"

export enum ResendNotificationTemplatesSubject {
  VERIFICATION_OTP = "Your Email Verification OTP",
  VERIFICATION = "Verify your email address",
  SIGN_IN_OTP = "Your Sign-in OTP",
  RESET_OTP = "Your Password Reset OTP",
  INVITATION = "Your invitation to join your team",
}

export function replaceLocalhostUrl(url: string, actor_type: "admin" | "user" | "checkin" = "admin") {
  const CLIENT_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://event.coderina.org"
  const CHECKIN_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://checkin.coderina.org"
  const ADMIN_URL = process.env.NODE_ENV === "development" ? "http://localhost:3002" : "https://admin.coderina.org"

  const urlPrefix = actor_type === "checkin" ? CHECKIN_URL : actor_type === "user" ? CLIENT_URL : ADMIN_URL

  return url.replace(/^https?:\/\/[^/]+/, urlPrefix)
}

export const formatDate = (date: Date = new Date()) => format(date, "yyyy-MM-dd")

export async function generateQRCode(payload: string) {
  const qrSvg = await QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "H",
  })
  return qrSvg
}
