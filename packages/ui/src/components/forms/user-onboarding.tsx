"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tag } from "emblor"

import { Button } from "@branda/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@branda/ui/components/form"
import { Input } from "@branda/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@branda/ui/components/select"
import { Checkbox } from "@branda/ui/components/checkbox"
import { TagInput } from "@branda/ui/components/tag-input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@branda/ui/components/card"
import { Logo } from "@branda/ui/components/logo"
import { useRouter } from "next/navigation"

const LAGOS_LGAS = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti-Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere",
] as const

const AreaOfInterest = [{

}]

const formSchema = z.object({
  nin: z.string().min(11, "NIN must be 11 characters").max(11, "NIN must be 11 characters"),
  voterId: z.string().min(1, "Voter ID is required"),
  lga: z.string().min(1, "LGA is required"),
  ward: z.string().optional(),
  occupation: z.string().optional(),
  areaOfInterest: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and policy.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export interface UserOnboardingProps {
  onSubmit?: (data: FormValues) => void
  onCancel?: () => void
}

export function UserOnboarding({ onSubmit, onCancel }: UserOnboardingProps) {
  const [step, setStep] = React.useState(1)
  const [tags, setTags] = React.useState<Tag[]>([])
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nin: "",
      voterId: "",
      lga: "",
      ward: "",
      occupation: "",
      areaOfInterest: [],
      agreeTerms: false,
    },
  })

  const nextStep = async () => {
    // Validate Step 1 fields before moving on
    const valid = await form.trigger(["nin", "voterId", "lga"])
    if (valid) {
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  const handleSubmit = (data: FormValues) => {
    if (onSubmit) {
      onSubmit(data)

      // route to /dashboard

    } else {
      console.log(data)
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full h-screen">
      <Logo />
      <p className="text-sm text-muted-foreground">Welcome to Engage Lagos, let's get you onboarded</p>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Onboarding</CardTitle>
          <CardDescription>
            {step === 1
              ? "Step 1 of 2: Proof of Identity"
              : "Step 2 of 2: Additional Details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <FormField
                    control={form.control}
                    name="nin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National Identification Number (NIN)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your 11-digit NIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="voterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voter Registration Number (VIN/Voter ID)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Voter ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 items-center justify-between">
                    <FormField
                      control={form.control}
                      name="lga"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Local Government Area (LGA)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an LGA" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LAGOS_LGAS.map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                  {lga}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Ward (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Ward A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areaOfInterest"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Areas of Interest (Optional)</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Type an interest and press entering"
                            tags={tags}
                            setTags={(newTags) => {
                              setTags(newTags);
                              // Synchronize format expected by zod
                              // Note: newTags is an array (dispatch) or function. It's safer to read the new tags output.
                              // TagInput usually sets the state natively using the generic type.
                              // We'll update the form field with the corresponding items
                              const latestTags = typeof newTags === "function" ? newTags(tags) : newTags;
                              form.setValue("areaOfInterest", latestTags as any, { shouldValidate: true })
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Press enter or comma to add a new interest.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and privacy policy
                          </FormLabel>
                          <FormDescription>
                            By checking this box, you confirm that you have read and agreed to our Terms of Service.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 ? (
            <Button disabled variant="outline" onClick={onCancel || (() => { })}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}

          {step === 1 ? (
            <Button onClick={nextStep} type="button">
              Next Step
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(handleSubmit)} type="button">
              Complete Onboarding
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
