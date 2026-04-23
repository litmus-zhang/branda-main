import { Section, Tailwind, Text } from "@react-email/components"
import { Base } from "./base"

export default function NewTicket({ eventName }: { eventName: string }) {
  return (
    <Base>
      <Section className="">
                <h1 className="font-sans text-lg">Your registration is confirmed for {eventName}</h1>

          <Text className="">
            Your ticket is attached below
          </Text>
          
      </Section>
    </Base>
  )
}

NewTicket.PreviewProps = {
  eventName: "Annual Tech Conference 2024",
}
