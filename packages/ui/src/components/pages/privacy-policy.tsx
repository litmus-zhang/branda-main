import * as React from "react";
import { cn } from "@branda/ui/lib/utils";
import { Navbar } from "@branda/ui/components/navbar";
import { Footer } from "@branda/ui/components/footer";
import { CompanyName, SupportEmail } from "@branda/ui/lib/constants";

export interface PrivacyPolicyProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName?: string;
  contactEmail?: string;
  lastUpdated?: string;
}

export function PrivacyPolicy({
  companyName = CompanyName,
  contactEmail = SupportEmail,
  lastUpdated = new Date().toLocaleDateString(),
  className,
  ...props
}: PrivacyPolicyProps) {
  return (
    <>
      <Navbar />
      <div className={cn("mx-auto max-w-4xl px-4 pt-24 py-12 sm:px-6 lg:px-8", className)} {...props}>
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-base leading-7 text-foreground/90">
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">1. Introduction</h2>
            <p>
              Welcome to {companyName}. We respect your privacy and are committed to protecting your personal data.
              This Privacy Policy will inform you as to how we look after your personal data when you visit our website
              and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-primary hover:underline">
                {contactEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
