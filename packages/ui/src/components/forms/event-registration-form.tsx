import * as z from "zod"
import { formSchema } from '@branda/ui/lib/form-schema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Field, FieldGroup, FieldContent, FieldLabel, FieldDescription, FieldError, FieldSeparator } from "@branda/ui/components/field"
import { Button } from "@branda/ui/components/button"
import { Input } from "@branda/ui/components/input"
import { RadioGroup, RadioGroupItem } from '@branda/ui/components/radio-group'
import { Label } from '@branda/ui/components/label'
import { Textarea } from "@branda/ui/components/textarea"
import { Event } from "@branda/ui/lib/events"



type Schema = z.infer<typeof formSchema>;

export function EventRegistrationForm({ event }: { event?: Event }) {

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema as any),
  })
  const { formState: { isSubmitting, isSubmitSuccessful } } = form;

  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    try {
      // TODO: implement form submission
      console.log(data);
      form.reset();
    } catch (error) {
      // TODO: handle error
    }
  });

  if (isSubmitSuccessful) {
    return (<div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
        className="h-full py-6 px-3"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
          className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
        >
          <Check className="size-8" />
        </motion.div>
        <h2 className="text-center text-2xl text-pretty font-bold mb-2">
          Thank you
        </h2>
        <p className="text-center text-lg text-pretty text-muted-foreground">
          Form submitted successfully, we will get back to you soon
        </p>
      </motion.div>
    </div>)
  }
  return (
    <form onSubmit={handleSubmit} className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border max-w-3xl mx-auto">
      <FieldGroup className="grid md:grid-cols-6 gap-4 mb-6">
        <h1 className="mt-6 mb-1 font-extrabold text-3xl tracking-tight col-span-full">Event Registration</h1>
        <p className="tracking-wide text-muted-foreground mb-5 text-wrap text-sm col-span-full">Register for {event?.title || "this event"}</p>

        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
              <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
              <Input
                {...field}
                id="firstName"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your first name"

              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-3">
              <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
              <Input
                {...field}
                id="lastName"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your last name"

              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 col-span-full">
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <Input
                {...field}
                id="email"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email address"

              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 col-span-full">
              <FieldLabel htmlFor="company">Company/Organization </FieldLabel>
              <Input
                {...field}
                id="company"
                type="text"
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your company name"

              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [{ "label": "General Admission - Free", "value": "general" }, { "label": "VIP Access - $99", "value": "vip" }, { "label": "Premium Package - $199", "value": "premium" }];
            return (
              <Field data-invalid={fieldState.invalid} className="gap-1 [&_p]:pb-2 col-span-full">
                <FieldLabel htmlFor="ticket-type">Ticket Type *</FieldLabel>

                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}

                >
                  {options.map(({ label, value }) => (
                    <div
                      key={value}
                      className="flex items-center gap-x-2"
                    >
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )
          }}
        />

        <Controller
          name="comments"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1 col-span-full">
              <FieldLabel htmlFor="comments">Additional Comments </FieldLabel>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                id="comments"
                placeholder="Any special requirements or questions?"

              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex justify-end items-center w-full">
        <Button disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}