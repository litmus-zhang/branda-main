import { Section, Tailwind, Text } from "@react-email/components"
import * as React from "react"
import { Base } from "./base"

export default function OTPEmail({ otp }: { otp: number }) {
  return (
    <Base>
    <Section>
                          <h1 className="font-sans text-lg">Verify your Email Address with OTP</h1>

          <Text className="text-gray-500 my-2">
            Use the following code to verify your email address
          </Text>
          <Text className="text-5xl font-bold pt-2">{otp}</Text>
          <Text className="text-gray-400 font-light text-xs pb-4">
            This code is valid for 10 minutes
          </Text>
      </Section>
    </Base>
  )
}

OTPEmail.PreviewProps = {
  otp: 123456,
}
