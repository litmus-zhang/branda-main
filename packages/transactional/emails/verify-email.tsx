import { Button, Section, Tailwind, Text } from "@react-email/components"
import { Base } from "./base"

export default function EmailVerificationTemplate({ verificationUrl }: { verificationUrl: string }) {
  return (
    <Base>
        <Section className="">
          <Text className="text-lg font-medium">
            Verify your Email Address
          </Text>
          <Text className="text-gray-500 my-2">
            Use the following link to verify your email address:
          </Text>
          <a className="bg-blue-500 text-white py-2 px-4 rounded my-4 no-underline" href={verificationUrl}>
            Verify Email Address
          </a>
         
          <Text className="text-sm pt-2">If you can't click the button, copy the url below to verify</Text>
          <a href={verificationUrl} className="text-xs font-bold pt-2">{verificationUrl}</a>
          <Text className="text-gray-400 font-light text-xs pb-4">
            This link is valid for 30 minutes
          </Text>
          <Text className="text-gray-600">
            Thank you for joining us
          </Text>
        </Section>
    </Base>
  )
}

EmailVerificationTemplate.PreviewProps = {
  verificationUrl: "https://example.com/verify",
}
